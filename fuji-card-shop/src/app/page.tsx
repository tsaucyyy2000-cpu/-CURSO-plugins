import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ReleaseStatus } from "@/components/ReleaseStatus";
import { SealedShelf } from "@/components/SealedShelf";
import { TrustStrip } from "@/components/TrustStrip";
import { WhatsAppInquiryLink } from "@/components/WhatsAppInquiryLink";
import {
  announcements,
  brand,
  collectionLanes,
  heroReleases,
  heroSpotlight,
  ourStory,
  whyFuji,
} from "@/data/content";
import {
  getFeaturedProductsResolved,
  getProductBySlug,
  getSaleProductsResolved,
} from "@/data/resolveProducts";
import { formatPrice, hasListedPrice } from "@/data/products";
import { whatsappLinks } from "@/lib/whatsapp";

export default function HomePage() {
  const featured = getFeaturedProductsResolved().slice(0, 18);
  const sale = getSaleProductsResolved().slice(0, 12);
  const spotlight = getProductBySlug(heroSpotlight.href.replace("/product/", ""));
  const spotlightPriced = spotlight ? hasListedPrice(spotlight) : false;
  const spotlightPrice = spotlight ? formatPrice(spotlight) : null;

  return (
    <>
      <section className="hero hero-merged">
        <div className="hero-media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-banner-img" src={heroSpotlight.image} alt="" />
          <div className="hero-spark" />
        </div>
        <div className="shell hero-copy">
          <p className="hero-brand">{brand.name}</p>
          <div className="hero-kicker">
            {heroSpotlight.setCode} · {heroSpotlight.language} · {brand.trustpilotScore} Trustpilot
          </div>
          <h1>
            {heroSpotlight.title}
          </h1>
          <p className="hero-lead">{heroSpotlight.lead}</p>
          {spotlightPrice ? (
            <p className={`hero-price${spotlightPriced ? "" : " price-pending"}`}>
              {spotlightPrice}
              <span>
                {spotlightPriced
                  ? brand.currencyNote
                  : "USD sell price pending — inquire on WhatsApp. No invented price."}
              </span>
            </p>
          ) : null}
          <div className="hero-actions">
            <Link href={heroSpotlight.href} className="btn btn-primary">
              View English box
            </Link>
            <Link href="/store" className="btn btn-secondary">
              Browse English catalog
            </Link>
            <WhatsAppInquiryLink href={whatsappLinks.general()}>
              WhatsApp inquiry
            </WhatsAppInquiryLink>
          </div>
        </div>
      </section>

      <TrustStrip />

      <section className="section section-tight">
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Collections</div>
            <h2>Find your next sealed set</h2>
            <p>Game lanes from the Fuji Card domain — catalog depth from the sealed shop.</p>
          </div>
          <div className="lane-grid">
            {collectionLanes.map((lane) => (
              <Link key={lane.href} href={lane.href} className="lane-card">
                <strong>{lane.title}</strong>
                <span>{lane.blurb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <SealedShelf products={featured} />

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Featured releases</div>
            <h2>What&apos;s landing next</h2>
            <p>
              English sealed up front for USA collectors — Japanese OP boxes remain one Language
              filter away.
            </p>
          </div>
          <div className="release-rail">
            {heroReleases.map((release) => (
              <Link key={release.href + release.title} href={release.href} className="release-chip">
                <ReleaseStatus tone={release.status} />
                <strong>{release.title}</strong>
                <span>{release.subtitle}</span>
                <span className="release-config">{release.config}</span>
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
          <div className="story-panel lit-panel">
            <div className="eyebrow">Why collectors choose us</div>
            <h3 style={{ fontSize: "2rem", margin: "0.6rem 0 1rem" }}>
              Honest service from Japan
            </h3>
            <p>
              Fair pricing, careful packaging, reliable shipping, and clear communication — now on{" "}
              {brand.domain}.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Catalog</div>
            <h2>Featured products</h2>
            <p>
              English packaging photos first when available — Japanese sealed stays in the Language
              filter.
            </p>
          </div>
          <div className="product-grid">
            {featured.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Offers</div>
            <h2>Highlighted picks</h2>
            <p>Sale and featured-offer items from the Fuji sealed catalog.</p>
          </div>
          <div className="product-grid">
            {sale.map((product, index) => (
              <ProductCard key={product.slug} product={product} index={index} />
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
        <div className="shell split">
          <div>
            <div className="section-head">
              <div className="eyebrow">Wholesale</div>
              <h2>Apex TCG planning catalog</h2>
              <p>
                200 sealed SKUs with unit and B2B case planning prices — planning estimates labeled
                clearly, never as live retail checkout.
              </p>
            </div>
            <div className="hero-actions">
              <Link href="/apex" className="btn btn-primary">
                Open Apex wholesale
              </Link>
              <Link href="/apex/cases" className="btn btn-secondary">
                Case pricing
              </Link>
              <WhatsAppInquiryLink href={whatsappLinks.wholesale()}>
                Wholesale WhatsApp inquiry
              </WhatsAppInquiryLink>
            </div>
          </div>
          <div className="story-panel lit-panel">
            <div className="eyebrow">Quote-led</div>
            <h3 style={{ fontSize: "1.8rem", margin: "0.5rem 0 1rem" }}>
              Planning estimates, not live checkout
            </h3>
            <p>
              Confirm stock, case pack, and final wholesale terms before quoting. Source DOCX/PDF
              downloads live under Wholesale docs.
            </p>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="shell">
          <div className="section-head">
            <div className="eyebrow">Trust</div>
            <h2>Why Fuji Card?</h2>
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
