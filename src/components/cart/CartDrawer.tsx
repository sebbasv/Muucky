'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import { ShoppingBag, Trash2, X, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { ComboPacks, PackImage } from '@/components/product/PackImage';
import { QuantityStepper } from '@/components/ui/QuantityStepper';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { btn, field } from '@/components/ui/styles';
import { store, waLink, type ShippingZoneId } from '@/config/store';
import { track } from '@/lib/analytics';
import { formatPrice } from '@/lib/format';
import { buildWhatsAppMessage, validateBuyer, type Buyer } from '@/lib/order';
import { freeShippingProgress, getZone, zoneFromPostalCode } from '@/lib/shipping';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { comboItemsLabel, packProducts } from '@/data/products';

export function CartDrawer() {
  const { isOpen, close, totals, add, setQty, remove, buyer, updateBuyer, clear } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [errors, setErrors] = useState<Partial<Record<keyof Buyer, string>>>({});
  const [sent, setSent] = useState(false);
  useFocusTrap(panelRef, isOpen, close);

  // Al cerrar, el cajón vuelve al primer paso (ajuste de estado durante el render, sin efecto).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (!isOpen) {
      setStep('cart');
      setErrors({});
      setSent(false);
    }
  }

  const { detailed, subtotal, shipping, total, count } = totals;
  const progress = freeShippingProgress(subtotal);
  const zone = getZone(buyer.zone || null);
  // El pack más barato que alcanza para el envío gratis (ocupa el lugar vacío del cajón).
  const upsell = progress.reached
    ? undefined
    : packProducts.filter((p) => p.price >= progress.missing).sort((a, b) => a.price - b.price)[0];

  // La zona sale del código postal; si el CP cambia, se vuelve a calcular.
  const onPostalCode = (value: string) => updateBuyer({ postalCode: value, zone: zoneFromPostalCode(value) ?? '' });

  const goCheckout = () => {
    setStep('checkout');
    track('begin_checkout', { value: subtotal });
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLInputElement>('#buyer-name')?.focus());
  };

  const sendOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validateBuyer(buyer);
    setErrors(found);
    const firstError = Object.keys(found)[0];
    if (firstError) {
      panelRef.current?.querySelector<HTMLElement>(`[name="${firstError}"]`)?.focus();
      return;
    }
    const message = buildWhatsAppMessage(
      detailed.map((l) => ({ slug: l.slug, qty: l.qty })),
      buyer,
    );
    track('whatsapp_order', {
      value: total,
      items: detailed.map((l) => ({ item_id: l.slug, item_name: l.product.name, price: l.product.price, quantity: l.qty })),
    });
    // v1: el pedido solo se registra en el log; en v2 se guarda en Supabase con estado whatsapp_pending.
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines: detailed.map((l) => ({ slug: l.slug, qty: l.qty })), buyer, total }),
      keepalive: true,
    }).catch(() => {});
    window.open(waLink(message), '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={`fixed inset-0 z-50 bg-black/70 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        inert={!isOpen}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col border-l border-border bg-surface shadow-2xl outline-none transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id={titleId} className="font-display text-24 font-bold leading-none">
            {sent ? '¡Pedido armado!' : step === 'cart' ? 'Tu carrito' : 'Tus datos'}
            {count > 0 && step === 'cart' && !sent && (
              <span className="ml-2 align-middle font-sans text-14 font-medium text-ink-muted">({count})</span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            className="grid size-11 place-items-center rounded-md text-ink hover:bg-white/5"
            aria-label="Cerrar carrito"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        {detailed.length === 0 && !sent ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <ShoppingBag className="size-10 text-ink-muted" strokeWidth={1.25} aria-hidden="true" />
            <p className="font-display text-24 font-bold">Todavía no elegiste nada</p>
            <p className="text-16 text-ink-muted">Empezá por el de 100 g: es el que más sale.</p>
            <Link href="/productos" onClick={close} className={btn.solid}>
              Ver los packs
            </Link>
          </div>
        ) : sent ? (
          <div className="flex flex-1 flex-col justify-center gap-4 px-6">
            <p className="font-display text-32 font-bold leading-tight">Seguí en WhatsApp para confirmarlo</p>
            <p className="text-16 text-ink-muted">
              Se abrió el chat con el pedido completo. Si no se abrió, tocá el botón de abajo. Te respondemos con el
              total final y los datos para pagar.
            </p>
            <a
              href={waLink(buildWhatsAppMessage(detailed.map((l) => ({ slug: l.slug, qty: l.qty })), buyer))}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.solid} w-full`}
            >
              <WhatsAppIcon className="size-5" /> Abrir WhatsApp de nuevo
            </a>
            <button
              type="button"
              className={`${btn.outline} w-full`}
              onClick={() => {
                clear();
                close();
              }}
            >
              Vaciar el carrito y seguir mirando
            </button>
          </div>
        ) : (
          <>
            {/* Barra de progreso hacia el envío gratis */}
            <div className="border-b border-border px-5 py-4" aria-live="polite">
              <p className="flex items-center gap-2 text-14">
                <Truck className="size-4 shrink-0 text-red" aria-hidden="true" />
                {progress.reached ? (
                  <span>
                    <strong className="text-ink">Tenés envío gratis.</strong>
                  </span>
                ) : (
                  <span className="text-[#d6d6d6]">
                    Te faltan <strong className="text-ink">{formatPrice(progress.missing)}</strong> para el envío gratis
                  </span>
                )}
              </p>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-pill bg-surface-muted"
                role="progressbar"
                aria-label="Progreso hacia el envío gratis"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(progress.pct)}
              >
                <div
                  className="h-full rounded-pill bg-red transition-[width] duration-500 ease-out"
                  style={{ width: `${progress.pct}%` }}
                />
              </div>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain">
              {step === 'cart' ? (
                <>
                  <ul className="divide-y divide-border">
                    {detailed.map((l) => (
                      <li key={l.slug} className="flex gap-4 px-5 py-4">
                        <div className="flex h-24 w-20 shrink-0 items-center justify-center rounded-md bg-black" aria-hidden="true">
                          {l.product.kind === 'combo' ? (
                            <ComboPacks product={l.product} sizes="32px" className="h-12 w-full" />
                          ) : (
                            <PackImage weightG={l.product.weightG} sizes="56px" className="h-20" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/productos/${l.slug}`}
                                onClick={close}
                                className="font-display text-18 font-semibold leading-tight hover:underline"
                              >
                                {l.product.name}
                              </Link>
                              <p className="text-14 text-ink-muted">
                                {l.product.kind === 'combo' ? comboItemsLabel(l.product) : 'Chimichurri'} ·{' '}
                                {formatPrice(l.product.price)} c/u
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(l.slug)}
                              className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center rounded-md text-ink-muted hover:bg-white/5 hover:text-red-text"
                              aria-label={`Eliminar ${l.product.name} del carrito`}
                            >
                              <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-end justify-between pt-2">
                            <QuantityStepper
                              size="sm"
                              value={l.qty}
                              min={0}
                              onChange={(n) => setQty(l.slug, n)}
                              label={`Cantidad de ${l.product.name}`}
                            />
                            <span className="font-display text-18 font-semibold tabular-nums">{formatPrice(l.lineTotal)}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                    <li className="px-5 py-5">
                      <ShippingEstimator
                        postalCode={buyer.postalCode}
                        zone={buyer.zone}
                        onPostalCode={onPostalCode}
                        onZone={(z) => updateBuyer({ zone: z })}
                      />
                    </li>
                  </ul>

                  {upsell && (
                    <div className="mx-5 mb-5 mt-auto flex items-center gap-4 rounded-lg border border-dashed border-red/50 bg-red/5 p-4">
                      <PackImage weightG={upsell.weightG} sizes="48px" className="h-16 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-14 font-bold">Sumá un {upsell.shortName} y llegás al envío gratis</p>
                        <p className="text-14 text-ink-muted tabular-nums">{formatPrice(upsell.price)}</p>
                      </div>
                      <button type="button" onClick={() => add(upsell.slug, 1)} className={`${btn.solid} shrink-0 px-4`}>
                        Sumar
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <form id="checkout-form" noValidate onSubmit={sendOrder} className="space-y-5 px-5 py-5">
                  <div>
                    <label htmlFor="buyer-name" className={field.label}>
                      Nombre y apellido
                    </label>
                    <input
                      id="buyer-name"
                      name="name"
                      autoComplete="name"
                      className={field.input}
                      value={buyer.name}
                      onChange={(e) => updateBuyer({ name: e.target.value })}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'err-name' : undefined}
                      required
                    />
                    {errors.name && <p id="err-name" className={field.error}>{errors.name}</p>}
                  </div>
                  <ShippingEstimator
                    postalCode={buyer.postalCode}
                    zone={buyer.zone}
                    onPostalCode={onPostalCode}
                    onZone={(z) => updateBuyer({ zone: z })}
                    errors={errors}
                    compact
                  />
                  <div>
                    <label htmlFor="buyer-address" className={field.label}>
                      Dirección <span className="font-normal text-ink-muted">(opcional, la podés pasar por WhatsApp)</span>
                    </label>
                    <input
                      id="buyer-address"
                      name="address"
                      autoComplete="street-address"
                      className={field.input}
                      value={buyer.address}
                      onChange={(e) => updateBuyer({ address: e.target.value })}
                    />
                  </div>
                  <fieldset>
                    <legend className={field.label}>¿Cómo vas a pagar?</legend>
                    <div className="grid grid-cols-3 gap-2" role="radiogroup">
                      {store.paymentMethods.map((m, i) => (
                        <label key={m.id} className={choiceClass}>
                          <input
                            type="radio"
                            name="payment"
                            value={m.id}
                            checked={buyer.payment === m.id}
                            onChange={() => updateBuyer({ payment: m.id })}
                            className="sr-only"
                            aria-describedby={errors.payment && i === 0 ? 'err-payment' : undefined}
                          />
                          {m.label}
                        </label>
                      ))}
                    </div>
                    {errors.payment && <p id="err-payment" className={field.error}>{errors.payment}</p>}
                  </fieldset>
                  <p className="text-14 text-ink-muted">
                    Al tocar el botón se abre WhatsApp con tu pedido ya escrito. Lo confirmamos por ahí y te pasamos los
                    datos para pagar.
                  </p>
                </form>
              )}
            </div>

            {/* Totales */}
            <div className="border-t border-border bg-black-soft px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
              <dl className="space-y-1.5 text-16">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Envío{zone ? ` (${zone.label})` : ''}</dt>
                  <dd className="tabular-nums">
                    {shipping === null ? (
                      <span className="text-ink-muted">Ingresá tu CP</span>
                    ) : shipping === 0 ? (
                      'Gratis'
                    ) : (
                      formatPrice(shipping)
                    )}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-border pt-2.5">
                  <dt className="font-bold">Total</dt>
                  <dd className="font-display text-32 font-bold tabular-nums">{formatPrice(total)}</dd>
                </div>
              </dl>
              {step === 'cart' ? (
                <button type="button" onClick={goCheckout} className={`${btn.solid} mt-4 w-full`}>
                  Completar mis datos <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              ) : (
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => setStep('cart')} className={`${btn.outline} shrink-0 px-4`}>
                    Volver
                  </button>
                  <button type="submit" form="checkout-form" className={`${btn.solid} flex-1`}>
                    <WhatsAppIcon className="size-5" /> Enviar pedido por WhatsApp
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

/** Opción tipo botón (radio oculto) para zona y medio de pago: mismo estilo que el resto, sin select nativo. */
const choiceClass =
  'flex min-h-11 cursor-pointer items-center justify-center rounded-sm border border-border bg-black px-2 text-center text-14 font-medium transition-colors has-[:checked]:border-red has-[:checked]:bg-red/10 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-red-text';

/**
 * Envío por código postal: la zona sale sola del CP (1414 → CABA). Solo se pregunta si el CP no se
 * reconoce, o si la persona quiere cambiarla (la zona por CP es una estimación).
 */
function ShippingEstimator({
  postalCode,
  zone,
  onPostalCode,
  onZone,
  errors,
  compact = false,
}: {
  postalCode: string;
  zone: ShippingZoneId | '';
  onPostalCode: (v: string) => void;
  onZone: (z: ShippingZoneId) => void;
  errors?: Partial<Record<keyof Buyer, string>>;
  compact?: boolean;
}) {
  const id = useId();
  const [choosing, setChoosing] = useState(false);
  const selected = getZone(zone || null);
  const unrecognized = postalCode.trim().length >= 4 && !zoneFromPostalCode(postalCode);
  const askZone = choosing || unrecognized || Boolean(errors?.zone);

  return (
    <div className="space-y-3">
      {!compact && <p className="text-14 font-bold">Calculá el envío</p>}
      <div>
        <label htmlFor={`${id}-cp`} className={field.label}>
          Código postal
        </label>
        <input
          id={`${id}-cp`}
          name="postalCode"
          inputMode="text"
          autoComplete="postal-code"
          placeholder="Por ejemplo 1414"
          maxLength={8}
          className={field.input}
          value={postalCode}
          onChange={(e) => {
            setChoosing(false);
            onPostalCode(e.target.value);
          }}
          aria-invalid={!!errors?.postalCode}
          aria-describedby={errors?.postalCode ? `${id}-cp-err` : `${id}-cp-zone`}
        />
        {errors?.postalCode && (
          <p id={`${id}-cp-err`} className={field.error}>
            {errors.postalCode}
          </p>
        )}
      </div>

      <p id={`${id}-cp-zone`} className="text-14 text-ink-muted" aria-live="polite">
        {selected ? (
          <>
            <span className="font-bold text-ink">{selected.label}</span>: {formatPrice(selected.price)} · llega en{' '}
            {selected.days}. Gratis desde {formatPrice(store.freeShippingFrom)}.{' '}
            {!askZone && (
              <button
                type="button"
                onClick={() => setChoosing(true)}
                className="font-bold text-ink underline decoration-red underline-offset-4"
              >
                Cambiar zona
              </button>
            )}
          </>
        ) : unrecognized ? (
          'No reconocemos ese código postal. Elegí tu zona:'
        ) : null}
      </p>

      {askZone && (
        <fieldset>
          <legend className="sr-only">Zona de entrega</legend>
          <div className="grid grid-cols-3 gap-2">
            {store.shippingZones.map((z, i) => (
              <label key={z.id} className={choiceClass}>
                <input
                  type="radio"
                  name="zone"
                  value={z.id}
                  checked={zone === z.id}
                  onChange={() => onZone(z.id)}
                  className="sr-only"
                  aria-describedby={errors?.zone && i === 0 ? `${id}-zone-err` : undefined}
                />
                {z.label}
              </label>
            ))}
          </div>
          {errors?.zone && (
            <p id={`${id}-zone-err`} className={field.error}>
              {errors.zone}
            </p>
          )}
        </fieldset>
      )}
    </div>
  );
}
