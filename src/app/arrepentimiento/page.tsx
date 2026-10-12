import Link from 'next/link';
import { WithdrawalForm } from '@/components/forms/WithdrawalForm';
import { PageHeader } from '@/components/layout/PageHeader';
import { store } from '@/config/store';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Botón de arrepentimiento',
  description: `Revocá tu compra dentro de los ${store.withdrawalDays} días corridos desde que recibiste el pedido (Ley 24.240, art. 34).`,
  path: '/arrepentimiento',
});

export default function ArrepentimientoPage() {
  return (
    <>
      <PageHeader eyebrow="Botón de arrepentimiento" title="Arrepentirte de una compra">
        Tenés {store.withdrawalDays} días corridos desde que recibiste el pedido para revocar la compra, sin dar
        explicaciones (Ley 24.240, art. 34, y Res. SCI 424/2020).
      </PageHeader>
      <div className="container-x section-y grid gap-12 lg:grid-cols-12">
        <div className="prose-muucky lg:col-span-5">
          <h2 className="!mt-0">Cómo funciona</h2>
          <ul>
            <li>Completá el formulario con tus datos y, si lo tenés, el número de pedido.</li>
            <li>Te damos un código de trámite en el momento.</li>
            <li>Te contactamos para coordinar la devolución del producto en las mismas condiciones en que lo recibiste.</li>
            <li>Te devolvemos el dinero por el mismo medio de pago.</li>
          </ul>
          <p>
            Más información en la <Link href="/devoluciones">política de cambios y devoluciones</Link> y en{' '}
            <a href={store.defensaConsumidorUrl} target="_blank" rel="noopener noreferrer">
              Defensa del Consumidor
            </a>
            .
          </p>
        </div>
        <div className="lg:col-span-7">
          <WithdrawalForm />
        </div>
      </div>
    </>
  );
}
