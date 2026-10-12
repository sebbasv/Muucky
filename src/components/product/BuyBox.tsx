'use client';

import { useEffect, useState } from 'react';
import { Truck } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { AddedLabel, useAddedFlash } from '@/components/product/ProductCard';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { btn, field } from '@/components/ui/styles';
import { store, hasTransferDiscount } from '@/config/store';
import { pricePer100g, type Product } from '@/data/products';
import { track } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { getZone, zoneFromPostalCode } from '@/lib/shipping';

export function BuyBox({ product }: { product: Product }) {
  const { add, buyer, updateBuyer } = useCart();
  const [qty, setQty] = useState(1);
  const [added, flash] = useAddedFlash();

  useEffect(() => {
    track('view_item', {
      value: product.price,
      items: [{ item_id: product.slug, item_name: product.name, price: product.price, quantity: 1 }],
    });
  }, [product]);

  const zone = getZone(buyer.zone || null);
  const subtotal = product.price * qty;
  const free = subtotal >= store.freeShippingFrom;

  const priceNotes = [
    // En el de 100 g el precio por 100 g es el mismo precio: no se repite
    product.weightG !== 100 && `${formatPrice(pricePer100g(product))} cada 100 g`,
    hasTransferDiscount &&
      `${formatPrice(Math.round(product.price * (1 - store.transferDiscountPct / 100)))} por transferencia`,
    store.installments &&
      `${store.installments.count} cuotas de ${formatPrice(Math.ceil(product.price / store.installments.count))}${
        store.installments.interestFree ? ' sin interés' : ''
      }`,
  ].filter(Boolean);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
        <p className="font-display text-48 font-bold leading-none tabular-nums">{formatPrice(product.price)}</p>
        {product.compareAtPrice && (
          <p className="pb-1 text-16 text-ink-muted line-through tabular-nums">{formatPrice(product.compareAtPrice)}</p>
        )}
      </div>
      {priceNotes.length > 0 && <p className="mt-2 text-14 text-ink-muted tabular-nums">{priceNotes.join(' · ')}</p>}

      <div className="mt-6 flex flex-wrap gap-2">
        <QuantityStepper value={qty} onChange={setQty} label={`Cantidad de ${product.name}`} />
        <button
          type="button"
          className={`${btn.secondary} min-w-[180px] flex-1`}
          onClick={() => {
            add(product.slug, qty);
            flash();
          }}
        >
          <AddedLabel added={added} />
        </button>
      </div>
      <button type="button" className={`${btn.solid} mt-2 w-full`} onClick={() => add(product.slug, qty, { open: true })}>
        Comprar ahora
      </button>

      {/* Estimado de envío por código postal: la zona sale sola del CP */}
      <div className="mt-6 rounded-lg border border-border p-4">
        <label htmlFor="pdp-cp" className="flex items-center gap-2 text-14 font-bold">
          <Truck className="size-4 text-red" aria-hidden="true" /> Calculá el envío
        </label>
        <div className="mt-3 flex gap-2">
          <input
            id="pdp-cp"
            inputMode="text"
            autoComplete="postal-code"
            placeholder="Tu código postal"
            maxLength={8}
            className={`${field.input} max-w-[180px]`}
            value={buyer.postalCode}
            onChange={(e) => updateBuyer({ postalCode: e.target.value, zone: zoneFromPostalCode(e.target.value) ?? '' })}
          />
        </div>
        <p className="mt-3 text-14 text-ink-muted" aria-live="polite">
          {zone ? (
            <>
              <span className="text-ink">{zone.label}</span>:{' '}
              {free ? <strong className="text-ink">envío gratis</strong> : formatPrice(zone.price)} · llega en {zone.days}.
            </>
          ) : (
            <>Envío gratis desde {formatPrice(store.freeShippingFrom)}.</>
          )}
        </p>
      </div>
    </div>
  );
}
