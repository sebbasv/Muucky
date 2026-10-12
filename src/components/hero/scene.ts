// Escena provisoria del hero "Del corte al bocado", dibujada en canvas 2D según el avance del scroll (p de 0 a 1).
// Cuenta el proceso real (corte, tiras, marinado, secado, pack) mientras se produce el video.
// Cuando lleguen los frames del video, el hero usa la secuencia de imágenes (ver HeroSequence) y esto queda de respaldo.

export type Layout = {
  w: number;
  h: number;
  /** Centro de la carne. */
  cx: number;
  cy: number;
  /** Tamaño de referencia del corte. */
  u: number;
  /** Boca del pack, adonde caen las tiras al final. */
  packX: number;
  packY: number;
};

type Strip = {
  len: number;
  noiseTop: number[];
  noiseBottom: number[];
  spreadX: number;
  spreadRot: number;
  phase: number;
  tint: number;
  specks: { x: number; y: number; r: number; c: string }[];
  fat: { y: number; a: number }[];
};

type Fleck = { r0: number; a0: number; speed: number; size: number; c: string; target: number; tx: number };
type Ember = { x: number; y: number; vy: number; size: number; phase: number };

const N = 8;
const RAW = ['#a3322a', '#7c1914', '#420c09'];
const DRY = ['#5c2416', '#3e170d', '#22100a'];
const FLECK_COLORS = ['#4f7a2a', '#6f9a34', '#3d6420', '#d9b23a', '#b3261e', '#e6dcc6'];

// Generador pseudoaleatorio con semilla: la escena es siempre la misma.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const window01 = (p: number, a: number, b: number) => ease(clamp((p - a) / (b - a)));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mix(c1: string, c2: string, t: number) {
  const a = parseInt(c1.slice(1), 16);
  const b = parseInt(c2.slice(1), 16);
  const r = Math.round(lerp((a >> 16) & 255, (b >> 16) & 255, t));
  const g = Math.round(lerp((a >> 8) & 255, (b >> 8) & 255, t));
  const bl = Math.round(lerp(a & 255, b & 255, t));
  return `#${((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1)}`;
}

