import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import { brand } from "@/data/content";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Payment methods",
  description:
    "Payment options are confirmed per inquiry. This page does not process payments.",
};

export default function PaymentMethodsPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Checkout</div>
        <h1>Payment methods</h1>
        <p>
          Payment options are confirmed for each order after availability and shipping are agreed.
        </p>
      </div>

      <div className="panel prose" style={{ maxWidth: "42rem" }}>
        <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>What this page does</h2>
        <p>
          This page does <strong>not</strong> process payments. Live card checkout and PayFast are
          disabled until a verified replacement is approved.
        </p>
        <p>
          Please wait for Fuji Card to confirm availability, shipping, and the final amount before
          paying. An inquiry is not payment, acceptance, or a reservation.
        </p>
        <ul>
          <li>Catalog amounts on this site are listed in USD.</li>
          <li>GBP or other settlement currencies are confirmed by the store when quoting.</li>
          <li>
            Primary request channel: WhatsApp {brand.whatsappDisplay} (
            <code>wa.me/{brand.whatsappE164}</code>).
          </li>
        </ul>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.25rem" }}>
          <WhatsAppInquiryLink href={whatsappLinks.general()} variant="primary">
            Request availability on WhatsApp
          </WhatsAppInquiryLink>
          <Link href="/cart" className="btn btn-secondary">
            Review cart
          </Link>
          <Link href="/contact" className="btn btn-secondary">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
