import imagedProducts from "./imaged-products.json";
import productImages from "./product-images.json";
import { products as baseProducts, type Product } from "./products";

type ImageEntry = {
  title: string;
  image: string;
  filename: string;
  source_url?: string;
  matchQuality?: "exact" | "closest-line";
  note?: string;
  gallery?: string[];
  imageAlt?: string;
  locked?: boolean;
};

type ImageMap = Record<string, ImageEntry>;

const images = productImages as ImageMap;

/** Packaging family so fuzzy match cannot map a sealed-case SKU onto a booster-box photo. */
function packagingKind(slug: string): "sealed-case" | "booster-box" | "other" {
  if (slug.endsWith("-sealed-case") || slug.includes("-sealed-case-")) {
    return "sealed-case";
  }
  if (slug.endsWith("-booster-box") || slug.includes("-booster-box")) {
    return "booster-box";
  }
  return "other";
}

function applyEntry(product: Product, entry: ImageEntry): Product {
  return {
    ...product,
    image: entry.image,
    gallery: entry.gallery,
    imageRef: entry.source_url || product.imageRef,
    imageMatchQuality: entry.matchQuality ?? "exact",
    imageNote: entry.note,
    imageAlt: entry.imageAlt ?? product.imageAlt,
  };
}

function withImage(product: Product): Product {
  const direct = images[product.slug];
  if (direct) {
    return applyEntry(product, direct);
  }

  const productKind = packagingKind(product.slug);
  const fuzzy = Object.entries(images).find(([slug]) => {
    if (packagingKind(slug) !== productKind && productKind !== "other") {
      return false;
    }
    return (
      slug === product.slug ||
      slug.includes(product.slug) ||
      product.slug.includes(slug.replace(/-booster-box$/, "").replace(/-sealed-case$/, ""))
    );
  });

  if (fuzzy) {
    return applyEntry(product, fuzzy[1]);
  }

  return product;
}

const extras: Product[] = (imagedProducts as Product[])
  .filter((entry) => !baseProducts.some((product) => product.slug === entry.slug))
  .map((entry) => {
    const mapped = images[entry.slug];
    const priced = entry.price > 0;
    return {
      ...entry,
      // Never invent prices — keep 0 when Fuji/official evidence is missing.
      price: priced ? entry.price : 0,
      badge: entry.badge ?? (priced ? "Archive photo" : "Price pending"),
      status: priced ? entry.status : entry.status === "preorder" ? "preorder" : entry.status,
      image: mapped?.image ?? entry.image,
      gallery: mapped?.gallery,
      imageRef: mapped?.source_url ?? entry.imageRef,
      imageMatchQuality: mapped?.matchQuality ?? "exact",
      imageNote: mapped?.note,
      imageAlt: mapped?.imageAlt ?? entry.imageAlt,
      shortDescription:
        entry.shortDescription ||
        "Japanese sealed product photo archived from Fuji Card Shop.",
      description: entry.description?.length
        ? entry.description
        : [
            "Product photography pulled from the live Fuji Card Shop catalog archive.",
            priced
              ? "Price synced from Fuji Card Shop listed USD."
              : "Listed price pending — no Fuji/official price evidence imported yet.",
          ],
    };
  });

export const allProducts: Product[] = [...baseProducts.map(withImage), ...extras];

export function getAllProducts(): Product[] {
  return allProducts;
}

export function getProductBySlug(slug: string): Product | undefined {
  return allProducts.find((product) => product.slug === slug);
}

export function getProductsByCategorySlug(category: Product["category"]): Product[] {
  if (category === "other-tcg") {
    return allProducts.filter((product) =>
      ["other-tcg", "weiss-schwarz", "union-arena", "hololive-cg", "gundam"].includes(
        product.category,
      ),
    );
  }
  return allProducts.filter((product) => product.category === category);
}

export function getFeaturedProductsResolved(): Product[] {
  const featured = allProducts.filter((product) => product.featured);
  if (featured.length >= 8) {
    return featured;
  }
  const withPhotos = allProducts.filter((product) => product.image);
  return [...featured, ...withPhotos.filter((product) => !product.featured)].slice(0, 12);
}

export function getSaleProductsResolved(): Product[] {
  const sale = allProducts.filter((product) => product.onSale);
  if (sale.length > 0) {
    return sale;
  }
  return allProducts.filter((product) => product.image).slice(0, 10);
}

export function getGalleryImages(): { src: string; alt: string; href?: string }[] {
  const seen = new Set<string>();
  const items: { src: string; alt: string; href?: string }[] = [];
  for (const product of allProducts) {
    if (!product.image || seen.has(product.image)) {
      continue;
    }
    seen.add(product.image);
    items.push({
      src: product.image,
      alt: product.name,
      href: `/product/${product.slug}`,
    });
  }
  return items;
}
