'use client';

import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { field } from '@/components/ui/styles';
import { store } from '@/config/store';
import { track } from '@/lib/analytics';

/** Captura de email o WhatsApp para novedades y el cupón de primera compra. */
export function LeadCapture() {
  const [contact, setContact] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [error, setError] = useState('');
  const coupon = store.firstPurchaseCoupon;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = contact.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^\+?[\d\s-]{8,16}$/.test(value);
    if (!isEmail && !isPhone) {
      setError('Ingresá un email o un número de WhatsApp.');
      return;
    }
    setError('');
    setStatus('sending');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'newsletter', contact: value }),
      });
      if (!res.ok) throw new Error();
      track('generate_lead', { lead_type: 'newsletter' });
      setStatus('ok');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'ok') {
    return (
      <p role="status" className="flex items-start gap-3 text-16">
        <Check className="mt-0.5 size-5 shrink-0 text-red" aria-hidden="true" />
        <span>
          Listo, ya estás en la lista.{' '}
          {coupon ? (
            <>
              Tu cupón de primera compra es <strong className="font-display text-18 tracking-wide">{coupon.code}</strong>.
            </>
          ) : (
            'Te avisamos de las novedades y promos.'
          )}
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate>
      <label htmlFor="lead-contact" className="block font-display text-24 font-bold leading-tight">
        {coupon ? `${coupon.pct}% off en tu primera compra` : 'Enterate primero de las promos'}
      </label>
      <p className="mt-1 text-14 text-ink-muted">Dejanos tu email o tu WhatsApp. Nada de spam.</p>
      <div className="mt-4 flex gap-2">
        <input
          id="lead-contact"
          name="contact"
          autoComplete="email"
          placeholder="tu@email.com o 11 2345 6789"
          className={field.input}
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? 'lead-error' : undefined}
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-sm bg-red px-4 font-bold text-white hover:bg-red-dark"
          aria-label="Suscribirme"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      {error && (
        <p id="lead-error" className={field.error}>
          {error}
        </p>
      )}
      {status === 'error' && <p className={field.error}>No pudimos guardarlo. Probá de nuevo en un rato.</p>}
    </form>
  );
}
