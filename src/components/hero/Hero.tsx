'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { btn } from '@/components/ui/styles';
import { store } from '@/config/store';
import { createScene, window01, type Layout } from '@/components/hero/scene';

/**
 * Las 5 etapas del video (Corte → Tiras → Marinado → Secado → Pack). Una sola lista para los textos,
 * el riel y el respaldo sin animación: la numeración siempre coincide.
 */
const stages = [
  {
    label: 'Corte',
    title: 'Carne vacuna argentina.',
    body: 'Cortes magros y seleccionados, sin vueltas. Lo que ves en la tira es carne.',
  },
  {
    label: 'Tiras',
    title: 'Cortada en tiras finas.',
    body: 'Cada tira sale pareja, para que se seque igual de punta a punta.',
  },
  {
    label: 'Marinado',
    title: '24 horas en chimichurri, limón y sal.',
    body: 'Perejil, ajo y ají molido. El sabor argentino que entra en la fibra antes de secarse.',
  },
  {
    label: 'Secado',
    title: 'Deshidratado lento.',
    body: 'Calor bajo durante horas, hasta que la tira queda firme y concentra todo el sabor.',
  },
  {
    label: 'Pack',
    title: 'Listo para llevar.',
    body: 'Para el bolso, la oficina o la previa. En packs de 40, 100 y 250 g.',
  },
];
const num = (i: number) => String(i + 1).padStart(2, '0');

/**
 * Coreografía del scroll, en fracción del recorrido. BLOCKS marca dónde cambia el texto: la intro y
 * después una etapa por tramo. Cada cambio es un fundido cruzado de FADE, así siempre hay un texto en
 * pantalla. El video avanza por tramos (los stops de store.hero), y termina en VIDEO_END: el último
 * pedazo del recorrido queda quieto el pack con su texto.
 */
const BLOCKS = [0, 0.12, 0.27, 0.44, 0.62, 0.8, 1];
const FADE = 0.05;
const VIDEO_END = 0.92;
const VIDEO_KEYS = [0, BLOCKS[2], BLOCKS[3], BLOCKS[4], BLOCKS[5], VIDEO_END];

