import type { MetadataRoute } from 'next';
import { store } from '@/config/store';
import { products } from '@/data/products';

const pages = [
  '',
  '/productos',
  '/nutricion',
  '/nosotros',
  '/preguntas-frecuentes',
  '/mayoristas',
  '/envios',
  '/devoluciones',
  '/terminos',
  '/privacidad',
  '/arrepentimiento',
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map((path) => ({
      url: `${store.siteUrl}${path}`,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : path === '/productos' ? 0.9 : 0.5,
    })),
    ...products.map((p) => ({
      url: `${store.siteUrl}/productos/${p.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
