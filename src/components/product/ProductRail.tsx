import { ProductCard } from '@/components/product/ProductCard';
import type { Product } from '@/data/products';

/**
 * Tarjetas de packs: en mobile, carrusel horizontal con snap y la siguiente tarjeta asomando
 * (una tarjeta apilada mide casi una pantalla); desde 640 px, grilla.
 */
export function ProductRail({ products, label, reveal = false }: { products: Product[]; label: string; reveal?: boolean }) {
  return (
    <ul
      aria-label={label}
      className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:p-0 lg:grid-cols-3"
    >
      {products.map((p) => (
        <li key={p.slug} className={`w-[82%] shrink-0 snap-start sm:w-auto ${reveal ? 'reveal' : ''}`}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
