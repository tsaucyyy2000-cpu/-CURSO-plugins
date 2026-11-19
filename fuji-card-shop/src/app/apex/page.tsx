import type { Metadata } from "next";
import Link from "next/link";
import { TrustStrip } from "@/components/TrustStrip";
import { apexMeta, apexProducts, formatUsd } from "@/data/apex";

export const metadata: Metadata = {
  title: "Apex TCG Wholesale",
};

export default function ApexHubPage() {
  const pokemon = apexProducts.filter((p) => p.category === "pokemon").length;
  const onePiece = apexProducts.filter((p) => p.category === "one-piece").length;
  const other = apexProducts.length - pokemon - onePiece;

  return (
    <>
    <div className="shell">
      <div className="page-hero">
        <div className="eyebrow">Wholesale partner</div>
        <h1>Apex TCG</h1>
        <p>
          Planning catalog and B2B case pricing for sealed TCG — integrated into the Fuji Card Shop
          Project site from the Apex upload pack ({apexMeta.prepared}).
        </p>
      </div>

      <div className="stub-note" style={{ marginBottom: "1.25rem" }}>
        {apexMeta.disclaimer}
      </div>
      <p style={{ color: "var(--mist)", marginBottom: "1.75rem" }}>
        Every planning SKU carries sealed-product photography so buyers can recognize the real
        item before requesting a quote.
      </p>
    </div>
    <TrustStrip />
    <div className="shell" style={{ paddingBottom: "4rem", paddingTop: "1.75rem" }}>
      <div className="why-grid" style={{ marginBottom: "2.5rem" }}>
        <div className="why-item">
          <h3>{apexProducts.length} planning SKUs</h3>
          <p>
            {pokemon} Pokémon · {onePiece} ONE PIECE · {other} other sealed lines from the 200-product
            wholesale sheet.
          </p>
        </div>
        <div className="why-item">
          <h3>B2B case math</h3>
          <p>{apexMeta.caseFormula}. Quote-required lines stay marked.</p>
        </div>
        <div className="why-item">
          <h3>NY ship-to sample</h3>
          <p>
            Pro forma quote {apexMeta.wholesale.quoteRef} — estimated total before tax{" "}
            {formatUsd(apexMeta.wholesale.sampleTotalBeforeTax)}.
          </p>
        </div>
        <div className="why-item">
          <h3>Sample GTS confirmation</h3>
          <p>Fictional wholesale receipt included for process reference — not an official GTS document.</p>
        </div>
      </div>

      <div className="hero-actions" style={{ marginBottom: "2.5rem" }}>
        <Link href="/apex/catalog" className="btn btn-primary">
          Browse unit catalog
        </Link>
        <Link href="/apex/cases" className="btn btn-secondary">
          B2B case pricing
        </Link>
        <Link href="/apex/wholesale" className="btn btn-secondary">
          Quotes & downloads
        </Link>
      </div>

      <div className="panel prose">
        <h2 style={{ fontSize: "1.3rem" }}>How this merges with Fuji Card Shop</h2>
        <p>
          The existing Fuji Japan sealed storefront stays the retail face. Apex material adds a
          wholesale planning layer: unit estimates, case discounts, and downloadable quote/sample
          docs — without standing up a second parallel shop from the Apex zip.
        </p>
        <p>
          Live Apex checkout backends (Stripe/PayPal/Supabase) from the zip are <strong>not</strong>{" "}
          connected here. Cart remains local stub; wholesale is quote-led.
        </p>
      </div>
    </div>
    </>
  );
}
