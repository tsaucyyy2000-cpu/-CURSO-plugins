import catalog from "./apex-catalog.json";
import meta from "./apex-meta.json";

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
};

export const apexMeta = meta;

export const apexProducts = catalog as ApexProduct[];

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
