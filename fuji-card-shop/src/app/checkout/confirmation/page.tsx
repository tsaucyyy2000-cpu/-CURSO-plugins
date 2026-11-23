"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { JourneyRail } from "@/components/JourneyRail";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import {
  countryLabel,
  paymentLabel,
  readDemoOrder,
  type DemoOrder,
} from "@/lib/checkout";
import { whatsappLinks } from "@/lib/whatsapp";

function inquiryStateLabel(state: DemoOrder["inquiryState"]): string {
  if (state === "whatsapp_opened") {
    return "WhatsApp inquiry opened (not paid)";
  }
  if (state === "draft") {
    return "Inquiry draft";
  }
  return "Local inquiry recorded (not paid / not accepted)";
}

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
          <div className="eyebrow">Inquiry</div>
          <h1>Loading local inquiry record…</h1>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Inquiry</div>
          <h1>No local inquiry in this browser</h1>
          <p>Complete cart → inquiry details to save a local record, or open WhatsApp directly.</p>
        </div>
        <DemoNotice />
        <JourneyRail current="confirmation" />
        <div className="panel empty-state">
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Nothing was charged. Inquiry receipts stay in session storage for this browser only.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/store" className="btn btn-primary">
              Browse store
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              Open cart
            </Link>
            <WhatsAppInquiryLink href={whatsappLinks.general()} />
          </div>
        </div>
      </div>
    );
  }

  const placedAt = new Date(order.createdAt);
  const followUpHref = whatsappLinks.cart({
    lines: order.lines.map((line) => ({
      name: line.name,
      quantity: line.quantity,
      unitPriceUsd: line.unitPrice,
      slug: line.slug,
    })),
    subtotalUsd: order.subtotal,
  });

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Inquiry</div>
        <h1>Local inquiry recorded</h1>
        <p>
          Reference <strong>{order.id}</strong>
          {Number.isNaN(placedAt.getTime())
            ? null
            : ` · ${placedAt.toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })}`}
        </p>
      </div>

      <DemoNotice>
        <strong>No payment was processed.</strong> This is not an accepted order or stock
        reservation. Live card checkout and PayFast remain disabled.
      </DemoNotice>
      <JourneyRail current="confirmation" />

      <div className="split">
        <div className="panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.85rem" }}>Products inquired</h2>
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
            <span>Catalog subtotal ({order.itemCount} item{order.itemCount === 1 ? "" : "s"})</span>
            <strong style={{ color: "var(--gold)" }}>$ {order.subtotal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.85rem" }}>Inquiry status</h2>
          <dl className="review-list">
            <div>
              <dt>State</dt>
              <dd>
                <span>{inquiryStateLabel(order.inquiryState)}</span>
              </dd>
            </div>
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
              <dt>Channel</dt>
              <dd>
                <span>{paymentLabel(order.details.payment)}</span>
              </dd>
            </div>
          </dl>
          <div className="stub-note">
            Your local cart was cleared after saving this inquiry record. Follow up on WhatsApp to
            ask Fuji Cards about availability.
          </div>
          <div className="cta-row" style={{ marginTop: "1rem" }}>
            <WhatsAppInquiryLink href={followUpHref} variant="primary">
              Continue on WhatsApp
            </WhatsAppInquiryLink>
            <Link href="/store" className="btn btn-secondary">
              Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
