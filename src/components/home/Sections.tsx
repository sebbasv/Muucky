import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Car, Coffee, Dumbbell, Laptop, MapPin, MessageCircle, Truck, Users, Wallet } from 'lucide-react';
import { ComboCard } from '@/components/product/ProductCard';
import { NutritionTable } from '@/components/product/NutritionTable';
import { PackImage } from '@/components/product/PackImage';
import { ProductRail } from '@/components/product/ProductRail';
import { PhotoSlot, showsPhoto } from '@/components/ui/PhotoSlot';
import { SodiumSeal } from '@/components/ui/SodiumSeal';
import { Pending } from '@/components/ui/Pending';
import { btn } from '@/components/ui/styles';
import { store, hasTransferDiscount } from '@/config/store';
import { comboProducts, lowestPrice, packProducts } from '@/data/products';
import { ingredients } from '@/data/nutrition';
import { photos } from '@/data/photos';
import { faq } from '@/data/faq';
import { formatPrice } from '@/lib/format';
import { FaqList } from '@/components/home/FaqList';
import { LeadCapture } from '@/components/home/LeadCapture';

export function SectionHeading({
  eyebrow,
  title,
  children,
  align = 'left',
  id,
  onLeather = false,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  align?: 'left' | 'center';
  id?: string;
  /** Sobre la banda leather el rojo chico necesita el tono más claro para pasar AA. */
  onLeather?: boolean;
}) {
  return (
    <div className={`reveal max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow ${onLeather ? 'text-red-text-on-leather' : ''}`}>{eyebrow}</p>
      <h2 id={id} className="h2 mt-3">
        {title}
      </h2>
      {children && <p className="mt-4 text-18 text-[#cfcfcf]">{children}</p>}
    </div>
  );
}

