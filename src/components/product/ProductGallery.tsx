'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ComboPacks, PackImage } from '@/components/product/PackImage';
import { PhotoSlot } from '@/components/ui/PhotoSlot';
import { store } from '@/config/store';
import type { Product, ProductImage } from '@/data/products';

const stageBg = 'bg-[radial-gradient(70%_60%_at_50%_65%,#2a231d_0%,#121212_70%)]';

/**
 * Galería: swipe con scroll-snap en mobile, miniaturas y zoom al pasar el mouse en desktop.
 * El sello EXCESO EN SODIO ya está impreso en el pack: no se superpone otro (va en la caja de nutrición).
 */
export function ProductGallery({ product }: { product: Product }) {
  // Las fotos que faltan solo aparecen como notas de la demo, nunca como cajas vacías.
  const images = product.images.filter((img) => img.kind !== 'placeholder' || store.demoNotes);
  const [active, setActive] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);

  const goTo = (i: number) => {
    setActive(i);
    const track = trackRef.current;
    if (track) track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
  };

  const onScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const i = Math.round(track.scrollLeft / track.clientWidth);
    if (i !== active) setActive(i);
  };

  const zoomable = (img: ProductImage, i: number, content: React.ReactNode) => (
    <div
      className={`relative h-full w-full cursor-zoom-in overflow-hidden ${stageBg}`}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onMouseLeave={() => setZoom(null)}
    >
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-out motion-reduce:transition-none"
        style={zoom && i === active ? { transform: 'scale(1.9)', transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
      >
        {content}
      </div>
      {img.kind === 'pack' && store.demoNotes && (
        <span className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-12 text-ink-muted">
          Foto provisoria: pack de 40 g con etiqueta de peso
        </span>
      )}
    </div>
  );

  return (
    <div className="md:sticky md:top-[calc(var(--bar-h)+var(--header-h)+24px)]">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-lg"
        aria-roledescription="carrusel"
        aria-label={`Fotos de ${product.name}`}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative aspect-square w-full shrink-0 snap-center overflow-hidden rounded-lg"
            aria-roledescription="foto"
            aria-label={`${i + 1} de ${images.length}`}
          >
            {img.kind === 'photo' &&
              zoomable(
                img,
                i,
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="h-[86%] w-auto"
                />,
              )}
            {img.kind === 'pack' &&
              zoomable(
                img,
                i,
                <>
                  <PackImage
                    weightG={img.weightG}
                    sizes="(min-width: 768px) 380px, 60vw"
                    eager={i === 0}
                    className="h-[86%]"
                  />
                  <span className="sr-only">{img.alt}</span>
                </>,
              )}
            {img.kind === 'combo' && (
              <div role="img" aria-label={img.alt} className={`flex h-full w-full items-center justify-center ${stageBg}`}>
                <ComboPacks product={product} sizes="(min-width: 768px) 200px, 30vw" className="h-[62%] w-full" />
              </div>
            )}
            {img.kind === 'placeholder' && <PhotoSlot className="h-full w-full" photo={img} />}
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-4 gap-2" role="tablist" aria-label="Elegir foto">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Ver foto ${i + 1}: ${img.alt}`}
              onClick={() => goTo(i)}
              className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-md border bg-surface transition-colors ${
                i === active ? 'border-red' : 'border-border hover:border-[#444]'
              }`}
            >
              {img.kind === 'photo' && <Image src={img.src} alt="" width={80} height={120} className="h-[80%] w-auto" />}
              {img.kind === 'pack' && <PackImage weightG={img.weightG} sizes="64px" className="h-[80%]" />}
              {img.kind === 'combo' && <ComboPacks product={product} sizes="40px" className="h-[60%] w-full" />}
              {img.kind === 'placeholder' && (
                <span
                  className="absolute inset-0"
                  style={{ background: 'radial-gradient(120% 90% at 18% 20%, #3a2a1f 0%, #231f1a 38%, #0d0d0d 100%)' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
