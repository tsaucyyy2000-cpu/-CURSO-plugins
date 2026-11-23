/**
 * Catalog-side cart quantity / stock integrity helpers.
 * Adapted from Codex fuji-card cart stock validation (local catalog; no live DB writes).
 */

export type StockAwareProduct = {
  slug: string;
  status: "available" | "preorder" | "out-of-stock" | "sale";
  stock?: number;
  price: number;
  name: string;
};

export type CartLineInput = {
  slug: string;
  quantity: number;
};

/** Soft upper bound when a listing has no numeric stock count. */
export const DEFAULT_MAX_QTY = 99;

export type AddResult =
  | { ok: true; quantity: number; capped: boolean }
  | { ok: false; reason: "missing" | "out-of-stock" | "invalid-quantity"; quantity: number };

export function maxPurchasableQty(product: StockAwareProduct): number {
  if (product.status === "out-of-stock") {
    return 0;
  }
  if (typeof product.stock === "number") {
    if (!Number.isFinite(product.stock) || product.stock < 0) {
      return 0;
    }
    return Math.min(DEFAULT_MAX_QTY, Math.floor(product.stock));
  }
  return DEFAULT_MAX_QTY;
}

export function normalizeQty(raw: number): number {
  if (!Number.isFinite(raw)) {
    return 0;
  }
  return Math.max(0, Math.floor(raw));
}

export function clampLineQuantity(
  product: StockAwareProduct | undefined,
  desiredQty: number,
): AddResult {
  const quantity = normalizeQty(desiredQty);
  if (!product) {
    return { ok: false, reason: "missing", quantity: 0 };
  }
  if (quantity < 1) {
    return { ok: false, reason: "invalid-quantity", quantity: 0 };
  }
  const max = maxPurchasableQty(product);
  if (max < 1) {
    return { ok: false, reason: "out-of-stock", quantity: 0 };
  }
  const next = Math.min(quantity, max);
  return { ok: true, quantity: next, capped: next < quantity };
}

/**
 * Merge an add into existing lines with stock caps.
 * Returns a new lines array (immutable).
 */
export function addWithStockCap(
  lines: CartLineInput[],
  product: StockAwareProduct | undefined,
  addQty = 1,
): { lines: CartLineInput[]; result: AddResult } {
  if (!product) {
    return { lines, result: { ok: false, reason: "missing", quantity: 0 } };
  }
  const existing = lines.find((line) => line.slug === product.slug);
  const currentQty = existing ? existing.quantity : 0;
  const desired = currentQty + normalizeQty(addQty);
  const result = clampLineQuantity(product, desired);
  if (!result.ok) {
    return { lines, result };
  }
  if (existing) {
    return {
      lines: lines.map((line) =>
        line.slug === product.slug ? { ...line, quantity: result.quantity } : line,
      ),
      result,
    };
  }
  return {
    lines: [...lines, { slug: product.slug, quantity: result.quantity }],
    result,
  };
}

export function setWithStockCap(
  lines: CartLineInput[],
  product: StockAwareProduct | undefined,
  slug: string,
  desiredQty: number,
): { lines: CartLineInput[]; result: AddResult } {
  const quantity = normalizeQty(desiredQty);
  if (quantity < 1) {
    return {
      lines: lines.filter((line) => line.slug !== slug),
      result: { ok: true, quantity: 0, capped: false },
    };
  }
  const result = clampLineQuantity(product, quantity);
  if (!result.ok) {
    return {
      lines: lines.filter((line) => line.slug !== slug),
      result,
    };
  }
  const existing = lines.find((line) => line.slug === slug);
  if (existing) {
    return {
      lines: lines.map((line) =>
        line.slug === slug ? { ...line, quantity: result.quantity } : line,
      ),
      result,
    };
  }
  if (!product) {
    return { lines, result };
  }
  return {
    lines: [...lines, { slug, quantity: result.quantity }],
    result,
  };
}

/**
 * Drop missing / out-of-stock lines and clamp remaining quantities.
 * Fail-closed: unknown slugs are removed.
 */
export function reconcileCartLines(
  lines: CartLineInput[],
  resolve: (slug: string) => StockAwareProduct | undefined,
): { lines: CartLineInput[]; removed: string[]; capped: string[] } {
  const next: CartLineInput[] = [];
  const removed: string[] = [];
  const capped: string[] = [];

  for (const line of lines) {
    const product = resolve(line.slug);
    const result = clampLineQuantity(product, line.quantity);
    if (!result.ok || result.quantity < 1) {
      removed.push(line.slug);
      continue;
    }
    if (result.capped) {
      capped.push(line.slug);
    }
    next.push({ slug: line.slug, quantity: result.quantity });
  }

  return { lines: next, removed, capped };
}

export function catalogSubtotal(
  lines: CartLineInput[],
  resolve: (slug: string) => StockAwareProduct | undefined,
): number {
  let sum = 0;
  for (const line of lines) {
    const product = resolve(line.slug);
    if (!product) {
      continue;
    }
    sum += product.price * line.quantity;
  }
  return sum;
}
