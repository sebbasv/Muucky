'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ShippingZoneId } from '@/config/store';
import { getProduct } from '@/data/products';
import { track } from '@/lib/analytics';
import { cartTotals, type Buyer, type CartLine } from '@/lib/order';

const STORAGE_KEY = 'muucky.cart.v1';

type CartContextValue = {
  lines: CartLine[];
  buyer: Buyer;
  isOpen: boolean;
  totals: ReturnType<typeof cartTotals>;
  add: (slug: string, qty?: number, options?: { open?: boolean }) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  updateBuyer: (patch: Partial<Buyer>) => void;
  setZone: (zone: ShippingZoneId | '') => void;
  /** Último producto agregado, para el aviso "Agregado al carrito". */
  lastAdded: { slug: string; qty: number; at: number } | null;
};

const CartContext = createContext<CartContextValue | null>(null);

const emptyBuyer: Buyer = { name: '', zone: '', postalCode: '', address: '', payment: '' };

function readStorage(): { lines: CartLine[]; buyer: Buyer } | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    const lines = Array.isArray(data.lines)
      ? data.lines.filter(
          (l: CartLine) => typeof l?.slug === 'string' && getProduct(l.slug) && Number.isInteger(l.qty) && l.qty > 0,
        )
      : [];
    return { lines, buyer: { ...emptyBuyer, ...(data.buyer ?? {}) } };
  } catch {
    return null;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [buyer, setBuyer] = useState<Buyer>(emptyBuyer);
  const [isOpen, setOpen] = useState(false);
  const [lastAdded, setLastAdded] = useState<CartContextValue['lastAdded']>(null);
  const hydrated = useRef(false);

  // El carrito persiste en localStorage (con try/catch: puede no estar disponible).
  useEffect(() => {
    const saved = readStorage();
    if (saved) {
      // localStorage es un sistema externo: se lee recién en el cliente para no romper la hidratación.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLines(saved.lines);
      setBuyer(saved.buyer);
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines, buyer }));
    } catch {
      // sin almacenamiento, el carrito vive en memoria
    }
  }, [lines, buyer]);

  const totals = useMemo(() => cartTotals(lines, buyer.zone), [lines, buyer.zone]);

  const add = useCallback<CartContextValue['add']>((slug, qty = 1, options) => {
    const product = getProduct(slug);
    if (!product || qty < 1) return;
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...prev, { slug, qty }];
    });
    setLastAdded({ slug, qty, at: Date.now() });
    track('add_to_cart', {
      value: product.price * qty,
      items: [{ item_id: product.slug, item_name: product.name, price: product.price, quantity: qty }],
    });
    if (options?.open) setOpen(true);
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setLines((prev) =>
      qty < 1 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty: Math.min(99, qty) } : l)),
    );
  }, []);

  const remove = useCallback((slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const updateBuyer = useCallback((patch: Partial<Buyer>) => setBuyer((b) => ({ ...b, ...patch })), []);
  const setZone = useCallback((zone: ShippingZoneId | '') => setBuyer((b) => ({ ...b, zone })), []);

  useEffect(() => {
    if (isOpen) track('view_cart', { value: totals.subtotal });
    // solo al abrir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const value = useMemo(
    () => ({ lines, buyer, isOpen, totals, add, setQty, remove, clear, open, close, updateBuyer, setZone, lastAdded }),
    [lines, buyer, isOpen, totals, add, setQty, remove, clear, open, close, updateBuyer, setZone, lastAdded],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart tiene que usarse dentro de <CartProvider>');
  return ctx;
}
