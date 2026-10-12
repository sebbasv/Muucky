// Eventos de analítica (GA4 y Meta Pixel). Si los scripts no están cargados, solo se empujan al dataLayer.

type EventName =
  | 'view_item'
  | 'add_to_cart'
  | 'view_cart'
  | 'begin_checkout'
  | 'whatsapp_order'
  | 'purchase'
  | 'generate_lead';

type Item = { item_id: string; item_name: string; price: number; quantity: number };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const pixelEvents: Partial<Record<EventName, string>> = {
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  begin_checkout: 'InitiateCheckout',
  whatsapp_order: 'Contact',
  purchase: 'Purchase',
  generate_lead: 'Lead',
};

export function track(event: EventName, params: { value?: number; items?: Item[]; [key: string]: unknown } = {}) {
  if (typeof window === 'undefined') return;
  const payload = { currency: 'ARS', ...params };
  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...payload });
    window.gtag?.('event', event, payload);
    const pixel = pixelEvents[event];
    if (pixel) window.fbq?.('track', pixel, { value: params.value, currency: 'ARS' });
  } catch {
    // la analítica nunca rompe la compra
  }
}
