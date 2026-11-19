"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";
import { getProductBySlug } from "@/data/resolveProducts";

function getProduct(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export type CartLine = {
  slug: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  hydrated: boolean;
};

const STORAGE_KEY = "fuji-card-shop-cart-v1";
const CartContext = createContext<CartContextValue | null>(null);

function readStorage(): CartLine[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed
      .filter((entry): entry is CartLine => {
        if (typeof entry !== "object" || entry === null) {
          return false;
        }
        const candidate = entry as { slug?: unknown; quantity?: unknown };
        return typeof candidate.slug === "string" && typeof candidate.quantity === "number";
      })
      .map((entry) => ({
        slug: entry.slug,
        quantity: Math.max(1, Math.floor(entry.quantity)),
      }));
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLines(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const addItem = useCallback((slug: string, quantity = 1) => {
    const product = getProduct(slug);
    if (!product || product.status === "out-of-stock") {
      return;
    }
    setLines((current) => {
      const existing = current.find((line) => line.slug === slug);
      if (existing) {
        return current.map((line) =>
          line.slug === slug
            ? { ...line, quantity: line.quantity + Math.max(1, quantity) }
            : line,
        );
      }
      return [...current, { slug, quantity: Math.max(1, quantity) }];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity < 1) {
      setLines((current) => current.filter((line) => line.slug !== slug));
      return;
    }
    setLines((current) =>
      current.map((line) =>
        line.slug === slug ? { ...line, quantity: Math.floor(quantity) } : line,
      ),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const resolved = lines
      .map((line) => {
        const product = getProduct(line.slug);
        return product ? { line, product } : null;
      })
      .filter((entry): entry is { line: CartLine; product: Product } => entry !== null);

    return {
      lines,
      hydrated,
      itemCount: resolved.reduce((sum, entry) => sum + entry.line.quantity, 0),
      subtotal: resolved.reduce(
        (sum, entry) => sum + entry.product.price * entry.line.quantity,
        0,
      ),
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [lines, hydrated, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
