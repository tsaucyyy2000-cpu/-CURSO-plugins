import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import { apexMeta, formatUsd } from "@/data/apex";
import { whatsappLinks } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Apex Wholesale Quotes & Docs",
};

const downloads = [
  {
    href: "/docs/apex/ApexTCG_200_Product_Pricing_Planning_Catalog.docx",
    title: "200-Product Pricing Planning Catalog",
    note: "Source DOCX — unit planning prices",
  },
  {
    href: "/docs/apex/ApexTCG_B2B_Case_Pricing_200_Products.docx",
    title: "B2B Case Pricing — 200 Products",
    note: "Source DOCX — case qty + 5% planning discount",
  },
  {
    href: "/docs/apex/ApexTCG_Wholesale_Pro_Forma_Quote.pdf",
    title: "Wholesale Pro Forma Quote",
    note: "Estimate for review — not a payment receipt",
  },
  {
    href: "/docs/apex/ApexTCG_GTS_Sample_Transaction_Confirmation.pdf",
    title: "GTS Sample Transaction Confirmation",
    note: "Sample only — fictional transaction, not an official GTS receipt",
  },
];

export default function ApexWholesalePage() {
  const w = apexMeta.wholesale;

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Documents</div>
        <h1>Wholesale quotes & downloads</h1>
        <p>
          Source Apex uploads mirrored into the site. Pro forma and GTS files are clearly marked as
          estimates / samples. Request a live quote on WhatsApp — not a purchase order.
        </p>
        <div style={{ marginTop: "1rem" }}>
          <WhatsAppInquiryLink href={whatsappLinks.wholesale()} variant="primary">
            Wholesale WhatsApp inquiry
          </WhatsAppInquiryLink>
        </div>
      </div>

      <div className="split" style={{ marginBottom: "2.5rem" }}>
        <div className="panel prose">
          <h2 style={{ fontSize: "1.25rem" }}>Pro forma snapshot</h2>
          <p>
            <strong>Quote:</strong> {w.quoteRef}
            <br />
            <strong>Date:</strong> {w.quoteDate}
            <br />
            <strong>Business:</strong> {w.business}
            <br />
            <strong>Ship-to:</strong> {w.shipTo}
          </p>
          <p>
            Sample requested order merchandise subtotal {formatUsd(w.sampleOrderSubtotal)} + shipping{" "}
            {formatUsd(w.sampleShipping)} = {formatUsd(w.sampleTotalBeforeTax)} before tax.
          </p>
          <p style={{ color: "var(--gold)" }}>
            ESTIMATE FOR REVIEW — final prices, stock, tax, freight and terms require supplier
            confirmation.
          </p>
        </div>
        <div className="panel prose">
          <h2 style={{ fontSize: "1.25rem" }}>GTS sample confirmation</h2>
          <p>
            Fictional wholesale transaction for process reference (SAMPLE-RCP-2026-0924). Not an
            official GTS Distribution receipt. Tracking and payment figures are hypothetical.
          </p>
          <p>
            <Link href="/apex/catalog">Browse planning catalog →</Link>
          </p>
        </div>
      </div>

      <div className="announce-list">
        {downloads.map((file) => (
          <article key={file.href} className="announce-item">
            <div className="announce-date">File</div>
            <div>
              <h3>
                <a href={file.href} download>
                  {file.title}
                </a>
              </h3>
              <p>{file.note}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
