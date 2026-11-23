import Link from "next/link";
import { detectLanguage, languageLabel } from "@/data/browse";
import type { Product } from "@/data/products";

export function SealedShelf({ products }: { products: Product[] }) {
  const shots = products.filter((product) => product.image).slice(0, 14);

  if (shots.length === 0) {
    return null;
  }

  return (
    <section className="sealed-shelf" aria-label="Sealed product photography">
      <div className="shell sealed-shelf-head">
        <div className="eyebrow">Sealed shelf</div>
        <h2>Packaging photos, full frame</h2>
        <p>English sealed first when available — every shot is the product collectors receive.</p>
      </div>
      <div className="sealed-shelf-track">
        {shots.map((product, index) => {
          const language = detectLanguage(product);
          return (
            <Link
              key={product.slug}
              href={`/product/${product.slug}`}
              className="sealed-shelf-card"
              style={{ animationDelay: `${Math.min(index, 10) * 55}ms` }}
            >
              <div className="sealed-shelf-glow" aria-hidden="true" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.image} alt={product.name} loading="lazy" />
              <span className={`lang-badge lang-badge-${language}`}>
                {languageLabel(language)}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
