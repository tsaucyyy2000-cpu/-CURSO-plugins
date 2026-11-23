import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { InventoryStatus } from "@/components/InventoryStatus";
import { ProductGallery } from "@/components/ProductGallery";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import { ProductCard } from "@/components/ProductCard";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
  relatedProducts,
  statusLabel,
} from "@/data/browse";
import { formatPrice, hasListedPrice } from "@/data/products";
import { getAllProducts, getProductBySlug } from "@/data/resolveProducts";
import { whatsappLinks } from "@/lib/whatsapp";

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

  const languageKey = detectLanguage(product);
  const language = languageLabel(languageKey);
  const sealedType = productTypeLabel(detectProductType(product));
  const priced = hasListedPrice(product);
  const productInquiryHref = whatsappLinks.product({
    name: product.name,
    slug: product.slug,
    unitPriceUsd: product.price,
    quantity: 1,
    statusLabel: statusLabel(product.status),
  });
  const related = relatedProducts(product, getAllProducts(), 4);

  return (
    <>
      <div className="shell product-layout">
        <ProductGallery product={product} />

        <div className="detail-copy">
          <div className="eyebrow">{product.category.replace("-", " ")}</div>
          <h1 className="pdp-title">{product.name}</h1>
          <div className="product-confirm-row">
            <span className={`lang-badge lang-badge-${languageKey}`}>{language}</span>
            <span className="confirm-chip">{sealedType}</span>
            <InventoryStatus product={product} />
          </div>
          <div className={`price${priced ? "" : " price-pending"}`}>{formatPrice(product)}</div>
          <p className="product-assurance">
            {product.image
              ? product.imageMatchQuality === "closest-line"
                ? "Closest-line catalog packaging photo"
                : "Catalog packaging photo on file"
              : `${language} sealed listing`}
            {!priced ? " · USD sell price pending — inquire on WhatsApp" : null}
          </p>
          {product.imageMatchQuality === "closest-line" && product.imageNote ? (
            <p className="stub-note image-disclaimer">{product.imageNote}</p>
          ) : null}

          <dl className="pdp-facts">
            {typeof product.stock === "number" ? (
              <div>
                <dt>Catalog stock</dt>
                <dd>{product.stock}</dd>
              </div>
            ) : null}
            {product.releaseDate ? (
              <div>
                <dt>Release</dt>
                <dd>{product.releaseDate}</dd>
              </div>
            ) : null}
            {product.shipNote ? (
              <div>
                <dt>Shipping note</dt>
                <dd>{product.shipNote}</dd>
              </div>
            ) : null}
          </dl>

          <div className="prose">
            {product.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          {product.features ? (
            <div className="panel panel-soft">
              <h2 className="panel-title">Product features</h2>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {product.contents ? (
            <div className="panel panel-soft">
              <h2 className="panel-title">Contents</h2>
              <ul>
                {product.contents.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="pdp-actions">
            <AddToCartButton slug={product.slug} status={product.status} />
            <WhatsAppInquiryLink href={productInquiryHref} variant="primary">
              Ask about availability on WhatsApp
            </WhatsAppInquiryLink>
            <Link href="/shipping" className="btn btn-secondary">
              Shipping details
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              View cart
            </Link>
          </div>

          <div className="stub-note">
            Live card checkout and PayFast are disabled. WhatsApp opens an availability request only —
            not payment, acceptance, or a reservation. Confirm language and sealed type before
            inquiring.
          </div>

          <StickyCtaBar>
            <div className="sticky-cta-meta">
              <span>
                {language} · {sealedType}
              </span>
              <strong className={priced ? undefined : "price-pending"}>{formatPrice(product)}</strong>
            </div>
            <AddToCartButton slug={product.slug} status={product.status} />
          </StickyCtaBar>

          <div className="panel panel-soft">
            <h2 className="panel-title">Cancellation policy</h2>
            <p>
              Cancellation is possible before shipment via the contact form. A 10% cancellation fee
              applies for customer-requested cancellations. See the{" "}
              <Link href="/right-to-cancel">Right to cancel</Link> page.
            </p>
            {(product.weight || product.dimensions) && (
              <p className="pdp-spec">
                {product.weight ? `Weight: ${product.weight}. ` : null}
                {product.dimensions ? `Dimensions: ${product.dimensions}.` : null}
              </p>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="section section-related">
          <div className="shell">
            <div className="section-head">
              <div className="eyebrow">Related</div>
              <h2>More from this game</h2>
              <p>Same-language sealed first when available — verify language and type.</p>
            </div>
            <div className="product-grid">
              {related.map((entry, index) => (
                <ProductCard key={entry.slug} product={entry} index={index} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
