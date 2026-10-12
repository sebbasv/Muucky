'use client';

import { useEffect, useState } from 'react';
import { Pause, Play, X } from 'lucide-react';
import { store, hasTransferDiscount } from '@/config/store';
import { formatPrice } from '@/lib/format';

export const BAR_KEY = 'muucky.bar.closed';

const messages = [
  `Envío gratis desde ${formatPrice(store.freeShippingFrom)}`,
  ...(hasTransferDiscount ? [`${store.transferDiscountPct}% off pagando por transferencia`] : []),
  ...(store.installments
    ? [`Hasta ${store.installments.count} cuotas${store.installments.interestFree ? ' sin interés' : ''}`]
    : []),
  'Hacemos envíos a todo el país',
];

/**
 * Barra de anuncios: un mensaje rotativo que se puede pausar y cerrar (recuerda que se cerró).
 * Sin aria-live, para que el lector de pantalla no anuncie cada rotación. Con reduced motion no rota.
 */
export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [holding, setHolding] = useState(false); // mouse encima o foco adentro

  useEffect(() => {
    if (messages.length < 2 || paused || holding || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 4500);
    return () => window.clearInterval(id);
  }, [paused, holding]);

  const dismiss = () => {
    document.documentElement.dataset.barClosed = 'true';
    try {
      window.localStorage.setItem(BAR_KEY, '1');
    } catch {
      // sin almacenamiento: se vuelve a mostrar en la próxima visita
    }
  };

  return (
    <div
      className="announcement relative flex h-[var(--bar-h)] items-center justify-center overflow-hidden bg-red-deep px-12 text-white"
      onMouseEnter={() => setHolding(true)}
      onMouseLeave={() => setHolding(false)}
      onFocus={() => setHolding(true)}
      onBlur={() => setHolding(false)}
    >
      {messages.length > 1 && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="absolute left-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-white/80 hover:text-white motion-reduce:hidden"
          aria-label={paused ? 'Reanudar los avisos' : 'Pausar los avisos'}
        >
          {paused ? <Play className="size-3.5" aria-hidden="true" /> : <Pause className="size-3.5" aria-hidden="true" />}
        </button>
      )}
      <p className="truncate text-center text-14 font-medium tracking-wide">
        <span key={index} className="inline-block motion-safe:animate-[barIn_400ms_ease-out]">
          {messages[index]}
        </span>
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center text-white/80 hover:text-white"
        aria-label="Cerrar aviso"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
