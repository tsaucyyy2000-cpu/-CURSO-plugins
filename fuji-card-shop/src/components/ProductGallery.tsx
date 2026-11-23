"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { ProductArt } from "@/components/ProductArt";
import { detectLanguage } from "@/data/browse";

export function ProductGallery({ product }: { product: Product }) {
  const images = [
    product.image,
    ...(product.gallery ?? []).filter((src) => src && src !== product.image),
  ].filter((src): src is string => Boolean(src));

  const [active, setActive] = useState(0);
  const current = images[active] ?? product.image;
  const language = detectLanguage(product);

  if (images.length === 0) {
    return (
      <div className="product-gallery">
        <div className="product-detail-art">
          <ProductArt product={product} priority language={language} showPhotoChip />
        </div>
        <p className="gallery-caption">Packaging photo pending — confirm language before inquiry.</p>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="product-gallery">
        <div className="product-detail-art">
          <div
            className="product-spotlight"
            style={{ backgroundImage: `url(${product.image})` }}
            aria-hidden="true"
          />
          <ProductArt product={product} priority language={language} showPhotoChip />
        </div>
        <p className="gallery-caption">Front sealed packaging · confirm language and sealed type</p>
      </div>
    );
  }

  const activeProduct: Product = {
    ...product,
    image: current,
  };

  return (
    <div className="product-gallery">
      <div className="product-detail-art">
        <div
          className="product-spotlight"
          style={{ backgroundImage: `url(${current})` }}
          aria-hidden="true"
        />
        <ProductArt product={activeProduct} priority language={language} showPhotoChip />
      </div>
      <div className="gallery-thumbs" role="list" aria-label="Product photos">
        {images.map((src, index) => (
          <button
            key={src}
            type="button"
            className="gallery-thumb"
            role="listitem"
            aria-label={index === 0 ? "Front sealed photo" : `Alternate view ${index}`}
            aria-current={index === active ? "true" : undefined}
            onClick={() => setActive(index)}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading={index === 0 ? "eager" : "lazy"} />
          </button>
        ))}
      </div>
      <p className="gallery-caption">
        {active === 0 ? "Front sealed photo" : `Alternate view ${active}`} · Confirm language and
        sealed type before adding to cart
      </p>
    </div>
  );
}
