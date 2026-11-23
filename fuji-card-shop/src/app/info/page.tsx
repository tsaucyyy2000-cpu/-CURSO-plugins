import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Official card information",
  description:
    "Publisher card lists and product pages for reference. These links do not confirm Fuji Card stock or prices.",
};

const sections = [
  {
    title: "Pokémon Card Game",
    blurb: "Japanese product releases and the official card search.",
    links: [
      {
        href: "https://www.pokemon-card.com/products/",
        label: "Products and release information (official site)",
      },
      {
        href: "https://www.pokemon-card.com/card-search/",
        label: "Card search (official site)",
      },
    ],
  },
  {
    title: "ONE PIECE Card Game",
    blurb: "Products and card lists from the official Bandai site.",
    links: [
      {
        href: "https://en.onepiece-cardgame.com/products/",
        label: "Products (official site)",
      },
      {
        href: "https://en.onepiece-cardgame.com/cardlist/",
        label: "Card list (official site)",
      },
    ],
  },
  {
    title: "Yu-Gi-Oh!",
    blurb: "Official Konami card database and product information.",
    links: [
      {
        href: "https://www.db.yugioh-card.com/yugiohdb/",
        label: "Card database (official site)",
      },
      {
        href: "https://www.konami.com/yugioh/",
        label: "Card game information (official site)",
      },
    ],
  },
];

export default function InfoPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Reference</div>
        <h1>Official card information</h1>
        <p>
          Browse the publishers’ own websites for current product and card details. These external
          pages are for reference; they do not confirm Fuji Card stock, prices, or preorders.
        </p>
      </div>

      <div className="stub-note" style={{ marginBottom: "1.5rem" }}>
        For availability of a sealed SKU on this storefront, open the product page or inquire on
        WhatsApp. Do not treat publisher pages as Fuji inventory.
      </div>

      <div className="announce-list">
        {sections.map((section) => (
          <article key={section.title} className="announce-item">
            <div className="announce-date">Official</div>
            <div className="prose">
              <h2 style={{ fontSize: "1.25rem", marginBottom: "0.35rem" }}>{section.title}</h2>
              <p>{section.blurb}</p>
              <ul>
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer">
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>

      <div style={{ marginTop: "2rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
        <Link href="/store" className="btn btn-primary">
          Browse Fuji sealed store
        </Link>
        <Link href="/store?q=yu-gi-oh" className="btn btn-secondary">
          Yu-Gi-Oh! sealed lane
        </Link>
        <Link href="/contact" className="btn btn-secondary">
          Contact
        </Link>
      </div>
    </div>
  );
}
