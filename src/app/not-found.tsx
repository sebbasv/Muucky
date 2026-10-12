import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { btn } from '@/components/ui/styles';

// Sin canonical (el del layout apuntaría a la home) y fuera del índice.
export const metadata: Metadata = {
  title: 'Página no encontrada',
  alternates: { canonical: null },
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="border-b border-border bg-black-soft">
      <div className="container-x flex min-h-[80svh] flex-col justify-center pb-20 pt-[calc(var(--bar-h)+var(--header-h)+48px)]">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 max-w-2xl text-balance font-display text-48 font-bold uppercase leading-[0.92] md:text-96">
          Acá no quedó ni una tira.
        </h1>
        <p className="mt-5 max-w-lg text-18 text-[#cfcfcf]">
          La página que buscás no existe o se movió. Los packs siguen donde siempre.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/productos" className={btn.solid}>
            Ver los productos <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <Link href="/" className={btn.outline}>
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
