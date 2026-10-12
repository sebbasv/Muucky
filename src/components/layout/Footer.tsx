import Image from 'next/image';
import Link from 'next/link';
import { Banknote, Landmark, Mail, MapPin, Undo2, Wallet } from 'lucide-react';
import { store, waLink } from '@/config/store';
import { FacebookIcon, InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/ui/SocialIcons';
import { Pending } from '@/components/ui/Pending';

const shop = [
  { href: '/productos', label: 'Productos' },
  { href: '/#como-se-hace', label: 'Cómo se hace' },
  { href: '/nutricion', label: 'Nutrición' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
  { href: '/mayoristas', label: 'Mayoristas' },
];

const legal = [
  { href: '/terminos', label: 'Términos y condiciones' },
  { href: '/privacidad', label: 'Privacidad' },
  { href: '/envios', label: 'Envíos' },
  { href: '/devoluciones', label: 'Devoluciones' },
];

const paymentIcons = { transferencia: Landmark, mercadopago: Wallet, efectivo: Banknote } as const;

export function Footer() {
  const socials = [
    { href: store.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: store.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: store.social.tiktok, label: 'TikTok', Icon: TikTokIcon },
  ].filter((s) => s.href);
  const company = [store.legal.businessName, store.legal.cuit && `CUIT ${store.legal.cuit}`, store.legal.address].filter(Boolean);

  return (
    <footer className="border-t border-border bg-black-soft">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Image
            src="/brand/logo-muucky-224.webp"
            alt="Muucky Beef Jerky"
            width={230}
            height={224}
            className="h-20 w-auto"
          />
          {/* El claim ya cierra la página en el CTA final: acá no se repite */}
          <p className="mt-5 max-w-xs text-16 text-ink-muted">
            Beef jerky argentino: carne vacuna marinada con chimichurri, limón y sal, deshidratada despacio.
          </p>
          {socials.length > 0 ? (
            <ul className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Muucky en ${label}`}
                    className="grid size-11 place-items-center rounded-md border border-border text-ink hover:border-ink"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            store.demoNotes && (
              <p className="mt-6 text-14 text-ink-muted">
                Redes: <Pending>URLs a confirmar</Pending>
              </p>
            )
          )}
        </div>

        <nav aria-label="Tienda" className="md:col-span-2">
          <h2 className="eyebrow mb-4">Tienda</h2>
          <ul className="space-y-1">
            {shop.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1.5 text-16 text-[#cfcfcf] hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legales" className="md:col-span-3">
          <h2 className="eyebrow mb-4">Legales</h2>
          <ul className="space-y-1">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1.5 text-16 text-[#cfcfcf] hover:text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href={store.defensaConsumidorUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block py-1.5 text-16 text-[#cfcfcf] hover:text-ink"
              >
                Defensa del Consumidor
              </a>
            </li>
          </ul>
          <Link
            href="/arrepentimiento"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md border border-red px-4 text-14 font-bold text-ink hover:bg-red hover:text-white"
          >
            <Undo2 className="size-4" aria-hidden="true" /> Botón de arrepentimiento
          </Link>
        </nav>

        <div className="md:col-span-3">
          <h2 className="eyebrow mb-4">Contacto</h2>
          <ul className="space-y-3 text-16">
            <li>
              <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-ink">
                <WhatsAppIcon className="size-4 text-red" /> {store.whatsappDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${store.email}`} className="flex items-center gap-3 break-all hover:text-ink">
                <Mail className="size-4 shrink-0 text-red" aria-hidden="true" /> {store.email}
              </a>
            </li>
            <li className="flex items-center gap-3 text-[#cfcfcf]">
              <MapPin className="size-4 shrink-0 text-red" aria-hidden="true" /> {store.zone}
            </li>
          </ul>
          <h2 className="eyebrow mb-3 mt-8">Medios de pago</h2>
          <ul className="flex flex-wrap gap-2">
            {store.paymentMethods.map((m) => {
              const Icon = paymentIcons[m.id];
              return (
                <li
                  key={m.id}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-14 text-[#cfcfcf]"
                >
                  <Icon className="size-4" aria-hidden="true" /> {m.label}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-x flex flex-col gap-3 pb-24 pt-6 text-12 leading-5 text-ink-muted md:flex-row md:items-center md:justify-between md:pb-6">
          <p>
            © Muucky{company.length > 0 && ` · ${company.join(' · ')}`}
            {company.length < 3 && (
              <>
                {' '}
                <Pending>Razón social, CUIT y domicilio a confirmar</Pending>
              </>
            )}
          </p>
          <p>
            Imágenes ilustrativas.
            {store.demoNotes && ' Demo de propuesta de rediseño, con datos de ejemplo.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
