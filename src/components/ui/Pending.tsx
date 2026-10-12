import { store } from '@/config/store';

/**
 * Marca un dato que tiene que confirmar el cliente. Solo se ve con las notas de la demo activadas
 * (store.demoNotes); si no, muestra el texto de respaldo, que por defecto es nada.
 */
export function Pending({
  children = 'Dato a confirmar',
  fallback = null,
}: {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  if (!store.demoNotes) return <>{fallback}</>;
  return (
    <span className="inline-flex items-center rounded-pill border border-dashed border-[#4a4a4a] px-2 py-0.5 align-middle text-12 font-medium leading-4 text-ink-muted">
      {children}
    </span>
  );
}
