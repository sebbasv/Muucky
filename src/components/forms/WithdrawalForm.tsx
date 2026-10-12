'use client';

import { useState } from 'react';
import { btn, field } from '@/components/ui/styles';
import { store } from '@/config/store';

type Values = { name: string; email: string; order: string; reason: string };

/** Botón de arrepentimiento: genera un código de trámite (Res. SCI 424/2020). */
export function WithdrawalForm() {
  const [v, setV] = useState<Values>({ name: '', email: '', order: '', reason: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'error'>('idle');
  const [code, setCode] = useState('');

  const set = (k: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setV((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found: typeof errors = {};
    if (v.name.trim().length < 2) found.name = 'Escribí tu nombre y apellido.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) found.email = 'Ingresá un email válido.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/arrepentimiento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(v),
      });
      const data = await res.json();
      if (!res.ok || !data.code) throw new Error();
      setCode(data.code);
    } catch {
      setStatus('error');
    }
  };

  if (code) {
    return (
      <div role="status" className="rounded-lg border border-red bg-surface p-8">
        <p className="eyebrow">Solicitud recibida</p>
        <p className="mt-3 text-16 text-[#cfcfcf]">Tu código de trámite es:</p>
        <p className="mt-2 select-all font-display text-48 font-bold tracking-wide">{code}</p>
        <p className="mt-4 text-16 leading-6 text-ink-muted">
          Guardalo. Te vamos a escribir a <strong className="text-ink">{v.email}</strong> para coordinar
          la devolución. Si tenés dudas, escribinos a {store.email}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-5 rounded-lg border border-border bg-surface p-6 md:p-8">
      {(
        [
          ['name', 'Nombre y apellido', 'name', 'text'],
          ['email', 'Email', 'email', 'email'],
          ['order', 'Número de pedido (si lo tenés)', 'off', 'text'],
        ] as const
      ).map(([k, label, ac, type]) => (
        <div key={k}>
          <label htmlFor={`a-${k}`} className={field.label}>
            {label}
          </label>
          <input
            id={`a-${k}`}
            name={k}
            type={type}
            autoComplete={ac}
            className={field.input}
            value={v[k]}
            onChange={set(k)}
            aria-invalid={!!errors[k]}
            aria-describedby={errors[k] ? `a-${k}-err` : undefined}
          />
          {errors[k] && (
            <p id={`a-${k}-err`} className={field.error}>
              {errors[k]}
            </p>
          )}
        </div>
      ))}
      <div>
        <label htmlFor="a-reason" className={field.label}>
          Motivo <span className="font-normal text-ink-muted">(opcional)</span>
        </label>
        <textarea id="a-reason" name="reason" rows={3} className={`${field.input} resize-y`} value={v.reason} onChange={set('reason')} />
      </div>
      <button type="submit" disabled={status === 'sending'} className={`${btn.solid} w-full`}>
        {status === 'sending' ? 'Enviando…' : 'Solicitar la revocación'}
      </button>
      {status === 'error' && <p className={field.error}>No pudimos enviarlo. Probá de nuevo o escribinos a {store.email}.</p>}
    </form>
  );
}
