import { Plus } from 'lucide-react';
import type { FaqItem } from '@/data/faq';

/** Acordeón con <details>: accesible y funciona sin JavaScript. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-18 font-bold leading-6 marker:hidden [&::-webkit-details-marker]:hidden">
            {item.q}
            <Plus
              className="size-5 shrink-0 text-red transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-[65ch] pb-6 pr-10 text-16 leading-7 text-[#cfcfcf]">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
