import { ImageResponse } from 'next/og';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';

export const ogSize = { width: 1200, height: 630 };

const MARGIN = 64;
const PACK_RATIO = 612 / 408; // alto / ancho del PNG del pack

// Los assets no dependen del request: se leen una vez.
const assets = Promise.all([
  readFile(join(process.cwd(), 'public/brand/product-pack.png'), 'base64'),
  readFile(join(process.cwd(), 'public/brand/logo-muucky.png'), 'base64'),
]).then(([pack, logo]) => ({
  pack: `data:image/png;base64,${pack}`,
  logo: `data:image/png;base64,${logo}`,
}));

// Oswald estática (ImageResponse no lee woff2 ni fuentes variables). Si el archivo no está, queda la fuente
// por defecto en lugar de romper el build.
const oswald = readFile(join(process.cwd(), 'src/assets/fonts/Oswald-Bold.ttf'))
  .then((b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength) as ArrayBuffer)
  .catch(() => null);

/** Un pack; con peso, lleva la misma etiqueta que en el sitio (tapa el "40 gramos" del arte). */
function Pack({ src, height, weightG, rotate }: { src: string; height: number; weightG?: number; rotate: number }) {
  const width = Math.round(height / PACK_RATIO);
  return (
    <div style={{ display: 'flex', position: 'relative', width, height, transform: `rotate(${rotate}deg)` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} width={width} height={height} alt="" />
      {weightG !== undefined && (
        <div
          style={{
            position: 'absolute',
            left: width * 0.18,
            top: height * 0.72,
            width: width * 0.47,
            height: height * 0.15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#d41111',
            border: `${Math.max(1, width * 0.006)}px solid rgba(255,255,255,0.2)`,
            borderRadius: width * 0.015,
            color: '#fff',
            fontSize: width * 0.15,
            fontWeight: 700,
            lineHeight: 1,
            transform: 'rotate(-3deg)',
          }}
        >
          {`${weightG} g`}
        </div>
      )}
    </div>
  );
}

/**
 * og:image de 1200×630: el logo (el único "Muucky" de la imagen), el titular y el pack entero, con 64 px de
 * margen. `packs` son los pesos a dibujar (uno por pack del combo); sin `packs`, el pack de siempre.
 */
export async function renderOg({
  title,
  subtitle,
  price,
  packs,
}: {
  title: string;
  subtitle: string;
  price?: string;
  packs?: number[];
}) {
  const [{ pack, logo }, font] = await Promise.all([assets, oswald]);
  const display = font ? 'Oswald' : 'sans-serif';
  const weights: (number | undefined)[] = packs && packs.length > 0 ? packs : [undefined];
  const n = weights.length;
  // Lugar para los packs: 1200 − 2 × 64 de margen − 600 de texto, menos ~30 px por el giro.
  // Un pack solo usa el alto disponible (470 + el giro de 6° ≈ 500 de 502); varios van encimados un 40 %.
  const packWidth = n === 1 ? 313 : Math.floor(440 / (0.6 * n + 0.4));
  const packHeight = Math.round(packWidth * PACK_RATIO);
  const overlap = Math.round(packWidth * 0.4);
  const middle = (n - 1) / 2;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          padding: MARGIN,
          background: '#080808',
          backgroundImage: 'radial-gradient(60% 80% at 75% 70%, rgba(212,17,17,0.28) 0%, rgba(8,8,8,0) 70%)',
          color: '#f2f2f2',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 600 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={120} height={117} alt="" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                fontFamily: display,
                fontSize: 72,
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: -1,
                textTransform: 'uppercase',
              }}
            >
              {title}
            </div>
            <div style={{ marginTop: 20, fontSize: 30, color: '#cfcfcf', lineHeight: 1.3 }}>{subtitle}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {price && (
              <div
                style={{
                  display: 'flex',
                  background: '#d41111',
                  color: '#fff',
                  fontFamily: display,
                  fontSize: 36,
                  fontWeight: 700,
                  padding: '8px 22px',
                  borderRadius: 12,
                }}
              >
                {price}
              </div>
            )}
            <div style={{ fontSize: 26, color: '#8c8c8c' }}>muucky.com.ar</div>
          </div>
        </div>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {weights.map((w, i) => (
            <div key={i} style={{ display: 'flex', marginLeft: i === 0 ? 0 : -overlap }}>
              <Pack src={pack} height={packHeight} weightG={w} rotate={n === 1 ? 6 : (i - middle) * 7} />
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...ogSize,
      ...(font ? { fonts: [{ name: 'Oswald', data: font, weight: 700 as const, style: 'normal' as const }] } : {}),
    },
  );
}
