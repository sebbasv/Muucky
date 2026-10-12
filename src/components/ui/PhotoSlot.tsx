import Image from 'next/image';
import { Camera } from 'lucide-react';
import { store } from '@/config/store';
import type { Photo } from '@/data/photos';

/** Hay algo para mostrar: la foto, o su dirección de arte si están activas las notas de la demo. */
export function showsPhoto(photo: Photo) {
  return Boolean(photo.src) || store.demoNotes;
}

/**
 * Foto de una sección. Si el archivo todavía no existe, con las notas de la demo muestra qué foto va
 * (en lugar de una imagen de stock) y sin notas no muestra nada: la sección usa su versión sin foto.
 */
export function PhotoSlot({
  photo,
  className = '',
  tone = 'warm',
  sizes = '(min-width: 1024px) 560px, 100vw',
}: {
  photo: Photo;
  className?: string;
  tone?: 'warm' | 'dark';
  sizes?: string;
}) {
  if (photo.src) {
    return (
      <figure className={`relative overflow-hidden rounded-lg bg-surface ${className}`}>
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </figure>
    );
  }
  if (!store.demoNotes) return null;

  const bg =
    tone === 'warm'
      ? 'radial-gradient(120% 90% at 18% 20%, #3a2a1f 0%, #231f1a 38%, #0d0d0d 100%)'
      : 'radial-gradient(120% 90% at 80% 10%, #2a1414 0%, #141414 45%, #080808 100%)';
  return (
    <figure
      role="img"
      aria-label={photo.alt}
      className={`relative isolate flex overflow-hidden rounded-lg border border-white/5 ${className}`}
      style={{ background: bg }}
    >
      {/* luz lateral cálida, como la de la sesión de fotos que se propone */}
      <div
        aria-hidden="true"
        className="absolute -left-1/4 top-0 h-full w-3/4 -skew-x-12 opacity-40"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(207,69,23,0.18), transparent)' }}
      />
      <figcaption className="relative mt-auto flex w-full items-start gap-3 p-4 text-left md:p-5">
        <Camera aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-ink-muted" strokeWidth={1.75} />
        <span className="text-12 leading-[18px] text-ink-muted">
          <span className="block font-bold uppercase tracking-[0.14em] text-ink/80">Foto pendiente</span>
          {photo.brief}
        </span>
      </figcaption>
    </figure>
  );
}
