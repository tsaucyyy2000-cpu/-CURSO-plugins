import type { Metadata } from "next";
import { BrowseConsole } from "@/components/BrowseConsole";
import { TrustStrip } from "@/components/TrustStrip";
import type { BrowseFilters, BrowseSort } from "@/data/browse";
import { getAllProducts } from "@/data/resolveProducts";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse Japanese and English sealed TCG by game, language, and type.",
};

type SearchParams = {
  q?: string;
  sort?: string;
  game?: string;
  status?: string;
};

function parseSort(value: string | undefined): BrowseSort {
  const allowed: BrowseSort[] = [
    "featured",
    "newest",
    "price-asc",
    "price-desc",
    "name-asc",
    "name-desc",
  ];
  for (const option of allowed) {
    if (option === value) {
      return option;
    }
  }
  return "featured";
}

function parseGame(value: string | undefined): BrowseFilters["game"] {
  const allowed = [
    "all",
    "pokemon",
    "one-piece",
    "other-tcg",
    "weiss-schwarz",
    "union-arena",
    "hololive-cg",
    "gundam",
  ] as const;
  for (const option of allowed) {
    if (option === value) {
      return option;
    }
  }
  return "all";
}

function parseStatus(value: string | undefined): BrowseFilters["status"] {
  const allowed = [
    "all",
    "buyable",
    "available",
    "preorder",
    "out-of-stock",
    "sale",
  ] as const;
  for (const option of allowed) {
    if (option === value) {
      return option;
    }
  }
  return "all";
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const products = getAllProducts();
  const withPhotos = products.filter((product) => product.image).length;

  return (
    <>
      <div className="shell">
        <div className="page-hero">
          <div className="eyebrow">Shop</div>
          <h1>Store</h1>
          <p>
            Search and filter by game, language, and sealed type — then open a listing to inspect
            photos before you inquire or add the correct SKU. Catalog packaging photos on{" "}
            {withPhotos}/{products.length} listings. Ships from Japan. Prices listed in USD.
          </p>
        </div>
      </div>
      <TrustStrip />
      <div className="shell">
        <BrowseConsole
          products={products}
          initialQuery={params.q ?? ""}
          initialSort={parseSort(params.sort)}
          initialGame={parseGame(params.game)}
          initialStatus={parseStatus(params.status)}
        />
      </div>
    </>
  );
}
