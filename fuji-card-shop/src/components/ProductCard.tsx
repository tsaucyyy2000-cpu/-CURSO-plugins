import Link from "next/link";
import { InventoryStatus } from "@/components/InventoryStatus";
import { ProductArt } from "@/components/ProductArt";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
} from "@/data/browse";
import { formatPrice, hasListedPrice, type Product } from "@/data/products";

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
  const language = detectLanguage(product);
  const languageText = languageLabel(language);
  const sealedType = productTypeLabel(detectProductType(product));
  const priced = hasListedPrice(product);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-tile"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <ProductArt product={product} language={language} />
      <div className="product-meta">
        <div className="tile-status-row">
          <span className={`lang-badge lang-badge-${language}`}>{languageText}</span>
          <InventoryStatus product={product} />
          {caseLabel ? <span className="case-config">{caseLabel}</span> : null}
        </div>
        <p className="product-config-line">{sealedType}</p>
        <h3>{product.name}</h3>
        <div className={`price${priced ? "" : " price-pending"}`}>{formatPrice(product)}</div>
      </div>
    </Link>
  );
}
