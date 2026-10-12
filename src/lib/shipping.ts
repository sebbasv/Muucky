import { store, type ShippingZone, type ShippingZoneId } from '@/config/store';

/** Normaliza un código postal argentino: acepta "1414" o el CPA "C1414ABC". */
export function parsePostalCode(input: string): { digits: number; province?: string } | null {
  const clean = input.trim().toUpperCase().replace(/\s+/g, '');
  const cpa = clean.match(/^([A-Z])(\d{4})[A-Z]{0,3}$/);
  if (cpa) return { province: cpa[1], digits: Number(cpa[2]) };
  const plain = clean.match(/^(\d{4})$/);
  if (plain) return { digits: Number(plain[1]) };
  return null;
}

/**
 * Zona aproximada por código postal. CABA usa 1000-1499 (letra C) y el conurbano bonaerense
 * cae mayormente en 1600-1899 (letra B). Es una estimación: el cliente puede cambiar la zona a mano.
 * [CONFIRMAR] reemplazar por la tabla del correo o la logística que use Muucky.
 */
export function zoneFromPostalCode(input: string): ShippingZoneId | null {
  const cp = parsePostalCode(input);
  if (!cp) return null;
  if (cp.province === 'C') return 'caba';
  if (cp.province && cp.province !== 'B') return 'interior';
  if (cp.digits >= 1000 && cp.digits <= 1499) return cp.province === 'B' ? 'gba' : 'caba';
  if (cp.digits >= 1500 && cp.digits <= 1899) return 'gba';
  return 'interior';
}

export function getZone(id: ShippingZoneId | null | undefined): ShippingZone | undefined {
  return store.shippingZones.find((z) => z.id === id);
}

export function shippingCost(subtotal: number, zoneId: ShippingZoneId | null | undefined) {
  const zone = getZone(zoneId);
  if (!zone) return null;
  if (subtotal >= store.freeShippingFrom) return 0;
  return zone.price;
}

export function freeShippingProgress(subtotal: number) {
  const missing = Math.max(0, store.freeShippingFrom - subtotal);
  return { missing, pct: Math.min(100, (subtotal / store.freeShippingFrom) * 100), reached: missing === 0 };
}
