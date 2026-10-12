import { Dumbbell, Leaf, Store } from 'lucide-react';
import { WholesaleForm } from '@/components/forms/WholesaleForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Mayoristas y revendedores',
  description:
    'Vendé Muucky en tu gimnasio, dietética, kiosco o tienda. Completá el formulario y te pasamos la lista de precios mayoristas.',
  path: '/mayoristas',
});

const channels = [
  { Icon: Dumbbell, title: 'Gimnasios', text: 'Un snack de carne para después de entrenar, al lado de la caja.' },
  { Icon: Leaf, title: 'Dietéticas', text: 'Para clientes que buscan alternativas con carne y sin vueltas.' },
  { Icon: Store, title: 'Kioscos y almacenes', text: 'No necesita heladera: se exhibe en el mostrador.' },
];

export default function MayoristasPage() {
  return (
    <>
      <PageHeader eyebrow="Mayoristas" title="Vendé Muucky en tu negocio.">
        Gimnasios, dietéticas, kioscos y tiendas. Completá el formulario y te pasamos la lista de precios.
      </PageHeader>
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <ul className="space-y-8 lg:col-span-4">
          {channels.map(({ Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-1 size-6 shrink-0 text-red" strokeWidth={1.75} aria-hidden="true" />
              <div>
                <h2 className="font-display text-24 font-bold leading-tight">{title}</h2>
                <p className="mt-1 text-16 leading-6 text-ink-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <div className="lg:col-span-8">
          <WholesaleForm />
        </div>
      </div>
    </>
  );
}
