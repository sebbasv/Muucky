import { PageHeader } from '@/components/layout/PageHeader';
import { PackImage } from '@/components/product/PackImage';
import { ComboCard } from '@/components/product/ProductCard';
import { ProductRail } from '@/components/product/ProductRail';
import { JsonLd } from '@/components/seo/JsonLd';
import { Pending } from '@/components/ui/Pending';
import { store } from '@/config/store';
import { comboProducts, packProducts, pricePer100g } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Productos · Packs de beef jerky',
  description:
    'Beef jerky argentino con chimichurri en packs de 40 g, 100 g y 250 g, y combos. Precio por 100 g a la vista y envío a todo el país.',
  path: '/productos',
});

export default function ProductosPage() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: [...packProducts, ...comboProducts].map((p, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            url: `${store.siteUrl}/productos/${p.slug}`,
            name: p.name,
          })),
        }}
      />
      <PageHeader
        eyebrow="Productos"
        title="Elegí tu pack"
        visual={
          <div className="flex h-44 items-end lg:h-52">
            {packProducts.map((p, i) => (
              <PackImage
                key={p.slug}
                weightG={p.weightG}
                sizes="120px"
                className="-ml-6 h-full first:ml-0 drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                style={{ transform: `rotate(${(i - 1) * 6}deg)`, zIndex: i + 1 }}
              />
            ))}
          </div>
        }
      >
        Un solo sabor: chimichurri, limón y sal. Tres tamaños y combos para no quedarte sin. Cuanto más grande, mejor
        el precio por gramo.
      </PageHeader>

      <section aria-labelledby="packs" className="section-y">
        <div className="container-x">
          <h2 id="packs" className="sr-only">
            Packs
          </h2>
          <ProductRail products={packProducts} label="Packs" />

          {/* Comparativa simple: el precio por gramo justifica el badge */}
          <div className="mt-12 overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[480px] text-left text-16">
              <caption className="sr-only">Comparación de packs</caption>
              <thead className="bg-black-soft text-12 uppercase tracking-[0.12em] text-ink-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Pack
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Precio
                  </th>
                  <th scope="col" className="px-5 py-3 text-right font-medium">
                    Cada 100 g
                  </th>
                </tr>
              </thead>
              <tbody>
                {packProducts.map((p) => (
                  <tr key={p.slug} className="border-t border-border">
                    <th scope="row" className="px-5 py-3 font-display text-18 font-semibold">
                      {p.name}
                    </th>
                    <td className="px-5 py-3 text-right tabular-nums">{formatPrice(p.price)}</td>
                    <td className="px-5 py-3 text-right tabular-nums">{formatPrice(pricePer100g(p))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section aria-labelledby="combos" className="section-y border-t border-border bg-black-soft">
        <div className="container-x">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="combos" className="h2">
              Combos
            </h2>
            <Pending>Combos y descuento a confirmar</Pending>
          </div>
          <p className="mt-4 max-w-2xl text-18 text-[#cfcfcf]">
            Packs armados para repartir o para toda la semana, con {store.comboDiscountPct}% menos que comprándolos por
            separado.
          </p>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {comboProducts.map((p) => (
              <ComboCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
