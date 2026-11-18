import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/data/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Legal</div>
        <h1>Privacy Policy</h1>
        <p>
          Summary of the live shop privacy posture for order processing, enquiries, and optional
          newsletter consent under GDPR-style rights language used on fujicardshop.com.
        </p>
      </div>
      <div className="prose" style={{ maxWidth: "48rem" }}>
        <p>
          Personal data is collected to process orders and respond to enquiries. Account and order data
          are retained for applicable retention periods unless further consent is given.
        </p>
        <p>
          If you subscribe to a newsletter, messages are sent based on your consent. You may unsubscribe
          at any time via the opt-out link or by contacting support.
        </p>
        <p>
          As a data subject you may have rights to access, rectify, erase, restrict, or port your data,
          and to lodge a complaint with a supervisory authority, subject to applicable law.
        </p>
        <p>
          You may object to processing based on legitimate interests, including direct marketing. After
          an objection to direct marketing, we will no longer process your data for those purposes.
        </p>
        <p>
          Questions: <a href={`mailto:${brand.email}`}>{brand.email}</a> or the{" "}
          <Link href="/contact">contact form</Link>.
        </p>
        <div className="stub-note">
          This rebuild stores cart data only in your browser localStorage. The contact and checkout
          forms do not transmit personal data to a server.
        </div>
      </div>
    </div>
  );
}
