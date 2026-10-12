'use client';

import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { getProduct } from '@/data/products';

const VISIBLE_MS = 3500;

/**
 * Aviso "Pack 100 g agregado · Ver carrito" al agregar un producto, cerca del ícono del carrito.
 * La región role="status" queda siempre montada para que el lector de pantalla anuncie cada agregado.
 */
export function CartToast() {
  const { lastAdded, isOpen, open } = useCart();
  const [hiddenAt, setHiddenAt] = useState<number | null>(null);

  useEffect(() => {
    if (!lastAdded) return;
    const id = window.setTimeout(() => setHiddenAt(lastAdded.at), VISIBLE_MS);
    return () => window.clearTimeout(id);
  }, [lastAdded]);

  // Lo que se agrega con el carrito abierto ya se ve ahí: no avisa después, al cerrarlo.
  if (isOpen && lastAdded && hiddenAt !== lastAdded.at) setHiddenAt(lastAdded.at);

  const product = lastAdded ? getProduct(lastAdded.slug) : undefined;
  const visible = Boolean(lastAdded && product && hiddenAt !== lastAdded.at && !isOpen);
  const text =
    lastAdded && product
      ? lastAdded.qty > 1
        ? `${lastAdded.qty} × ${product.shortName} agregados`
        : `${product.shortName} agregado`
      : '';

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-4 top-[calc(var(--bar-h)+var(--header-h)+8px)] z-40 flex justify-end sm:left-auto sm:right-6"
    >
      {visible && (
        <div
          key={lastAdded!.at}
          className="pointer-events-auto flex w-full items-center gap-3 rounded-md border border-white/10 bg-surface-raised py-2 pl-4 pr-2 shadow-[0_12px_32px_rgba(0,0,0,0.6)] motion-safe:animate-[barIn_250ms_ease-out] sm:w-auto"
        >
          <Check className="size-5 shrink-0 text-red-text" aria-hidden="true" />
          <p className="flex-1 text-14 font-medium">{text}</p>
          <button
            type="button"
            onClick={() => {
              setHiddenAt(lastAdded!.at);
              open();
            }}
            className="min-h-11 shrink-0 rounded-sm px-3 text-14 font-bold text-ink underline decoration-red decoration-2 underline-offset-4 hover:decoration-ink"
          >
            Ver carrito
          </button>
        </div>
      )}
    </div>
  );
}
