import type { Metadata } from 'next';

/** title, description, canonical, Open Graph y Twitter card de cada página. */
export function pageMetadata({
  title,
  description,
  path,
  imagePath = '/opengraph-image',
}: {
  title: string;
  description: string;
  path: string;
  /** Ruta de la og:image; por defecto la general (app/opengraph-image.tsx). */
  imagePath?: string;
}): Metadata {
  const image = { url: imagePath, width: 1200, height: 630, alt: 'Muucky, beef jerky argentino' };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: 'website', locale: 'es_AR', siteName: 'Muucky', images: [image] },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
  };
}
