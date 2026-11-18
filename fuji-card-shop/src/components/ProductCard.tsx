import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, type Product } from "@/data/products";

function shortLabel(name: string): string {
  return name
    .replace(/^\[.*?\]\s*/, "")
    .replace(/ Japanese.*$/i, "")
    .replace(/ Booster Box.*$/i, "")
    .replace(/ Sealed Case.*$/i, "")
    .slice(0, 42);
}

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="product-tile">
      <div
        className="product-art"
        style={
          {
            "--accent": product.accent,
            "--accent-2": product.accentSecondary,
          } as CSSProperties
        }
      >
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
        <div className="product-art-inner">
          <div className="product-art-label">{shortLabel(product.name)}</div>
        </div>
      </div>
      <div className="product-meta">
        <h3>{product.name}</h3>
        <div className="price">{formatPrice(product)}</div>
      </div>
    </Link>
  );
}
