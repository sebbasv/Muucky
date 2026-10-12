# Hero de Muucky: video con IA controlado por scroll · Traspaso

> Documento de traspaso para el agente que maneja el hero.
> Fecha: 10/10/2026. Proyecto: `C:\Users\TechVale\Desktop\general\Paginas web\Carniceria\muucky\`

---

## 1. Contexto

- **Proyecto:** rediseño completo de muucky.com.ar (beef jerky argentino, marinado con chimichurri) para ofrecérselo al emprendimiento. Se basa en un Design System hecho en Claude Design y en el brief `C:\Users\TechVale\Desktop\MUUCKY-REDISENO-BRIEF.md`.
- **Hero, concepto A "Del corte al bocado":** una secuencia que avanza con el scroll y muestra el proceso en 5 etapas: **Corte → Tiras → Marinado → Secado → Pack**. Termina con el pack del producto quieto, en el mismo lugar donde está el pack del DOM.
- **Estado:** el video está generado, montado y exportado en frames WebP para desktop y mobile. **Todavía no está activado**, porque los dos `frames` siguen en `0` en la configuración.

## 2. Stack y particularidades

- **Versiones:** Next.js **16.4.0** (App Router, `cacheComponents: true`, `partialPrefetching`), React 19.3, Tailwind 4 (`@theme inline`), TypeScript, `lucide-react` 1.55, sharp, `next/font` (Oswald 600/700 e Inter 400/500/700).
- **Diferencias de Next 16:**
  - `params` es una promesa.
  - Con Cache Components no se permite `dynamicParams`.
  - Las rutas dinámicas usan `export const instant = false`.
  - `priority` está deprecado: se usa `loading="eager"` y `fetchPriority="high"`.
  - Antes de escribir código, leé `AGENTS.md` y `node_modules/next/dist/docs/`.
- **Tokens de marca:** `black #080808`, `black-soft #0d0d0d`, `surface #121212`, `border #242424`, `ink #f2f2f2`, `ink-muted #8c8c8c`, `red #d41111`, `red-dark #981b1b`, degradado `red-deep #a50d0d → red-bright #ec1313 → ember #cf4517`, `red-text #ef4343`, `leather #231f1a`.
- **Preview:** configuración `"muucky"` en `Carniceria\.claude\launch.json`. Corre `npm run dev --prefix muucky` en el puerto 3000.
- **Git:** la raíz del repo es `Paginas web`, que tiene muchos cambios ajenos (otros proyectos borrados o sin seguimiento). **No se hizo ningún commit.** No commitees nada que esté fuera de `Carniceria/muucky` sin preguntar.
- **Windows:** Node no entiende rutas `/c/...`; usá `C:/...`. Hay ffmpeg en el PATH, con `libwebp` incluido.

## 3. Cómo funciona el hero en el código

### Archivos
| Archivo | Rol |
|---|---|
| `src/components/hero/Hero.tsx` | Componente del hero: modos, scroll, canvas, textos, riel |
| `src/components/hero/scene.ts` | Escena procedural de respaldo (8 tiras, brasas, resplandor). `mix()` devuelve hex |
| `src/app/globals.css` | Reglas `.hero[data-mode="static"\|"scroll"]`, `.hero[data-sequence="true"] .hero-pack{display:none}`, `--bar-h`, `--header-h` |
| `src/config/store.ts` | Configuración `hero.desktop` / `hero.mobile` (ruta y cantidad de frames) |
| `scripts/hero-keyframes.mjs` | Genera los fotogramas finales del pack (`video-hero/frame-final-*.png`) |

### Comportamiento
- **Dos modos:**
  - **static:** con reduced motion o sin JS.
  - **scroll:** el contenido queda fijo con `position: sticky` mientras la sección mide **400svh en desktop y 300svh en mobile**.
