import type { Metadata } from "next";
import Link from "next/link";
import { brand, ourStory, whyFuji } from "@/data/content";

export const metadata: Metadata = {
  title: "Our story",
};

export default function AboutPage() {
  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">About</div>
        <h1>{ourStory.title}</h1>
        <p>{brand.tagline}</p>
      </div>

      <div className="split">
        <div className="prose">
          {ourStory.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            We continuously work to improve our webshop and customer experience, and we truly
            appreciate the trust our customers place in us.
          </p>
          <p>
            Official channels: Instagram{" "}
            <a href={brand.instagram} target="_blank" rel="noreferrer">
              @fujicardshop
            </a>
            , Facebook{" "}
            <a href={brand.facebook} target="_blank" rel="noreferrer">
              Fujicardshop
            </a>
            , email <a href={`mailto:${brand.email}`}>{brand.email}</a>.
          </p>
        </div>
        <div className="story-panel">
          <div className="eyebrow">{brand.trustpilotScore}</div>
          <h2 style={{ fontSize: "2rem", margin: "0.5rem 0 1rem" }}>Trusted worldwide</h2>
          <p style={{ color: "var(--mist)" }}>
            Collectors highlight fast international delivery, secure packaging, verified authenticity,
            and clear communication — including thoughtful extras on some orders.
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <Link href="/store" className="btn btn-primary">
              Browse the shop
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <div className="section-head">
          <div className="eyebrow">Why Fuji Cards?</div>
          <h2>What we stand for</h2>
        </div>
        <div className="why-grid">
          {whyFuji.map((item) => (
            <div key={item.title} className="why-item">
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
