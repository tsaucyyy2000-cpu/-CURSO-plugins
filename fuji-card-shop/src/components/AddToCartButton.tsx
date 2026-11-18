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
  const [added, setAdded] = useState(false);
  const disabled = status === "out-of-stock";

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={disabled}
      onClick={() => {
        addItem(slug, 1);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1400);
      }}
    >
      {disabled ? "Out of stock" : added ? "Added to cart" : status === "preorder" ? "Pre-order" : "Add to cart"}
    </button>
  );
}
