import Image from 'next/image';
import { getProduct, type Product } from '@/data/products';

/**
 * El pack con una etiqueta con su peso. Hoy existe solo la foto del pack de 40 g y su bloque de datos dice
 * "40 gramos": la etiqueta lo tapa con el peso real de cada tamaño, sin agrandar el pack para fingir el tamaño.
 * Las medidas van en % del pack y la letra en cqw, así la etiqueta acompaña al pack en cualquier tamaño.
 */
export function PackImage({
  weightG,
  alt = '',
  sizes,
  className = '',
  eager = false,
  style,
}: {
  weightG: number;
  alt?: string;
  sizes: string;
  className?: string;
  eager?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`@container relative aspect-[2/3] ${className}`} style={style}>
      <Image
        src="/brand/product-pack.webp"
        alt={alt}
        fill
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        className="object-contain"
      />
      <span
        aria-hidden="true"
        className="absolute left-[18%] top-[72%] flex h-[15%] w-[47%] -rotate-3 items-center justify-center rounded-[1.5cqw] border-[0.6cqw] border-white/20 bg-red font-display text-[15cqw] font-bold leading-none tracking-tight text-white shadow-[0_1cqw_3cqw_rgba(0,0,0,0.55)]"
      >
        {weightG} g
      </span>
    </div>
  );
}

/**
 * Los packs de un combo, juntos y cada uno con su peso (el Combo Semana muestra 100 g, 100 g y 40 g).
 * Cada pack se corre un 62 % de su propio ancho: tres packs ocupan 2,24 anchos de pack (1,5 veces el alto
 * del contenedor), sin importar el tamaño.
 */
export function ComboPacks({ product, className = '', sizes }: { product: Product; className?: string; sizes: string }) {
  const weights = (product.items ?? []).flatMap((i) => Array.from({ length: i.qty }, () => getProduct(i.slug)!.weightG));
  const middle = (weights.length - 1) / 2;
  return (
    <div className={`relative ${className}`} aria-hidden="true">
      {weights.map((w, i) => (
        <PackImage
          key={i}
          weightG={w}
          sizes={sizes}
          className="!absolute bottom-0 left-1/2 h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)]"
          style={{
            transform: `translateX(calc(-50% + ${(i - middle) * 62}%)) rotate(${(i - middle) * 7}deg)`,
            // Cada pack encima del anterior: la etiqueta (a la izquierda del pack) nunca queda tapada.
            zIndex: i + 1,
          }}
        />
      ))}
    </div>
  );
}
