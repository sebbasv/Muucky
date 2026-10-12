// Leads de newsletter y mayoristas. v1: solo log. v2: tabla wholesale_leads en Supabase y aviso por email.

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }
  const type = body.type === 'wholesale' ? 'wholesale' : 'newsletter';

  if (type === 'newsletter') {
    const contact = clean(body.contact, 120);
    if (contact.length < 6) return Response.json({ ok: false, error: 'Falta el contacto' }, { status: 400 });
    console.info('[lead newsletter]', { contact });
    return Response.json({ ok: true });
  }

  const lead = {
    name: clean(body.name),
    business: clean(body.business),
    kind: clean(body.kind, 60),
    city: clean(body.city),
    email: clean(body.email, 120),
    phone: clean(body.phone, 40),
    volume: clean(body.volume, 60),
    message: clean(body.message, 1000),
  };
  if (!lead.name || !lead.business || (!lead.email && !lead.phone)) {
    return Response.json({ ok: false, error: 'Faltan datos obligatorios' }, { status: 400 });
  }
  console.info('[lead mayorista]', lead);
  return Response.json({ ok: true });
}
