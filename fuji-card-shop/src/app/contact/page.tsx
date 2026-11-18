"use client";

import { useState } from "react";
import Link from "next/link";
import { brand } from "@/data/content";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Support</div>
        <h1>Contact us</h1>
        <p>
          Please use the form below. For questions about an existing order, include your order
          number.
        </p>
      </div>

      <div className="split">
        {sent ? (
          <div className="panel">
            <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>Message staged locally</h2>
            <p style={{ color: "var(--mist)" }}>
              This rebuild does not send email. On the live shop, messages go to the Fuji Card Shop
              team at {brand.email}.
            </p>
            <button type="button" className="btn btn-secondary" style={{ marginTop: "1rem" }} onClick={() => setSent(false)}>
              Write another
            </button>
          </div>
        ) : (
          <form
            className="panel form-grid"
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
          >
            <label>
              Name
              <input name="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" required />
            </label>
            <label>
              Order number (optional)
              <input name="order" />
            </label>
            <label>
              Message
              <textarea name="message" required />
            </label>
            <button type="submit" className="btn btn-primary">
              Send message
            </button>
            <div className="stub-note">Contact form is front-end only in this clone.</div>
          </form>
        )}

        <div className="panel prose">
          <p>You may also find our shipping information and alternative contact options helpful.</p>
          <p>
            <Link href="/shipping">Shipping information →</Link>
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
