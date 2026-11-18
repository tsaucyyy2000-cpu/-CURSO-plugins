import type { Metadata } from "next";
import Link from "next/link";
import { shippingTransit } from "@/data/content";

export const metadata: Metadata = {
  title: "Customs duties/VAT & Shipping Details",
};

export default function ShippingPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Logistics</div>
        <h1>Shipping, taxes & import charges</h1>
        <p>What you pay at checkout, what may be due before delivery, and when your order ships.</p>
      </div>

      <div className="prose" style={{ maxWidth: "48rem" }}>
        <h2>Your checkout total</h2>
        <p>
          Your order summary shows the goods, shipping and any taxes or fees collected by us. These
          collected amounts are included in your checkout total.
        </p>

        <h2>Possible import charges</h2>
        <p>
          Customs or your carrier may request payment for import taxes, duties or clearance fees that
          were not collected at checkout. The rules depend on your delivery destination.
        </p>

        <h2>United States</h2>
        <p>The tariff collected by us is included in your checkout total.</p>
        <p>
          We collect our configured US tariff of 12.5% on applicable goods. You can see the collected
          amount in your order summary; shipping and handling are listed separately.
        </p>
        <p>
          This does not mean every possible import or carrier charge has been prepaid. Charges not
          included in your order summary may be requested separately.
        </p>

        <h2>Australia</h2>
        <p>The AUD 1,000 boundary changes when import charges may be collected.</p>
        <p>
          <strong>AUD 1,000 or less:</strong> GST may still be collected at checkout. Check your order
          summary for the amount collected.
        </p>
        <p>
          <strong>Over AUD 1,000:</strong> Import GST, applicable duties and clearance fees not
          collected at checkout may be payable before delivery. Combining orders into one shipment can
          change the applicable value.
        </p>

        <h2>European Union / United Kingdom / Canada / New Zealand / Other</h2>
        <p>
          Import VAT, applicable duties and carrier clearance fees not collected at checkout may be
          payable before delivery. Amounts depend on destination, goods and customs valuation. Check
          your local customs authority for the applicable rules.
        </p>

        <h2>Shipping & delivery times</h2>
        <p>
          <strong>Usually dispatched in 1–3 business days.</strong> Pre-orders follow their stated
          dispatch schedule. Dispatch may take longer during peak periods or holidays.
        </p>
        <p>
          <strong>Tracked & insured express shipping.</strong> We ship from Japan, primarily via
          FedEx, DHL or UPS. All shipments include tracking and insurance.
        </p>

        <table className="table">
          <thead>
            <tr>
              <th>Destination</th>
              <th>Business days after dispatch</th>
            </tr>
          </thead>
          <tbody>
            {shippingTransit.map((row) => (
              <tr key={row.destination}>
                <td>{row.destination}</td>
                <td>{row.days}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p>
          Transit estimates are separate from dispatch time. Customs checks, carrier issues and weather
          can affect delivery.
        </p>

        <h2>Customs declarations & unpaid charges</h2>
        <p>
          We declare the actual sales price and cannot declare a lower value to customs. If the
          recipient refuses to pay the applicable taxes or duties, the shipment may be returned or
          discarded. In such cases, we are unable to cancel the order or issue any refunds.
        </p>

        <p>
          Questions? <Link href="/contact">Contact support</Link> or review the{" "}
          <Link href="/right-to-cancel">cancellation & return policy</Link>.
        </p>
      </div>
    </div>
  );
}
