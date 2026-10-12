// Configuración de la tienda. Todo lo marcado [CONFIRMAR] es un dato que tiene que pasar el cliente:
// los valores actuales son de ejemplo para la demo de propuesta.

export type ShippingZoneId = 'caba' | 'gba' | 'interior';

export type ShippingZone = {
  id: ShippingZoneId;
  label: string;
  price: number;
  days: string;
};

export type PaymentMethodId = 'transferencia' | 'mercadopago' | 'efectivo';

export const store = {
  name: 'Muucky',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.muucky.com.ar',
  /**
   * Notas internas de la demo ("a confirmar", "FOTO: …", textos provisorios). Solo se ven con
   * NEXT_PUBLIC_DEMO_NOTES=true (en .env.local); para presentar o publicar, se deja sin definir.
   */
  demoNotes: process.env.NEXT_PUBLIC_DEMO_NOTES === 'true',

  whatsapp: '5491127821967', // [CONFIRMAR] con el 9 (auditoría F1)
  whatsappDisplay: '+54 9 11 2782-1967',
  email: 'contacto@muucky.com.ar',
  zone: 'Buenos Aires, Argentina',

  freeShippingFrom: 15000, // [CONFIRMAR] hoy lo dice el FAQ del sitio
  transferDiscountPct: 0, // [CONFIRMAR] 0 = no se muestra
  installments: null as null | { count: number; interestFree: boolean }, // [CONFIRMAR]
  comboDiscountPct: 10, // [CONFIRMAR] ejemplo para la demo

  shippingZones: [
    { id: 'caba', label: 'CABA', price: 2500, days: '24 a 48 h' }, // [CONFIRMAR] precios y plazos
    { id: 'gba', label: 'GBA', price: 3500, days: '48 a 72 h' },
    { id: 'interior', label: 'Interior', price: 5900, days: '3 a 7 días hábiles' },
  ] as ShippingZone[],

  paymentMethods: [
    { id: 'transferencia', label: 'Transferencia' },
    { id: 'mercadopago', label: 'Mercado Pago' },
    { id: 'efectivo', label: 'Efectivo' },
  ] as { id: PaymentMethodId; label: string }[], // [CONFIRMAR] opciones reales

  /**
   * Secuencia de frames del hero (Anexo B y video-hero/HERO-HANDOFF.md). Con frames en 0 se usa la escena
   * provisoria dibujada en canvas. Si cambian los frames, subir la versión de la carpeta (/hero/v2/…) para
   * que no queden viejos en caché.
   * stops: en qué fracción del video empieza cada etapa (corte, tiras, marinado, secado, pack) y dónde
   * termina. El scroll se reparte por etapa, así cada texto aparece con su parte del video.
   * desktop: 16:9 (pantallas horizontales de 768 px o más); mobile: 9:16 (el resto, tablets en vertical incluidas).
   */
  hero: {
    desktop: { path: '/hero/v1/desktop', frames: 150, stops: [0, 0.22, 0.385, 0.6, 0.8, 1] },
    mobile: { path: '/hero/v1/mobile', frames: 90, stops: [0, 0.25, 0.41, 0.6, 0.8, 1] },
  },

  /** Reseñas: true solo con reseñas reales y con permiso para usarlas. */
  showReviews: false,

  firstPurchaseCoupon: null as null | { code: string; pct: number }, // [CONFIRMAR]

  legal: {
    businessName: '', // [CONFIRMAR]
    cuit: '', // [CONFIRMAR]
    address: '', // [CONFIRMAR]
  },
  social: {
    instagram: '', // [CONFIRMAR] URL
    facebook: '',
    tiktok: '',
  },
  registry: {
    rne: '', // [CONFIRMAR]
    rnpa: '', // [CONFIRMAR]
  },
  shelfLife: {
    closed: '12 meses', // [CONFIRMAR]
    opened: 'consumir dentro de los 30 días', // [CONFIRMAR]
  },
  withdrawalDays: 10, // Ley 24.240, art. 34
  defensaConsumidorUrl: 'https://www.argentina.gob.ar/produccion/defensadelconsumidor',
};

export const hasTransferDiscount = store.transferDiscountPct > 0;

export function waLink(text?: string) {
  const base = `https://wa.me/${store.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
