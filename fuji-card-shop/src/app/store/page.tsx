import type { Metadata } from "next";
import { BrowseConsole } from "@/components/BrowseConsole";
import { TrustStrip } from "@/components/TrustStrip";
import {
  DEFAULT_BROWSE_LANGUAGE,
  type BrowseFilters,
  type BrowseSort,
  type ProductLanguage,
} from "@/data/browse";
import { getAllProducts } from "@/data/resolveProducts";

export const metadata: Metadata = {
  title: "Store",
  description: "Browse English and Japanese sealed TCG by game, language, and type.",
};

type SearchParams = {
  q?: string;
  sort?: string;
  game?: string;
  status?: string;
  language?: string;
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

function parseLanguage(value: string | undefined): BrowseFilters["language"] {
  const allowed = ["english", "japanese", "all", "other"] as const;
  for (const option of allowed) {
    if (option === value) {
      return option;
    }
  }
  return DEFAULT_BROWSE_LANGUAGE;
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const products = getAllProducts();
  const withPhotos = products.filter((product) => product.image).length;
  const initialLanguage = parseLanguage(params.language);

  return (
    <>
      <div className="shell">
        <div className="page-hero">
          <div className="eyebrow">Shop</div>
          <h1>Store</h1>
          <p>
            English sealed first for USA collectors — switch Language to Japanese or All when you
            need it. Confirm sealed type, then open a listing to inspect packaging photos before you
            inquire. Catalog photos on {withPhotos}/{products.length} listings. Ships from Japan.
            Prices listed in USD when verified.
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
          initialLanguage={initialLanguage as ProductLanguage | "all"}
        />
      </div>
    </>
  );
}
