import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Plus } from 'lucide-react';
import { BuyBox } from '@/components/product/BuyBox';
import { NutritionTable } from '@/components/product/NutritionTable';
import { ComboCard, ProductCard } from '@/components/product/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { JsonLd } from '@/components/seo/JsonLd';
import { Pending } from '@/components/ui/Pending';
import { SodiumSeal } from '@/components/ui/SodiumSeal';
import { store } from '@/config/store';
import { ingredients } from '@/data/nutrition';
import { comboItemsLabel, getProduct, products } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

// Todas las fichas se pre-renderizan con generateStaticParams; no hace falta un shell con Suspense.
export const instant = false;

export async function generateMetadata({ params }: PageProps<'/productos/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = `${product.name} · Beef jerky con chimichurri`;
  const description = `${product.description} ${formatPrice(product.price)}. Envío a todo el país, gratis desde ${formatPrice(store.freeShippingFrom)}.`;
  return pageMetadata({
    title,
    description,
    path: `/productos/${product.slug}`,
    imagePath: `/productos/${product.slug}/opengraph-image`,
  });
}

export default async function ProductPage({ params }: PageProps<'/productos/[slug]'>) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products.filter((p) => p.slug !== product.slug && p.kind === 'pack').slice(0, 3);
  const url = `${store.siteUrl}/productos/${product.slug}`;
  const image = product.images[0];
  const imageUrl =
    image?.kind === 'photo' ? image.src : image?.kind === 'pack' ? '/brand/product-pack.webp' : undefined;
  const hasRegistry = Boolean(store.registry.rne || store.registry.rnpa);

  const tabs = [
    {
      title: 'Descripción',
      body: (
        <>
          <p>{product.description}</p>
          {product.kind === 'combo' && <p>Incluye: {comboItemsLabel(product)}.</p>}
          <p>
            Sabor: chimichurri, limón y sal. Carne vacuna argentina, deshidratada despacio. No necesita heladera hasta
            que lo abrís.
          </p>
        </>
      ),
    },
    {
      title: 'Nutrición e ingredientes',
      body: (
        <>
          <p>
            <strong>Ingredientes:</strong> {ingredients} <Pending>Lista a confirmar</Pending>
          </p>
          <div className="not-prose my-4">
            <NutritionTable caption={false} />
          </div>
          {(hasRegistry || store.demoNotes) && (
            <p>
              <strong>RNE / RNPA:</strong>{' '}
              {hasRegistry ? `RNE ${store.registry.rne} · RNPA ${store.registry.rnpa}` : <Pending>A confirmar</Pending>}
            </p>
          )}
        </>
      ),
    },
    {
      title: 'Conservación',
      body: (
        <p>
          Cerrado: {store.shelfLife.closed} en un lugar fresco y seco, sin sol directo. Una vez abierto,{' '}
          {store.shelfLife.opened}. Cerralo bien después de cada uso.
        </p>
      ),
    },
    {
      title: 'Envíos y devoluciones',
      body: (
        <>
          <p>
            Enviamos a todo el país:{' '}
            {store.shippingZones.map((z) => `${z.label} ${formatPrice(z.price)} (${z.days})`).join(' · ')}. Gratis desde{' '}
            {formatPrice(store.freeShippingFrom)}.
          </p>
          <p>
            Tenés {store.withdrawalDays} días corridos para arrepentirte de la compra.{' '}
            <Link href="/devoluciones">Ver la política de devoluciones</Link>.
          </p>
        </>
      ),
    },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: `Muucky ${product.name}`,
            description: product.description,
            sku: product.slug,
            brand: { '@type': 'Brand', name: 'Muucky' },
            category: 'Beef jerky',
            ...(imageUrl ? { image: `${store.siteUrl}${imageUrl}` } : {}),
            weight: { '@type': 'QuantitativeValue', value: product.weightG, unitCode: 'GRM' },
            offers: {
              '@type': 'Offer',
              url,
              priceCurrency: 'ARS',
              price: product.price,
              availability: 'https://schema.org/InStock',
              itemCondition: 'https://schema.org/NewCondition',
              seller: { '@type': 'Organization', name: 'Muucky' },
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Inicio', item: store.siteUrl },
              { '@type': 'ListItem', position: 2, name: 'Productos', item: `${store.siteUrl}/productos` },
              { '@type': 'ListItem', position: 3, name: product.name, item: url },
            ],
          },
        ]}
      />

      <div className="container-x pb-16 pt-[calc(var(--bar-h)+var(--header-h)+24px)] md:pb-24">
        <nav aria-label="Migas de pan" className="mb-6 text-14 text-ink-muted">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="hover:text-ink">
                Inicio
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li>
              <Link href="/productos" className="hover:text-ink">
                Productos
              </Link>
            </li>
            <ChevronRight className="size-3.5" aria-hidden="true" />
            <li aria-current="page" className="text-ink">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <ProductGallery product={product} />

          <div>
            {product.badge && <p className="eyebrow">{product.badge}</p>}
            <h1 className="mt-2 font-display text-48 font-bold leading-none md:text-64">{product.name}</h1>
            <p className="mt-3 text-18 text-[#cfcfcf]">
              Beef jerky argentino marinado con chimichurri, limón y sal. {product.tagline}
            </p>
            <div className="mt-8">
              <BuyBox product={product} />
            </div>

            {/* El sello va una sola vez en la ficha: acá, legible y junto al dato (en la foto ya está el del envase) */}
            <div className="mt-8 flex items-center gap-5 rounded-lg border border-border bg-black-soft p-4">
              <SodiumSeal size={112} />
              <p className="text-14 text-ink-muted">
                Este producto lleva el sello <strong className="text-ink">EXCESO EN SODIO</strong> (Ley 27.642). La tabla
                completa está en <strong className="text-ink">Nutrición e ingredientes</strong>.
              </p>
            </div>

            <div className="mt-8 divide-y divide-border border-y border-border">
              {tabs.map((t, i) => (
                <details key={t.title} className="group" open={i === 0}>
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between py-4 text-16 font-bold [&::-webkit-details-marker]:hidden">
                    {t.title}
                    <Plus
                      className="size-5 text-red transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="prose-muucky pb-6">{t.body}</div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="relacionados" className="section-y border-t border-border bg-black-soft">
        <div className="container-x">
          <h2 id="relacionados" className="h2">
            {product.kind === 'combo' ? 'Los packs, por separado' : 'También te puede gustar'}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          {product.kind === 'pack' && (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {products
                .filter((p) => p.kind === 'combo' && p.items?.some((i) => i.slug === product.slug))
                .map((p) => (
                  <ComboCard key={p.slug} product={p} />
                ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

