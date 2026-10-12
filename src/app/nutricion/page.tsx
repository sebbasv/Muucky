import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { NutritionTable } from '@/components/product/NutritionTable';
import { Pending } from '@/components/ui/Pending';
import { SodiumSeal } from '@/components/ui/SodiumSeal';
import { store } from '@/config/store';
import { ingredients, portionG } from '@/data/nutrition';
import { packProducts } from '@/data/products';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Nutrición e ingredientes',
  description:
    'Tabla nutricional completa del beef jerky Muucky por porción y por 100 g, ingredientes, sellos y registro sanitario.',
  path: '/nutricion',
});

export default function NutricionPage() {
  const hasRegistry = Boolean(store.registry.rne || store.registry.rnpa);
  return (
    <>
      <PageHeader eyebrow="Nutrición" title="Lo que tiene, sin vueltas.">
        La información del envase, completa: tabla nutricional, ingredientes, sellos y registro.
      </PageHeader>
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <NutritionTable />
          <p className="mt-4 text-14 text-ink-muted">
            Valores por porción de {portionG} g. Los packs de {packProducts.map((p) => `${p.weightG} g`).join(', ')}{' '}
            traen el mismo producto en distinta cantidad.
          </p>
        </div>
        <div className="space-y-10 lg:col-span-5">
          <section aria-labelledby="ingredientes">
            <h2 id="ingredientes" className="font-display text-32 font-bold">
              Ingredientes
            </h2>
            <p className="mt-3 text-16 leading-7 text-[#cfcfcf]">
              {ingredients} <Pending>Lista a confirmar con el envase</Pending>
            </p>
          </section>
          <section aria-labelledby="sellos">
            <h2 id="sellos" className="font-display text-32 font-bold">
              Sellos
            </h2>
            <div className="mt-4 flex items-start gap-5">
              <SodiumSeal size={128} />
              <p className="text-16 leading-6 text-ink-muted">
                Por la Ley 27.642 de Promoción de la Alimentación Saludable, el envase lleva el sello{' '}
                <strong className="text-ink">EXCESO EN SODIO</strong>. Lo mostramos acá y en cada ficha de producto.
              </p>
            </div>
          </section>
          {(hasRegistry || store.demoNotes) && (
            <section aria-labelledby="registro">
              <h2 id="registro" className="font-display text-32 font-bold">
                Registro sanitario
              </h2>
              <dl className="mt-3 grid grid-cols-[80px_1fr] gap-y-2 text-16">
                <dt className="text-ink-muted">RNE</dt>
                <dd>{store.registry.rne || <Pending fallback="—" />}</dd>
                <dt className="text-ink-muted">RNPA</dt>
                <dd>{store.registry.rnpa || <Pending fallback="—" />}</dd>
              </dl>
            </section>
          )}
          <section aria-labelledby="conservacion">
            <h2 id="conservacion" className="font-display text-32 font-bold">
              Conservación
            </h2>
            <p className="mt-3 text-16 leading-6 text-[#cfcfcf]">
              Cerrado, {store.shelfLife.closed} en un lugar fresco y seco. Una vez abierto, {store.shelfLife.opened}.
            </p>
          </section>
          <p className="text-16">
            <Link href="/productos" className="font-bold underline decoration-red decoration-2 underline-offset-4">
              Ver los packs
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
