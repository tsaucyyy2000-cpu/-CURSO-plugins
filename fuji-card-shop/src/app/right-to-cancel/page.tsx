import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Right to cancel",
};

export default function RightToCancelPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Policy</div>
        <h1>Cancellation and Return Policy</h1>
      </div>
      <div className="prose" style={{ maxWidth: "48rem" }}>
        <h2>1. Customer-Requested Cancellation Before Shipping</h2>
        <p>
          You may request cancellation of your order before the products have been shipped. For
          customer-requested cancellations, a cancellation fee equal to 10% of the total order amount
          will apply to cover payment processing fees and other costs associated with the cancellation.
        </p>
        <p>
          To request cancellation, inform us through our <Link href="/contact">contact form</Link>{" "}
          before the products have been shipped.
        </p>
        <p>
          Once an order has been shipped, we do not accept cancellations or returns for customer
          convenience. After shipping, claims are accepted only if a product is defective, if we have
          made an error with your order, or if the product has been damaged during shipping.
        </p>
        <p>
          If you cancel before shipping, we refund the amount paid after deducting the 10% fee within
          10 days, using the original payment method. If we cancel an order for reasons attributable to
          us, the 10% fee does not apply and a full refund is issued.
        </p>

        <h2>2. Defective, Incorrect, or Shipping-Damaged Products</h2>
        <p>
          Notify us within 10 days of receipt via the contact form with your order number, a
          description of the issue, and clear photographs of the affected product. For shipping damage,
          also include photos of the outer shipping box, shipping label, internal packaging, and
          damaged product. Retain packaging until review is complete.
        </p>
        <p>
          Resolution may include replacement, partial refund, full refund, or another agreed solution.
          Refunds are processed within 10 days of agreement using the original payment method. If a
          return is required after confirmation, Fuji Card Shop bears the direct return shipping cost.
          Do not return products before receiving instructions.
        </p>

        <h2>3. Lost or Missing Shipments</h2>
        <p>
          All shipments include tracking and shipping insurance, subject to carrier and insurer terms.
          If delivery is overdue, tracking suggests loss, or a package shows delivered but cannot be
          located, contact us promptly with your order number. Resolution is determined case-by-case
          after any carrier investigation.
        </p>

        <h2>4. Statutory Rights</h2>
        <p>
          Nothing in this policy excludes, restricts, or limits any mandatory rights or remedies
          available under applicable consumer protection laws.
        </p>
      </div>
    </div>
  );
}
