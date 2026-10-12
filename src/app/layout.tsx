import type { Metadata, Viewport } from 'next';
import { Inter, Oswald } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartToast } from '@/components/cart/CartToast';
import { FloatingActions } from '@/components/layout/FloatingActions';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { RevealObserver } from '@/components/layout/RevealObserver';
import { Analytics } from '@/components/seo/Analytics';
import { JsonLd } from '@/components/seo/JsonLd';
import { store } from '@/config/store';

// Fuentes servidas desde el propio dominio (next/font), solo el subset latino.
const oswald = Oswald({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-oswald', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(store.siteUrl),
  title: {
    default: 'Muucky · Beef jerky argentino marinado con chimichurri',
    template: '%s · Muucky',
  },
  description:
    'Muucky es beef jerky argentino: carne vacuna marinada con chimichurri, limón y sal, y deshidratada despacio. Packs de 40 g, 100 g y 250 g con envío a todo el país.',
  applicationName: 'Muucky',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    siteName: 'Muucky',
    url: '/',
  },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#080808',
  colorScheme: 'dark',
};

// Recuerda si se cerró la barra de anuncios antes de pintar (sin salto de layout).
const barScript = `try{if(localStorage.getItem('muucky.bar.closed'))document.documentElement.dataset.barClosed='true'}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="es-AR" className={`${oswald.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <script dangerouslySetInnerHTML={{ __html: barScript }} />
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Muucky',
              url: store.siteUrl,
              logo: `${store.siteUrl}/brand/icon-512.png`,
              email: store.email,
              telephone: `+${store.whatsapp}`,
              sameAs: Object.values(store.social).filter(Boolean),
            },
            {
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Muucky',
              url: store.siteUrl,
              inLanguage: 'es-AR',
            },
          ]}
        />
        <CartProvider>
          <Header />
          <main id="contenido">{children}</main>
          <Footer />
          <CartDrawer />
          <CartToast />
          <FloatingActions />
        </CartProvider>
        <RevealObserver />
        <Analytics />
      </body>
    </html>
  );
}
