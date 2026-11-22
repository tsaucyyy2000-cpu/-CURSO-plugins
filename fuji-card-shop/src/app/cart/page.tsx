"use client";

import Link from "next/link";
import { DemoNotice } from "@/components/DemoNotice";
import { InventoryStatus } from "@/components/InventoryStatus";
import { JourneyRail } from "@/components/JourneyRail";
import { ProductArt } from "@/components/ProductArt";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import {
  detectLanguage,
  detectProductType,
  languageLabel,
  productTypeLabel,
} from "@/data/browse";
import { getProductBySlug } from "@/data/resolveProducts";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, hydrated, itemCount } = useCart();

  const resolved = lines
    .map((line) => {
      const product = getProductBySlug(line.slug);
      return product ? { line, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  const hasItems = hydrated && resolved.length > 0;

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: hasItems ? "6.5rem" : "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Bag</div>
        <h1>Your cart</h1>
        <p>Review sealed language and product type, then continue to the local checkout demo.</p>
      </div>

      <DemoNotice />
      <JourneyRail current="cart" />

      {!hydrated ? <p style={{ color: "var(--mist)" }}>Loading cart…</p> : null}

      {hydrated && resolved.length === 0 ? (
        <div className="panel empty-state">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Your cart is empty</h2>
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Add a sealed product from the store to walk the demo browse → cart → checkout path.
            Nothing is charged here.
          </p>
          <Link href="/store" className="btn btn-primary">
            Continue shopping
          </Link>
        </div>
      ) : null}

      {resolved.length > 0 ? (
        <>
          <div className="cart-lines">
            {resolved.map(({ line, product }) => (
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
            ))}
          </div>

          <div className="panel cart-summary" style={{ marginTop: "1.5rem", maxWidth: "28rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <strong>Subtotal · {itemCount} item{itemCount === 1 ? "" : "s"}</strong>
              <strong style={{ color: "var(--gold)" }}>$ {subtotal.toFixed(2)}</strong>
            </div>
            <p style={{ color: "var(--mist)", marginBottom: "1rem", fontSize: "0.92rem" }}>
              Shipping, US tariff (12.5% where applicable), and destination import charges are
              calculated on the live shop at checkout. This demo shows product subtotal only.
            </p>
            <div className="stub-note" style={{ marginTop: 0, marginBottom: "1rem" }}>
              Local cart stub — checkout will not process Credit Card, Google Pay, Apple Pay, or
              PayPal.
            </div>
            <Link href="/checkout" className="btn btn-primary cart-summary-cta">
              Proceed to checkout
            </Link>
          </div>

          <StickyCtaBar>
            <div className="sticky-cta-meta">
              <span>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
              <strong>$ {subtotal.toFixed(2)}</strong>
            </div>
            <Link href="/checkout" className="btn btn-primary">
              Checkout
            </Link>
          </StickyCtaBar>
        </>
      ) : null}
    </div>
  );
}