/** Qué parte del video (0 a 1) corresponde a un punto del scroll. */
function videoAt(p: number, stops: readonly number[]) {
  if (p >= VIDEO_END) return 1;
  for (let k = 0; k < VIDEO_KEYS.length - 1; k++) {
    if (p <= VIDEO_KEYS[k + 1]) {
      const t = (p - VIDEO_KEYS[k]) / (VIDEO_KEYS[k + 1] - VIDEO_KEYS[k]);
      return stops[k] + t * (stops[k + 1] - stops[k]);
    }
  }
  return 1;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const WIDE = '(min-width: 768px) and (orientation: landscape)';

// Se decide antes de pintar: con reduced motion o ahorro de datos queda el hero estático (póster con el
// pack y el proceso en lista), sin canvas ni descarga de frames.
const modeScript = `(function(){var s=document.currentScript.parentElement;try{var c=navigator.connection;var low=!!c&&(c.saveData||/(^|-)(2g|3g)$/.test(c.effectiveType||''));if(!low&&!matchMedia('(prefers-reduced-motion: reduce)').matches)s.dataset.mode='scroll'}catch(e){}})()`;

const pad = (n: number) => String(n).padStart(4, '0');
const posterVars = {
  '--hero-poster-desktop': `url(${store.hero.desktop.path}/0001.webp)`,
  '--hero-poster-mobile': `url(${store.hero.mobile.path}/0001.webp)`,
} as React.CSSProperties;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const packRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current!;
    if (section.dataset.mode !== 'scroll') return;
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scene = createScene();
    const texts = Array.from(section.querySelectorAll<HTMLElement>('[data-stage]'));
    const railItems = Array.from(railRef.current?.querySelectorAll<HTMLElement>('[data-rail]') ?? []);
    const railFill = railRef.current?.querySelector<HTMLElement>('[data-rail-fill]');
    const railLabel = railRef.current?.querySelector<HTMLElement>('[data-rail-label]');

    // Set de frames según la pantalla (horizontal ancha: 16:9; el resto: 9:16). Si se gira la tablet, cambia.
    const wideMq = matchMedia(WIDE);
    const cache = new Map<string, HTMLImageElement[]>();
    let cfg: (typeof store.hero)['desktop'] = store.hero.desktop;
    let frames: HTMLImageElement[] = [];
    let mobile = false;

    const idle = (fn: () => void) => {
      if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(fn);
      else setTimeout(fn, 200);
    };

    const loadSet = () => {
      mobile = !wideMq.matches;
      cfg = mobile ? store.hero.mobile : store.hero.desktop;
      if (cfg.frames === 0) {
        frames = [];
        delete section.dataset.sequence;
        return;
      }
      section.dataset.sequence = 'true';
      const cached = cache.get(cfg.path);
      if (cached) {
        frames = cached;
        return;
      }
      const set: HTMLImageElement[] = new Array(cfg.frames);
      const path = cfg.path;
      cache.set(path, set);
      frames = set;
      const load = (i: number, low = false) => {
        const img = new window.Image();
        img.decoding = 'async';
        if (low) img.fetchPriority = 'low';
        img.src = `${path}/${pad(i + 1)}.webp`;
        set[i] = img;
      };
      // Primero el 1 (es el póster), después uno de cada 6 para cubrir todo el recorrido enseguida,
      // y el resto en tiempo libre. Mientras falte un frame se dibuja el más cercano: nunca hay un hueco.
      load(0);
      const fine: number[] = [];
      for (let i = 1; i < set.length; i++) {
        if (i % 6 === 0) load(i);
        else fine.push(i);
      }
      idle(() => fine.forEach((i) => load(i, true)));
    };

    const ready = (img: HTMLImageElement | undefined) => !!img && img.complete && img.naturalWidth > 0;
    const nearestReady = (i: number) => {
      for (let d = 0; d < frames.length; d++) {
        if (ready(frames[i - d])) return i - d;
        if (ready(frames[i + d])) return i + d;
      }
      return -1;
    };

    let layout: Layout = { w: 1, h: 1, cx: 0, cy: 0, u: 1, packX: 0, packY: 0 };
    let dpr = 1;
    const measure = () => {
      const r = stage.getBoundingClientRect();
      const pr = packRef.current!.getBoundingClientRect();
      // Hasta 2×: con 1,5× el navegador volvía a estirar el canvas en celulares y pantallas retina
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      const packCx = pr.left - r.left + pr.width / 2;
      const packCy = pr.top - r.top + pr.height / 2;
      const u = mobile ? Math.min(r.width * 0.72, r.height * 0.3) : Math.min(r.width * 0.36, r.height * 0.6);
      layout = {
        w: r.width,
        h: r.height,
        cx: packCx,
        cy: packCy - pr.height * 0.04,
        u,
        packX: packCx,
        packY: packCy - pr.height * 0.36,
      };
      lastFrame = -1; // el canvas se vació al cambiar de tamaño
    };

    let target = 0;
    let p = 0;
    let lastFrame = -1;
    let lastP = -1;
    let lastStageState = '';
    let raf = 0;
    let running = false;
    let prev = performance.now();
    const t0 = prev;

    const readScroll = () => {
      const r = section.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      target = travel > 0 ? clamp01(-r.top / travel) : 0;
    };

    // Tipo cover y centrado, igual que el póster de fondo: el primer dibujo no salta.
    const drawSequence = (i: number) => {
      const k = nearestReady(i);
      if (k < 0 || k === lastFrame) return;
      lastFrame = k;
      const img = frames[k];
      const { w, h } = layout;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // El frame casi siempre se agranda (720p en pantallas más grandes): escalado de alta calidad
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      const iw = img.naturalWidth * s;
      const ih = img.naturalHeight * s;
      ctx.drawImage(img, (w - iw) / 2, (h - ih) / 2, iw, ih);
    };

    const updateDom = () => {
      // Textos: fundido cruzado en cada cambio de tramo (la suma de opacidades es siempre 1)
      const last = texts.length - 1;
      const state: string[] = [];
      texts.forEach((el, i) => {
        const a = BLOCKS[i];
        const b = BLOCKS[i + 1];
        const fadeIn = i === 0 ? 1 : clamp01((p - (a - FADE / 2)) / FADE);
        const fadeOut = i === last ? 1 : clamp01((b + FADE / 2 - p) / FADE);
        const o = Math.min(fadeIn, fadeOut);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${((1 - o) * (p < a ? 18 : -18)).toFixed(1)}px, 0)`;
        state.push(o > 0.02 ? '1' : '0');
      });
      // Etapa activa del riel: la intro no cuenta (-1), después 0 a 4
      let active = -1;
      for (let k = 0; k < stages.length; k++) if (p >= BLOCKS[k + 1] - FADE / 2) active = k;
      const s = state.join('') + active;
      if (s !== lastStageState) {
        lastStageState = s;
        texts.forEach((el, i) => {
          el.inert = state[i] === '0';
          el.style.visibility = state[i] === '0' ? 'hidden' : 'visible';
        });
        // El riel tiene dos juegos (puntos en mobile, nombres en desktop): el índice es la etapa
        railItems.forEach((el, i) => el.toggleAttribute('data-active', i % stages.length <= active));
        if (railLabel) railLabel.textContent = active < 0 ? 'Del corte al bocado' : `${num(active)} · ${stages[active].label}`;
      }
      if (railFill) railFill.style.transform = `scaleX(${p.toFixed(4)})`;
      if (hintRef.current) hintRef.current.style.opacity = String(Math.max(0, 1 - p * 25));
      if (!frames.length && packRef.current) {
        const o = window01(p, 0.8, 0.92);
        packRef.current.style.opacity = o.toFixed(3);
        packRef.current.style.transform = `translate3d(0, ${((1 - o) * 36).toFixed(1)}px, 0) scale(${(0.92 + o * 0.08).toFixed(3)})`;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      p += (target - p) * Math.min(1, dt * 9); // scrub suave (~0.5 s)
      if (Math.abs(target - p) < 0.0005) p = target;
      if (frames.length) {
        drawSequence(Math.round(videoAt(p, cfg.stops) * (cfg.frames - 1)));
      } else {
        scene.draw(ctx, layout, p, (now - t0) / 1000, dpr);
      }
      if (p !== lastP) {
        lastP = p;
        updateDom();
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      prev = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    loadSet();
    measure();
    readScroll();
    p = target;
    updateDom();

    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        measure();
        readScroll();
      }, 120);
    });
    ro.observe(stage);
    const onSetChange = () => {
      loadSet();
      measure();
    };
    wideMq.addEventListener('change', onSetChange);
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { rootMargin: '100px' });
    io.observe(section);
    window.addEventListener('scroll', readScroll, { passive: true });
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      window.clearTimeout(resizeTimer);
      wideMq.removeEventListener('change', onSetChange);
      window.removeEventListener('scroll', readScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const withVideo = store.hero.desktop.frames > 0 || store.hero.mobile.frames > 0;

  return (
    <>
      <section
        ref={sectionRef}
        data-mode="static"
        suppressHydrationWarning
        aria-label="Muucky: del corte al bocado"
        className="hero relative bg-black"
      >
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <div ref={stageRef} className="hero-stage relative h-svh min-h-[560px] overflow-hidden">
          {/* Fondo cálido de base */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(90% 70% at 70% 55%, rgba(35,31,26,0.9) 0%, rgba(13,13,13,0.6) 45%, #080808 80%)',
            }}
          />
          {withVideo && <div aria-hidden="true" className="hero-poster absolute inset-0" style={posterVars} />}
          <canvas ref={canvasRef} aria-hidden="true" className="hero-canvas absolute inset-0 h-full w-full" />

          {/* Pack: póster del modo estático y final de la escena de respaldo (con video se oculta) */}
          <div
            ref={packRef}
            className="hero-pack pointer-events-none absolute left-1/2 top-[29%] -translate-x-1/2 -translate-y-1/2 wide:left-[68%] wide:top-[52%]"
          >
            <Image
              src="/brand/product-pack.webp"
              alt="Pack de Muucky Beef Jerky, marinado con chimichurri, con el sello EXCESO EN SODIO"
              width={408}
              height={612}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 768px) 420px, 60vw"
              className="h-[32svh] w-auto drop-shadow-[0_20px_60px_rgba(180,30,30,0.3)] wide:h-[min(64svh,600px)]"
            />
          </div>
          {/* Velos para que el texto se lea sobre el video: abajo en mobile, a la izquierda en desktop */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/80 to-transparent wide:hidden"
          />
          {/* En marinado y secado las tiras ocupan del 35 % al 98 % del ancho del video: el velo apaga lo que
              queda debajo del texto y deja viva la carne de la derecha */}
          <div
            aria-hidden="true"
            className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(8,8,8,0.92)_0%,rgba(8,8,8,0.78)_34%,rgba(8,8,8,0.35)_48%,rgba(8,8,8,0)_62%)] wide:block"
          />

          {/* Textos reales (no quemados en la imagen) */}
          <div className="container-x relative flex h-full items-end pb-28 pt-[calc(var(--bar-h)+var(--header-h)+16px)] wide:items-center wide:pb-0">
            <div className="relative w-full wide:max-w-[560px]">
              <div data-stage className="hero-text">
                <p className="inline-flex items-center gap-2 rounded-pill border border-white/15 bg-black/40 px-3.5 py-1.5 text-12 font-bold uppercase tracking-[0.18em] text-ink backdrop-blur-sm">
                  <span className="size-1.5 rounded-pill bg-red" aria-hidden="true" /> Muucky · Hecho en Argentina
                </p>
                {/* El nombre ya está en el logo del header: el protagonista es el producto */}
                <h1 className="mt-4 text-balance font-display text-48 font-bold uppercase leading-[0.9] tracking-[-0.01em] wide:text-96">
                  <span className="sr-only">Muucky: </span>Beef jerky argentino.
                </h1>
                <p className="mt-4 max-w-[34ch] text-18 text-[#d6d6d6] wide:max-w-[520px] wide:text-24 wide:leading-8">
                  Carne vacuna marinada 24 horas en chimichurri, limón y sal.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/productos" className={btn.primary}>
                    Comprar <ArrowRight className="size-5" aria-hidden="true" />
                  </Link>
                  <a href="#como-se-hace" className={btn.outline}>
                    Cómo se hace
                  </a>
                </div>
              </div>

              {stages.map((s, i) => (
                <div
                  key={s.label}
                  data-stage
                  className="hero-text hero-step absolute inset-x-0 bottom-0 wide:bottom-auto wide:top-1/2 wide:-translate-y-1/2"
                >
                  <p className="eyebrow">
                    {num(i)} · {s.label}
                  </p>
                  <h2 className="mt-3 text-balance font-display text-32 font-bold leading-[1.05] wide:text-64 wide:leading-[1]">
                    {s.title}
                  </h2>
                  <p className="mt-4 max-w-[42ch] text-16 leading-7 text-[#cfcfcf] wide:text-18">{s.body}</p>
                  {i === stages.length - 1 && (
                    <Link href="/productos" className={`${btn.primary} mt-7`}>
                      Elegí tu pack <ArrowRight className="size-5" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Riel del proceso y salida rápida a los productos */}
          <div className="hero-rail absolute inset-x-0 bottom-5 hidden wide:bottom-8">
            <div className="container-x">
              <div className="relative">
                <a
                  href="#productos"
                  className="absolute bottom-full right-0 mb-3 inline-flex min-h-11 items-center gap-1.5 text-12 font-bold uppercase tracking-[0.16em] text-ink-muted transition-colors hover:text-ink"
                >
                  Saltar a productos <ArrowDown className="size-3.5" aria-hidden="true" />
                </a>
                <div ref={railRef} aria-hidden="true">
                  <div className="relative h-px bg-white/15">
                    <div data-rail-fill className="absolute inset-0 origin-left scale-x-0 bg-red" />
                  </div>
                  {/* Mobile: el nombre de la etapa activa y un punto por etapa */}
                  <div className="mt-3 flex items-center justify-between gap-4 wide:hidden">
                    <span data-rail-label className="text-12 font-bold uppercase tracking-[0.16em] text-ink">
                      Del corte al bocado
                    </span>
                    <span className="flex gap-1.5">
                      {stages.map((s) => (
                        <span
                          key={s.label}
                          data-rail
                          className="size-1.5 rounded-pill bg-white/25 transition-colors duration-300 data-[active]:bg-red"
                        />
                      ))}
                    </span>
                  </div>
                  {/* Desktop: las 5 etapas con número y nombre */}
                  <ol className="mt-3 hidden grid-cols-5 text-12 font-bold uppercase tracking-[0.16em] text-ink-muted wide:grid">
                    {stages.map((s, i) => (
                      <li key={s.label} data-rail className="transition-colors duration-300 data-[active]:text-ink">
                        <span className="mr-1.5 tabular-nums text-red-text">{num(i)}</span>
                        {s.label}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          <div
            ref={hintRef}
            aria-hidden="true"
            className="hero-hint absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-12 font-medium uppercase tracking-[0.2em] text-ink-muted wide:flex"
          >
            Scrolleá
            <ArrowDown className="size-4 motion-safe:animate-bounce" />
          </div>
        </div>

        <div id="como-se-hace" className="hero-anchor" />

        {/* Respaldo sin animación (reduced motion, ahorro de datos o sin JS): el proceso en lista */}
        <div className="hero-static-only border-t border-border bg-black-soft">
          <ol className="container-x grid gap-10 py-16 md:grid-cols-2 md:gap-12 lg:grid-cols-4">
            {stages.slice(0, -1).map((s, i) => (
              <li key={s.label}>
                <p className="eyebrow">
                  {num(i)} · {s.label}
                </p>
                <h2 className="mt-3 text-balance font-display text-24 font-bold leading-tight">{s.title}</h2>
                <p className="mt-2 text-16 leading-6 text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div id="hero-end" aria-hidden="true" />
    </>
  );
}
