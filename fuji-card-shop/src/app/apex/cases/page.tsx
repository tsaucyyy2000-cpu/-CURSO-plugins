import type { Metadata } from "next";
import Link from "next/link";
import { apexMeta, apexProducts, formatUsd, getApexSections } from "@/data/apex";

export const metadata: Metadata = {
  title: "Apex B2B Case Pricing",
};

export default function ApexCasesPage() {
  const sections = getApexSections();

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">B2B</div>
        <h1>Case pricing — 200 products</h1>
        <p>
          Illustrative case totals from the Apex B2B sheet. Formula: {apexMeta.caseFormula}.{" "}
          <Link href="/apex/catalog">Unit catalog →</Link>
        </p>
      </div>

      <div className="stub-note" style={{ marginBottom: "1.5rem" }}>
        Not supplier-confirmed case costs or verified sealed-case quantities. Confirm manufacturer
        case pack, availability, and final B2B price before offering a quote.
      </div>

      {sections.map((section) => {
        const rows = apexProducts.filter((product) => product.section === section);
        return (
          <section key={section} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "0.75rem" }}>{section}</h2>
            <div className="panel" style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Unit</th>
                    <th>Case qty</th>
                    <th>Subtotal</th>
                    <th>Case (−5%)</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((product) => (
                    <tr key={product.slug}>
                      <td>{product.id}</td>
                      <td>
                        <Link href={`/apex/product/${product.slug}`}>{product.name}</Link>
                      </td>
                      <td>{formatUsd(product.unitPrice)}</td>
                      <td>
                        {product.quoteRequired || !product.caseQty
                          ? "Quote"
                          : product.caseQty}
                      </td>
                      <td>
                        {product.caseSubtotal != null
                          ? formatUsd(product.caseSubtotal)
                          : "—"}
                      </td>
                      <td style={{ color: "var(--gold)", fontWeight: 650 }}>
                        {product.casePrice != null ? formatUsd(product.casePrice) : "Quote required"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}
