import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import {
  announcements,
  brand,
  heroReleases,
  ourStory,
  whyFuji,
} from "@/data/content";
import { getFeaturedProducts, getSaleProducts } from "@/data/products";

export default function HomePage() {
  const featured = getFeaturedProducts().slice(0, 12);
  const sale = getSaleProducts().slice(0, 10);

  return (
    <>
      <section className="hero">
        <div className="hero-media" aria-hidden="true" />
        <div className="shell hero-copy">
          <div className="hero-kicker">
            {brand.trustpilotScore} · Ships from Japan
          </div>
          <h1>
            Fuji <em>Card</em> Shop
          </h1>
          <p className="hero-lead">
            Authentic Japanese Pokémon, ONE PIECE, and sealed TCG — carefully packed
            and sent worldwide with tracked express shipping.
          </p>
          <div className="hero-actions">
            <Link href="/store" className="btn btn-primary">
              Shop sealed products
            </Link>
            <Link href="/category/pokemon" className="btn btn-secondary">
              Browse Pokémon
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Featured releases</div>
            <h2>What&apos;s landing next</h2>
            <p>Pre-order windows and recent arrivals mirrored from the live shop homepage.</p>
          </div>
          <div className="release-rail">
            {heroReleases.map((release) => (
              <Link key={release.href} href={release.href} className="release-chip">
                <strong>{release.title}</strong>
                <span>{release.subtitle}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell split">
          <div>
            <div className="section-head">
              <div className="eyebrow">About</div>
              <h2>{ourStory.title}</h2>
            </div>
            <div className="prose">
              {ourStory.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <Link href="/about" className="btn btn-secondary">
                Read our story
              </Link>
            </div>
          </div>
          <div className="story-panel">
            <div className="eyebrow">Why collectors choose us</div>
            <h3 style={{ fontSize: "2rem", margin: "0.6rem 0 1rem" }}>
              Honest service from Japan
            </h3>
            <p style={{ color: "var(--mist)" }}>
              Fair pricing, careful packaging, reliable shipping, and clear communication —
              the same promise published on the live Fuji Card Shop profile.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Catalog</div>
            <h2>Featured products</h2>
            <p>Homepage selections including pre-orders, anniversary sets, and Pokémon Center exclusives.</p>
          </div>
          <div className="product-grid">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Offers</div>
            <h2>SALE Products</h2>
            <p>Highlighted sale and featured-offer items from the live storefront.</p>
          </div>
          <div className="product-grid">
            {sale.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">News</div>
            <h2>Announcements</h2>
          </div>
          <div className="announce-list">
            {announcements.map((item) => (
              <article key={item.slug} className="announce-item">
                <div className="announce-date">{item.date}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Trust</div>
            <h2>Why Fuji Cards?</h2>
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
      </section>
    </>
  );
}
