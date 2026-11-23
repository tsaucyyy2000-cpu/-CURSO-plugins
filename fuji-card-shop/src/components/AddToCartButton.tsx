"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart";
import type { ProductStatus } from "@/data/products";

export function AddToCartButton({
  slug,
  status,
}: {
  slug: string;
  status: ProductStatus;
}) {
  const { addItem } = useCart();
  const [message, setMessage] = useState<string | null>(null);
  const disabled = status === "out-of-stock";

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={disabled}
      aria-live="polite"
      onClick={() => {
        const result = addItem(slug, 1);
        if (!result.ok) {
          setMessage(
            result.reason === "out-of-stock"
              ? "Out of stock"
              : "Could not add — check availability",
          );
          window.setTimeout(() => setMessage(null), 1800);
          return;
        }
        setMessage(result.capped ? "Added (qty capped to stock)" : "Added to cart");
        window.setTimeout(() => setMessage(null), 1400);
      }}
    >
      {disabled
        ? "Out of stock"
        : message
          ? message
          : status === "preorder"
            ? "Pre-order"
            : "Add to cart"}
    </button>
  );
}
