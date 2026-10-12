const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

/** $9.990 (formato es-AR, sin decimales). Se normaliza el espacio duro que agregan algunos motores. */
export function formatPrice(value: number) {
  return ars.format(value).replace(/ /g, '');
}

export function formatWeight(grams: number) {
  return grams >= 1000 ? `${(grams / 1000).toLocaleString('es-AR')} kg` : `${grams} g`;
}

export function pluralize(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}
