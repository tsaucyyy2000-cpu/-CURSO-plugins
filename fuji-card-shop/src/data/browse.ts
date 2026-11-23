import type { CategorySlug, Product, ProductStatus } from "./products";

export type ProductLanguage = "japanese" | "english" | "other";
export type SealedProductType =
  | "booster-box"
  | "booster-pack"
  | "sealed-case"
  | "deck"
  | "special-set"
  | "other";

export type BrowseFilters = {
  game?: CategorySlug | "all";
  language?: ProductLanguage | "all";
  productType?: SealedProductType | "all";
  status?: ProductStatus | "all" | "buyable";
  query?: string;
};

export type BrowseSort =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const GAME_LABELS: Record<CategorySlug, string> = {
  pokemon: "Pokémon",
  "one-piece": "ONE PIECE",
  "other-tcg": "Other TCG",
  "weiss-schwarz": "Weiss Schwarz",
  "union-arena": "UNION ARENA",
  "hololive-cg": "hololive OFFICIAL CG",
  gundam: "Gundam Card Game",
};

export function gameLabel(slug: CategorySlug): string {
  return GAME_LABELS[slug];
}

export function detectLanguage(product: Product): ProductLanguage {
  // Prefer explicit EN slug/name so counterpart notes mentioning JP do not flip language.
  if (
    /^en-|_english\b/i.test(product.slug) ||
    /\benglish\b/i.test(product.name)
  ) {
    return "english";
  }
  const text = `${product.name} ${product.shortDescription} ${product.description.join(" ")}`;
  if (/japanese|\bjp\b|日本/i.test(text)) {
    return "japanese";
  }
  if (/english|\ben\b/i.test(text)) {
    return "english";
  }
  return "other";
}

export function detectProductType(product: Product): SealedProductType {
  const text = `${product.slug} ${product.name}`.toLowerCase();
  if (/sealed[- ]case|\(\d+\s*boxes?\)/.test(text)) {
    return "sealed-case";
  }
  if (/booster[- ]pack|single pack/.test(text)) {
    return "booster-pack";
  }
  if (/booster[- ]box|display/.test(text)) {
    return "booster-box";
  }
  if (/starter|deck set|start deck|premium deck/.test(text)) {
    return "deck";
  }
  if (/pokemon center|special set|collection|bundle|premium|futuristic box|tin/.test(text)) {
    return "special-set";
  }
  return "other";
}

export function languageLabel(language: ProductLanguage): string {
  if (language === "japanese") {
    return "Japanese";
  }
  if (language === "english") {
    return "English";
  }
  return "Other";
}

export function productTypeLabel(type: SealedProductType): string {
  switch (type) {
    case "booster-box":
      return "Booster box";
    case "booster-pack":
      return "Booster pack";
    case "sealed-case":
      return "Sealed case";
    case "deck":
      return "Deck / starter";
    case "special-set":
      return "Special set";
    default:
      return "Other sealed";
  }
}

export function statusLabel(status: ProductStatus): string {
  switch (status) {
    case "preorder":
      return "Pre-order";
    case "out-of-stock":
      return "Sold out";
    case "sale":
      return "Sale";
    default:
      return "In stock";
  }
}

export function inventoryTone(
  product: Product,
): "preorder" | "soldout" | "sale" | "instock" | "low" {
  if (product.status === "out-of-stock") {
    return "soldout";
  }
  if (product.status === "preorder") {
    return "preorder";
  }
  if (product.status === "sale" || product.onSale) {
    return "sale";
  }
  if (typeof product.stock === "number" && product.stock > 0 && product.stock <= 3) {
    return "low";
  }
  return "instock";
}

