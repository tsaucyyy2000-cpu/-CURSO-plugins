import type { CSSProperties } from "react";
import type { ProductLanguage } from "@/data/browse";
import { detectLanguage } from "@/data/browse";
import type { Product } from "@/data/products";

function shortLabel(name: string): string {
  return name
    .replace(/^\[.*?\]\s*/, "")
    .replace(/ Japanese.*$/i, "")
    .replace(/ English.*$/i, "")
    .replace(/ Booster Box.*$/i, "")
    .replace(/ Sealed Case.*$/i, "")
    .slice(0, 42);
}

export function ProductArt({
  product,
  priority = false,
  language,
  showPhotoChip = false,
}: {
  product: Product;
  priority?: boolean;
  language?: ProductLanguage;
  /** PDP may show a subtle catalog-photo chip; tiles stay uncluttered. */
  showPhotoChip?: boolean;
}) {
  const resolvedLanguage = language ?? detectLanguage(product);

  return (
    <div
      className="product-art"
      data-language={resolvedLanguage}
      style={
        {
          "--accent": product.accent,
          "--accent-2": product.accentSecondary,
        } as CSSProperties
      }
    >
      {product.badge && product.badge !== "Price pending" ? (
        <span className="product-badge">{product.badge}</span>
      ) : null}
      {product.image ? (
        <>
          {showPhotoChip ? (
            <span className="authentic-chip">
              {product.imageMatchQuality === "closest-line"
                ? "Line-matched photo"
                : "Packaging photo"}
            </span>
          ) : null}
          {showPhotoChip &&
          product.imageMatchQuality === "closest-line" &&
          product.imageNote ? (
            <span className="image-disclaimer-chip">{product.imageNote}</span>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="product-photo"
            src={product.image}
            alt={product.imageAlt || product.name}
            loading={priority ? "eager" : "lazy"}
          />
        </>
      ) : (
        <div className="product-art-inner">
          <div className="product-art-label">{shortLabel(product.name)}</div>
        </div>
      )}
    </div>
  );
}
