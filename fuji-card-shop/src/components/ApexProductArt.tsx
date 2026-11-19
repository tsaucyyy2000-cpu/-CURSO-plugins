import type { CSSProperties } from "react";
import type { ApexProduct } from "@/data/apex";

export function ApexProductArt({
  product,
  priority = false,
}: {
  product: ApexProduct;
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
      {product.quoteRequired ? (
        <span className="product-badge">Quote</span>
      ) : product.status ? (
        <span className="product-badge">{product.status}</span>
      ) : null}
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
          <div className="product-art-label">{product.name}</div>
        </div>
      )}
    </div>
  );
}
