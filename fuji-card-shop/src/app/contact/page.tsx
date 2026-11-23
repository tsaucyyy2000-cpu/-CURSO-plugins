"use client";

import Link from "next/link";
import { useState } from "react";
import { DemoNotice } from "@/components/DemoNotice";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import { brand } from "@/data/content";
import {
  ContactFormSchema,
  fieldErrorsFromZod,
  type ContactFormValues,
} from "@/lib/checkout";
import { whatsappLinks } from "@/lib/whatsapp";

const emptyForm: ContactFormValues = {
  name: "",
  email: "",
  order: "",
  message: "",
};

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState<ContactFormValues>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ack, setAck] = useState(false);
  const [ackError, setAckError] = useState("");

  function updateField<K extends keyof ContactFormValues>(key: K, value: ContactFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function submitDemo() {
    const parsed = ContactFormSchema.safeParse({
      ...values,
      order: values.order?.trim() ? values.order : undefined,
    });
    if (!parsed.success) {
      setErrors(fieldErrorsFromZod(parsed.error));
      return;
    }
    if (!ack) {
      setAckError("Confirm you understand this form only stages a local demo acknowledgment.");
      return;
    }
    setErrors({});
    setAckError("");
    setSent(true);
  }

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Support</div>
        <h1>Contact us</h1>
        <p>
          Prefer WhatsApp for a live inquiry, or stage a local form draft below. For questions about
          an existing order, include your order number.
        </p>
      </div>

      <DemoNotice>
        <strong>WhatsApp is the active contact path</strong> ({brand.whatsappDisplay}). The on-page
        form only stages a local acknowledgment — it is not emailed to {brand.email}.
      </DemoNotice>

      <div style={{ marginBottom: "1.25rem" }}>
        <WhatsAppInquiryLink href={whatsappLinks.contact()} variant="primary">
          Open WhatsApp inquiry
        </WhatsAppInquiryLink>
      </div>

      <div className="split">
        {sent ? (
          <div className="panel">
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>
              Message staged locally
            </h2>
            <p style={{ color: "var(--mist)" }}>
              Demo acknowledgment only. Nothing left this browser. On the live shop, messages go to
              the Fuji Card Shop team at {brand.email}.
            </p>
            <dl className="review-list" style={{ marginTop: "1rem" }}>
              <div>
                <dt>From</dt>
                <dd>
                  <span>{values.name}</span>
                  <span>{values.email}</span>
                </dd>
              </div>
              {values.order ? (
                <div>
                  <dt>Order number</dt>
                  <dd>
                    <span>{values.order}</span>
                  </dd>
                </div>
              ) : null}
            </dl>
            <button
              type="button"
              className="btn btn-secondary"
              style={{ marginTop: "1rem" }}
              onClick={() => {
                setSent(false);
                setValues(emptyForm);
                setAck(false);
              }}
            >
              Write another
            </button>
          </div>
        ) : (
          <form
            className="panel form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              submitDemo();
            }}
            noValidate
          >
            <label>
              Name
              <input
                name="name"
                autoComplete="name"
                value={values.name}
                onChange={(event) => updateField("name", event.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "contact-name-error" : undefined}
              />
              {errors.name ? (
                <span id="contact-name-error" className="field-error" role="alert">
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
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "contact-email-error" : undefined}
              />
              {errors.email ? (
                <span id="contact-email-error" className="field-error" role="alert">
                  {errors.email}
                </span>
              ) : null}
            </label>
            <label>
              Order number (optional)
              <input
                name="order"
                value={values.order ?? ""}
                onChange={(event) => updateField("order", event.target.value)}
                aria-invalid={Boolean(errors.order)}
                aria-describedby={errors.order ? "contact-order-error" : undefined}
              />
              {errors.order ? (
                <span id="contact-order-error" className="field-error" role="alert">
                  {errors.order}
                </span>
              ) : null}
            </label>
            <label>
              Message
              <textarea
                name="message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "contact-message-error" : undefined}
              />
              {errors.message ? (
                <span id="contact-message-error" className="field-error" role="alert">
                  {errors.message}
                </span>
              ) : null}
            </label>
            <label className="checkbox-field">
              <input
                type="checkbox"
                checked={ack}
                onChange={(event) => {
                  setAck(event.target.checked);
                  setAckError("");
                }}
              />
              <span>
                I understand this stages a <strong>local demo acknowledgment only</strong> — no
                email is sent from this rebuild.
              </span>
            </label>
            {ackError ? (
              <span className="field-error" role="alert">
                {ackError}
              </span>
            ) : null}
            <button type="submit" className="btn btn-secondary">
              Stage local draft
            </button>
            <WhatsAppInquiryLink
              href={whatsappLinks.contact({
                name: values.name || undefined,
                email: values.email || undefined,
                orderRef: values.order || undefined,
                message: values.message || undefined,
              })}
              variant="primary"
            >
              Send this draft via WhatsApp
            </WhatsAppInquiryLink>
            <div className="stub-note">
              WhatsApp opens a prefilled inquiry only — not payment or an accepted order.
            </div>
          </form>
        )}

        <div className="panel prose">
          <p>You may also find our shipping information and alternative contact options helpful.</p>
          <p>
            <Link href="/shipping">Shipping information →</Link>
          </p>
          <p>
            WhatsApp:{" "}
            <a href={whatsappLinks.general()} target="_blank" rel="noopener noreferrer">
              {brand.whatsappDisplay}
            </a>
          </p>
          <p>
            <a href={brand.instagram} target="_blank" rel="noreferrer">
              Instagram @fujicardshop ↗
            </a>
          </p>
          <p>
            <a href={`mailto:${brand.email}`}>Email support {brand.email} →</a>
          </p>
          <p style={{ marginTop: "1rem" }}>
            Phone: {brand.phone}
            <br />
            {brand.address}
          </p>
        </div>
      </div>
    </div>
  );
}
