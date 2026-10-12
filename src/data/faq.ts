import { store, hasTransferDiscount } from '@/config/store';
import { formatPrice } from '@/lib/format';
import { portionG, kcalPerPortion, fatPerPortion, proteinPerPortion } from '@/data/nutrition';

export type FaqItem = { q: string; a: string };

const zones = store.shippingZones.map((z) => `${z.label}: ${z.days}`).join(' · ');
const payments = store.paymentMethods.map((p) => p.label).join(', ');

// Todas las respuestas que dependen de la tienda salen de store.ts (nunca escritas a mano).
export const faq: FaqItem[] = [
  {
    q: '¿Qué es el beef jerky?',
    a: 'Es carne vacuna cortada en tiras finas, marinada y deshidratada despacio. Queda un snack seco, firme y con mucho sabor, que se conserva sin heladera. El de Muucky lleva chimichurri, limón y sal.',
  },
  {
    q: '¿Cuánto tarda el envío?',
    a: `Enviamos a todo el país. Plazos estimados desde que se confirma el pago: ${zones}. El costo se calcula en el carrito según tu zona y es gratis desde ${formatPrice(store.freeShippingFrom)}.`,
  },
  {
    q: '¿Cómo pago?',
    a: `Por ahora el pedido se arma en el carrito y se confirma por WhatsApp. Aceptamos: ${payments}.${
      hasTransferDiscount ? ` Pagando por transferencia tenés ${store.transferDiscountPct}% de descuento.` : ''
    }${store.installments ? ` Hasta ${store.installments.count} cuotas${store.installments.interestFree ? ' sin interés' : ''}.` : ''}`,
  },
  {
    q: '¿Qué tiene cada pack?',
    a: `La porción de referencia es de ${portionG} g: ${kcalPerPortion} kcal y ${fatPerPortion} g de grasa${
      proteinPerPortion !== null ? `, con ${proteinPerPortion} g de proteína` : ''
    }. Los packs de 100 g y 250 g traen el mismo producto en más cantidad. La tabla completa está en la página de nutrición.`,
  },
  {
    q: '¿Cuánto dura una vez abierto?',
    a: `Cerrado dura ${store.shelfLife.closed} en un lugar fresco y seco. Una vez abierto, ${store.shelfLife.opened}: cerralo bien después de cada uso.`,
  },
  {
    q: '¿Puedo devolver un pedido?',
    a: `Sí. Tenés ${store.withdrawalDays} días corridos desde que recibís el pedido para arrepentirte de la compra, con el Botón de arrepentimiento que está al pie de cada página. Si un pack llegó dañado, escribinos y lo resolvemos.`,
  },
  {
    q: '¿Venden por mayor?',
    a: 'Sí: gimnasios, dietéticas, kioscos y tiendas. Completá el formulario de Mayoristas y te pasamos la lista de precios.',
  },
];
