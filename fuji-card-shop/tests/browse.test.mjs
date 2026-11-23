import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_BROWSE_LANGUAGE,
  detectLanguage,
  filterProducts,
  matchesQuery,
  preferEnglishProducts,
  sortProducts,
} from "../src/data/browse.ts";
import { formatPrice } from "../src/data/products.ts";

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
  {
    slug: "en-pokemon-surging-sparks-booster-box",
    name: "Pokémon Scarlet & Violet Surging Sparks Booster Box English",
    price: 0,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#0f766e",
    accentSecondary: "#5eead4",
    shortDescription: "English sealed",
    description: ["English sealed"],
  },
];

describe("browse search/sort/filter", () => {
  it("matches Yu-Gi-Oh query", () => {
    assert.equal(matchesQuery(sample[0], "yu-gi-oh"), true);
    assert.equal(matchesQuery(sample[1], "yu-gi-oh"), false);
  });

  it("hides sold out when buyable", () => {
    const next = filterProducts(sample, { status: "buyable" });
    assert.equal(next.length, 3);
    assert.ok(next.every((item) => item.status !== "out-of-stock"));
  });

  it("sorts by price ascending", () => {
    const next = sortProducts(sample, "price-asc");
    assert.equal(next[0].slug, "en-pokemon-surging-sparks-booster-box");
    assert.equal(next[3].slug, "yugioh-utility-selection-booster-box");
  });

  it("defaults store language to English", () => {
    assert.equal(DEFAULT_BROWSE_LANGUAGE, "english");
  });

  it("filters English language without inventing SKUs", () => {
    const next = filterProducts(sample, { language: "english" });
    assert.equal(next.length, 1);
    assert.equal(next[0].slug, "en-pokemon-surging-sparks-booster-box");
    assert.equal(detectLanguage(next[0]), "english");
  });

  it("prefers English products for featured rails", () => {
    const next = preferEnglishProducts(sample, 2);
    assert.equal(next[0].slug, "en-pokemon-surging-sparks-booster-box");
    assert.equal(next.length, 2);
  });

  it("detects chinese / german / korean language tags", () => {
    assert.equal(
      detectLanguage({
        slug: "zh-pokemon-csv10c-chasing-glory-together-booster-box",
        name: "Pokémon CSV10C Chasing Glory Together Booster Box Simplified Chinese",
        shortDescription: "Chinese sealed",
        description: ["Language: Chinese"],
      }),
      "chinese",
    );
    assert.equal(
      detectLanguage({
        slug: "de-pokemon-temporal-forces-booster-box",
        name: "Pokémon Temporal Forces Booster Box German",
        shortDescription: "German sealed",
        description: ["Language: German"],
      }),
      "german",
    );
    assert.equal(
      detectLanguage({
        slug: "kr-pokemon-inferno-x-booster-box",
        name: "Pokémon Inferno X Booster Box Korean",
        shortDescription: "Korean sealed",
        description: ["Language: Korean"],
      }),
      "korean",
    );
  });
});

describe("formatPrice honesty", () => {
  it("does not invent a sell price for pending listings", () => {
    assert.equal(formatPrice(sample[3]), "Inquire for price");
  });

  it("formats verified USD without a stray space", () => {
    assert.equal(formatPrice(sample[0]), "$80.00");
  });
});
