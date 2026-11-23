import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  addWithStockCap,
  clampLineQuantity,
  maxPurchasableQty,
  reconcileCartLines,
} from "../src/lib/cart-validation.ts";

describe("cart-validation", () => {
  it("caps quantity to catalog stock", () => {
    const product = {
      slug: "op-18",
      name: "OP-18",
      price: 76,
      status: "available",
      stock: 2,
    };
    const result = clampLineQuantity(product, 5);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.quantity, 2);
      assert.equal(result.capped, true);
    }
  });

  it("rejects out-of-stock adds", () => {
    const product = {
      slug: "gone",
      name: "Gone",
      price: 10,
      status: "out-of-stock",
      stock: 0,
    };
    const { lines, result } = addWithStockCap([], product, 1);
    assert.equal(result.ok, false);
    assert.equal(lines.length, 0);
  });

  it("reconciles missing and overstock lines fail-closed", () => {
    const catalog = new Map([
      [
        "a",
        { slug: "a", name: "A", price: 1, status: "available", stock: 1 },
      ],
    ]);
    const { lines, removed, capped } = reconcileCartLines(
      [
        { slug: "a", quantity: 4 },
        { slug: "missing", quantity: 2 },
      ],
      (slug) => catalog.get(slug),
    );
    assert.deepEqual(lines, [{ slug: "a", quantity: 1 }]);
    assert.deepEqual(removed, ["missing"]);
    assert.deepEqual(capped, ["a"]);
  });

  it("uses soft max when stock is omitted", () => {
    assert.equal(
      maxPurchasableQty({
        slug: "x",
        name: "X",
        price: 1,
        status: "preorder",
      }),
      99,
    );
  });
});
