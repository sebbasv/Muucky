// Información nutricional. Los valores de perPortion salen del envase del pack de 40 g; los que faltan
// [CONFIRMAR] se muestran con un valor de ejemplo (example) y la tabla lo avisa una sola vez arriba.
// Los ejemplos son coherentes con las 130 kcal y los 3 g de grasa del envase, pero no son datos reales.

export const portionG = 40;

export type NutritionRow = {
  label: string;
  unit: 'kcal' | 'g' | 'mg';
  /** Dato real del envase; null mientras falte. */
  perPortion: number | null;
  /** Valor de ejemplo para la demo, solo mientras perPortion sea null. */
  example?: number;
  indent?: boolean;
};

export const nutritionRows: NutritionRow[] = [
  { label: 'Valor energético', unit: 'kcal', perPortion: 130 },
  { label: 'Carbohidratos', unit: 'g', perPortion: null, example: 2 },
  { label: 'Azúcares totales', unit: 'g', perPortion: 0, indent: true },
  { label: 'Proteínas', unit: 'g', perPortion: null, example: 24 },
  { label: 'Grasas totales', unit: 'g', perPortion: 3 },
  { label: 'Grasas saturadas', unit: 'g', perPortion: null, example: 1.2, indent: true },
  { label: 'Grasas trans', unit: 'g', perPortion: null, example: 0, indent: true },
  { label: 'Fibra alimentaria', unit: 'g', perPortion: null, example: 0 },
  { label: 'Sodio', unit: 'mg', perPortion: null, example: 720 },
];

/** La tabla tiene valores de ejemplo (hay que avisarlo). */
export const hasExampleValues = nutritionRows.some((r) => r.perPortion === null);

// Solo datos reales del envase (las preguntas frecuentes no dan la proteína hasta que esté confirmada).
export const proteinPerPortion = nutritionRows.find((r) => r.label === 'Proteínas')?.perPortion ?? null;
export const kcalPerPortion = 130;
export const fatPerPortion = 3;

export const ingredients = 'Carne vacuna, chimichurri (perejil, ajo, ají molido), jugo de limón y sal.'; // [CONFIRMAR] lista exacta del envase

export function per100g(value: number) {
  return Math.round((value / portionG) * 100 * 10) / 10;
}

export function formatNutrient(value: number, unit: NutritionRow['unit']) {
  return `${value.toLocaleString('es-AR')} ${unit}`;
}
