import { getProduct, products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { ogSize, renderOg } from '@/lib/og';

export const alt = 'Pack de Muucky beef jerky';
export const size = ogSize;
export const contentType = 'image/png';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug) ?? products[0];
  // Cada pack con su peso; un combo muestra los packs que trae.
  const packs = product.items
    ? product.items.flatMap((i) => Array.from({ length: i.qty }, () => getProduct(i.slug)!.weightG))
    : [product.weightG];
  return renderOg({
    title: product.name,
    subtitle: product.tagline,
    price: formatPrice(product.price),
    packs,
  });
}