- **Elección del modo:** un script inline (`modeScript`) lo decide antes del primer pintado.
- **Scrub:** hecho a mano, con lerp dentro de `requestAnimationFrame`. El canvas usa un DPR máximo de 1,5.
- **Textos:** cambian según el progreso del scroll, con `RANGES = [[0,0.13],[0.17,0.34],[0.38,0.54],[0.58,0.74],[0.8,1.01]]` y `FADE = 0.035`.
- **Riel de etapas:** Corte / Tiras / Marinado / Secado / Pack. En mobile muestra solo los números.
- **Desktop o mobile:** depende de `matchMedia('(max-width: 767px)')`. Elige `store.hero.mobile` o `store.hero.desktop`.
- **Modo secuencia:** se activa si `frames > 0` y la conexión no es lenta (no `saveData` ni 2g/3g).
  - Carga los primeros 30 frames, y el resto en `requestIdleCallback` con `fetchPriority='low'`.
  - Pide los archivos como `${path}/${pad(i+1)}.webp`, es decir `0001.webp`, `0002.webp`…
  - Si un frame no cargó todavía, dibuja el último que esté disponible.
  - Marca `section.dataset.sequence='true'`, y con eso **se oculta el pack del DOM**.
  - Dibuja tipo *cover* y centrado en el canvas. El frame se elige con `Math.round(p * (frames - 1))`.
- **Sin frames** (`frames: 0`): se usa la escena procedural de `scene.ts`.
- **Anclas y pack del DOM:**
  - `#como-se-hace` está en 58svh (mobile) / 85svh (desktop). `#hero-end` va después de la sección.
  - Pack del DOM en desktop: `left 68% / top 52%`, alto `min(64svh, 600px)`.
  - Pack del DOM en mobile: `top 29%`, alto 32svh, con un degradado oscuro sobre la mitad de abajo, que es donde va el texto.

## 4. Lo que ya está hecho

### Frames exportados (listos)
| Versión | Carpeta | Frames | Resolución | fps del master | Calidad | Peso |
|---|---|---|---|---|---|---|
| Desktop 16:9 | `public/hero/v1/desktop/` | **150** (`0001`–`0150.webp`) | 1280×720 | 30 | WebP q70 | 3,2 MB |
| Mobile 9:16 | `public/hero/v1/mobile/` | **90** (`0001`–`0090.webp`) | 720×1280 | 18 | WebP q62 | 1,6 MB |

> El brief pedía desktop en 1600 de ancho. El plan gratis de Flow solo genera en 720p, así que el desktop quedó en 1280.

### Masters
- `video-hero/master_16x9.mp4`: 5,0 s, 150 cuadros.
- `video-hero/master_9x16.mp4`: 5,0 s, 90 cuadros.

### Composición del master (5 s)
| Etapa | Desktop (fuente) | Mobile (fuente) | Duración |
|---|---|---|---|
| Corte | `clip1.mp4` (0–4 s) | `clip1v.mp4` (0–4 s) | 0,8 s |
| Tiras / fetas | `clip2.mp4` (0–4 s) | `clip2v.mp4` (**0–3 s**) | 1,0 s |
| Marinado | `clip3.mp4` (**0–2,5 s**) | `clip3v.mp4` (0–4 s) | 1,2 s |
| Secado | `clip4-fundido.mp4` | `clip4v-fundido.mp4` | 1,0 s |
| Pack | `clip5-editado.mp4` | `clip5v.mp4` (con un fundido de 0,12 s al entrar) | 1,0 s |

**Ajustes propios de mobile:**
- Todo el cuadro está achicado al **80%**, anclado en el punto (0,5; 0,29), donde queda el pack. Así la carne no queda debajo del header.
- Los bordes del cuadro achicado están esfumados (56 px a los costados, 40 px arriba, 90 px abajo).
- Al clip 5 V se le bajó el negro 8 niveles para que el fondo coincida con el resto y no se vea un recuadro.
- Como el pack del DOM se oculta en modo secuencia, que el pack del video sea un poco más chico no genera ningún problema.

**Posición final del pack en el video:** desktop en (0,68; 0,52) con un alto del 64% del cuadro. Mobile en (0,5; 0,29), con alto 32% × 0,8. Es la misma composición que el pack del DOM.

## 5. Cómo se hizo (por si hay que regenerar)

