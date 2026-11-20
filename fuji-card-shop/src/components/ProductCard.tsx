import Link from "next/link";
import { InventoryStatus } from "@/components/InventoryStatus";
import { ProductArt } from "@/components/ProductArt";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
} from "@/data/browse";
import { formatPrice, type Product } from "@/data/products";

function caseHint(product: Product): string | null {
  const match = product.name.match(/\((\d+)\s*boxes?\)/i);
  if (match) {
    return `${match[1]} boxes / case`;
  }
  if (/sealed case/i.test(product.name)) {
    return "Sealed case";
  }
  return null;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const caseLabel = caseHint(product);
  const language = languageLabel(detectLanguage(product));
  const sealedType = productTypeLabel(detectProductType(product));

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-tile"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <ProductArt product={product} />
      <div className="tile-status-row">
        <InventoryStatus product={product} />
        {caseLabel ? <span className="case-config">{caseLabel}</span> : null}
      </div>
      <div className="product-meta">
        <div className="product-config-line">
          {language} · {sealedType}
        </div>
        <h3>{product.name}</h3>
        <div className="product-assurance">
          {product.image
            ? product.imageMatchQuality === "closest-line"
              ? "Closest authentic sealed photo"
              : "Official sealed product photo"
            : "Sealed TCG"}
          {" · "}
          Ships from Japan
        </div>
        <div className="price">{formatPrice(product)}</div>
      </div>
    </Link>
  );
}
