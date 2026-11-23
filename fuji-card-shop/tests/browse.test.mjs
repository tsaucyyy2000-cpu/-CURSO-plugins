import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  filterProducts,
  matchesQuery,
  sortProducts,
} from "../src/data/browse.ts";

const sample = [
  {
    slug: "yugioh-utility-selection-booster-box",
    name: "Yu-Gi-Oh! OCG UTILITY SELECTION Booster Box Japanese Trading Card",
    price: 80,
    currency: "USD",
    category: "other-tcg",
    status: "available",
    accent: "#000",
    accentSecondary: "#111",
    shortDescription: "Japanese Yu-Gi-Oh!",
    description: ["Japanese Yu-Gi-Oh!"],
  },
  {
    slug: "op-18-the-dominance-of-god-booster-box",
    name: "OP-18 The Dominance of God Booster Box",
    price: 76,
    currency: "USD",
    category: "one-piece",
    status: "preorder",
    accent: "#000",
    accentSecondary: "#111",
    shortDescription: "ONE PIECE",
    description: ["ONE PIECE"],
    releaseDate: "2026-12-01",
  },
  {
    slug: "sold-out-box",
    name: "Sold Out Box",
    price: 10,
    currency: "USD",
    category: "pokemon",
    status: "out-of-stock",
    accent: "#000",
    accentSecondary: "#111",
    shortDescription: "gone",
    description: ["gone"],
  },
];

describe("browse search/sort/filter", () => {
  it("matches Yu-Gi-Oh query", () => {
    assert.equal(matchesQuery(sample[0], "yu-gi-oh"), true);
    assert.equal(matchesQuery(sample[1], "yu-gi-oh"), false);
  });

  it("hides sold out when buyable", () => {
    const next = filterProducts(sample, { status: "buyable" });
    assert.equal(next.length, 2);
    assert.ok(next.every((item) => item.status !== "out-of-stock"));
  });

  it("sorts by price ascending", () => {
    const next = sortProducts(sample, "price-asc");
    assert.equal(next[0].slug, "sold-out-box");
    assert.equal(next[2].slug, "yugioh-utility-selection-booster-box");
  });
});