### Herramienta
- **Google Flow** (gratis), con el modelo de video **Omni 1.1 Flash** y el de imagen **Nano Banana 2.1**.
- **Configuración para video:** Video → modo **Fotogramas** (no Ingredientes) → 16:9 o 9:16 → 720p → 4 s → x1/x2. Agente apagado, marca de agua apagada.
- **Clips encadenados:** el último cuadro de cada clip es el primer fotograma del siguiente. Las imágenes se suben **desde la computadora**, nunca desde la galería de Flow (eso causó un error).
- **Comandos de ffmpeg útiles:**
  ```bash
  ffmpeg -sseof -0.1 -i clipN.mp4 -update 1 clipN-ultimo.png    # último cuadro
  ffmpeg -ss 2.5 -i clipN.mp4 -frames:v 1 clipN-ultimo.png       # cuadro en un punto de corte
  # Exportar frames (lo que ya se hizo):
  ffmpeg -i master_16x9.mp4 -c:v libwebp -quality 70 -compression_level 6 -start_number 1 public/hero/v1/desktop/%04d.webp
  ffmpeg -i master_9x16.mp4 -c:v libwebp -quality 62 -compression_level 6 -start_number 1 public/hero/v1/mobile/%04d.webp
  ```

### Lo que aprendimos de Omni Flash
1. **Hace zoom solo, aunque el prompt lo prohíba.**
   - Ayuda pedir la carne chica, "camera never moves, never zooms, never pushes in" y "well inside all four edges".
   - Si igual pasa, se corta el clip antes del zoom (clip 3 en el segundo 2,5; clip 2V en el 3,0).
2. **No sabe hacer la transformación de crudo a jerky.** En 4 intentos salieron llamas y humo, carne gris como hervida, carne que nunca se secaba o un primer cuadro distinto.
   - **Solución:** con Nano Banana se edita el último cuadro del marinado para convertir la carne en jerky, manteniendo la composición. Después se hace un **fundido con ffmpeg** entre las dos imágenes alineadas, con un acercamiento del 2%. Como las siluetas coinciden, no aparece efecto fantasma.
3. **No siempre respeta el primer fotograma.** Hay que medir la similitud (SSIM con ffmpeg) entre el primer cuadro del clip y el fotograma de entrada. Cuando difieren, la unión se tapa con un fundido corto.
4. **A veces mete un corte de escena a mitad del clip** (clip 5 desktop en el segundo 2,0). Se resolvió usando de 0 a 0,8 s, después de 2,0 a 4,0 s, con un fundido de 0,4 s entre los dos tramos.
5. **Nano Banana devuelve 2000×1116 o 1116×2000**, que no es exactamente 16:9 ni 9:16. Se escala manteniendo la proporción y se agregan 3 px de relleno: `scale=1280:714,pad=1280:720:0:3` o `scale=714:1280,pad=720:1280:3:0`. Esa es la variante con mejor alineación por SSIM.
6. Las pruebas en 360p no anticipan cómo sale la versión en 720p. Conviene generar directamente en 720p.

### Prompts finales que funcionaron (16:9)

**Clip 1, corte** (solo texto):
```
Photorealistic commercial food cinematography. A whole raw Argentine beef eye of round, a lean, compact, cylindrical cut with smooth deep-red meat and almost no visible fat, rests on a dark wet slate stone. The entire cut is fully visible and small in the frame, about one quarter of the frame width, with generous black space on every side. Warm amber rim light from the left traces the edges of the meat. Only three or four tiny, faint embers drift slowly in the darkness. The meat stays still; only the light shimmers softly on its moist surface. Perfectly static locked-off camera with no zoom and no push-in, macro lens, shallow depth of field. Widescreen composition: the cut sits in the right half of the frame, centered at about two thirds of the width, well away from the right edge; the whole left half stays empty, pure black. Pitch-black background, deep blacks, rich red tones. Slow, smooth motion, crisp frames with minimal motion blur. No text, no people, no hands.
```

