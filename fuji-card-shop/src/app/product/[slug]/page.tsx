import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { InventoryStatus } from "@/components/InventoryStatus";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
} from "@/data/browse";
import { formatPrice } from "@/data/products";
import { getAllProducts, getProductBySlug } from "@/data/resolveProducts";

type Params = { slug: string };

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const language = languageLabel(detectLanguage(product));
  const sealedType = productTypeLabel(detectProductType(product));

  return (
    <div className="shell product-layout" style={{ paddingTop: "2.5rem" }}>
      <ProductGallery product={product} />

      <div className="detail-copy">
        <div className="eyebrow">{product.category.replace("-", " ")}</div>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>{product.name}</h1>
        <div className="product-confirm-row">
          <InventoryStatus product={product} />
          <span className="confirm-chip">{language}</span>
          <span className="confirm-chip">{sealedType}</span>
        </div>
        <div className="price">{formatPrice(product)}</div>
        <p className="product-assurance">
          {product.image
            ? product.imageMatchQuality === "closest-line"
              ? "Closest-line catalog packaging photo"
              : "Catalog packaging photo"
            : language === "English"
              ? "Sealed English TCG listing"
              : "Sealed Japanese TCG listing"}
        </p>
        {product.imageMatchQuality === "closest-line" && product.imageNote ? (
          <p className="stub-note image-disclaimer">{product.imageNote}</p>
        ) : null}
        {typeof product.stock === "number" ? (
          <p style={{ color: "var(--mist)" }}>{product.stock} in stock (catalog count)</p>
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

        <div className="pdp-actions" style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          <AddToCartButton slug={product.slug} status={product.status} />
          <Link href="/shipping" className="btn btn-secondary">
            Shipping details
          </Link>
          <Link href="/cart" className="btn btn-secondary">
            View cart
          </Link>
        </div>

        <div className="stub-note">
          Checkout payments (Credit Card / Google Pay / Apple Pay / PayPal) are stubbed in this
          rebuild. Cart state is local-only. Confirm language and sealed type match what you intend
          before placing a demo order.
        </div>

        <StickyCtaBar>
          <div className="sticky-cta-meta">
            <span>
              {language} · {sealedType}
            </span>
            <strong>{formatPrice(product)}</strong>
          </div>
          <AddToCartButton slug={product.slug} status={product.status} />
        </StickyCtaBar>

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
