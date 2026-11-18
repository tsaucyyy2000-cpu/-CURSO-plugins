import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { formatPrice, getProduct, products } from "@/data/products";

type Params = { slug: string };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = getProduct(slug);
    return {
      title: product?.name ?? "Product",
      description: product?.shortDescription,
    };
  });
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = getProduct(slug);
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
        {product.badge ? <span className="product-badge">{product.badge}</span> : null}
        <div className="product-art-inner" style={{ inset: 0, position: "absolute" }}>
          <div className="product-art-label">{product.name}</div>
        </div>
      </div>

      <div className="detail-copy">
        <div className="eyebrow">{product.category.replace("-", " ")}</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{product.name}</h1>
        <div className="price">{formatPrice(product)}</div>
        {typeof product.stock === "number" ? (
          <p style={{ color: "var(--mist)" }}>{product.stock} in stock</p>
        ) : null}
        {product.shipNote ? (
          <p style={{ color: "var(--gold)" }}>{product.shipNote}</p>
        ) : null}
        {product.releaseDate ? (
          <p style={{ color: "var(--mist)" }}>Release: {product.releaseDate}</p>
        ) : null}

        <div className="prose">
          {product.description.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {product.features ? (
          <div className="panel">
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.65rem" }}>Product features</h2>
            <ul>
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {product.contents ? (
          <div className="panel">
            <h2 style={{ fontSize: "1.1rem", marginBottom: "0.65rem" }}>Contents</h2>
            <ul>
              {product.contents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <AddToCartButton slug={product.slug} status={product.status} />
          <Link href="/shipping" className="btn btn-secondary">
            Shipping details
          </Link>
        </div>

        <div className="stub-note">
          Checkout payments (Credit Card / Google Pay / Apple Pay / PayPal) are stubbed in this
          rebuild. Cart state is local-only.
        </div>

        <div className="panel">
          <h2 style={{ fontSize: "1.05rem", marginBottom: "0.5rem" }}>Cancellation policy</h2>
          <p style={{ color: "var(--mist)" }}>
            Cancellation is possible before shipment via the contact form. A 10% cancellation fee
            applies for customer-requested cancellations. See the{" "}
            <Link href="/right-to-cancel">Right to cancel</Link> page.
          </p>
          {(product.weight || product.dimensions) && (
            <p style={{ color: "var(--mist)", marginTop: "0.75rem" }}>
              {product.weight ? `Weight: ${product.weight}. ` : null}
              {product.dimensions ? `Dimensions: ${product.dimensions}.` : null}
            </p>
          )}
          {product.imageRef ? (
            <p style={{ color: "var(--mist)", marginTop: "0.75rem", fontSize: "0.9rem" }}>
              Live imagery reference: {product.imageRef}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
