import type { MetadataRoute } from 'next';
import { basePath } from '@/lib/base-path';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Muucky · Beef jerky argentino',
    short_name: 'Muucky',
    description: 'Beef jerky argentino marinado con chimichurri, limón y sal.',
    start_url: `${basePath}/`,
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    lang: 'es-AR',
    icons: [
      { src: `${basePath}/icon.png`, sizes: '192x192', type: 'image/png' },
      { src: `${basePath}/brand/icon-512.png`, sizes: '512x512', type: 'image/png' },
    ],
  };
}
