"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";

export default function CheckoutPage() {
  const { subtotal, itemCount, clear, hydrated } = useCart();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="shell" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Checkout stub</div>
          <h1>Order recorded locally</h1>
          <p>
            No payment was processed. This rebuild does not connect to Credit Card, Google Pay,
            Apple Pay, or PayPal.
          </p>
        </div>
        <div className="panel">
          <p>Your demo cart has been cleared. On the live shop, payment is processed immediately.</p>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/store" className="btn btn-primary">
              Back to store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Checkout</div>
        <h1>Checkout stub</h1>
        <p>
          Mirrors the live shop&apos;s checkout intent (contact + shipping + payment methods) without
          a payment backend.
        </p>
      </div>

      <div className="split">
        <form
          className="panel form-grid"
          onSubmit={(event) => {
            event.preventDefault();
            clear();
            setSubmitted(true);
          }}
        >
          <label>
            Full name
            <input name="name" required placeholder="Collector name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required placeholder="you@example.com" />
          </label>
          <label>
            Shipping country
            <select name="country" defaultValue="US">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="EU">European Union</option>
              <option value="AU">Australia</option>
              <option value="JP">Japan</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>
            Address
            <textarea name="address" required placeholder="Street, city, postal code" />
          </label>
          <label>
            Payment method (stub)
            <select name="payment" defaultValue="card">
              <option value="card">Credit Card</option>
              <option value="google">Google Pay</option>
              <option value="apple">Apple Pay</option>
              <option value="paypal">PayPal</option>
            </select>
          </label>
          <button className="btn btn-primary" type="submit" disabled={!hydrated || itemCount === 0}>
            Place demo order
          </button>
          <div className="stub-note">
            Stub only: no charges, no emails, no inventory updates. Live payments stay on
            fujicardshop.com.
          </div>
        </form>

        <div className="panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>Order summary</h2>
          <p style={{ color: "var(--mist)" }}>{itemCount} item(s)</p>
          <p style={{ color: "var(--gold)", fontSize: "1.4rem", fontWeight: 700, marginTop: "0.5rem" }}>
            Subtotal $ {subtotal.toFixed(2)}
          </p>
          <p style={{ color: "var(--mist)", marginTop: "1rem", fontSize: "0.92rem" }}>
            On the live shop, checkout may also collect US tariff (12.5% where applicable), shipping,
            and any taxes displayed in the order summary. Destination import charges may still apply.
          </p>
          <div style={{ marginTop: "1rem" }}>
            <Link href="/cart" className="btn btn-secondary">
              Edit cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
