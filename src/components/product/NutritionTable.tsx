import { formatNutrient, hasExampleValues, nutritionRows, per100g, portionG } from '@/data/nutrition';

/** Tabla nutricional por porción y por 100 g. Mientras falten datos del envase, usa valores de ejemplo y lo avisa una vez. */
export function NutritionTable({ caption = true }: { caption?: boolean }) {
  const notice = hasExampleValues && (
    <span className="mt-1 block text-14 text-ink-muted">
      <strong className="font-bold text-ink">Valores de ejemplo.</strong> Los definitivos son los del envase.
    </span>
  );
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <table className="w-full text-left text-16">
        {caption ? (
          <caption className="border-b border-border px-5 py-4 text-left">
            <span className="block font-display text-24 font-bold leading-tight">Información nutricional</span>
            <span className="text-14 text-ink-muted">Porción: {portionG} g (1 pack chico)</span>
            {notice}
          </caption>
        ) : (
          hasExampleValues && <caption className="border-b border-border px-5 py-3 text-left">{notice}</caption>
        )}
        <thead>
          <tr className="border-b border-border text-12 uppercase tracking-[0.12em] text-ink-muted">
            <th scope="col" className="px-5 py-3 font-medium">
              Nutriente
            </th>
            <th scope="col" className="px-3 py-3 text-right font-medium">
              Por porción
            </th>
            <th scope="col" className="px-5 py-3 text-right font-medium">
              Por 100 g
            </th>
          </tr>
        </thead>
        <tbody>
          {nutritionRows.map((r) => {
            const value = r.perPortion ?? r.example ?? null;
            return (
              <tr key={r.label} className="border-b border-border last:border-0">
                <th scope="row" className={`px-5 py-3 font-normal ${r.indent ? 'pl-9 text-ink-muted' : 'font-medium'}`}>
                  {r.label}
                </th>
                <td className="px-3 py-3 text-right tabular-nums">{value === null ? '—' : formatNutrient(value, r.unit)}</td>
                <td className="px-5 py-3 text-right tabular-nums text-ink-muted">
                  {value === null ? '—' : formatNutrient(per100g(value), r.unit)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
