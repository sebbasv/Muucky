# Fotos pendientes (provisorias de IA para la demo)

Cada foto se exporta en WebP a `public/fotos/` con el nombre de la tabla. Después se completa `src` en `src/data/photos.ts` (por ejemplo `src: '/fotos/macro.webp'`) y la sección la muestra sola. Mientras falte, la sección se ve sin foto, nunca con una caja vacía.

Estilo común para todas: fondo oscuro, luz cálida lateral, nada de texto ni logos inventados en la imagen y nada de packs con otro diseño (si aparece un pack, que sea el de Muucky o que no aparezca). El footer ya dice "Imágenes ilustrativas".

| Archivo | Proporción | Dónde se ve | Prompt (en inglés, rinde mejor en la mayoría de los generadores) |
|---|---|---|---|
| `macro.webp` | 4:5 | Home, "¿Por qué Muucky?" | Extreme macro of a torn strip of beef jerky, visible meat fibers, glossy chimichurri marinade with flecks of parsley, garlic and red chili flakes, black background, warm side light, a few out-of-focus embers, food photography, shallow depth of field |
| `gym.webp` | 1:1 | Home, Momentos (tile grande) | Open bag of beef jerky inside a black gym bag on a wooden bench after a workout, towel and water bottle, warm natural window light, moody dark tones, food lifestyle photography |
| `oficina.webp` | 1:1 | Home, Momentos | Beef jerky strips on a desk next to a laptop and an Argentine mate gourd, late afternoon warm light, dark moody tones, lifestyle photography |
| `viaje.webp` | 1:1 | Home, Momentos | Beef jerky in an open backpack pocket on a car passenger seat, highway at golden hour through the windshield, warm tones, lifestyle photography |
| `mate.webp` | 1:1 | Home, Momentos | Argentine mate and a small pile of beef jerky strips on a rustic wooden table, late afternoon sunlight, warm and dark tones, food photography |
| `previa.webp` | 1:1 | Home, Momentos | Wooden board with beef jerky strips to share at a night gathering with friends, hands reaching in, warm low light, bokeh, food lifestyle photography |
| `corte.webp` | 4:5 | /nosotros, "El corte" | Raw lean beef cut on a black slate stone, warm side light, dark background, a few embers out of focus, food photography |
| `marinado.webp` | 4:5 | /nosotros, "El marinado" | Macro of raw beef strips in chimichurri marinade, glossy surface, parsley, garlic and chili flakes, lemon, black background, warm side light |
| `secado.webp` | 4:5 | /nosotros, "El secado" | Dried beef jerky strips on a metal drying rack, visible fiber texture, dark background, warm out-of-focus embers |
| `equipo.webp` | 4:3 | /nosotros, "Quiénes somos" | **No usar IA.** Tiene que ser una foto real del equipo en el lugar de producción. |

Las fotos de cada tamaño de pack (100 g y 250 g), el dorso, el pack abierto y el pack en la mano tienen que ser fotos reales del producto: mostrar un envase generado sería engañoso. Hasta que estén, los packs usan la foto del de 40 g con una etiqueta con su peso.
