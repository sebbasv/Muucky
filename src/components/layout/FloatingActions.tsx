'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';
import { waLink } from '@/config/store';
import { lowestPrice } from '@/data/products';
import { formatPrice } from '@/lib/format';

/**
 * Botón flotante de WhatsApp (para consultas, no para pedidos) y, en la home, la barra fija de compra
 * en mobile. Para no tapar la pantalla: la barra aparece al pasar el hero y se oculta mientras se ven los
 * productos o el footer; WhatsApp no aparece sobre el hero y, en mobile, tampoco sobre los precios. Con el
 * menú abierto se ocultan los dos (.floating-ui en globals.css); con el carrito abierto, también.
 */
export function FloatingActions() {
  const { isOpen } = useCart();
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [pastHero, setPastHero] = useState(false);
  const [productsInView, setProductsInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const end = document.getElementById('hero-end');
    if (!end) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      setPastHero(end.getBoundingClientRect().top < 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [isHome]);

  useEffect(() => {
    if (!isHome || !('IntersectionObserver' in window)) return;
    const products = document.getElementById('productos');
    const footer = document.querySelector('footer');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === products) setProductsInView(e.isIntersecting);
        else setFooterInView(e.isIntersecting);
      }
    });
    if (products) io.observe(products);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, [isHome]);

  const showBar = isHome && pastHero && !productsInView && !footerInView && !isOpen;
  // En el hero (pantalla completa, con su riel y "Saltar a productos" abajo) no flota nada, en ningún tamaño
  const hideWhatsApp = isOpen || (isHome && !pastHero);
  const hideWhatsAppMobile = isHome && productsInView;

  return (
    <>
      <a
        href={waLink('¡Hola Muucky! Tengo una consulta.')}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Consultas por WhatsApp (se abre en otra pestaña)"
        className={`floating-ui fixed right-4 z-40 grid size-14 place-items-center rounded-pill border border-white/10 bg-surface text-ink shadow-[0_8px_24px_rgba(0,0,0,0.5)] transition-[transform,opacity,bottom] duration-300 hover:border-red hover:text-white md:bottom-6 md:right-6 ${
          showBar ? 'bottom-[calc(77px+max(12px,env(safe-area-inset-bottom)))]' : 'bottom-4'
        } ${
          hideWhatsApp
            ? 'pointer-events-none translate-y-24 opacity-0'
            : hideWhatsAppMobile
              ? 'max-md:pointer-events-none max-md:translate-y-24 max-md:opacity-0'
              : ''
        }`}
      >
        <WhatsAppIcon className="size-7" />
      </a>

      {isHome && (
        <div
          className={`floating-ui fixed inset-x-0 bottom-0 z-30 border-t border-border bg-black/90 px-4 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md transition-transform duration-300 ease-out md:hidden ${
            showBar ? 'translate-y-0' : 'translate-y-full'
          }`}
          inert={!showBar}
        >
          <Link href="/productos" className="flex min-h-12 items-center justify-between rounded-md bg-red px-5 font-bold text-white">
            <span>Comprar desde {formatPrice(lowestPrice)}</span>
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        </div>
      )}
    </>
  );
}
