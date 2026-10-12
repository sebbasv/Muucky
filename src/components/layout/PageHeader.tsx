import { store } from '@/config/store';

/**
 * Encabezado de páginas internas: fondo liso (las franjas quedan solo para el CTA final de la home) y,
 * si se pasa, una imagen chica a la derecha. El header fijo queda arriba, así que se deja su alto.
 */
export function PageHeader({
  eyebrow,
  title,
  children,
  visual,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  visual?: React.ReactNode;
}) {
  return (
    <header className="border-b border-border bg-black-soft">
      <div className="container-x flex items-end justify-between gap-10 pb-12 pt-[calc(var(--bar-h)+var(--header-h)+40px)] md:pb-16 md:pt-[calc(var(--bar-h)+var(--header-h)+64px)]">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-balance font-display text-48 font-bold leading-[1] md:text-64">{title}</h1>
          {children && <div className="mt-5 max-w-2xl text-18 text-[#cfcfcf]">{children}</div>}
        </div>
        {visual && (
          <div className="hidden shrink-0 md:block" aria-hidden="true">
            {visual}
          </div>
        )}
      </div>
    </header>
  );
}

/** Aviso para textos legales provisorios (validar con un profesional). Es una nota interna de la demo. */
export function DraftNotice() {
  if (!store.demoNotes) return null;
  return (
    <p className="mb-10 rounded-md border border-dashed border-[#4a4a4a] p-4 text-14 leading-6 text-ink-muted">
      <strong className="text-ink">Texto provisorio.</strong> Este contenido es un borrador para la propuesta y tiene que
      revisarlo un profesional (abogado) antes de publicarse. Los datos marcados se completan con la información del
      negocio.
    </p>
  );
}
