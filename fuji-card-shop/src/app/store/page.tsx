import type { Metadata } from "next";
import { BrowseConsole } from "@/components/BrowseConsole";
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
            Browse by game, language, and sealed type — then open a listing to inspect photos before
            you add the correct SKU. Catalog packaging photos on {withPhotos}/{products.length}{" "}
            listings. Ships from Japan.
          </p>
        </div>
      </div>
      <TrustStrip />
      <div className="shell">
        <BrowseConsole products={products} />
      </div>
    </>
  );
}