**Clip 2, tiras** (primer fotograma: `clip1-ultimo.png`):
```
Start exactly from the provided first frame and keep the exact same framing and scale for the whole clip: a wide shot where the camera never moves, never zooms and never pushes in. In slow motion, the raw beef cut separates into eight long, thin, flat strips, each about as thin as a finger, like strips cut for beef jerky. The strips lift off the slate and drift apart from each other in mid-air, each one floating separately with clear space between them, gently turning, like an exploded view. The strips stay small in the frame and close together, spreading over roughly the same area the original cut occupied, never larger than one third of the frame width, always well inside all four edges of the frame, inside the right half. The slate slowly sinks into darkness below. Same warm amber rim light from the left, only a few tiny faint embers. Photorealistic macro food cinematography, shallow depth of field. The whole left half of the frame stays empty, pure black. Pitch-black background. Slow, smooth, continuous motion, crisp frames with minimal motion blur. No text, no people, no hands, no knife.
```

**Clip 3, marinado** (primer fotograma: `clip2-ultimo.png`):
```
Start exactly from the provided first frame and keep the exact same framing and scale for the whole clip: the camera never moves, never zooms and never pushes in. The floating raw beef strips stay where they are, gently turning in place. Fresh chimichurri swirls in from the darkness around them in slow motion: finely chopped flat-leaf parsley, minced garlic, red pepper flakes, tiny specks of finely grated lemon zest and coarse salt crystals orbit the strips and gradually land on them, so that by the end every strip is speckled with green and red flecks and has a moist, glistening surface. All the herbs stay close to the strips, inside the right half of the frame and well inside all four edges. Same warm amber rim light from the left. Photorealistic high-speed macro food cinematography, shallow depth of field. The whole left half of the frame stays empty, pure black. Pitch-black background. Slow, smooth, continuous motion, crisp frames with minimal motion blur. No text, no people, no hands, no bowl, no spoon, no streams of liquid, no long strands.
```

**Clip 4, imagen del jerky** (Nano Banana, con `clip3-ultimo.png` como referencia):
```
Edit this image. Keep exactly the same composition, framing, camera angle, pitch-black background and warm amber rim light from the left, and keep every beef strip in exactly the same position, size, angle and shape. Only change the meat: every strip is now finished dried beef jerky, deep reddish mahogany brown, almost black at the edges, with a dry, leathery surface with a slight sheen, visible meat fibers, slightly thinner, with wrinkled, gently curled edges, exactly like premium store-bought beef jerky. The chopped parsley, garlic and red pepper flakes stay stuck to the strips, darker and dried. Remove most of the loose flecks floating in the air and keep only a few. The whole left half of the frame stays empty, pure black, and nothing touches the edges of the frame. Photorealistic macro food photography. No fire, no smoke, no text.
```
Después: el fundido con ffmpeg de `clip3-ultimo.png` a `clip4-ultimo.png` da como resultado `clip4-fundido.mp4` (`xfade` de 1,8 s más `zoompan` del 1,00 al 1,02 centrado en el sujeto).

**Clip 5, pack** (primer fotograma: `clip4-ultimo.png`; último: `frame-final-16x9.png`):
```
Start exactly from the provided first frame and end exactly on the provided last frame. The camera is locked off: it never moves, never zooms and never pushes in. The floating beef jerky strips gently drop down and out of frame, while the sealed black snack bag rises smoothly into place from below, already facing the camera with a slight tilt that straightens as it settles. A soft red glow blooms behind the bag. Keep the bag's printed artwork, logo and text exactly as in the last frame: no warping, no redrawing, no new text. Everything stays well inside all four edges of the frame. Pitch-black background. Slow, smooth, continuous motion, crisp frames with minimal motion blur. The last half second is completely still. No fire, no flames, no smoke, no people, no hands.
```

### Diferencias en 9:16
- **Encuadre:** "Vertical composition: the subject stays in the upper half of the frame, horizontally centered, with its center about one third from the top, well inside all four edges; the whole lower half stays empty, pure black."
- **Clip 2V:** si las tiras se abren hacia los costados, en vertical se salen del cuadro. El prompt que funcionó pide que suban y formen una columna ("rise straight up… stacking into a loose floating column… never wider than the original cut"). El modelo hizo **5 fetas anchas** en lugar de 8 tiras. Se aceptó así, porque cada usuario ve solo una de las dos versiones.
- **Clip 3V, 4V y 5V:** los mismos prompts, hablando de "slices" y de la "vertical column". El clip 5V salió continuo y sin cortes; es el mejor de la serie.

