// Fotos propias del sitio (o provisorias de IA). Cuando exista el archivo, se exporta a public/fotos/
// con el nombre indicado y se completa `src`: la sección la muestra sola. Sin foto, cada sección
// tiene su versión sin imagen (nunca una caja vacía). `brief` es la dirección de arte de cada toma.

export type Photo = {
  /** Ruta en public, por ejemplo '/fotos/macro.webp'. Vacío = todavía no está. */
  src?: string;
  alt: string;
  brief: string;
};

export const photos = {
  macro: {
    alt: 'Tira de jerky Muucky desgarrada, con las fibras y el chimichurri a la vista',
    brief:
      'Tira de jerky desgarrada en macro, se ven las fibras y el chimichurri. Fondo negro, luz cálida lateral, alguna brasa desenfocada. 4:5.',
  },
  gym: {
    alt: 'Pack de Muucky abierto en un bolso de gimnasio',
    brief: 'Pack abierto en el bolso del gym, después de entrenar. Luz natural cálida. 1:1.',
  },
  oficina: {
    alt: 'Pack de Muucky sobre un escritorio, al lado de la notebook y el mate',
    brief: 'Sobre el escritorio, entre la notebook y el mate. 1:1.',
  },
  viaje: {
    alt: 'Pack de Muucky en la mochila durante un viaje en ruta',
    brief: 'En la guantera o la mochila, ruta de fondo. 1:1.',
  },
  mate: {
    alt: 'Mate y tiras de jerky Muucky sobre una mesa de madera',
    brief: 'Mate y jerky en la mesa de madera, de tarde. 1:1.',
  },
  previa: {
    alt: 'Tabla con jerky Muucky para compartir en una previa',
    brief: 'Tabla con jerky para compartir, de noche, luz cálida. 1:1.',
  },
  equipo: {
    alt: 'Las personas que hacen Muucky, en el lugar de producción',
    brief: 'Retrato del equipo en el lugar de producción, luz natural cálida. Tiene que ser real, nada de stock ni IA. 4:3.',
  },
  corte: {
    alt: 'Corte de carne vacuna cruda sobre piedra negra',
    brief: 'Corte de carne cruda sobre piedra negra, luz cálida lateral. 4:5.',
  },
  marinado: {
    alt: 'Tiras de carne en el marinado de chimichurri',
    brief: 'Tiras en el marinado, macro: perejil, ajo y ají sobre la carne brillante. 4:5.',
  },
  secado: {
    alt: 'Tiras de jerky secas sobre una rejilla',
    brief: 'Tiras ya secas sobre rejilla, textura de las fibras, brasas desenfocadas. 4:5.',
  },
} satisfies Record<string, Photo>;
