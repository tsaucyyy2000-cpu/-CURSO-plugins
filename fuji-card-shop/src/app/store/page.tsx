import type { Metadata } from "next";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { TrustStrip } from "@/components/TrustStrip";
import { getAllProducts } from "@/data/resolveProducts";

export const metadata: Metadata = {
  title: "Store - Japanese Pokemon Products",
};

export default function StorePage() {
  const products = getAllProducts();
  const withPhotos = products.filter((product) => product.image).length;

  return (
    <>
      <div className="shell">
        <div className="page-hero">
          <div className="eyebrow">Shop</div>
          <h1>Store</h1>
          <p>
            Japanese Pokémon, ONE PIECE, and sealed TCG with authentic product photography on every
            listing ({withPhotos}/{products.length}). Factory-sealed presentation — ships from Japan.
          </p>
        </div>
      </div>
      <TrustStrip />
      <div className="shell">
        <CategoryFilters />
        <div className="product-grid" style={{ paddingBottom: "4rem", paddingTop: "1.25rem" }}>
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </>
  );
}
