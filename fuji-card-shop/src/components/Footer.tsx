import Link from "next/link";
import { brand, footerLinks } from "@/data/content";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <h2>{brand.name}</h2>
          <p>{brand.tagline}</p>
          <p style={{ marginTop: "0.85rem" }}>{brand.address}</p>
          <p style={{ marginTop: "0.45rem" }}>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
          </p>
          <p style={{ marginTop: "0.45rem", color: "var(--mist)" }}>{brand.currencyNote}</p>
        </div>
        <div>
          <h3>Policies</h3>
          <ul>
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Official channels</h3>
          <ul>
            <li>
              <a href={brand.instagram} target="_blank" rel="noreferrer">
                Instagram @fujicardshop
              </a>
            </li>
            <li>
              <a href={brand.facebook} target="_blank" rel="noreferrer">
                Facebook / Fujicardshop
              </a>
            </li>
            <li>
              {brand.trustpilotScore} {brand.trustpilotLabel}
            </li>
            <li>
              <a href={`https://${brand.domain}`} rel="noreferrer">
                {brand.domain}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
