import Link from 'next/link';
import { DraftNotice, PageHeader } from '@/components/layout/PageHeader';
import { Pending } from '@/components/ui/Pending';
import { store } from '@/config/store';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Cambios y devoluciones',
  description: `Política de cambios y devoluciones de Muucky. ${store.withdrawalDays} días corridos para arrepentirte de tu compra.`,
  path: '/devoluciones',
});

export default function DevolucionesPage() {
  return (
    <>
      <PageHeader eyebrow="Devoluciones" title="Cambios y devoluciones" />
      <div className="container-x section-y">
        <DraftNotice />
        <div className="prose-muucky">
          <h2 className="!mt-0">Derecho de arrepentimiento</h2>
          <p>
            Tenés {store.withdrawalDays} días corridos desde que recibís el pedido para revocar la compra, sin necesidad de
            explicar el motivo (Ley 24.240, art. 34). Podés hacerlo desde el{' '}
            <Link href="/arrepentimiento">Botón de arrepentimiento</Link>, que está al pie de todas las páginas.
          </p>
          <ul>
            <li>El producto tiene que estar cerrado, en el mismo estado en que lo recibiste.</li>
            <li>Los costos de devolución corren por nuestra cuenta.</li>
            <li>Te devolvemos el dinero por el mismo medio de pago que usaste.</li>
          </ul>
          <h2>Productos dañados o con fallas</h2>
          <p>
            Si un pack llegó roto, abierto o con algún problema, escribinos con una foto a{' '}
            <a href={`mailto:${store.email}`}>{store.email}</a> o por WhatsApp. Te lo cambiamos o te devolvemos el dinero.
          </p>
          <h2>Productos abiertos</h2>
          <p>
            Por tratarse de un alimento, no podemos aceptar devoluciones de packs abiertos, salvo que tengan un defecto de
            fabricación. <Pending>Confirmar con el asesor legal</Pending>
          </p>
        </div>
      </div>
    </>
  );
}
