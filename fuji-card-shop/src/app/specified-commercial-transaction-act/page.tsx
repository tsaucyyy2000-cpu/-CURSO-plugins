import type { Metadata } from "next";
import Link from "next/link";
import { commercialTransaction } from "@/data/content";

export const metadata: Metadata = {
  title: "Specified Commercial Transaction Act",
};

export default function SctaPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Japan disclosure</div>
        <h1>Specified Commercial Transaction Act</h1>
        <p>Notations based on the Specified Commercial Transaction Act.</p>
      </div>
      <table className="table">
        <tbody>
          {commercialTransaction.map((row) => (
            <tr key={row.label}>
              <th style={{ width: "34%", verticalAlign: "top" }}>{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
          <tr>
            <th>Customer-Requested Cancellation Before Shipping</th>
            <td>
              Contact via the contact form before shipment. A 10% cancellation fee applies to
              customer-requested cancellations. See the{" "}
              <Link href="/right-to-cancel">Cancellation and Return Policy</Link>.
            </td>
          </tr>
          <tr>
            <th>Returns After Shipping</th>
            <td>
              No convenience returns after shipping. Claims accepted for defects, order errors, or
              material shipping damage within 10 days of receipt.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
