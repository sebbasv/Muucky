import { FaqList } from '@/components/home/FaqList';
import { PageHeader } from '@/components/layout/PageHeader';
import { JsonLd } from '@/components/seo/JsonLd';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { btn } from '@/components/ui/styles';
import { waLink } from '@/config/store';
import { faq } from '@/data/faq';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Preguntas frecuentes',
  description: 'Envíos, pagos, conservación, devoluciones y todo lo que nos preguntan sobre el beef jerky Muucky.',
  path: '/preguntas-frecuentes',
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <PageHeader eyebrow="Preguntas" title="Preguntas frecuentes" />
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <FaqList items={faq} />
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded-lg border border-border bg-surface p-6">
            <p className="font-display text-24 font-bold leading-tight">¿No está tu pregunta?</p>
            <p className="mt-2 text-16 text-ink-muted">Escribinos y te respondemos nosotros, no un bot.</p>
            <a
              href={waLink('¡Hola Muucky! Tengo una consulta.')}
              target="_blank"
              rel="noopener noreferrer"
              className={`${btn.solid} mt-5 w-full`}
            >
              <WhatsAppIcon className="size-5" /> Escribinos por WhatsApp
            </a>
          </div>
        </aside>
      </div>
    </>
  );
}
