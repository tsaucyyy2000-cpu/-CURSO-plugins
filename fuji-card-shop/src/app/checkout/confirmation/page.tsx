"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { JourneyRail } from "@/components/JourneyRail";
import {
  countryLabel,
  paymentLabel,
  readDemoOrder,
  type DemoOrder,
} from "@/lib/checkout";

export default function CheckoutConfirmationPage() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      setOrder(readDemoOrder());
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Confirmation</div>
          <h1>Loading demo receipt…</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Confirmation</div>
          <h1>No demo order in this browser</h1>
          <p>Complete the cart → checkout path to generate a local demo receipt.</p>
        </div>
        <DemoNotice />
        <JourneyRail current="confirmation" />
        <div className="panel empty-state">
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Nothing was charged. Demo receipts stay in session storage for this browser only.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/store" className="btn btn-primary">
              Browse store
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              Open cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const placedAt = new Date(order.createdAt);

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Confirmation</div>
        <h1>Demo order recorded locally</h1>
        <p>
          Receipt <strong>{order.id}</strong>
          {Number.isNaN(placedAt.getTime())
            ? null
            : ` · ${placedAt.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}`}
        </p>
      </div>

      <DemoNotice>
        <strong>No payment was processed.</strong> Credit Card, Google Pay, Apple Pay, and PayPal
        were not contacted. This rebuild does not send email or update inventory.
      </DemoNotice>
      <JourneyRail current="confirmation" />

      <div className="split">
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.85rem" }}>What you demoed</h2>
          <ul className="order-summary-lines">
            {order.lines.map((line) => (
              <li key={line.slug}>
                <div>
                  <Link href={`/product/${line.slug}`}>{line.name}</Link>
                  <span style={{ color: "var(--mist)", display: "block", fontSize: "0.88rem" }}>
                    Qty {line.quantity}
                  </span>
                </div>
                <strong style={{ color: "var(--gold)" }}>$ {line.lineTotal.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-summary-total">
            <span>Subtotal ({order.itemCount} item{order.itemCount === 1 ? "" : "s"})</span>
            <strong style={{ color: "var(--gold)" }}>$ {order.subtotal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.85rem" }}>Ship & pay stubs</h2>
          <dl className="review-list">
            <div>
              <dt>Contact</dt>
              <dd>
                <span>{order.details.name}</span>
                <span>{order.details.email}</span>
              </dd>
            </div>
            <div>
              <dt>Ship to</dt>
              <dd>
                <span>{countryLabel(order.details.country)}</span>
                <span>{order.details.address}</span>
              </dd>
            </div>
            <div>
              <dt>Payment method selected</dt>
              <dd>
                <span>{paymentLabel(order.details.payment)} (not charged)</span>
              </dd>
            </div>
          </dl>
          <div className="stub-note">
            Your local cart was cleared after this demo. On the live shop, payment is processed
            immediately and you receive a real order confirmation.
          </div>
          <div className="cta-row" style={{ marginTop: "1rem" }}>
            <Link href="/store" className="btn btn-primary">
              Back to store
            </Link>
            <Link href="/contact" className="btn btn-secondary">
              Contact (demo form)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
