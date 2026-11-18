"use client";

import Link from "next/link";
import { ProductArt } from "@/components/ProductArt";
import { getProductBySlug } from "@/data/resolveProducts";
import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { lines, subtotal, setQuantity, removeItem, hydrated } = useCart();

  const resolved = lines
    .map((line) => {
      const product = getProductBySlug(line.slug);
      return product ? { line, product } : null;
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null);

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Bag</div>
        <h1>Your cart</h1>
        <p>Local cart stub — no payment backend is connected in this rebuild.</p>
      </div>

      {!hydrated ? <p style={{ color: "var(--mist)" }}>Loading cart…</p> : null}

      {hydrated && resolved.length === 0 ? (
        <div className="panel">
          <p>Your cart is empty.</p>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/store" className="btn btn-primary">
              Continue shopping
            </Link>
          </div>
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
                  <div className="price" style={{ color: "var(--gold)" }}>
                    $ {product.price.toFixed(2)}
                  </div>
                  <div className="qty" style={{ marginTop: "0.65rem" }}>
                    <button type="button" onClick={() => setQuantity(line.slug, line.quantity - 1)}>
                      −
                    </button>
                    <span>{line.quantity}</span>
                    <button type="button" onClick={() => setQuantity(line.slug, line.quantity + 1)}>
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

          <div className="panel" style={{ marginTop: "1.5rem", maxWidth: "28rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <strong>Subtotal</strong>
              <strong style={{ color: "var(--gold)" }}>$ {subtotal.toFixed(2)}</strong>
            </div>
            <p style={{ color: "var(--mist)", marginBottom: "1rem", fontSize: "0.92rem" }}>
              Shipping, US tariff (12.5% where applicable), and destination import charges are
              calculated on the live shop at checkout. This demo shows product subtotal only.
            </p>
            <Link href="/checkout" className="btn btn-primary">
              Proceed to checkout stub
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
