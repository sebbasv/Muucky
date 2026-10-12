import Link from 'next/link';
import { DraftNotice, PageHeader } from '@/components/layout/PageHeader';
import { store } from '@/config/store';
import { formatPrice } from '@/lib/format';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Envíos',
  description: `Enviamos beef jerky Muucky a todo el país. Costos y plazos por zona, envío gratis desde ${formatPrice(store.freeShippingFrom)}.`,
  path: '/envios',
});

export default function EnviosPage() {
  return (
    <>
      <PageHeader eyebrow="Envíos" title="Llega a todo el país.">
        Envío gratis desde {formatPrice(store.freeShippingFrom)}. Por debajo de ese monto, el costo depende de la zona.
      </PageHeader>
      <div className="container-x section-y">
        <DraftNotice />
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[480px] text-left text-16">
            <caption className="sr-only">Costos y plazos de envío por zona</caption>
            <thead className="bg-black-soft text-12 uppercase tracking-[0.12em] text-ink-muted">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">
                  Zona
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Costo
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Plazo estimado
                </th>
              </tr>
            </thead>
            <tbody>
              {store.shippingZones.map((z) => (
                <tr key={z.id} className="border-t border-border">
                  <th scope="row" className="px-5 py-4 font-display text-18 font-semibold">
                    {z.label}
                  </th>
                  <td className="px-5 py-4 tabular-nums">
                    {formatPrice(z.price)}{' '}
                    <span className="text-ink-muted">· gratis desde {formatPrice(store.freeShippingFrom)}</span>
                  </td>
                  <td className="px-5 py-4">{z.days}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="prose-muucky mt-12">
          <h2>Cómo funciona</h2>
          <ul>
            <li>Los plazos corren desde que se confirma el pago.</li>
            <li>Cuando despachamos el pedido te avisamos por WhatsApp o email con el seguimiento.</li>
            <li>Si no hay nadie para recibir, el correo deja un aviso y el paquete queda en la sucursal más cercana.</li>
            <li>
              Si el paquete llega dañado, sacale una foto y escribinos. Lo resolvemos sin costo.
            </li>
          </ul>
          <p>
            ¿Dudas? Mirá las <Link href="/preguntas-frecuentes">preguntas frecuentes</Link> o escribinos a{' '}
            <a href={`mailto:${store.email}`}>{store.email}</a>.
          </p>
        </div>
      </div>
    </>
  );
}
