import Link from 'next/link';
import { DraftNotice, PageHeader } from '@/components/layout/PageHeader';
import { Pending } from '@/components/ui/Pending';
import { store } from '@/config/store';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Términos y condiciones',
  description: 'Términos y condiciones de compra en la tienda online de Muucky.',
  path: '/terminos',
});

// Quién vende: los datos que haya; con las notas de la demo se marca lo que falta.
const seller = [
  store.legal.businessName || 'Muucky',
  store.legal.cuit && `CUIT ${store.legal.cuit}`,
  store.legal.address && `con domicilio en ${store.legal.address}`,
].filter(Boolean);
const sellerComplete = Boolean(store.legal.businessName && store.legal.cuit && store.legal.address);

export default function TerminosPage() {
  return (
    <>
      <PageHeader eyebrow="Legales" title="Términos y condiciones" />
      <div className="container-x section-y">
        <DraftNotice />
        <div className="prose-muucky">
          <h2 className="!mt-0">1. Quién vende</h2>
          <p>
            El sitio muucky.com.ar es operado por {seller.join(', ')}.{' '}
            {!sellerComplete && <Pending>Razón social, CUIT y domicilio a confirmar</Pending>} Contacto:{' '}
            <a href={`mailto:${store.email}`}>{store.email}</a>.
          </p>
          <h2>2. Productos y precios</h2>
          <p>
            Los precios están expresados en pesos argentinos e incluyen IVA. Pueden cambiar sin aviso, pero se respeta el
            precio vigente al momento de confirmar el pedido. Las fotos son ilustrativas.
          </p>
          <h2>3. Cómo se compra</h2>
          <p>
            Armás el pedido en el carrito y lo enviás por WhatsApp. El pedido queda confirmado cuando acordamos el total y
            el medio de pago, y se acredita el pago.
          </p>
          <h2>4. Envíos</h2>
          <p>
            Los costos y plazos están en la página de <Link href="/envios">envíos</Link>. Los plazos son estimados y corren
            desde la acreditación del pago.
          </p>
          <h2>5. Arrepentimiento y devoluciones</h2>
          <p>
            Tenés {store.withdrawalDays} días corridos para revocar la compra desde el{' '}
            <Link href="/arrepentimiento">Botón de arrepentimiento</Link>. Más detalles en la{' '}
            <Link href="/devoluciones">política de devoluciones</Link>.
          </p>
          <h2>6. Defensa del consumidor</h2>
          <p>
            Ante cualquier reclamo podés dirigirte a{' '}
            <a href={store.defensaConsumidorUrl} target="_blank" rel="noopener noreferrer">
              Defensa del Consumidor
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
