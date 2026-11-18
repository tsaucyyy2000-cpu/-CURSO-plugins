import type { CSSProperties } from "react";
import type { Product } from "@/data/products";

function shortLabel(name: string): string {
  return name
    .replace(/^\[.*?\]\s*/, "")
    .replace(/ Japanese.*$/i, "")
    .replace(/ Booster Box.*$/i, "")
    .replace(/ Sealed Case.*$/i, "")
    .slice(0, 42);
}

export function ProductArt({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
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
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="product-photo"
          src={product.image}
          alt={product.name}
          loading={priority ? "eager" : "lazy"}
        />
      ) : (
        <div className="product-art-inner">
          <div className="product-art-label">{shortLabel(product.name)}</div>
        </div>
      )}
    </div>
  );
}
