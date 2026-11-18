import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function TermsPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Legal</div>
        <h1>Terms & Conditions</h1>
      </div>
      <div className="prose" style={{ maxWidth: "48rem" }}>
        <h2>Overview</h2>
        <p>
          This website is operated by FUJI CARD SHOP. Throughout the site, the terms “we”, “us” and
          “our” refer to FUJI CARD SHOP. By visiting our site and/or purchasing something from us, you
          agree to these Terms of Service.
        </p>
        <p>
          Cancellations, returns, refunds, replacements, shipping-damage claims, and lost-shipment
          claims are governed by our{" "}
          <Link href="/right-to-cancel">Cancellation and Return Policy</Link>.
        </p>

        <h2>Online store terms</h2>
        <p>
          You represent that you are at least the age of majority in your state or province of
          residence. You may not use our products for any illegal or unauthorized purpose.
        </p>

        <h2>Products or services</h2>
        <p>
          Certain products may be available exclusively online and only in limited quantities. We have
          made every effort to display colors and images accurately, but cannot guarantee your display
          is exact.
        </p>
        <p>
          Products are not guaranteed to be in perfect condition for collection or grading purposes.
          They are supplied in the condition typically found in the Japanese retail market. Minor
          imperfections (small scratches, minor dents, light packaging wear, shrink-wrap marks, label
          removal marks, cut or blacked-out lot numbers, slightly dented case corners) are disclosed
          and will not normally be treated as product defects. Material damage, significant undisclosed
          damage, incorrect/missing products, and shipping damage may qualify for remedy under the
          Cancellation and Return Policy.
        </p>

        <h2>Shipping and delivery</h2>
        <p>
          Orders ship from Japan via FedEx, DHL, or UPS with tracking and insurance. Delivery dates are
          estimates. Customs duties, import taxes, and handling fees imposed by the destination country
          are the recipient’s responsibility except where collected at checkout. See{" "}
          <Link href="/shipping">Shipping details</Link>.
        </p>
        <p>
          FUJI CARD SHOP does not provide preferential origin declarations or supporting documentation
          for reduced customs duties under free trade agreements.
        </p>

        <h2>Billing and account information</h2>
        <p>
          We reserve the right to refuse or limit any order. If we cancel an order for reasons
          attributable to us, the customer-requested cancellation fee will not apply and applicable
          amounts are refunded via the original payment method.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about these Terms should be sent via the <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </div>
  );
}
