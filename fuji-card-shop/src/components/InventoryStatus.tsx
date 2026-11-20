import type { Product } from "@/data/products";
import { inventoryTone, statusLabel } from "@/data/browse";

export function InventoryStatus({ product }: { product: Product }) {
  const tone = inventoryTone(product);
  let label = statusLabel(product.status);
  if (tone === "low" && typeof product.stock === "number") {
    label = `${product.stock} left`;
  } else if (tone === "instock" && typeof product.stock === "number") {
    label = `${product.stock} in stock`;
  } else if (tone === "sale") {
    label = product.status === "preorder" ? "Pre-order · Sale" : "Sale";
  }

  return <span className={`inv-status inv-status-${tone}`}>{label}</span>;
}
