import { randomBytes } from 'node:crypto';

// Botón de arrepentimiento (Res. SCI 424/2020): recibe la solicitud y devuelve un código de trámite.
// v1: solo log. Producción: guardar la solicitud y avisar al negocio y al cliente por email.

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'JSON inválido' }, { status: 400 });
  }
  const data = {
    name: clean(body.name),
    email: clean(body.email, 120),
    order: clean(body.order, 60),
    reason: clean(body.reason, 1000),
  };
  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return Response.json({ ok: false, error: 'Nombre y email son obligatorios' }, { status: 400 });
  }
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const code = `ARR-${date}-${randomBytes(3).toString('hex').toUpperCase()}`;
  console.info('[arrepentimiento]', { code, ...data, at: now.toISOString() });
  return Response.json({ ok: true, code });
}
