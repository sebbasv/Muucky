import { basePath } from '@/lib/base-path';

/**
 * Loader de next/image para la exportación estática (GitHub Pages no optimiza imágenes): sirve el
 * archivo tal cual, con el prefijo de basePath. El ?w= solo existe para que cada ancho del srcset
 * tenga su URL; Pages lo ignora.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  const url = src.startsWith('/') ? `${basePath}${src}` : src;
  return `${url}?w=${width}`;
}
