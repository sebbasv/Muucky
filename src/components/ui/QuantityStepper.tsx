'use client';

import { Minus, Plus } from 'lucide-react';

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label,
  size = 'md',
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  label: string;
  size?: 'sm' | 'md';
}) {
  const h = size === 'sm' ? 'h-9 w-9' : 'h-11 w-11';
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-md border border-border bg-black">
      <button
        type="button"
        className={`${h} grid place-items-center rounded-l-md text-ink transition-colors hover:bg-surface-muted disabled:opacity-40`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Restar uno (${label})`}
      >
        <Minus className="size-4" aria-hidden="true" />
      </button>
      <output aria-live="polite" className="min-w-8 text-center font-display text-18 font-semibold tabular-nums">
        {value}
      </output>
      <button
        type="button"
        className={`${h} grid place-items-center rounded-r-md text-ink transition-colors hover:bg-surface-muted disabled:opacity-40`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Sumar uno (${label})`}
      >
        <Plus className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
