import catalog from "./apex-catalog.json";
import apexImages from "./apex-images.json";
import meta from "./apex-meta.json";

export type ApexImageMeta = {
  title?: string;
  image: string;
  filename?: string;
  source_url?: string;
  matchedProductName?: string;
  matchQuality?: "exact" | "closest-line";
  note?: string;
  attribution?: string;
  counterpartSlug?: string;
  tcgplayerProductId?: number;
};

export type ApexProduct = {
  id: number;
  slug: string;
  name: string;
  format: string;
  section: string;
  category: string;
  unitPrice: number;
  caseQty?: number | null;
  caseSubtotal?: number | null;
  casePrice?: number | null;
  status: string;
  quoteRequired: boolean;
  accent: string;
  accentSecondary: string;
  image?: string;
  imageRef?: string;
  imageMatchQuality?: "exact" | "closest-line";
  imageNote?: string;
  visible?: boolean;
};

type ImageMap = Record<string, ApexImageMeta>;

const images = apexImages as ImageMap;

export const apexMeta = meta;

function withImage(product: ApexProduct): ApexProduct {
  const entry = images[product.slug];
  if (!entry) {
    return { ...product, visible: product.visible !== false };
  }
  return {
    ...product,
    image: entry.image,
    imageRef: entry.source_url,
    imageMatchQuality: entry.matchQuality,
    imageNote: entry.note,
    visible: product.visible !== false,
  };
}

export const apexProducts: ApexProduct[] = (catalog as ApexProduct[]).map(withImage);

export function getApexProduct(slug: string): ApexProduct | undefined {
  return apexProducts.find((product) => product.slug === slug);
}

export function getApexSections(): string[] {
  return [...new Set(apexProducts.map((product) => product.section))];
}

export function getApexBySection(section: string): ApexProduct[] {
  return apexProducts.filter((product) => product.section === section);
}

export function getApexByCategory(category: string): ApexProduct[] {
  if (category === "all") {
    return apexProducts;
  }
  return apexProducts.filter((product) => product.category === category);
}

export function formatUsd(amount: number): string {
  return `$ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
