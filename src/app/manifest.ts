import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Muucky · Beef jerky argentino',
    short_name: 'Muucky',
    description: 'Beef jerky argentino marinado con chimichurri, limón y sal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#080808',
    theme_color: '#080808',
    lang: 'es-AR',
    icons: [
      { src: '/icon.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
