import type { Metadata } from "next";
import Link from "next/link";
import { getGalleryImages } from "@/data/resolveProducts";

export const metadata: Metadata = {
  title: "Product photos",
};

export default function GalleryPage() {
  const images = getGalleryImages();

  return (
    <div className="shell" style={{ paddingBottom: "4rem" }}>
      <div className="page-hero">
        <div className="eyebrow">Archive</div>
        <h1>Product photos</h1>
        <p>
          Photography pulled from the live Fuji Card Shop catalog. Current CDN assets are hotlink
          protected from this environment, so these files were recovered via public Wayback Machine
          snapshots of the shop&apos;s media library and wired into the rebuild.
        </p>
      </div>

      <div className="product-grid">
        {images.map((image) =>
          image.href ? (
            <Link key={image.src} href={image.href} className="product-tile">
              <div className="product-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="product-photo" src={image.src} alt={image.alt} loading="lazy" />
              </div>
              <div className="product-meta">
                <h3>{image.alt}</h3>
              </div>
            </Link>
          ) : (
            <div className="product-tile" key={image.src}>
              <div className="product-art">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="product-photo" src={image.src} alt={image.alt} loading="lazy" />
              </div>
              <div className="product-meta">
                <h3>{image.alt}</h3>
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
