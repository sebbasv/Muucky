# Muucky: rediseño del sitio (demo de propuesta)

Rediseño completo de [muucky.com.ar](https://www.muucky.com.ar), hecho a partir del brief `MUUCKY-REDISENO-BRIEF.md` y del sistema de diseño de Claude Design. Incluye la Fase 0 completa (home, fichas de producto, carrito con pedido por WhatsApp) y casi todo el sitemap de la Fase 1.

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (todo se pre-renderiza como HTML estático)
npm run demo     # build de producción + servidor: así se presenta (sin el indicador de Next del modo dev)
```

Stack: Next.js 16 (App Router, Cache Components) + TypeScript + Tailwind CSS 4, `lucide-react` para íconos y `next/font` para servir Oswald e Inter desde el propio dominio.

## Dónde se configura cada cosa

| Qué | Archivo |
|---|---|
| WhatsApp, email, envío gratis, zonas y costos, medios de pago, descuentos, datos legales, redes, RNE/RNPA | `src/config/store.ts` |
| Productos, precios, badges y combos | `src/data/products.ts` |
| Tabla nutricional e ingredientes | `src/data/nutrition.ts` |
| Fotos de las secciones (qué toma va en cada lugar y dónde se guarda) | `src/data/photos.ts` |
| Preguntas frecuentes (salen de `store.ts`) | `src/data/faq.ts` |
| Tokens de marca (colores, radios, sombras y escala tipográfica) | `src/app/globals.css` |
| Favicon, íconos y versiones livianas del logo y el pack | `node scripts/brand-assets.mjs` |

### Notas internas de la demo

Las etiquetas "a confirmar", las cajas "Foto pendiente" con la dirección de arte, los avisos de texto provisorio y la nota de demo del footer solo se ven con `NEXT_PUBLIC_DEMO_NOTES=true` (en `.env.local`, reiniciando el servidor). Sin definirla, que es como se presenta y se publica, no aparece ninguna. Lo que el visitante sí tiene que saber queda siempre: "Imágenes ilustrativas" en el footer y "Valores de ejemplo" arriba de la tabla nutricional mientras falten datos del envase.

### Fotos

Cada foto de sección (macro, momentos, equipo y proceso) está en `src/data/photos.ts` con su dirección de arte. Se exporta a `public/fotos/` y se completa `src`: la sección la muestra sola. Mientras no esté, la sección se arma sin foto (nunca una caja vacía). Los packs de 100 y 250 g usan la foto del de 40 g con una etiqueta con su peso real, que tapa el bloque "40 gramos" del arte, hasta que haya fotos de cada tamaño.

### Tipografía

Escala de 8 pasos más 2 de display, como tokens en `globals.css`: clases `text-12`, `text-14`, `text-16`, `text-18`, `text-24`, `text-32`, `text-48`, `text-64`, `text-96` y `text-128`. No se usan tamaños sueltos (`text-[15px]`). Quedan afuera el hero y los botones `btn.primary` y `btn.outline`, que usa el hero.

La imagen para compartir usa Oswald desde `src/assets/fonts/Oswald-Bold.ttf` (estática: `ImageResponse` no lee woff2 ni fuentes variables). Si el archivo no está, sale con la fuente por defecto.

## El hero animado

El hero sigue el concepto A del Anexo B ("Del corte al bocado"): queda fijo mientras se scrollea y el video avanza con el scroll en 5 etapas: corte, tiras, marinado, secado y pack. El video está hecho con IA y exportado en frames (cómo se hizo y cómo regenerarlo: `video-hero/HERO-HANDOFF.md`).

- Frames: `public/hero/v1/desktop/0001…0150.webp` (16:9) y `public/hero/v1/mobile/0001…0090.webp` (9:16), configurados en `store.hero`. Si cambian, se sube la versión de la carpeta (`/hero/v2/`).
- Qué set se usa: 16:9 en pantallas horizontales de 768 px o más; 9:16 en el resto (tablets en vertical incluidas). Si se gira la pantalla, cambia solo. En CSS es la variante `wide:`.
- Coreografía (`src/components/hero/Hero.tsx`): intro y después una etapa por tramo, con fundido cruzado, así siempre hay un texto. `store.hero.*.stops` marca en qué parte del video empieza cada etapa, para que cada texto aparezca con su imagen. El último tramo queda quieto el pack.
- Recorrido: 300svh en desktop y 100svh en mobile (la sección mide 400svh y 200svh). Hay un link "Saltar a productos".
- Carga: el frame 1 hace de póster (fondo CSS) hasta que dibuja el canvas; después se pide uno de cada 6 frames y el resto en tiempo libre. Si falta un frame, se dibuja el más cercano.
- Con `prefers-reduced-motion` o ahorro de datos (o 2G/3G) el hero queda estático: el pack fijo y el proceso en una lista, sin descargar frames.
- Con `frames: 0` vuelve la escena dibujada por código (`scene.ts`), que queda de respaldo.

## Qué funciona

- Header fijo con logo, navegación, carrito con contador y menú mobile a pantalla completa. Barra de anuncios que se puede pausar y cerrar, y que se esconde al scrollear para abajo.
- Al agregar al carrito, el botón pasa a "Agregado" y aparece un aviso con "Ver carrito".
- Carrito lateral: +/−, eliminar, persistencia en `localStorage`, barra hacia el envío gratis con sugerencia del pack que falta, envío por código postal (la zona sale del CP y solo se pregunta si no se reconoce) y formulario corto.
- Pedido por WhatsApp a `wa.me/5491127821967` con ítems, precios, envío, total, nombre, entrega y pago. Además se registra en `/api/orders`, que recalcula el total en el servidor.
- Fichas de producto (`/productos/[slug]`) con galería (swipe y zoom), precio por 100 g calculado, "Comprar ahora", estimado de envío, acordeón de detalles, productos relacionados y JSON-LD `Product` y `BreadcrumbList`.
- Páginas: productos, nutrición, nosotros, preguntas frecuentes (con `FAQPage`), mayoristas (formulario), envíos, devoluciones, términos, privacidad, botón de arrepentimiento (genera un código de trámite) y 404 propio.
- SEO: title, description, canonical, og:image de 1200×630 (una general y una por producto), `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, favicon y apple-touch-icon, `lang="es-AR"`.
- Analítica: GA4 y Meta Pixel se cargan solos si se definen `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_META_PIXEL_ID`. Eventos: `view_item`, `add_to_cart`, `view_cart`, `begin_checkout`, `whatsapp_order` y `generate_lead`.
- Accesibilidad: foco visible, foco atrapado en el carrito y el menú, cierre con Esc, `aria-label` en español, áreas táctiles de 44 px o más y texto rojo chico en `red-text`.

## Qué falta (pedir al cliente)

Todo lo marcado `[CONFIRMAR]` en el código:

- Logo en vector, fotos propias (una por pack, dorso, abierto, en la mano, macros y momentos) y el video del hero.
- El vector oficial del sello EXCESO EN SODIO (el del anexo de la normativa, que tiene el diseñador del envase) para reemplazar `src/components/ui/SodiumSeal.tsx`.
- Tabla nutricional completa (proteína, sodio, etc.), lista exacta de ingredientes, RNE/RNPA y conservación.
- Precios vigentes, combos y su descuento, monto de envío gratis, costos y plazos por zona, descuento por transferencia, cuotas y medios de pago reales.
- Razón social, CUIT, domicilio, URLs de redes y número de WhatsApp confirmado.
- Historia de la marca para `/nosotros` y reseñas reales (la sección está apagada con `showReviews: false`).
- Que un abogado revise los textos legales. Son borradores (con las notas de la demo activadas, lo dicen en la página).

## Fase 2 (no incluida)

Mercado Pago Checkout Pro (`/checkout`, `/api/mp/preference`, `/api/mp/webhook`, `/pedido/[id]`), pedidos y leads en Supabase, emails, suscripción y reseñas verificadas. Los endpoints de la v1 (`/api/orders`, `/api/leads`, `/api/arrepentimiento`) hoy solo registran en el log del servidor y tienen marcado dónde se conecta la base de datos.
