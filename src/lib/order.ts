import { store, type PaymentMethodId, type ShippingZoneId } from '@/config/store';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { getZone, shippingCost } from '@/lib/shipping';

export type CartLine = { slug: string; qty: number };

export type Buyer = {
  name: string;
  zone: ShippingZoneId | '';
  postalCode: string;
  address: string;
  payment: PaymentMethodId | '';
};

export function cartTotals(lines: CartLine[], zone: ShippingZoneId | '' | null) {
  const detailed = lines
    .map((l) => {
      const product = getProduct(l.slug);
      return product ? { ...l, product, lineTotal: product.price * l.qty } : null;
    })
    .filter((l) => l !== null);
  const subtotal = detailed.reduce((s, l) => s + l.lineTotal, 0);
  const count = detailed.reduce((s, l) => s + l.qty, 0);
  const shipping = zone ? shippingCost(subtotal, zone) : null;
  const total = subtotal + (shipping ?? 0);
  return { detailed, subtotal, count, shipping, total };
}

/** Mensaje del pedido para WhatsApp (brief, punto 9). */
export function buildWhatsAppMessage(lines: CartLine[], buyer: Buyer) {
  const { detailed, subtotal, shipping, total } = cartTotals(lines, buyer.zone);
  const zone = getZone(buyer.zone || null);
  const payment = store.paymentMethods.find((p) => p.id === buyer.payment);
  const rows = [
    '¡Hola Muucky! Quiero hacer este pedido:',
    ...detailed.map((l) => `• ${l.qty} × ${l.product.shortName} — ${formatPrice(l.lineTotal)}`),
    `Subtotal: ${formatPrice(subtotal)}`,
    `Envío (${zone?.label ?? 'a confirmar'}): ${shipping === null ? 'a confirmar' : shipping === 0 ? 'Gratis' : formatPrice(shipping)}`,
    `Total: ${formatPrice(total)}`,
    `Nombre: ${buyer.name.trim()}`,
    `Entrega: CP ${buyer.postalCode.trim().toUpperCase()} — ${zone?.label ?? ''}${buyer.address.trim() ? ` — ${buyer.address.trim()}` : ''}`,
    `Pago: ${payment?.label ?? 'a confirmar'}`,
  ];
  return rows.join('\n');
}

/** Errores en el orden en que aparecen los campos (el primero recibe el foco). La zona sale del CP. */
export function validateBuyer(buyer: Buyer) {
  const errors: Partial<Record<keyof Buyer, string>> = {};
  if (buyer.name.trim().length < 3) errors.name = 'Escribí tu nombre y apellido.';
  if (!/^([A-Za-z]\d{4}[A-Za-z]{0,3}|\d{4})$/.test(buyer.postalCode.trim().replace(/\s+/g, '')))
    errors.postalCode = 'Ingresá un código postal válido (por ejemplo 1414).';
  else if (!buyer.zone) errors.zone = 'Elegí tu zona de entrega.';
  if (!buyer.payment) errors.payment = 'Elegí cómo vas a pagar.';
  return errors;
}