export function matchesQuery(product: Product, query: string | undefined): boolean {
  const needle = query?.trim().toLowerCase() ?? "";
  if (!needle) {
    return true;
  }
  const haystack = [
    product.slug,
    product.name,
    product.shortDescription,
    product.category,
    product.badge ?? "",
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterProducts(products: Product[], filters: BrowseFilters): Product[] {
  return products.filter((product) => {
    if (filters.game && filters.game !== "all" && product.category !== filters.game) {
      if (
        filters.game === "other-tcg" &&
        ["weiss-schwarz", "union-arena", "hololive-cg", "gundam", "other-tcg"].includes(
          product.category,
        )
      ) {
        // allow
      } else {
        return false;
      }
    }
    if (filters.language && filters.language !== "all") {
      if (detectLanguage(product) !== filters.language) {
        return false;
      }
    }
    if (filters.productType && filters.productType !== "all") {
      if (detectProductType(product) !== filters.productType) {
        return false;
      }
    }
    if (filters.status && filters.status !== "all") {
      if (filters.status === "buyable") {
        if (product.status === "out-of-stock") {
          return false;
        }
      } else if (product.status !== filters.status) {
        return false;
      }
    }
    if (!matchesQuery(product, filters.query)) {
      return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: BrowseSort): Product[] {
  const next = [...products];
  if (sort === "price-asc") {
    return next.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
  }
  if (sort === "price-desc") {
    return next.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
  }
  if (sort === "name-asc") {
    return next.sort((a, b) => a.name.localeCompare(b.name));
  }
  if (sort === "name-desc") {
    return next.sort((a, b) => b.name.localeCompare(a.name));
  }
  if (sort === "newest") {
    return next.sort((a, b) => {
      const aDate = a.releaseDate ? Date.parse(a.releaseDate) : Number.NaN;
      const bDate = b.releaseDate ? Date.parse(b.releaseDate) : Number.NaN;
      const aOk = Number.isFinite(aDate);
      const bOk = Number.isFinite(bDate);
      if (aOk && bOk && aDate !== bDate) {
        return bDate - aDate;
      }
      if (aOk && !bOk) {
        return -1;
      }
      if (!aOk && bOk) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  }
  // featured: keep incoming catalog order
  return next;
}

export function relatedProducts(
  product: Product,
  catalog: Product[],
  limit = 4,
): Product[] {
  const sameGame = catalog.filter(
    (entry) => entry.slug !== product.slug && entry.category === product.category,
  );
  const sameLanguage = sameGame.filter(
    (entry) => detectLanguage(entry) === detectLanguage(product),
  );
  const pool = sameLanguage.length >= limit ? sameLanguage : sameGame;
  return pool.slice(0, limit);
}

/** Prefer existing English SKUs for home/featured rails; fall back only when none exist. */
export function preferEnglishProducts(products: Product[], limit?: number): Product[] {
  const english = products.filter((product) => detectLanguage(product) === "english");
  const ordered = english.length > 0
    ? [...english, ...products.filter((product) => detectLanguage(product) !== "english")]
    : products;
  if (typeof limit === "number") {
    return ordered.slice(0, limit);
  }
  return ordered;
}

/** Store/category default — USA-first; Japanese remains available via the Language filter. */
export const DEFAULT_BROWSE_LANGUAGE: ProductLanguage = "english";

export const browseGames: { value: CategorySlug | "all"; label: string }[] = [
  { value: "all", label: "All games" },
  { value: "pokemon", label: "Pokémon" },
  { value: "one-piece", label: "ONE PIECE" },
  { value: "union-arena", label: "UNION ARENA" },
  { value: "gundam", label: "Gundam" },
  { value: "weiss-schwarz", label: "Weiss Schwarz" },
  { value: "hololive-cg", label: "hololive" },
  { value: "other-tcg", label: "Other TCG" },
];

export const browseLanguages: { value: ProductLanguage | "all"; label: string }[] = [
  { value: "english", label: "English" },
  { value: "japanese", label: "Japanese" },
  { value: "all", label: "All languages" },
  { value: "other", label: "Other" },
];

export const browseProductTypes: { value: SealedProductType | "all"; label: string }[] = [
  { value: "all", label: "All sealed types" },
  { value: "booster-box", label: "Booster box" },
  { value: "booster-pack", label: "Booster pack" },
  { value: "sealed-case", label: "Sealed case" },
  { value: "deck", label: "Deck / starter" },
  { value: "special-set", label: "Special set" },
  { value: "other", label: "Other" },
];

export const browseStatuses: {
  value: ProductStatus | "all" | "buyable";
  label: string;
}[] = [
  { value: "all", label: "Any availability" },
  { value: "buyable", label: "In stock only (hide sold out)" },
  { value: "available", label: "Listed available" },
  { value: "preorder", label: "Pre-order" },
  { value: "out-of-stock", label: "Sold out" },
  { value: "sale", label: "Sale" },
];

export const browseSorts: { value: BrowseSort; label: string }[] = [
  { value: "featured", label: "Featured order" },
  { value: "newest", label: "Newest arrivals" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name: A–Z" },
  { value: "name-desc", label: "Name: Z–A" },
];

/** Quick lane presets for games that share the other-tcg category. */
export const collectionSearchPresets: { label: string; href: string; query: string }[] = [
  { label: "Yu-Gi-Oh!", href: "/store?q=yu-gi-oh&language=all", query: "yu-gi-oh" },
  { label: "Dragon Ball", href: "/store?q=dragon%20ball&language=all", query: "dragon ball" },
  { label: "Disney Lorcana", href: "/store?q=lorcana&language=all", query: "lorcana" },
];
