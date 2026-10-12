'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Menu, ShoppingBag, X, ArrowRight } from 'lucide-react';
import { useCart } from '@/components/cart/CartProvider';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { store, waLink } from '@/config/store';
import { useFocusTrap } from '@/lib/useFocusTrap';
import { pluralize } from '@/lib/format';

export const nav = [
  { href: '/productos', label: 'Productos' },
  { href: '/#como-se-hace', label: 'Cómo se hace' },
  { href: '/nutricion', label: 'Nutrición' },
  { href: '/preguntas-frecuentes', label: 'Preguntas' },
  { href: '/mayoristas', label: 'Mayoristas' },
];

export function Header() {
  const { totals, open } = useCart();
  const [scrolled, setScrolled] = useState(false);
  // La barra de anuncios se esconde al scrollear para abajo y vuelve al subir (menos capas fijas en mobile).
  const [barHidden, setBarHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusTrap(menuRef, menuOpen, closeMenu);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      if (Math.abs(y - lastY) < 6) return;
      setBarHidden(y > lastY && y > 80);
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Con el menú abierto se ocultan WhatsApp y la barra de compra (ver .floating-ui en globals.css).
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.menuOpen = String(menuOpen);
    return () => {
      delete root.dataset.menuOpen;
    };
  }, [menuOpen]);

  // Cambiar de página cierra el menú (ajuste de estado durante el render, sin efecto).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  const count = totals.count;
  const cartLabel = count > 0 ? `Abrir carrito, ${pluralize(count, 'producto', 'productos')}` : 'Abrir carrito, vacío';

  return (
    <>
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-md bg-ink px-4 py-2 font-bold text-black focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Saltar al contenido
      </a>
      <div
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ease-out motion-reduce:transition-none ${
          barHidden && !menuOpen ? '-translate-y-[var(--bar-h)]' : ''
        }`}
      >
        <AnnouncementBar />
        <header
          className={`transition-[background-color,border-color,backdrop-filter] duration-300 ${
            scrolled || menuOpen
              ? 'border-b border-white/5 bg-black/80 backdrop-blur-md'
              : 'border-b border-transparent bg-gradient-to-b from-black/70 to-transparent'
          }`}
        >
          <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
            <Link href="/" className="flex shrink-0 items-center" aria-label="Muucky, ir al inicio">
              <Image
                src="/brand/logo-muucky-224.webp"
                alt="Muucky Beef Jerky"
                width={230}
                height={224}
                loading="eager"
                className="h-12 w-auto md:h-14"
              />
            </Link>

            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-8">
                {nav.map((item) => {
                  const active = item.href === pathname || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? 'page' : undefined}
                        className={`relative py-2 text-16 font-medium transition-colors hover:text-ink ${
                          active ? 'text-ink' : 'text-[#cfcfcf]'
                        } after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-red after:transition-transform after:duration-200 ${
                          active ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={open}
                aria-label={cartLabel}
                className="relative grid size-11 place-items-center rounded-md text-ink transition-colors hover:bg-white/5"
              >
                <ShoppingBag className="size-6" strokeWidth={1.75} aria-hidden="true" />
                {count > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0.5 top-0.5 grid min-w-5 place-items-center rounded-pill bg-red px-1 font-display text-12 font-semibold leading-5 text-white"
                  >
                    {count}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="menu-mobile"
                aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                className="grid size-11 place-items-center rounded-md text-ink transition-colors hover:bg-white/5 lg:hidden"
              >
                {menuOpen ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* Menú mobile a pantalla completa */}
      <div
        id="menu-mobile"
        ref={menuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menú"
        hidden={!menuOpen}
        className="fixed inset-0 z-30 overflow-y-auto overflow-x-hidden bg-black pt-[calc(var(--bar-h)+var(--header-h))] lg:hidden"
      >
        <nav aria-label="Menú mobile" className="container-x relative py-8">
          <ul className="space-y-1">
            {nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeMenu}
                  data-autofocus={i === 0 ? true : undefined}
                  className="flex items-baseline gap-4 border-b border-border py-4 font-display text-48 font-bold leading-none text-ink"
                >
                  <span className="font-sans text-14 font-medium text-ink-muted tabular-nums">0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 text-16">
            <a href={waLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-ink">
              Consultas por WhatsApp <ArrowRight className="size-4 text-red" aria-hidden="true" />
            </a>
            <a href={`mailto:${store.email}`} className="block text-ink-muted">
              {store.email}
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
