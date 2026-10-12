'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { btn, field } from '@/components/ui/styles';
import { track } from '@/lib/analytics';

type Values = {
  name: string;
  business: string;
  kind: string;
  city: string;
  email: string;
  phone: string;
  volume: string;
  message: string;
};

const empty: Values = { name: '', business: '', kind: '', city: '', email: '', phone: '', volume: '', message: '' };

export function WholesaleForm() {
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (v.name.trim().length < 2) found.name = 'Escribí tu nombre.';
    if (v.business.trim().length < 2) found.business = 'Escribí el nombre del negocio.';
    if (!v.kind) found.kind = 'Elegí el tipo de negocio.';
    if (!v.email.trim() && !v.phone.trim()) found.email = 'Dejanos un email o un teléfono.';
    if (v.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) found.email = 'Revisá el email.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'wholesale', ...v }),
      });
      if (!res.ok) throw new Error();
      track('generate_lead', { lead_type: 'wholesale' });
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <div role="status" className="rounded-lg border border-border bg-surface p-8">
        <Check className="size-8 text-red" aria-hidden="true" />
        <p className="mt-4 font-display text-32 font-bold leading-tight">¡Gracias, {v.name.split(' ')[0]}!</p>
        <p className="mt-2 text-16 text-ink-muted">
          Recibimos tus datos. Te escribimos con la lista de precios mayoristas.
        </p>
      </div>
    );
  }

  const input = (k: keyof Values, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`w-${k}`} className={field.label}>
        {label}
      </label>
      <input
        id={`w-${k}`}
        name={k}
        className={field.input}
        value={v[k]}
        onChange={set(k)}
        aria-invalid={!!errors[k]}
        aria-describedby={errors[k] ? `w-${k}-err` : undefined}
        {...props}
      />
      {errors[k] && (
        <p id={`w-${k}-err`} className={field.error}>
          {errors[k]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="grid gap-5 rounded-lg border border-border bg-surface p-6 sm:grid-cols-2 md:p-8">
      {input('name', 'Nombre y apellido', { autoComplete: 'name' })}
      {input('business', 'Negocio', { autoComplete: 'organization' })}
      <div>
        <label htmlFor="w-kind" className={field.label}>
          Tipo de negocio
        </label>
        <select
          id="w-kind"
          name="kind"
          className={field.input}
          value={v.kind}
          onChange={set('kind')}
          aria-invalid={!!errors.kind}
          aria-describedby={errors.kind ? 'w-kind-err' : undefined}
        >
          <option value="">Elegí</option>
          <option>Gimnasio</option>
          <option>Dietética</option>
          <option>Kiosco o almacén</option>
          <option>Tienda gourmet</option>
          <option>Distribuidor</option>
          <option>Otro</option>
        </select>
        {errors.kind && (
          <p id="w-kind-err" className={field.error}>
            {errors.kind}
          </p>
        )}
      </div>
      {input('city', 'Localidad', { autoComplete: 'address-level2' })}
      {input('email', 'Email', { type: 'email', autoComplete: 'email' })}
      {input('phone', 'Teléfono o WhatsApp', { type: 'tel', autoComplete: 'tel' })}
      <div className="sm:col-span-2">
        <label htmlFor="w-volume" className={field.label}>
          ¿Cuántos packs pensás mover por mes?
        </label>
        <select id="w-volume" name="volume" className={field.input} value={v.volume} onChange={set('volume')}>
          <option value="">Todavía no sé</option>
          <option>Menos de 50</option>
          <option>50 a 200</option>
          <option>Más de 200</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="w-message" className={field.label}>
          Comentarios <span className="font-normal text-ink-muted">(opcional)</span>
        </label>
        <textarea
          id="w-message"
          name="message"
          rows={4}
          className={`${field.input} resize-y`}
          value={v.message}
          onChange={set('message')}
        />
      </div>
      <div className="sm:col-span-2">
        <button type="submit" disabled={status === 'sending'} className={`${btn.solid} w-full sm:w-auto`}>
          {status === 'sending' ? 'Enviando…' : 'Quiero la lista de precios'}
        </button>
        {status === 'error' && <p className={field.error}>No pudimos enviarlo. Probá de nuevo o escribinos por WhatsApp.</p>}
      </div>
    </form>
  );
}
