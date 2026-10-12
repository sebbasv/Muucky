// Clases de botones compartidas. El degradado y el halo fuerte son solo para el CTA principal.
// primary y outline también los usa el hero: se dejan como están.

const base =
  'inline-flex items-center justify-center gap-2 font-sans font-bold transition-[background-color,border-color,color,transform,box-shadow] duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-50 min-h-11 select-none';

export const btn = {
  /** CTA principal: pill con el degradado de marca. Uno por pantalla. */
  primary: `${base} rounded-pill bg-[image:var(--gradient-cta)] px-7 py-3 text-[17px] text-white shadow-glow-strong hover:brightness-110 active:scale-[0.98]`,
  /** Botón rojo plano: la acción de compra en tarjetas, fichas y carrito. */
  solid: `${base} rounded-md bg-red px-5 py-3 text-16 text-white hover:bg-red-dark active:scale-[0.98]`,
  /** Secundario, al lado de un solid ("Agregar al carrito" junto a "Comprar ahora"). */
  secondary: `${base} rounded-md border border-[#5a5a5a] bg-transparent px-5 py-3 text-16 text-ink hover:border-ink hover:bg-white/5 active:scale-[0.98]`,
  /** Contorno. */
  outline: `${base} rounded-pill border border-[#3a3a3a] px-6 py-3 text-[15px] text-ink hover:border-ink`,
  /** Link con flecha. */
  link: 'inline-flex items-center gap-1.5 font-bold text-ink underline decoration-red decoration-2 underline-offset-[6px] hover:decoration-ink transition-colors min-h-11',
};

export const field = {
  label: 'block text-14 font-medium text-ink mb-1.5',
  // 16 px en los campos: con menos, Safari en iPhone hace zoom al enfocar
  input:
    'w-full min-h-11 rounded-sm border border-border bg-black px-3 py-2.5 text-16 text-ink placeholder:text-[#6b6b6b] focus:border-ink focus:outline-none focus-visible:outline-2 focus-visible:outline-red-text aria-[invalid=true]:border-red-text',
  error: 'mt-1 text-14 text-red-text',
};
