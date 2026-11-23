"use client";

import Link from "next/link";
import { DemoNotice } from "@/components/DemoNotice";
import { InventoryStatus } from "@/components/InventoryStatus";
import { JourneyRail } from "@/components/JourneyRail";
import { ProductArt } from "@/components/ProductArt";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
} from "@/data/browse";
import { getProductBySlug } from "@/data/resolveProducts";
import { useCart } from "@/lib/cart";
import { maxPurchasableQty } from "@/lib/cart-validation";
import { whatsappLinks } from "@/lib/whatsapp";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, hydrated, itemCount } = useCart();

  const resolved = lines
    .map((line) => {
      const product = getProductBySlug(line.slug);
      return product ? { line, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const hasItems = hydrated && resolved.length > 0;
  const cartInquiryHref = whatsappLinks.cart({
    lines: resolved.map(({ line, product }) => ({
      name: product.name,
      quantity: line.quantity,
      unitPriceUsd: product.price,
      slug: product.slug,
    })),
    subtotalUsd: subtotal,
  });

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: hasItems ? "6.5rem" : "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Bag</div>
        <h1>Your cart</h1>
        <p>
          Review sealed language and product type, then request availability on WhatsApp. Live card
          checkout is disabled.
        </p>
      </div>

      <DemoNotice />
      <JourneyRail current="cart" />

      {!hydrated ? <p style={{ color: "var(--mist)" }}>Loading cart…</p> : null}

      {hydrated && resolved.length === 0 ? (
        <div className="panel empty-state">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Your cart is empty</h2>
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Add a sealed product from the store, then inquire about availability. Nothing is charged
            here.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/store" className="btn btn-primary">
              Continue shopping
            </Link>
            <WhatsAppInquiryLink href={whatsappLinks.general()} />
          </div>
        </div>
      ) : null}

      {resolved.length > 0 ? (
        <>
          <div className="cart-lines">
            {resolved.map(({ line, product }) => {
              const maxQty = maxPurchasableQty(product);
              const atCap = line.quantity >= maxQty;
              return (
                <div key={line.slug} className="cart-line">
                  <div style={{ width: 88 }}>
                    <ProductArt product={product} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>
                      <Link href={`/product/${product.slug}`}>{product.name}</Link>
                    </h2>
                    <div className="product-confirm-row" style={{ marginBottom: "0.45rem" }}>
                      <InventoryStatus product={product} />
                      <span className="confirm-chip">
                        {languageLabel(detectLanguage(product))}
                      </span>
                      <span className="confirm-chip">
                        {productTypeLabel(detectProductType(product))}
                      </span>
                    </div>
                    <div className="price" style={{ color: "var(--gold)" }}>
                      $ {product.price.toFixed(2)}
                    </div>
                    {atCap ? (
                      <p style={{ color: "var(--mist)", fontSize: "0.85rem", marginTop: "0.35rem" }}>
                        Quantity capped to catalog stock ({maxQty}).
                      </p>
                    ) : null}
                    <div className="qty" style={{ marginTop: "0.65rem" }}>
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${product.name}`}
                        onClick={() => setQuantity(line.slug, line.quantity - 1)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{line.quantity}</span>
                      <button
                        type="button"
                        aria-label={`Increase quantity of ${product.name}`}
                        disabled={atCap}
                        onClick={() => setQuantity(line.slug, line.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ marginLeft: "0.5rem", padding: "0.35rem 0.7rem" }}
                        onClick={() => removeItem(line.slug)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="line-total" style={{ color: "var(--gold)", fontWeight: 700 }}>
                    $ {(product.price * line.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="panel cart-summary" style={{ marginTop: "1.5rem", maxWidth: "28rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <strong>Subtotal · {itemCount} item{itemCount === 1 ? "" : "s"}</strong>
              <strong style={{ color: "var(--gold)" }}>$ {subtotal.toFixed(2)}</strong>
            </div>
            <p style={{ color: "var(--mist)", marginBottom: "1rem", fontSize: "0.92rem" }}>
              Catalog subtotal only (USD). Shipping, duties, and final availability are confirmed by
              Fuji Cards — an inquiry is not a reservation.
            </p>
            <div className="stub-note" style={{ marginTop: 0, marginBottom: "1rem" }}>
              Live card checkout and PayFast are retired until a verified replacement is approved.
            </div>
            <div style={{ display: "grid", gap: "0.65rem" }}>
              <WhatsAppInquiryLink href={cartInquiryHref} variant="primary">
                Request availability on WhatsApp
              </WhatsAppInquiryLink>
              <Link href="/checkout" className="btn btn-secondary">
                Continue with contact details
              </Link>
            </div>
          </div>

          <StickyCtaBar>
            <div className="sticky-cta-meta">
              <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
              <strong>$ {subtotal.toFixed(2)}</strong>
            </div>
            <WhatsAppInquiryLink href={cartInquiryHref} variant="primary" className="btn btn-primary">
              WhatsApp inquiry
            </WhatsAppInquiryLink>
          </StickyCtaBar>
        </>
      ) : null}
    </div>
  );
}
