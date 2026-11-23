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
import {
  addWithStockCap,
  catalogSubtotal,
  reconcileCartLines,
  setWithStockCap,
  type AddResult,
  type CartLineInput,
} from "@/lib/cart-validation";

function getProduct(slug: string): Product | undefined {
  return getProductBySlug(slug);
}

export type CartLine = CartLineInput;

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  addItem: (slug: string, quantity?: number) => AddResult;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => AddResult;
  clear: () => void;
  hydrated: boolean;
  lastResult: AddResult | null;
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
    const lines = parsed
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
    return reconcileCartLines(lines, getProduct).lines;
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastResult, setLastResult] = useState<AddResult | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      setLines(readStorage());
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // Fail closed on persistence errors: keep in-memory cart, do not throw.
    }
  }, [lines, hydrated]);

  const addItem = useCallback((slug: string, quantity = 1): AddResult => {
    const product = getProduct(slug);
    let result: AddResult = { ok: false, reason: "missing", quantity: 0 };
    setLines((current) => {
      const next = addWithStockCap(current, product, quantity);
      result = next.result;
      return next.lines;
    });
    setLastResult(result);
    return result;
  }, []);

  const removeItem = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
    setLastResult(null);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number): AddResult => {
    const product = getProduct(slug);
    let result: AddResult = { ok: false, reason: "missing", quantity: 0 };
    setLines((current) => {
      const next = setWithStockCap(current, product, slug, quantity);
      result = next.result;
      return next.lines;
    });
    setLastResult(result);
    return result;
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    setLastResult(null);
  }, []);

  // Prices always resolve from catalog data — never trust client-provided amounts.
  const value = useMemo<CartContextValue>(() => {
    const reconciled = reconcileCartLines(lines, getProduct);
    const resolvedLines = reconciled.lines;
    return {
      lines: resolvedLines,
      hydrated,
      itemCount: resolvedLines.reduce((sum, line) => sum + line.quantity, 0),
      subtotal: catalogSubtotal(resolvedLines, getProduct),
      addItem,
      removeItem,
      setQuantity,
      clear,
      lastResult,
    };
  }, [lines, hydrated, addItem, removeItem, setQuantity, clear, lastResult]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
