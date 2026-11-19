import type { Metadata } from "next";
import Link from "next/link";
import { ApexProductArt } from "@/components/ApexProductArt";
import { apexMeta, apexProducts, formatUsd, getApexSections } from "@/data/apex";

export const metadata: Metadata = {
  title: "Apex 200-Product Planning Catalog",
};

const filters = [
  { href: "/apex/catalog", label: "All", cat: "all" },
  { href: "/apex/catalog?cat=pokemon", label: "Pokémon", cat: "pokemon" },
  { href: "/apex/catalog?cat=one-piece", label: "ONE PIECE", cat: "one-piece" },
  { href: "/apex/catalog?cat=mtg", label: "MTG", cat: "mtg" },
  { href: "/apex/catalog?cat=yugioh", label: "Yu-Gi-Oh!", cat: "yugioh" },
  { href: "/apex/catalog?cat=lorcana", label: "Lorcana", cat: "lorcana" },
  { href: "/apex/catalog?cat=other-tcg", label: "Other", cat: "other-tcg" },
];

export default async function ApexCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat = "all" } = await searchParams;
  const list =
    cat === "all" ? apexProducts : apexProducts.filter((product) => product.category === cat);
  const sections = getApexSections().filter((section) =>
    list.some((product) => product.section === section),
  );

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Apex TCG</div>
        <h1>200-product planning catalog</h1>
        <p>
          Unit draft prices from the Apex wholesale planning sheet ({apexMeta.prepared}).{" "}
          <Link href="/apex/cases">View case pricing →</Link>
        </p>
      </div>

      <div className="filters">
        {filters.map((filter) => (
          <Link
            key={filter.cat}
            href={filter.href}
            className="chip"
            aria-current={cat === filter.cat ? "page" : undefined}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="stub-note" style={{ marginBottom: "1.5rem" }}>
        {apexMeta.disclaimer}
      </div>

      {sections.map((section) => {
        const rows = list.filter((product) => product.section === section);
        if (rows.length === 0) {
          return null;
        }
        return (
          <section key={section} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.35rem", marginBottom: "0.85rem" }}>{section}</h2>
            <div className="product-grid">
              {rows.map((product) => (
                <Link key={product.slug} href={`/apex/product/${product.slug}`} className="product-tile">
                  <ApexProductArt product={product} />
                  <div className="product-meta">
                    <h3>{product.name}</h3>
                    <div style={{ color: "var(--mist)", fontSize: "0.88rem" }}>
                      {product.format || "Sealed"}
                    </div>
                    <div className="price">{formatUsd(product.unitPrice)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
