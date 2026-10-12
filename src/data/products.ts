import { store } from '@/config/store';

export type ProductImage =
  /** Foto propia del producto (cuando lleguen las de cada tamaño). */
  | { kind: 'photo'; src: string; alt: string; width: number; height: number }
  /** El pack de siempre con una etiqueta con su peso real (hoy solo existe la foto del de 40 g). */
  | { kind: 'pack'; weightG: number; alt: string }
  /** Los packs que trae un combo, juntos y cada uno con su peso. */
  | { kind: 'combo'; alt: string }
  /** Foto que falta: solo se ve con las notas de la demo, con su dirección de arte. */
  | { kind: 'placeholder'; alt: string; brief: string };

export type Product = {
  slug: string;
  kind: 'pack' | 'combo';
  name: string;
  /** Nombre corto para el carrito y el mensaje de WhatsApp. */
  shortName: string;
  weightG: number;
  price: number;
  /** Solo si hubo un precio anterior real y con fecha (auditoría L5). */
  compareAtPrice?: number;
  /** Texto corto: "Más vendido", "Rinde más". */
  badge?: string;
  /** La tarjeta destacada (borde y halo rojos). */
  featured?: boolean;
  tagline: string;
  description: string;
  flavor: 'chimichurri';
  seals: 'EXCESO EN SODIO'[];
  images: ProductImage[];
  items?: { slug: string; qty: number }[];
};

const packImage = (weight: number): ProductImage => ({
  kind: 'pack',
  weightG: weight,
  alt: `Pack Muucky de ${weight} g, beef jerky marinado con chimichurri, con el sello EXCESO EN SODIO`,
});

const gallery = (weight: number): ProductImage[] => [
  packImage(weight),
  {
    kind: 'placeholder',
    alt: `Dorso del pack de ${weight} g con la tabla nutricional`,
    brief: 'Dorso del pack: tabla nutricional, ingredientes y RNPA legibles. Fondo negro, luz pareja.',
  },
  {
    kind: 'placeholder',
    alt: 'Pack abierto con las tiras de jerky a la vista',
    brief: 'Pack abierto, tiras de jerky asomando. Macro, luz cálida lateral, fondo negro.',
  },
  {
    kind: 'placeholder',
    alt: `Pack de ${weight} g sostenido en la mano, para ver el tamaño real`,
    brief: 'El pack en la mano, para mostrar la escala. Luz natural cálida.',
  },
];

const packs: Product[] = [
  {
    slug: 'pack-40g',
    kind: 'pack',
    name: 'Pack 40 g',
    shortName: 'Pack 40 g',
    weightG: 40,
    price: 4990,
    tagline: 'Para el bolso, el escritorio o la previa.',
    description:
      'La porción justa para llevar encima. Tiras de carne vacuna argentina marinadas 24 horas en chimichurri, limón y sal, y deshidratadas despacio.',
    flavor: 'chimichurri',
    seals: ['EXCESO EN SODIO'],
    images: gallery(40),
  },
  {
    slug: 'pack-100g',
    kind: 'pack',
    name: 'Pack 100 g',
    shortName: 'Pack 100 g',
    weightG: 100,
    price: 9990,
    badge: 'Más vendido',
    featured: true,
    tagline: 'Para la semana o para compartir.',
    description:
      'El tamaño que más sale. Rinde para varios días de gym u oficina, o para abrirlo en la mesa y que alcance para todos.',
    flavor: 'chimichurri',
    seals: ['EXCESO EN SODIO'],
    images: gallery(100),
  },
  {
    slug: 'pack-250g',
    kind: 'pack',
    name: 'Pack 250 g',
    shortName: 'Pack 250 g',
    weightG: 250,
    price: 19990,
    badge: 'Rinde más',
    tagline: 'Para los que ya saben.',
    description:
      'El formato grande, con el mejor precio por gramo. Para los que comen jerky todos los días o para dividir entre varios.',
    flavor: 'chimichurri',
    seals: ['EXCESO EN SODIO'],
    images: gallery(250),
  },
];

const bySlug = (slug: string) => packs.find((p) => p.slug === slug)!;

function combo(
  slug: string,
  name: string,
  tagline: string,
  description: string,
  items: { slug: string; qty: number }[],
): Product {
  const base = items.reduce((sum, i) => sum + bySlug(i.slug).price * i.qty, 0);
  const weightG = items.reduce((sum, i) => sum + bySlug(i.slug).weightG * i.qty, 0);
  const price = Math.round((base * (1 - store.comboDiscountPct / 100)) / 10) * 10;
  return {
    slug,
    kind: 'combo',
    name,
    shortName: name,
    weightG,
    price,
    tagline,
    description,
    flavor: 'chimichurri',
    seals: ['EXCESO EN SODIO'],
    images: [
      {
        kind: 'combo',
        alt: `${name}: ${items.map((i) => `${i.qty} × ${bySlug(i.slug).name}`).join(' + ')}`,
      },
    ],
    items,
  };
}

// [CONFIRMAR] combos y precios con el cliente
const combos: Product[] = [
  combo(
    'combo-previa',
    'Combo Previa',
    '3 packs de 40 g',
    'Tres packs chicos para repartir: uno en el bolso, uno en el auto y uno para la previa.',
    [{ slug: 'pack-40g', qty: 3 }],
  ),
  combo(
    'combo-semana',
    'Combo Semana',
    '2 packs de 100 g + 1 de 40 g',
    'Para toda la semana: dos packs de 100 g para la casa y uno de 40 g para llevar.',
    [
      { slug: 'pack-100g', qty: 2 },
      { slug: 'pack-40g', qty: 1 },
    ],
  ),
];

export const products: Product[] = [...packs, ...combos];
export const packProducts = packs;
export const comboProducts = combos;

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

/** Precio por 100 g, calculado (nunca escrito a mano). */
export function pricePer100g(p: Pick<Product, 'price' | 'weightG'>) {
  return Math.round((p.price / p.weightG) * 100);
}

/** Lo que cuesta un combo comprando los packs por separado. */
export function comboBasePrice(p: Product) {
  return (p.items ?? []).reduce((sum, i) => sum + bySlug(i.slug).price * i.qty, 0);
}

export function comboItemsLabel(p: Product) {
  return (p.items ?? []).map((i) => `${i.qty} × ${bySlug(i.slug).name}`).join(' + ');
}

export const lowestPrice = Math.min(...packs.map((p) => p.price));
