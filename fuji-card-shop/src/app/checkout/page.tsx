"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { JourneyRail } from "@/components/JourneyRail";
import { StickyCtaBar } from "@/components/StickyCtaBar";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import { getProductBySlug } from "@/data/resolveProducts";
import { useCart } from "@/lib/cart";
import {
  CheckoutDetailsSchema,
  PAYMENT_METHODS,
  SHIPPING_COUNTRIES,
  buildDemoOrderLines,
  countryLabel,
  createDemoOrderId,
  emptyCheckoutDetails,
  fieldErrorsFromZod,
  paymentLabel,
  readCheckoutDraft,
  writeCheckoutDraft,
  writeDemoOrder,
  type CheckoutDetails,
} from "@/lib/checkout";
import { whatsappLinks } from "@/lib/whatsapp";

type Step = "details" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, itemCount, clear, hydrated } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<CheckoutDetails>(emptyCheckoutDetails);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inquiryAck, setInquiryAck] = useState(false);
  const [ackError, setAckError] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      const draft = readCheckoutDraft();
      setDetails({ ...draft, payment: "whatsapp" });
      setDraftReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const orderLines = useMemo(
    () =>
      buildDemoOrderLines(lines, (slug) => {
        const product = getProductBySlug(slug);
        return product ? { name: product.name, price: product.price } : undefined;
      }),
    [lines],
  );

  const cartInquiryHref = useMemo(
    () =>
      whatsappLinks.cart({
        lines: orderLines.map((line) => ({
          name: line.name,
          quantity: line.quantity,
          unitPriceUsd: line.unitPrice,
          slug: line.slug,
        })),
        subtotalUsd: subtotal,
      }),
    [orderLines, subtotal],
  );

  const emptyCart = hydrated && itemCount === 0;

  function updateField<K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) {
    setDetails((current) => {
      const next = { ...current, [key]: value, payment: "whatsapp" as const };
      writeCheckoutDraft(next);
      return next;
    });
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function goToReview() {
    const parsed = CheckoutDetailsSchema.safeParse({ ...details, payment: "whatsapp" });
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      setStep("details");
      return;
    }
    writeCheckoutDraft(parsed.data);
    setDetails(parsed.data);
    setErrors({});
    setStep("review");
  }

  function recordLocalInquiry() {
    const parsed = CheckoutDetailsSchema.safeParse({ ...details, payment: "whatsapp" });
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      setStep("details");
      return;
    }
    if (!inquiryAck) {
      setAckError(
        "Confirm you understand this records a local inquiry only — not payment or acceptance.",
      );
      return;
    }
    if (orderLines.length === 0) {
      return;
    }

    writeDemoOrder({
      id: createDemoOrderId(),
      createdAt: new Date().toISOString(),
      details: parsed.data,
      lines: orderLines,
      itemCount,
      subtotal,
      inquiryState: "local_recorded",
    });
    clear();
    router.push("/checkout/confirmation");
  }

  if (!hydrated || !draftReady) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Inquiry</div>
          <h1>Availability request</h1>
          <p>Loading your local cart…</p>
        </div>
      </div>
    );
  }

  if (emptyCart) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Inquiry</div>
          <h1>Availability request</h1>
          <p>Add sealed products before requesting availability.</p>
        </div>
        <DemoNotice />
        <JourneyRail current="checkout" />
        <div className="panel empty-state">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Your cart is empty</h2>
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Inquiry checkout stays blocked until the cart has at least one in-stock or preorder line.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/store" className="btn btn-primary">
              Browse store
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              View cart
            </Link>
            <WhatsAppInquiryLink href={whatsappLinks.general()} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: "6.5rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Inquiry</div>
        <h1>{step === "details" ? "Contact & shipping" : "Review availability request"}</h1>
        <p>
          Live card checkout and PayFast are disabled. Primary path: WhatsApp availability inquiry.
          Optional local record stays in this browser only — never payment, acceptance, or a
          reservation.
        </p>
      </div>

      <DemoNotice />
      <JourneyRail current="checkout" />

      <div className="checkout-step-tabs" role="tablist" aria-label="Inquiry steps">
        <button
          type="button"
          role="tab"
          aria-selected={step === "details"}
          className={step === "details" ? "is-active" : ""}
          onClick={() => setStep("details")}
        >
          1 · Details
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={step === "review"}
          className={step === "review" ? "is-active" : ""}
          onClick={() => goToReview()}
        >
          2 · Review
        </button>
      </div>

      <div className="split">
        {step === "details" ? (
          <form
            className="panel form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              goToReview();
            }}
            noValidate
          >
            <label>
              Full name
              <input
                name="name"
                autoComplete="name"
                value={details.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "checkout-name-error" : undefined}
                placeholder="Collector name"
              />
              {errors.name ? (
                <span id="checkout-name-error" className="field-error" role="alert">
                  {errors.name}
                </span>
              ) : null}
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                value={details.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "checkout-email-error" : undefined}
                placeholder="you@example.com"
              />
              {errors.email ? (
                <span id="checkout-email-error" className="field-error" role="alert">
                  {errors.email}
                </span>
              ) : null}
            </label>
            <label>
              Shipping country
              <select
                name="country"
                value={details.country}
                onChange={(event) => {
                  const value = event.target.value;
                  for (const country of SHIPPING_COUNTRIES) {
                    if (country.value === value) {
                      updateField("country", country.value);
                      return;
                    }
                  }
                }}
              >
                {SHIPPING_COUNTRIES.map((country) => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Address
              <textarea
                name="address"
                autoComplete="street-address"
                value={details.address}
                onChange={(event) => updateField("address", event.target.value)}
                aria-invalid={Boolean(errors.address)}
                aria-describedby={errors.address ? "checkout-address-error" : undefined}
                placeholder="Street, city, postal code"
              />
              {errors.address ? (
                <span id="checkout-address-error" className="field-error" role="alert">
                  {errors.address}
                </span>
              ) : null}
            </label>
            <label>
              Request channel
              <select name="payment" value="whatsapp" disabled aria-readonly="true">
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="stub-note">
              Card, Google Pay, Apple Pay, PayPal, and PayFast are not offered. WhatsApp inquiry does
              not charge or reserve stock.
            </div>
            <button className="btn btn-primary checkout-inline-cta" type="submit">
              Continue to review
            </button>
          </form>
        ) : (
          <div className="panel form-grid">
            <h2 style={{ fontSize: "1.2rem" }}>Confirm inquiry details</h2>
            <dl className="review-list">
              <div>
                <dt>Contact</dt>
                <dd>
                  <span>{details.name}</span>
                  <span>{details.email}</span>
                  <button type="button" className="text-edit" onClick={() => setStep("details")}>
                    Edit contact
                  </button>
                </dd>
              </div>
              <div>
                <dt>Ship to</dt>
                <dd>
                  <span>{countryLabel(details.country)}</span>
                  <span>{details.address}</span>
                  <button type="button" className="text-edit" onClick={() => setStep("details")}>
                    Edit shipping
                  </button>
                </dd>
              </div>
              <div>
                <dt>Channel</dt>
                <dd>
                  <span>{paymentLabel(details.payment)}</span>
                </dd>
              </div>
            </dl>

            <WhatsAppInquiryLink href={cartInquiryHref} variant="primary">
              Open WhatsApp availability request
            </WhatsAppInquiryLink>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={inquiryAck}
                onChange={(event) => {
                  setInquiryAck(event.target.checked);
                  setAckError("");
                }}
              />
              <span>
                I understand a local inquiry record is <strong>not payment, acceptance, or a
                reservation</strong>, and no charge or inventory update occurs.
              </span>
            </label>
            {ackError ? (
              <span className="field-error" role="alert">
                {ackError}
              </span>
            ) : null}

            <div className="stub-note">
              Optional: save a local inquiry receipt in this browser after opening WhatsApp (or
              instead of sending). Production inventory is untouched.
            </div>

            <div className="cta-row checkout-inline-cta">
              <button type="button" className="btn btn-secondary" onClick={() => setStep("details")}>
                Back to details
              </button>
              <button type="button" className="btn btn-secondary" onClick={recordLocalInquiry}>
                Save local inquiry record
              </button>
            </div>
          </div>
        )}

        <aside className="panel order-summary-panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>Request summary</h2>
          <ul className="order-summary-lines">
            {orderLines.map((line) => (
              <li key={line.slug}>
                <div>
                  <Link href={`/product/${line.slug}`}>{line.name}</Link>
                  <span style={{ color: "var(--mist)", display: "block", fontSize: "0.88rem" }}>
                    Qty {line.quantity} · $ {line.unitPrice.toFixed(2)}
                  </span>
                </div>
                <strong style={{ color: "var(--gold)" }}>$ {line.lineTotal.toFixed(2)}</strong>
              </li>
            ))}
          </ul>
          <div className="order-summary-total">
            <span>Catalog subtotal</span>
            <strong style={{ color: "var(--gold)" }}>$ {subtotal.toFixed(2)}</strong>
          </div>
          <p style={{ color: "var(--mist)", marginTop: "1rem", fontSize: "0.92rem" }}>
            Final availability, shipping, and payment method are confirmed by Fuji Cards after your
            inquiry.
          </p>
          <div style={{ marginTop: "1rem", display: "grid", gap: "0.65rem" }}>
            <WhatsAppInquiryLink href={cartInquiryHref} variant="primary">
              WhatsApp inquiry
            </WhatsAppInquiryLink>
            <Link href="/cart" className="btn btn-secondary">
              Edit cart
            </Link>
          </div>
        </aside>
      </div>

      <StickyCtaBar>
        {step === "details" ? (
          <>
            <div className="sticky-cta-meta">
              <span>Step 1 of 2</span>
              <strong>$ {subtotal.toFixed(2)}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={goToReview}>
              Review
            </button>
          </>
        ) : (
          <>
            <div className="sticky-cta-meta">
              <span>Inquiry · no charge</span>
              <strong>$ {subtotal.toFixed(2)}</strong>
            </div>
            <WhatsAppInquiryLink href={cartInquiryHref} variant="primary" className="btn btn-primary">
              WhatsApp
            </WhatsAppInquiryLink>
          </>
        )}
      </StickyCtaBar>
    </div>
  );
}
