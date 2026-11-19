import { promises as fs } from "node:fs";
import path from "node:path";
import { apexProducts, type ApexProduct } from "@/data/apex";
import type { Product } from "@/data/products";
import { getAllProducts as getFujiProducts } from "@/data/resolveProducts";

export type AdminProductOverride = {
  slug: string;
  catalog: "fuji" | "apex";
  name?: string;
  price?: number;
  unitPrice?: number;
  image?: string;
  visible?: boolean;
  status?: string;
  stock?: number;
  updatedAt: string;
};

export type AdminCatalogItem = {
  id: string;
  catalog: "fuji" | "apex";
  slug: string;
  name: string;
  price: number;
  image?: string;
  visible: boolean;
  status: string;
  stock?: number;
  category: string;
};

type StoreFile = {
  overrides: AdminProductOverride[];
};

const STORE_PATH = path.join(process.cwd(), ".data", "admin-overrides.json");

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      Array.isArray((parsed as StoreFile).overrides)
    ) {
      return parsed as StoreFile;
    }
  } catch {
    // missing or unreadable — start empty
  }
  return { overrides: [] };
}

async function writeStore(store: StoreFile): Promise<void> {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  const tmp = `${STORE_PATH}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(store, null, 2), "utf8");
  await fs.rename(tmp, STORE_PATH);
}

function fujiToItem(product: Product, override?: AdminProductOverride): AdminCatalogItem {
  return {
    id: `fuji:${product.slug}`,
    catalog: "fuji",
    slug: product.slug,
    name: override?.name ?? product.name,
    price: override?.price ?? product.price,
    image: override?.image ?? product.image,
    visible: override?.visible ?? true,
    status: override?.status ?? product.status,
    stock: override?.stock ?? product.stock,
    category: product.category,
  };
}

function apexToItem(product: ApexProduct, override?: AdminProductOverride): AdminCatalogItem {
  return {
    id: `apex:${product.slug}`,
    catalog: "apex",
    slug: product.slug,
    name: override?.name ?? product.name,
    price: override?.unitPrice ?? override?.price ?? product.unitPrice,
    image: override?.image ?? product.image,
    visible: override?.visible ?? product.visible !== false,
    status: override?.status ?? product.status,
    stock: override?.stock,
    category: product.category,
  };
}

export async function listAdminCatalog(): Promise<AdminCatalogItem[]> {
  const store = await readStore();
  const byKey = new Map(
    store.overrides.map((entry) => [`${entry.catalog}:${entry.slug}`, entry] as const),
  );

  const fuji = getFujiProducts().map((product) =>
    fujiToItem(product, byKey.get(`fuji:${product.slug}`)),
  );
  const apex = apexProducts.map((product) =>
    apexToItem(product, byKey.get(`apex:${product.slug}`)),
  );
  return [...fuji, ...apex];
}

export async function getAdminItem(
  catalog: "fuji" | "apex",
  slug: string,
): Promise<AdminCatalogItem | undefined> {
  const list = await listAdminCatalog();
  return list.find((item) => item.catalog === catalog && item.slug === slug);
}

export async function updateAdminItem(
  catalog: "fuji" | "apex",
  slug: string,
  patch: Omit<AdminProductOverride, "slug" | "catalog" | "updatedAt">,
): Promise<AdminCatalogItem | undefined> {
  const existing = await getAdminItem(catalog, slug);
  if (!existing) {
    return undefined;
  }

  const store = await readStore();
  const key = `${catalog}:${slug}`;
  const without = store.overrides.filter((entry) => `${entry.catalog}:${entry.slug}` !== key);
  const next: AdminProductOverride = {
    slug,
    catalog,
    name: patch.name ?? existing.name,
    price: catalog === "fuji" ? (patch.price ?? existing.price) : undefined,
    unitPrice: catalog === "apex" ? (patch.unitPrice ?? patch.price ?? existing.price) : undefined,
    image: patch.image ?? existing.image,
    visible: patch.visible ?? existing.visible,
    status: patch.status ?? existing.status,
    stock: patch.stock ?? existing.stock,
    updatedAt: new Date().toISOString(),
  };
  await writeStore({ overrides: [...without, next] });
  return getAdminItem(catalog, slug);
}
