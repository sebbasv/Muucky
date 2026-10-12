'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { ComboPacks, PackImage } from '@/components/product/PackImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { btn } from '@/components/ui/styles';
import { comboBasePrice, comboItemsLabel, pricePer100g, type Product } from '@/data/products';
import { formatPrice } from '@/lib/format';

/** El botón pasa a "Agregado" un momento; el aviso con "Ver carrito" lo muestra CartToast. */
export function useAddedFlash() {
  const [added, setAdded] = useState(false);
  useEffect(() => {
    if (!added) return;
    const id = window.setTimeout(() => setAdded(false), 1500);
    return () => window.clearTimeout(id);
  }, [added]);
  return [added, () => setAdded(true)] as const;
}

export function AddedLabel({ added, children = 'Agregar al carrito' }: { added: boolean; children?: React.ReactNode }) {
  return added ? (
    <>
      <Check className="size-4" aria-hidden="true" /> Agregado
    </>
  ) : (
    <>{children}</>
  );
}

const cardSizes = '(min-width: 1024px) 240px, (min-width: 640px) 35vw, 60vw';

export function ProductCard({ product, headingLevel = 'h3' }: { product: Product; headingLevel?: 'h2' | 'h3' }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, flash] = useAddedFlash();
  const H = headingLevel;
  const image = product.images[0];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded-lg border bg-surface ${
        product.featured ? 'border-red/70 shadow-glow' : 'border-border'
      }`}
    >
      {/* La imagen repite el link del título: fuera del orden de tabulación y del árbol de accesibilidad */}
      <Link
        href={`/productos/${product.slug}`}
        className="relative block aspect-[4/3] overflow-hidden bg-[radial-gradient(80%_60%_at_50%_70%,#231f1a_0%,#121212_70%)] sm:aspect-[4/5]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 bottom-[6%] flex h-[82%] justify-center transition-transform duration-500 ease-out group-hover:-translate-y-1.5 motion-reduce:transition-none">
          {image?.kind === 'photo' ? (
            <Image src={image.src} alt="" width={image.width} height={image.height} sizes={cardSizes} className="h-full w-auto" />
          ) : (
            <PackImage weightG={product.weightG} sizes={cardSizes} className="h-full" />
          )}
        </div>
      </Link>
      {product.badge && (
        <span className="absolute left-4 top-4 rounded-sm bg-red px-2.5 py-1 text-12 font-bold uppercase tracking-[0.1em] text-white">
          {product.badge}
        </span>
      )}

      <div className="flex flex-1 flex-col p-4 sm:p-5 md:p-6">
        <H className="font-display text-32 font-bold leading-none">
          <Link
            href={`/productos/${product.slug}`}
            className="hover:underline hover:decoration-red hover:decoration-2 hover:underline-offset-4"
          >
            {product.name}
          </Link>
        </H>
        <p className="mt-2 text-16 text-ink-muted md:text-14">{product.tagline}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-border pt-4">
            <p className="font-display text-32 font-bold leading-none tabular-nums">{formatPrice(product.price)}</p>
            {/* En el de 100 g el precio por 100 g es el mismo precio: no se repite */}
            {product.weightG !== 100 && (
              <p className="pb-0.5 text-right text-14 text-ink-muted tabular-nums">
                {formatPrice(pricePer100g(product))} <span className="whitespace-nowrap">/ 100 g</span>
              </p>
            )}
          </div>

          <div className="mt-5 flex gap-2">
            {/* En tarjetas angostas la cantidad queda para la ficha y el carrito: el botón entra en una línea */}
            <div className="hidden md:block">
              <QuantityStepper value={qty} onChange={setQty} label={`Cantidad de ${product.name}`} />
            </div>
            <button
              type="button"
              className={`${btn.solid} flex-1`}
              onClick={() => {
                add(product.slug, qty);
                flash();
                setQty(1);
              }}
            >
              <AddedLabel added={added} />
            </button>
          </div>
          <Link href={`/productos/${product.slug}`} className={`${btn.link} mt-2 text-14`}>
            Ver detalle <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/** Tarjeta horizontal para combos: los packs que trae, cada uno con su peso, y el ahorro en un chip. */
export function ComboCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, flash] = useAddedFlash();
  const saving = comboBasePrice(product) - product.price;

  return (
    <article className="flex h-full flex-col gap-5 rounded-lg border border-border bg-surface p-5 sm:flex-row sm:items-center md:p-6">
      <Link href={`/productos/${product.slug}`} tabIndex={-1} aria-hidden="true" className="block h-28 shrink-0 sm:w-44">
        <ComboPacks product={product} sizes="72px" className="h-full w-full" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="font-display text-24 font-bold leading-none">
          <Link href={`/productos/${product.slug}`} className="hover:underline hover:decoration-red hover:underline-offset-4">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1.5 text-14 text-ink-muted">{comboItemsLabel(product)}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-3">
            <span className="font-display text-32 font-bold leading-none tabular-nums">{formatPrice(product.price)}</span>
            {saving > 0 && (
              <span className="whitespace-nowrap rounded-sm bg-red/15 px-2 py-1 text-12 font-bold text-red-text tabular-nums">
                <span aria-hidden="true">−{formatPrice(saving)}</span>
                <span className="sr-only">Ahorrás {formatPrice(saving)} frente a comprarlos por separado</span>
              </span>
            )}
          </div>
          <button
            type="button"
            className={`${btn.solid} w-full sm:w-auto`}
            onClick={() => {
              add(product.slug, 1);
              flash();
            }}
          >
            <AddedLabel added={added} />
          </button>
        </div>
      </div>
    </article>
  );
}
