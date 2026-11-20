import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryFilters } from "@/components/CategoryFilters";
import { ProductCard } from "@/components/ProductCard";
import { TrustStrip } from "@/components/TrustStrip";
import { categories, type CategorySlug } from "@/data/products";
import { getProductsByCategorySlug } from "@/data/resolveProducts";

type Params = { slug: string };

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const category = categories.find((entry) => entry.slug === slug);
    return {
      title: category ? category.name : "Category",
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = categories.find((entry) => entry.slug === slug);
  if (!category) {
    notFound();
  }

  const list = getProductsByCategorySlug(slug as CategorySlug);

  const withPhotos = list.filter((product) => product.image).length;

  return (
    <>
      <div className="shell">
        <div className="page-hero">
          <div className="eyebrow">Category</div>
          <h1>{category.name}</h1>
          <p>
            {category.description} Authentic sealed photos on {withPhotos}/{list.length} listings.
          </p>
        </div>
      </div>
      <TrustStrip />
      <div className="shell">
        <CategoryFilters active={category.slug} />
        <div className="product-grid" style={{ paddingBottom: "4rem", paddingTop: "1.25rem" }}>
          {list.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </>
  );
}
