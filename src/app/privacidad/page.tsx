import { DraftNotice, PageHeader } from '@/components/layout/PageHeader';
import { Pending } from '@/components/ui/Pending';
import { store } from '@/config/store';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Política de privacidad',
  description: 'Cómo Muucky trata tus datos personales (Ley 25.326).',
  path: '/privacidad',
});

export default function PrivacidadPage() {
  return (
    <>
      <PageHeader eyebrow="Legales" title="Política de privacidad" />
      <div className="container-x section-y">
        <DraftNotice />
        <div className="prose-muucky">
          <h2 className="!mt-0">Qué datos usamos</h2>
          <p>
            Los que nos das para hacer un pedido (nombre, código postal, dirección, forma de pago), los de los formularios
            de mayoristas, novedades y arrepentimiento, y datos de navegación anónimos.
          </p>
          <h2>Para qué</h2>
          <ul>
            <li>Preparar y enviar tu pedido y responder tus consultas.</li>
            <li>Mandarte novedades y promos, solo si te suscribiste. Te podés dar de baja cuando quieras.</li>
            <li>Medir cómo se usa el sitio para mejorarlo.</li>
          </ul>
          <h2>Medición y publicidad</h2>
          <p>
            Usamos Google Analytics 4 y el píxel de Meta para medir visitas y campañas. Registran eventos como ver un
            producto, agregar al carrito o enviar un pedido por WhatsApp. El carrito se guarda en tu navegador
            (localStorage) para que no lo pierdas al recargar.
          </p>
          <h2>Tus derechos</h2>
          <p>
            Podés pedir acceso, rectificación o eliminación de tus datos escribiendo a{' '}
            <a href={`mailto:${store.email}`}>{store.email}</a>. La Agencia de Acceso a la Información Pública, como órgano
            de control de la Ley 25.326, atiende las denuncias por incumplimiento de las normas de protección de datos
            personales.
          </p>
          <h2>Responsable</h2>
          <p>
            {store.legal.businessName || 'Muucky'}
            {store.legal.cuit && `, CUIT ${store.legal.cuit}`}. Contacto:{' '}
            <a href={`mailto:${store.email}`}>{store.email}</a>.{' '}
            {!(store.legal.businessName && store.legal.cuit) && <Pending>Razón social y CUIT a confirmar</Pending>}
          </p>
        </div>
      </div>
    </>
  );
}
