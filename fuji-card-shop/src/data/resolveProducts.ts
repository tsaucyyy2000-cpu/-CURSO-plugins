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
};

type ImageMap = Record<string, ImageEntry>;

const images = productImages as ImageMap;

function withImage(product: Product): Product {
  const direct = images[product.slug];
  if (direct) {
    return {
      ...product,
      image: direct.image,
      imageRef: direct.source_url || product.imageRef,
      imageMatchQuality: direct.matchQuality ?? "exact",
      imageNote: direct.note,
    };
  }

  const fuzzy = Object.entries(images).find(([slug]) => {
    return (
      slug === product.slug ||
      slug.includes(product.slug) ||
      product.slug.includes(slug.replace(/-booster-box$/, ""))
    );
  });

  if (fuzzy) {
    return {
      ...product,
      image: fuzzy[1].image,
      imageRef: fuzzy[1].source_url || product.imageRef,
      imageMatchQuality: fuzzy[1].matchQuality ?? "exact",
      imageNote: fuzzy[1].note,
    };
  }

  return product;
}

const extras: Product[] = (imagedProducts as Product[])
  .filter((entry) => !baseProducts.some((product) => product.slug === entry.slug))
  .map((entry) => {
    const mapped = images[entry.slug];
    return {
      ...entry,
      price: entry.price > 0 ? entry.price : 49,
      badge: entry.badge ?? "Archive photo",
      image: mapped?.image ?? entry.image,
      imageRef: mapped?.source_url ?? entry.imageRef,
      shortDescription:
        entry.shortDescription ||
        "Japanese sealed product photo archived from Fuji Card Shop.",
      description: entry.description?.length
        ? entry.description
        : [
            "Product photography pulled from the live Fuji Card Shop catalog archive.",
            "Pricing shown is a placeholder when live checkout data was unavailable.",
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
