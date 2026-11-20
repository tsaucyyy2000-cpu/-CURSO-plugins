"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  browseGames,
  browseLanguages,
  browseProductTypes,
  browseStatuses,
  filterProducts,
  type BrowseFilters,
} from "@/data/browse";
import type { Product } from "@/data/products";

export function BrowseConsole({
  products,
  initialGame,
}: {
  products: Product[];
  initialGame?: BrowseFilters["game"];
}) {
  const [game, setGame] = useState<BrowseFilters["game"]>(initialGame ?? "all");
  const [language, setLanguage] = useState<BrowseFilters["language"]>("japanese");
  const [productType, setProductType] = useState<BrowseFilters["productType"]>("all");
  const [status, setStatus] = useState<BrowseFilters["status"]>("all");

  const filtered = useMemo(
    () => filterProducts(products, { game, language, productType, status }),
    [products, game, language, productType, status],
  );

  return (
    <div className="browse-console">
      <div className="browse-steps">
        <p className="browse-flow">
          Find a set → confirm <strong>language</strong> + sealed type → inspect photos → add the
          correct item
        </p>
        <div className="browse-grid">
          <label className="browse-field">
            <span>1. Game</span>
            <select
              value={game ?? "all"}
              onChange={(event) => setGame(event.target.value as BrowseFilters["game"])}
            >
              {browseGames.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field">
            <span>2. Language</span>
            <select
              value={language ?? "all"}
              onChange={(event) => setLanguage(event.target.value as BrowseFilters["language"])}
            >
              {browseLanguages.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field">
            <span>3. Sealed type</span>
            <select
              value={productType ?? "all"}
              onChange={(event) =>
                setProductType(event.target.value as BrowseFilters["productType"])
              }
            >
              {browseProductTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="browse-field">
            <span>Availability</span>
            <select
              value={status ?? "all"}
              onChange={(event) => setStatus(event.target.value as BrowseFilters["status"])}
            >
              {browseStatuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="browse-result-meta">
        Showing {filtered.length} of {products.length} sealed listings
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <p>No products match this game / language / sealed type combination.</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={() => {
              setGame(initialGame ?? "all");
              setLanguage("all");
              setProductType("all");
              setStatus("all");
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="product-grid" style={{ paddingBottom: "4rem", paddingTop: "1.25rem" }}>
          {filtered.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
