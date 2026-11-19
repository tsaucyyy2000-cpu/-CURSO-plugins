import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { apexProducts, formatUsd, getApexProduct } from "@/data/apex";

type Params = { slug: string };

export function generateStaticParams() {
  return apexProducts.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = getApexProduct(slug);
    return { title: product ? `${product.name} — Apex` : "Apex product" };
  });
}

export default async function ApexProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getApexProduct(slug);
  if (!product) {
    notFound();
  }

  return (
    <div className="shell product-layout" style={{ paddingTop: "2.5rem" }}>
      <div
        className="product-detail-art"
        style={
          {
            "--accent": product.accent,
            "--accent-2": product.accentSecondary,
          } as CSSProperties
        }
      >
        <div className="product-art" style={{ aspectRatio: "1 / 1", borderRadius: "var(--radius)" }}>
          {product.quoteRequired ? <span className="product-badge">Quote required</span> : null}
          <div className="product-art-inner">
            <div className="product-art-label">{product.name}</div>
          </div>
        </div>
      </div>

      <div className="detail-copy">
        <div className="eyebrow">{product.section}</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>{product.name}</h1>
        <div className="price">{formatUsd(product.unitPrice)} unit</div>
        {product.format ? <p style={{ color: "var(--mist)" }}>Format: {product.format}</p> : null}
        {product.status ? <p style={{ color: "var(--gold)" }}>{product.status}</p> : null}

        <div className="panel">
          <h2 style={{ fontSize: "1.1rem", marginBottom: "0.65rem" }}>B2B case planning</h2>
          <ul>
            <li>
              Assumed case qty:{" "}
              {product.caseQty != null && !product.quoteRequired ? product.caseQty : "Quote required"}
            </li>
            <li>
              Case subtotal:{" "}
              {product.caseSubtotal != null ? formatUsd(product.caseSubtotal) : "—"}
            </li>
            <li>
              Case after 5%:{" "}
              {product.casePrice != null ? formatUsd(product.casePrice) : "Quote required"}
            </li>
          </ul>
        </div>

        <div className="stub-note">
          Planning estimate only — not a live checkout price. Wholesale remains quote-led; Fuji retail
          cart does not charge Apex B2B totals.
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <Link href="/apex/cases" className="btn btn-primary">
            All case pricing
          </Link>
          <Link href="/apex/wholesale" className="btn btn-secondary">
            Download source docs
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact for a quote
          </Link>
        </div>
      </div>
    </div>
  );
}
