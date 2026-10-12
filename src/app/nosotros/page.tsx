import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PhotoSlot, showsPhoto } from '@/components/ui/PhotoSlot';
import { Pending } from '@/components/ui/Pending';
import { btn } from '@/components/ui/styles';
import { store } from '@/config/store';
import { photos } from '@/data/photos';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Nosotros · Cómo hacemos el jerky',
  description:
    'Quiénes somos y cómo hacemos Muucky: carne vacuna argentina en tiras finas, 24 horas de marinado con chimichurri, limón y sal, y deshidratado lento.',
  path: '/nosotros',
});

const steps = [
  {
    n: '01',
    title: 'El corte',
    text: 'Elegimos cortes vacunos magros y los cortamos en tiras parejas, para que se sequen igual de punta a punta.',
    photo: photos.corte,
  },
  {
    n: '02',
    title: 'El marinado',
    text: 'Veinticuatro horas en chimichurri, limón y sal. Es lo que le da el sabor argentino.',
    photo: photos.marinado,
  },
  {
    n: '03',
    title: 'El secado',
    text: 'Deshidratado lento, a baja temperatura, hasta que la tira queda firme y se conserva sin heladera.',
    photo: photos.secado,
  },
];

export default function NosotrosPage() {
  const withTeamPhoto = showsPhoto(photos.equipo);
  return (
    <>
      <PageHeader eyebrow="Nosotros" title="Un snack de carne con el sabor de acá.">
        Muucky nace de una idea simple: jerky de carne vacuna argentina, con el marinado que reconocés al primer bocado.{' '}
        <Pending>Historia de la marca a confirmar</Pending>
      </PageHeader>

      <section
        aria-labelledby="historia"
        className={`container-x section-y grid items-center gap-12 ${withTeamPhoto ? 'lg:grid-cols-2' : ''}`}
      >
        {withTeamPhoto && <PhotoSlot className="aspect-[4/3]" photo={photos.equipo} sizes="(min-width: 1024px) 560px, 100vw" />}
        <div className="prose-muucky">
          <h2 id="historia" className="!mt-0">
            Quiénes somos
          </h2>
          {store.demoNotes && (
            <p>
              Este texto se completa con la historia real de Muucky: quiénes son, desde cuándo hacen jerky y por qué
              eligieron el chimichurri. <Pending>A confirmar con el cliente</Pending>
            </p>
          )}
          <p>
            Hacemos un solo sabor y lo hacemos bien: carne vacuna argentina, un marinado que reconocés al primer bocado y
            un secado sin apuro.
          </p>
          <p>
            Estamos en {store.zone}, y los pedidos los atendemos nosotros por WhatsApp. Si tenés una duda sobre el
            producto, nos escribís y te contestamos.
          </p>
        </div>
      </section>

      <section aria-labelledby="proceso" className="section-y border-t border-border bg-black-soft">
        <div className="container-x">
          <p className="eyebrow">Cómo se hace</p>
          <h2 id="proceso" className="h2 mt-3">
            Del corte al bocado.
          </h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            {steps.map((s) =>
              showsPhoto(s.photo) ? (
                <li key={s.n}>
                  <PhotoSlot className="aspect-[4/5]" photo={s.photo} tone="dark" sizes="(min-width: 768px) 33vw, 100vw" />
                  <p className="mt-5 font-display text-18 font-semibold text-red-text">{s.n}</p>
                  <h3 className="mt-1 font-display text-32 font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 text-16 leading-6 text-ink-muted">{s.text}</p>
                </li>
              ) : (
                <li key={s.n} className="rounded-lg border border-border bg-surface p-6 md:p-8">
                  <p className="font-display text-48 font-bold leading-none text-red-text tabular-nums">{s.n}</p>
                  <h3 className="mt-6 font-display text-32 font-bold leading-tight">{s.title}</h3>
                  <p className="mt-2 text-16 leading-6 text-ink-muted">{s.text}</p>
                </li>
              ),
            )}
          </ol>
          <Link href="/productos" className={`${btn.solid} mt-12`}>
            Elegí tu pack <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
