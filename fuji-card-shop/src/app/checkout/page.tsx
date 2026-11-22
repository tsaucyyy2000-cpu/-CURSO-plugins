"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { JourneyRail } from "@/components/JourneyRail";
import { StickyCtaBar } from "@/components/StickyCtaBar";
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

type Step = "details" | "review";

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, itemCount, clear, hydrated } = useCart();
  const [step, setStep] = useState<Step>("details");
  const [details, setDetails] = useState<CheckoutDetails>(emptyCheckoutDetails);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [demoAck, setDemoAck] = useState(false);
  const [ackError, setAckError] = useState("");
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Defer sessionStorage read past the effect body to avoid sync setState-in-effect.
    Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      setDetails(readCheckoutDraft());
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

  const emptyCart = hydrated && itemCount === 0;

  function updateField<K extends keyof CheckoutDetails>(key: K, value: CheckoutDetails[K]) {
    setDetails((current) => {
      const next = { ...current, [key]: value };
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
    const parsed = CheckoutDetailsSchema.safeParse(details);
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

  function placeDemoOrder() {
    const parsed = CheckoutDetailsSchema.safeParse(details);
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      setStep("details");
      return;
    }
    if (!demoAck) {
      setAckError("Confirm you understand this is a local demo with no charge.");
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
    });
    clear();
    router.push("/checkout/confirmation");
  }

  if (!hydrated || !draftReady) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Checkout</div>
          <h1>Checkout demo</h1>
          <p>Loading your local cart…</p>
        </div>
      </div>
    );
  }

  if (emptyCart) {
    return (
      <div className="shell checkout-flow" style={{ paddingBottom: "4rem" }}>
        <div className="page-hero">
          <div className="eyebrow">Checkout</div>
          <h1>Checkout demo</h1>
          <p>Add sealed products before walking the demo checkout path.</p>
        </div>
        <DemoNotice />
        <JourneyRail current="checkout" />
        <div className="panel empty-state">
          <h2 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>Your cart is empty</h2>
          <p style={{ color: "var(--mist)", marginBottom: "1rem" }}>
            Checkout stays blocked until the cart has at least one in-stock or preorder line.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <Link href="/store" className="btn btn-primary">
              Browse store
            </Link>
            <Link href="/cart" className="btn btn-secondary">
              View cart
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shell checkout-flow" style={{ paddingBottom: "6.5rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Checkout</div>
        <h1>{step === "details" ? "Shipping & contact" : "Review demo order"}</h1>
        <p>
          Local demo only — mirrors contact, shipping, and payment method selection without a
          payment backend. No charges, emails, or inventory updates.
        </p>
      </div>

      <DemoNotice />
      <JourneyRail current="checkout" />

      <div className="checkout-step-tabs" role="tablist" aria-label="Checkout steps">
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
              Payment method (stub)
              <select
                name="payment"
                value={details.payment}
                onChange={(event) => {
                  const value = event.target.value;
                  for (const method of PAYMENT_METHODS) {
                    if (method.value === value) {
                      updateField("payment", method.value);
                      return;
                    }
                  }
                }}
              >
                {PAYMENT_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="stub-note">
              Stub only: selecting a payment method does not open a processor or capture a card.
            </div>
            <button className="btn btn-primary checkout-inline-cta" type="submit">
              Continue to review
            </button>
          </form>
        ) : (
          <div className="panel form-grid">
            <h2 style={{ fontSize: "1.2rem" }}>Confirm details</h2>
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
                <dt>Payment stub</dt>
                <dd>
                  <span>{paymentLabel(details.payment)}</span>
                  <button type="button" className="text-edit" onClick={() => setStep("details")}>
                    Change method
                  </button>
                </dd>
              </div>
            </dl>

            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={demoAck}
                onChange={(event) => {
                  setDemoAck(event.target.checked);
                  setAckError("");
                }}
              />
              <span>
                I understand this places a <strong>local demo order only</strong> — no payment is
                processed and no confirmation email is sent.
              </span>
            </label>
            {ackError ? (
              <span className="field-error" role="alert">
                {ackError}
              </span>
            ) : null}

            <div className="stub-note">
              Honest stub: “Place demo order” clears the local cart and shows a confirmation receipt
              in this browser. Live Fuji checkout still handles real payments.
            </div>

            <div className="cta-row checkout-inline-cta">
              <button type="button" className="btn btn-secondary" onClick={() => setStep("details")}>
                Back to details
              </button>
              <button type="button" className="btn btn-primary" onClick={placeDemoOrder}>
                Place demo order
              </button>
            </div>
          </div>
        )}

        <aside className="panel order-summary-panel">
          <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>Order summary</h2>
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
            <span>Subtotal</span>
            <strong style={{ color: "var(--gold)" }}>$ {subtotal.toFixed(2)}</strong>
          </div>
          <p style={{ color: "var(--mist)", marginTop: "1rem", fontSize: "0.92rem" }}>
            On the live shop, checkout may also collect US tariff (12.5% where applicable), shipping,
            and any taxes displayed in the order summary. Destination import charges may still apply.
          </p>
          <div style={{ marginTop: "1rem" }}>
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
              <span>Demo · no charge</span>
              <strong>$ {subtotal.toFixed(2)}</strong>
            </div>
            <button type="button" className="btn btn-primary" onClick={placeDemoOrder}>
              Place demo order
            </button>
          </>
        )}
      </StickyCtaBar>
    </div>
  );
}