export function createScene() {
  const rand = rng(1979);
  const strips: Strip[] = Array.from({ length: N }, () => {
    const noise = () => Array.from({ length: 14 }, () => rand() - 0.5);
    return {
      len: 0.92 + rand() * 0.14,
      noiseTop: noise(),
      noiseBottom: noise(),
      spreadX: (rand() - 0.5) * 0.4,
      spreadRot: (rand() - 0.5) * 0.55,
      phase: rand() * Math.PI * 2,
      tint: (rand() - 0.5) * 0.16,
      specks: Array.from({ length: 26 }, () => ({
        x: rand() - 0.5,
        y: rand() - 0.5,
        r: 0.6 + rand() * 1.6,
        c: FLECK_COLORS[Math.floor(rand() * FLECK_COLORS.length)],
      })),
      fat: Array.from({ length: 3 }, () => ({ y: (rand() - 0.5) * 0.8, a: 0.2 + rand() * 0.25 })),
    };
  });
  const flecks: Fleck[] = Array.from({ length: 150 }, () => ({
    r0: 0.7 + rand() * 0.9,
    a0: rand() * Math.PI * 2,
    speed: 0.15 + rand() * 0.35,
    size: 0.8 + rand() * 2.2,
    c: FLECK_COLORS[Math.floor(rand() * FLECK_COLORS.length)],
    target: Math.floor(rand() * N),
    tx: rand() - 0.5,
  }));
  const embers: Ember[] = Array.from({ length: 46 }, () => ({
    x: rand(),
    y: rand(),
    vy: 0.02 + rand() * 0.05,
    size: 0.6 + rand() * 1.8,
    phase: rand() * Math.PI * 2,
  }));

  let sprite: HTMLCanvasElement | null = null;
  const emberSprite = () => {
    if (sprite) return sprite;
    sprite = document.createElement('canvas');
    sprite.width = sprite.height = 32;
    const g = sprite.getContext('2d')!;
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,190,120,1)');
    grad.addColorStop(0.25, 'rgba(236,90,30,0.9)');
    grad.addColorStop(1, 'rgba(207,69,23,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return sprite;
  };

  function stripPath(ctx: CanvasRenderingContext2D, s: Strip, len: number, wid: number, wrinkle: number) {
    const steps = s.noiseTop.length - 1;
    const half = len / 2;
    ctx.beginPath();
    for (let k = 0; k <= steps; k++) {
      const x = -half + (len * k) / steps;
      const taper = Math.sin((Math.PI * k) / steps) * 0.08 + 0.92;
      const y = (-wid / 2) * taper + s.noiseTop[k] * wid * (0.16 + wrinkle);
      if (k === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.quadraticCurveTo(half + wid * 0.1, s.noiseTop[steps] * wid * 0.3, half, (wid / 2) * 0.92);
    for (let k = steps; k >= 0; k--) {
      const x = -half + (len * k) / steps;
      const taper = Math.sin((Math.PI * k) / steps) * 0.08 + 0.92;
      const y = (wid / 2) * taper + s.noiseBottom[k] * wid * (0.16 + wrinkle);
      ctx.lineTo(x, y);
    }
    ctx.quadraticCurveTo(-half - wid * 0.1, s.noiseBottom[0] * wid * 0.3, -half, (-wid / 2) * 0.92);
    ctx.closePath();
  }

  /** Dibuja un cuadro. t = segundos (movimiento sutil en reposo), p = avance del scroll. */
  function draw(ctx: CanvasRenderingContext2D, L: Layout, p: number, t: number, dpr: number) {
    const { w, h, cx, cy, u } = L;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const sep = window01(p, 0.14, 0.36);
    const mar = window01(p, 0.36, 0.56);
    const dry = window01(p, 0.56, 0.76);
    const fallStart = 0.76;
    const done = window01(p, 0.86, 1);

    // Brasa de fondo: crece con el secado y al final ilumina el pack desde abajo
    const glowA = 0.05 + dry * 0.12 - done * 0.06;
    const glow = ctx.createRadialGradient(cx, cy + u * 0.35, 0, cx, cy + u * 0.35, u * 1.2);
    glow.addColorStop(0, `rgba(207,69,23,${glowA})`);
    glow.addColorStop(1, 'rgba(207,69,23,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Piedra negra debajo del corte (solo al principio)
    const stoneA = 1 - sep;
    if (stoneA > 0.01) {
      ctx.save();
      ctx.globalAlpha = stoneA;
      ctx.translate(cx, cy + u * 0.36);
      ctx.rotate(-0.06);
      const stone = ctx.createLinearGradient(0, -u * 0.12, 0, u * 0.14);
      stone.addColorStop(0, '#1f1d1b');
      stone.addColorStop(1, '#0c0b0a');
      ctx.fillStyle = stone;
      ctx.beginPath();
      ctx.ellipse(0, 0, u * 0.78, u * 0.13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,170,120,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, -1, u * 0.78, u * 0.13, 0, Math.PI * 1.05, Math.PI * 1.65);
      ctx.stroke();
      ctx.restore();
    }

    // Chimichurri en el aire: llega girando y se pega a las tiras
    const fleckA = Math.sin(Math.PI * clamp((p - 0.34) / 0.26)) * 0.95;
    const wid0 = (u * 0.6) / N;

    // Tiras
    for (let i = 0; i < N; i++) {
      const s = strips[i];
      const fall = window01(p, fallStart + i * 0.012, fallStart + 0.1 + i * 0.012);
      if (fall >= 0.999) continue;
      const lane = i - (N - 1) / 2;
      const len = u * lerp(1 + (s.len - 1) * 0.3, s.len, sep) * lerp(1, 0.82, dry);
      const wid = wid0 * lerp(1, 0.78, dry);
      const bob = Math.sin(t * 0.9 + s.phase) * u * 0.012 * sep;

      // posición: corte entero → despiece → pack
      let x = cx + s.spreadX * u * sep;
      let y = cy + lane * wid0 * lerp(0.9, 1.9, sep) + bob;
      let rot = -0.1 + s.spreadRot * sep + Math.sin(t * 0.6 + s.phase) * 0.03 * sep;
      let scale = 1;
      if (fall > 0) {
        x = lerp(x, L.packX, fall);
        y = lerp(y, L.packY, fall) - Math.sin(Math.PI * fall) * u * 0.18;
        rot = lerp(rot, Math.PI / 2 + lane * 0.08, fall);
        scale = lerp(1, 0.22, fall);
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(scale, scale);
      ctx.globalAlpha = 1 - window01(fall, 0.7, 1);

      stripPath(ctx, s, len, wid * lerp(1.14, 0.94, sep), dry * 0.22);
      const tone = (c: string) => (s.tint >= 0 ? mix(c, '#ffffff', s.tint * 0.5) : mix(c, '#000000', -s.tint));
      const g = ctx.createLinearGradient(0, -wid / 2, 0, wid / 2);
      g.addColorStop(0, tone(mix(RAW[0], DRY[0], dry)));
      g.addColorStop(0.45, tone(mix(RAW[1], DRY[1], dry)));
      g.addColorStop(1, tone(mix(RAW[2], DRY[2], dry)));
      ctx.fillStyle = g;
      // volumen: sombra proyectada debajo de cada tira
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 14 * dpr * scale;
      ctx.shadowOffsetY = 7 * dpr * scale;
      ctx.fill();
      ctx.shadowColor = 'transparent';

      ctx.save();
      ctx.clip();
      // vetas de grasa (se van con el secado): un trazo ancho y suave y uno fino encima
      for (const f of s.fat) {
        const fy = f.y * wid;
        for (const [lw, a] of [
          [0.16, 0.35],
          [0.05, 1],
        ] as const) {
          ctx.strokeStyle = `rgba(232,190,170,${f.a * a * (1 - dry)})`;
          ctx.lineWidth = Math.max(0.6, wid * lw);
          ctx.beginPath();
          ctx.moveTo(-len / 2, fy);
          ctx.bezierCurveTo(-len / 5, fy - wid * 0.22, len / 5, fy + wid * 0.22, len / 2, fy - wid * 0.05);
          ctx.stroke();
        }
      }
      // fibras a lo largo, oscuras y claras alternadas
      ctx.lineWidth = Math.max(0.5, wid * 0.022);
      for (let k = -3; k <= 3; k++) {
        ctx.strokeStyle = k % 2 ? `rgba(15,3,2,${0.28 + dry * 0.25})` : `rgba(255,190,170,${0.04 * (1 - dry)})`;
        ctx.beginPath();
        ctx.moveTo(-len / 2, (k * wid) / 8);
        ctx.quadraticCurveTo(0, (k * wid) / 8 + Math.sin(s.phase + k) * wid * 0.1, len / 2, (k * wid) / 8);
        ctx.stroke();
      }
      // luz cálida lateral (rim light desde la izquierda), sombra a la derecha
      const light = ctx.createLinearGradient(-len / 2, 0, len / 2, 0);
      light.addColorStop(0, 'rgba(255,150,100,0.14)');
      light.addColorStop(0.35, 'rgba(255,150,100,0)');
      light.addColorStop(0.7, 'rgba(0,0,0,0)');
      light.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = light;
      ctx.fillRect(-len / 2 - wid, -wid, len + wid * 2, wid * 2);
      // brillo húmedo del marinado
      const gloss = mar * (1 - dry * 0.75) + (1 - sep) * 0.25;
      if (gloss > 0.02) {
        const hl = ctx.createLinearGradient(0, -wid / 2, 0, wid * 0.1);
        hl.addColorStop(0, `rgba(255,235,220,${0.3 * gloss})`);
        hl.addColorStop(1, 'rgba(255,235,220,0)');
        ctx.fillStyle = hl;
        ctx.fillRect(-len / 2, -wid / 2, len, wid * 0.6);
      }
      // chimichurri pegado
      if (mar > 0.01) {
        for (const sp of s.specks) {
          ctx.globalAlpha = (1 - window01(fall, 0.7, 1)) * mar * (1 - dry * 0.35);
          ctx.fillStyle = dry > 0.5 ? mix(sp.c, '#1a0d08', (dry - 0.5) * 0.9) : sp.c;
          ctx.beginPath();
          ctx.arc(sp.x * len * 0.94, sp.y * wid * 0.85, sp.r * (u / 420), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      ctx.restore();
    }

    if (fleckA > 0.01) {
      for (const f of flecks) {
        const radius = u * lerp(f.r0, 0.15, mar);
        const ang = f.a0 + t * f.speed + p * 9;
        const lane = f.target - (N - 1) / 2;
        const tx = cx + f.tx * u * 0.8 + strips[f.target].spreadX * u * sep;
        const ty = cy + lane * wid0 * 1.9;
        const x = lerp(cx + Math.cos(ang) * radius * 1.3, tx, mar);
        const y = lerp(cy + Math.sin(ang) * radius * 0.8, ty, mar);
        ctx.globalAlpha = fleckA * (1 - mar * 0.85);
        ctx.fillStyle = f.c;
        ctx.beginPath();
        ctx.arc(x, y, f.size * (u / 460), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // Brasas que suben (más intensas durante el secado)
    const emberA = 0.18 + dry * 0.7 - done * 0.45;
    if (emberA > 0.02) {
      const img = emberSprite();
      for (const e of embers) {
        const yy = (((e.y - t * e.vy) % 1) + 1) % 1;
        const x = (e.x + Math.sin(t * 0.7 + e.phase) * 0.01) * w;
        const y = yy * h;
        const flicker = 0.55 + 0.45 * Math.sin(t * 3 + e.phase);
        ctx.globalAlpha = clamp(emberA * flicker * (0.3 + (1 - yy) * 0.2 + yy * 0.6));
        const size = e.size * 7;
        ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    }

    // Resplandor rojo bajo el pack al final
    if (done > 0.01) {
      const rg = ctx.createRadialGradient(L.packX, L.packY + u * 0.62, 0, L.packX, L.packY + u * 0.62, u * 0.7);
      rg.addColorStop(0, `rgba(212,17,17,${0.35 * done})`);
      rg.addColorStop(1, 'rgba(212,17,17,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }
  }

  return { draw };
}
