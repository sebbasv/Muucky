// Arma el último frame del video del hero (clip 5) para generarlo con IA.
// El pack nunca se genera con IA: va la foto real sobre negro, en la misma posición que en el sitio.
// Uso: node scripts/hero-keyframes.mjs (volver a correrlo cuando llegue una foto del pack en alta)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const pack = 'public/brand/product-pack.png';
const out = 'video-hero';
await mkdir(out, { recursive: true });

// Mismo encuadre que el hero: en desktop el pack va centrado al 68% del ancho y al 52% del alto,
// y ocupa el 64% del alto; en mobile va arriba (29% del alto) y ocupa el 32% del alto.
const formats = [
  { name: 'frame-final-16x9.png', w: 1920, h: 1080, cx: 0.68, cy: 0.52, ph: 0.64 },
  { name: 'frame-final-9x16.png', w: 1080, h: 1920, cx: 0.5, cy: 0.29, ph: 0.32 },
];

for (const f of formats) {
  const height = Math.round(f.h * f.ph);
  const img = await sharp(pack).resize({ height, kernel: 'lanczos3' }).png().toBuffer();
  const { width } = await sharp(img).metadata();
  const left = Math.round(f.w * f.cx - width / 2);
  const top = Math.round(f.h * f.cy - height / 2);
  // Fondo black del sitio y el resplandor rojo bajo el pack
  const background = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${f.w}" height="${f.h}">
    <defs>
      <radialGradient id="glow">
        <stop offset="0" stop-color="#d41111" stop-opacity="0.5"/>
        <stop offset="1" stop-color="#d41111" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="#080808"/>
    <ellipse cx="${f.w * f.cx}" cy="${top + height * 0.96}" rx="${width * 0.95}" ry="${height * 0.16}" fill="url(#glow)"/>
  </svg>`);
  await sharp(background).composite([{ input: img, left, top }]).png().toFile(`${out}/${f.name}`);
  console.log(`${out}/${f.name}`);
}
