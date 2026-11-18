import type { Metadata } from "next";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { getAllProducts } from "@/data/resolveProducts";

export const metadata: Metadata = {
  title: "Store - Japanese Pokemon Products",
};

export default function StorePage() {
  const products = getAllProducts();
  return (
    <div className="shell">
      <div className="page-hero">
        <div className="eyebrow">Shop</div>
        <h1>Store</h1>
        <p>
          Japanese Pokémon products, ONE PIECE CARD GAME, and other sealed TCG —
          rebuilt from the live Fuji Card Shop catalog structure, with archived
          product photography where available.
        </p>
      </div>
      <CategoryFilters />
      <div className="product-grid" style={{ paddingBottom: "4rem" }}>
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
