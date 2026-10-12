import { getProduct } from '@/data/products';
import { cartTotals, type CartLine } from '@/lib/order';

// v1: registra el pedido enviado por WhatsApp (solo log).
// v2: guardar en Supabase (tablas orders y order_items) con estado 'whatsapp_pending'.
export async function POST(request: Request) {
  let body: { lines?: CartLine[]; buyer?: { zone?: string; name?: string } };
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }
  const lines = (body.lines ?? []).filter(
    (l) => typeof l?.slug === 'string' && getProduct(l.slug) && Number.isInteger(l.qty) && l.qty > 0 && l.qty < 100,
  );
  if (lines.length === 0) return Response.json({ ok: false, error: 'Pedido vacío' }, { status: 400 });

  // El total se recalcula en el servidor: nunca se confía en el que manda el navegador.
  const zone = ['caba', 'gba', 'interior'].includes(body.buyer?.zone ?? '') ? (body.buyer!.zone as 'caba') : null;
  const totals = cartTotals(lines, zone);
  console.info('[pedido whatsapp]', {
    items: lines,
    subtotal: totals.subtotal,
    shipping: totals.shipping,
    total: totals.total,
    zone,
  });
  return Response.json({ ok: true, status: 'whatsapp_pending', total: totals.total });
}
