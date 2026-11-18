import type { Metadata } from "next";
import { brand } from "@/data/content";

export const metadata: Metadata = {
  title: "Beware of Fake Accounts",
};

export default function FakeAccountsPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Safety</div>
        <h1>Beware of Fake Accounts</h1>
        <p>Mirrored from the live shop advisory published by Fuji Card Shop.</p>
      </div>
      <div className="prose" style={{ maxWidth: "48rem" }}>
        <p>
          Recently, accounts impersonating FUJI CARD SHOP have been discovered. The following are NOT
          operated by Fuji Card Shop and are very likely scams. Do not interact with them.
        </p>
        <div className="panel">
          <p>
            <strong>Fake accounts reported on the live shop:</strong>
          </p>
          <ul>
            <li>Facebook profile id 100086050431685</li>
            <li>WhatsApp numbers: +81 80-1027-9286, +81 70-2642-3853, +81 70-4004-9786</li>
            <li>Online shop: fujicardshop.online</li>
          </ul>
        </div>
        <p>
          Fuji Card Shop does not use WhatsApp for business communication and never contacts customers
          via WhatsApp.
        </p>
        <h2>Official channels</h2>
        <ul>
          <li>
            Online shop:{" "}
            <a href={brand.sourceUrl} target="_blank" rel="noreferrer">
              {brand.sourceUrl}
            </a>
          </li>
          <li>
            Instagram:{" "}
            <a href={brand.instagram} target="_blank" rel="noreferrer">
              @fujicardshop
            </a>
          </li>
          <li>
            Facebook:{" "}
            <a href={brand.facebook} target="_blank" rel="noreferrer">
              facebook.com/Fujicardshop
            </a>
          </li>
          <li>
            Email: <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
