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
  status?: ProductStatus | "all";
};

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
      if (product.status !== filters.status) {
        return false;
      }
    }
    return true;
  });
}

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
  { value: "all", label: "All languages" },
  { value: "japanese", label: "Japanese" },
  { value: "english", label: "English" },
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

export const browseStatuses: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "Any availability" },
  { value: "available", label: "In stock" },
  { value: "preorder", label: "Pre-order" },
  { value: "out-of-stock", label: "Sold out" },
  { value: "sale", label: "Sale" },
];