## 6. Archivos en `video-hero/`
| Archivo | Qué es |
|---|---|
| `clip1.mp4` … `clip5.mp4` | Clips desktop elegidos, tal como los generó Flow |
| `clip1v.mp4` … `clip3v.mp4`, `clip5v.mp4` | Clips mobile elegidos |
| `clip4-fundido.mp4`, `clip4v-fundido.mp4` | Secado hecho con fundido (**son los que se usan**) |
| `clip4.mp4` | Secado generado con IA (descartado: no coincide con el primer cuadro) |
| `clip5-editado.mp4` | Clip 5 desktop editado (0–0,8 s + 2,0–4,0 s) (**es el que se usa**) |
| `clip5-alt.mp4`, `prueba-union-3-4.mp4` | Descartes y pruebas |
| `clipN-ultimo.png`, `clipNv-ultimo.png` | Cuadros que encadenan los clips (el del clip 3 es el del segundo 2,5; el del 2V, el del 3,0) |
| `jerky-original.jpg`, `jerky-v-original.jpg` | Imágenes de jerky de Nano Banana en alta resolución |
| `frame-final-16x9.png`, `frame-final-9x16.png` | Fotogramas finales del pack (salen de `scripts/hero-keyframes.mjs`) |
| `master_16x9.mp4`, `master_9x16.mp4` | Masters de 5 s de donde salen los frames |

> `video-hero/` pesa bastante (varios mp4) y es material de trabajo. Conviene sumarlo a `.gitignore` o guardarlo fuera del repo, y versionar solo `public/hero/v1/`.

## 7. Pendientes, en orden de prioridad

1. **Activar la secuencia** en `src/config/store.ts`:
   ```ts
   hero: {
     desktop: { path: '/hero/v1/desktop', frames: 150 },
     mobile:  { path: '/hero/v1/mobile',  frames: 90 },
   },
   ```
2. **Probarla en el navegador:** desktop (1440×900 y 1920×1080), mobile (375×812) y reduced motion, que tiene que quedar en modo static sin cargar frames.
   - Comprobar que los textos de la izquierda (desktop) y de abajo (mobile) no se pisen con la carne.
   - Comprobar que el último cuadro deje el pack en el mismo lugar visual que tenía el pack del DOM.
   - Comprobar que no haya parpadeos ni huecos mientras cargan los frames.
3. **Riesgo con pantallas de otras proporciones.** El frame se dibuja tipo cover y centrado. En pantallas **verticales de más de 767 px de ancho** (por ejemplo una tablet en vertical, 768×1024) se usan los frames de desktop, y el recorte deja la carne y el pack contra el borde derecho o afuera.
   - **Solución sugerida:** elegir el set según la orientación, no solo según el ancho, por ejemplo `matchMedia('(max-width: 767px), (orientation: portrait)')`.
   - Otra opción es dibujar con un punto focal en x≈0,68 en lugar de centrado.
4. **Póster mientras carga.** En modo secuencia, el canvas queda vacío hasta que llega `0001.webp`.
   - **Solución sugerida:** precargar `0001.webp` del set que corresponda, con `<link rel="preload" as="image" media=...>`, o mostrarlo como póster de fondo hasta el primer dibujo.
5. **Arranque quieto:** en el primer ~1,2 s del master desktop la carne casi no se mueve, porque los clips 1 y 2 arrancan quietos. Si al probarlo se siente trabado, se puede recortar el inicio de `clip1.mp4` o `clip2.mp4` y volver a exportar.
6. **Pack real.** `public/brand/product-pack.png` (408×612) parece hecho con IA y tiene errores en el texto. Antes de la versión final, hay que pedirle al cliente una foto real o el archivo de diseño del pack y después:
   - regenerar los fotogramas finales con `node scripts/hero-keyframes.mjs`;
   - regenerar el clip 5 (o superponer el pack real en el último tramo del master);
   - volver a exportar los frames.
7. **Versionado:** subir la versión de la carpeta (`/hero/v2/`) cada vez que cambien los frames, para que no se queden imágenes viejas en caché.
8. **Commit:** cuando se apruebe, commitear solo `Carniceria/muucky` (código y `public/hero/v1/`), sin tocar los cambios ajenos del repo.