/** Franja de confianza: íconos Lucide sueltos, sin emojis ni cajitas. */
export function TrustStrip() {
  const items = [
    { Icon: Truck, title: 'Envío a todo el país', text: `Gratis desde ${formatPrice(store.freeShippingFrom)}` },
    {
      Icon: Wallet,
      title: store.installments ? 'Mercado Pago y cuotas' : 'Transferencia o Mercado Pago',
      text: hasTransferDiscount ? `${store.transferDiscountPct}% off por transferencia` : 'Pagás como te quede cómodo',
    },
    { Icon: MapPin, title: 'Hecho en Argentina', text: 'Carne vacuna argentina' },
    { Icon: MessageCircle, title: 'Atención por WhatsApp', text: 'Te respondemos nosotros' },
  ];
  return (
    <section aria-label="Por qué comprarnos" className="border-y border-border bg-black-soft">
      <ul className="container-x no-scrollbar flex snap-x snap-mandatory gap-8 overflow-x-auto py-7 md:grid md:grid-cols-4 md:overflow-visible">
        {items.map(({ Icon, title, text }) => (
          <li key={title} className="flex min-w-[220px] snap-start items-start gap-3">
            <Icon className="mt-0.5 size-6 shrink-0 text-red" strokeWidth={1.75} aria-hidden="true" />
            <div>
              <p className="text-16 font-bold">{title}</p>
              <p className="mt-1 text-14 text-ink-muted">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ProductsSection() {
  return (
    <section id="productos" aria-labelledby="productos-title" className="section-y">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading id="productos-title" eyebrow="Productos" title="Elegí tu pack">
            Un solo sabor, hecho bien: chimichurri, limón y sal. Elegí el tamaño.
          </SectionHeading>
          <Link href="/productos" className={`${btn.link} reveal shrink-0`}>
            Ver todos los productos <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="mt-10 md:mt-12">
          <ProductRail products={packProducts} label="Packs" reveal />
        </div>

        <div className="mt-16">
          <div className="reveal flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-32 font-bold leading-none">Combos</h3>
            <Pending>Combos y descuentos a confirmar</Pending>
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {comboProducts.map((p) => (
              <div key={p.slug} className="reveal">
                <ComboCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const whyPoints = [
  {
    n: '01',
    title: '100% carne vacuna',
    text: 'Carne vacuna argentina y nada de rellenos. Lo que ves en la tira es carne.',
  },
  {
    n: '02',
    title: 'Marinado con chimichurri, limón y sal',
    text: 'Veinticuatro horas de marinado. El sabor de acá, que no vas a encontrar en un jerky importado.',
  },
  {
    n: '03',
    title: 'Deshidratado lento',
    text: 'Sin apuro y a baja temperatura, para que quede firme, se conserve sin heladera y no pierda el sabor.',
  },
];

/** ¿Por qué Muucky? Con foto: composición editorial. Sin foto: titular y beneficios en dos columnas. */
export function WhySection() {
  const heading = <SectionHeading id="por-que-title" eyebrow="¿Por qué Muucky?" title="Carne, chimichurri y tiempo." />;
  const list = (
    <ol className="space-y-8">
      {whyPoints.map((p) => (
        <li key={p.n} className="reveal grid grid-cols-[48px_1fr] gap-4 border-t border-border pt-6">
          <span className="font-display text-18 font-semibold text-red-text tabular-nums">{p.n}</span>
          <div>
            <h3 className="font-display text-24 font-bold leading-tight md:text-32">{p.title}</h3>
            <p className="mt-2 text-16 leading-7 text-ink-muted">{p.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
  return (
    <section aria-labelledby="por-que-title" className="section-y bg-black-soft">
      {showsPhoto(photos.macro) ? (
        <div className="container-x grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <PhotoSlot className="reveal aspect-[4/5] lg:col-span-6" photo={photos.macro} sizes="(min-width: 1024px) 560px, 100vw" />
          <div className="lg:col-span-6">
            {heading}
            <div className="mt-10">{list}</div>
          </div>
        </div>
      ) : (
        <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:col-span-5 lg:self-start">{heading}</div>
          <div className="lg:col-span-7">{list}</div>
        </div>
      )}
    </section>
  );
}

const moments = [
  { photo: photos.gym, label: 'Gym', line: 'Después de entrenar, sin cocinar.', Icon: Dumbbell },
  { photo: photos.oficina, label: 'Oficina', line: 'Para la tarde larga.', Icon: Laptop },
  { photo: photos.viaje, label: 'Viaje', line: 'Cerrado, no necesita frío.', Icon: Car },
  { photo: photos.mate, label: 'Mate', line: 'Algo salado para la ronda.', Icon: Coffee },
  { photo: photos.previa, label: 'Previa', line: 'Se abre en la mesa y vuela.', Icon: Users },
];

/** Momentos: cuándo se come. Banda cálida en leather. Cada momento usa su foto o, sin foto, ícono y frase. */
export function MomentsSection() {
  return (
    <section aria-labelledby="momentos-title" className="section-y bg-leather">
      <div className="container-x">
        <SectionHeading id="momentos-title" eyebrow="Momentos" title="Para cuando pinta el hambre." onLeather>
          No hace falta heladera ni cubiertos. Va en el bolso, en el auto o arriba de la mesa.
        </SectionHeading>
        <ul className="mt-12 grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          {moments.map(({ photo, label, line, Icon }, i) => {
            const big = i === 0;
            return (
              <li key={label} className={`reveal relative ${big ? 'col-span-2 row-span-2' : ''}`}>
                {showsPhoto(photo) ? (
                  <>
                    <PhotoSlot
                      className="h-full"
                      photo={photo}
                      tone="dark"
                      sizes={big ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
                    />
                    <span className="pointer-events-none absolute left-4 top-4 font-display text-24 font-bold uppercase tracking-wide md:text-32">
                      {label}
                    </span>
                  </>
                ) : (
                  <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-white/[0.06] bg-[radial-gradient(120%_90%_at_15%_10%,#3a2a1f_0%,#2a241e_45%,#1a1714_100%)] p-4 md:p-5">
                    <Icon className="size-7 text-red-text-on-leather md:size-8" strokeWidth={1.5} aria-hidden="true" />
                    {big && (
                      <PackImage
                        weightG={40}
                        sizes="(min-width: 768px) 200px, 40vw"
                        className="!absolute -bottom-[8%] right-[6%] h-[78%] rotate-6 drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
                      />
                    )}
                    <div className="relative">
                      <p className={`font-display font-bold uppercase leading-none tracking-wide ${big ? 'text-48 md:text-64' : 'text-24 md:text-32'}`}>
                        {label}
                      </p>
                      <p className={`mt-2 text-[#d8d0c6] ${big ? 'max-w-[16ch] text-18' : 'text-14 md:text-16'}`}>{line}</p>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/** Nutrición: información, sin slogans (auditoría L3). El sello va una vez, legible. */
export function NutritionSection() {
  const hasRegistry = Boolean(store.registry.rne || store.registry.rnpa);
  return (
    <section aria-labelledby="nutricion-title" className="section-y">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="nutricion-title" eyebrow="Nutrición" title="Lo que tiene cada pack.">
            La tabla del envase, completa. Sin letra chica.
          </SectionHeading>
          <div className="reveal mt-8 flex items-center gap-5 rounded-lg border border-border p-5">
            <SodiumSeal size={112} />
            <p className="text-14 text-ink-muted">
              El envase lleva el sello <strong className="text-ink">EXCESO EN SODIO</strong> (Ley 27.642). Lo mostramos acá
              y en cada ficha de producto.
            </p>
          </div>
          <dl className="reveal mt-6 space-y-3 text-14">
            <div>
              <dt className="font-bold">Ingredientes</dt>
              <dd className="mt-1 text-ink-muted">
                {ingredients} <Pending>Lista a confirmar</Pending>
              </dd>
            </div>
            {(hasRegistry || store.demoNotes) && (
              <div>
                <dt className="font-bold">RNE / RNPA</dt>
                <dd className="mt-1 text-ink-muted">
                  {hasRegistry ? (
                    `RNE ${store.registry.rne} · RNPA ${store.registry.rnpa}`
                  ) : (
                    <Pending>Números de registro a confirmar</Pending>
                  )}
                </dd>
              </div>
            )}
          </dl>
          <Link href="/nutricion" className={`${btn.link} reveal mt-6`}>
            Ver la información completa <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="reveal lg:col-span-7">
          <NutritionTable />
        </div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  // Solo con reseñas reales y con permiso (store.showReviews). Sin avales de profesionales ni deportistas (L3).
  if (!store.showReviews) return null;
  return null;
}

export function FaqSection() {
  return (
    <section aria-labelledby="faq-title" className="section-y bg-black-soft">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="faq-title" eyebrow="Preguntas" title="Lo que más nos preguntan." />
          <p className="reveal mt-6 text-16 text-ink-muted">
            ¿Otra duda?{' '}
            <Link href="/preguntas-frecuentes" className="font-bold text-ink underline decoration-red underline-offset-4">
              Ver todas las preguntas
            </Link>
          </p>
        </div>
        <div className="reveal lg:col-span-7">
          <FaqList items={faq.slice(0, 6)} />
        </div>
      </div>
    </section>
  );
}

/** Cierre: el único lugar del sitio con las franjas de marca. */
export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="relative overflow-hidden">
      <div className="strips absolute -left-10 top-0 hidden h-full w-64 bg-red opacity-90 lg:block" aria-hidden="true" />
      <div className="container-x section-y relative grid items-center gap-12 lg:grid-cols-12">
        <div className="reveal relative flex justify-center lg:col-span-5">
          <div
            className="absolute bottom-0 h-1/3 w-3/4 rounded-[50%] blur-3xl"
            style={{ background: 'rgba(212,17,17,0.25)' }}
            aria-hidden="true"
          />
          <Image
            src="/brand/product-pack.webp"
            alt="Pack de Muucky Beef Jerky"
            width={408}
            height={612}
            sizes="(min-width: 1024px) 320px, 60vw"
            className="relative h-[360px] w-auto drop-shadow-[0_20px_60px_rgba(180,30,30,0.3)] md:h-[460px]"
          />
        </div>
        <div className="lg:col-span-7">
          <h2 id="cta-title" className="reveal text-balance font-display text-48 font-bold uppercase leading-[0.92] md:text-96">
            La fuerza en cada bocado.
          </h2>
          <div className="reveal mt-8 flex flex-wrap items-center gap-4">
            <Link href="/productos" className={btn.primary}>
              Elegí tu pack <ArrowRight className="size-5" aria-hidden="true" />
            </Link>
            <span className="text-14 text-ink-muted">Desde {formatPrice(lowestPrice)}</span>
          </div>
          <div className="reveal mt-12 max-w-lg border-t border-border pt-8">
            <LeadCapture />
          </div>
        </div>
      </div>
    </section>
  );
}
