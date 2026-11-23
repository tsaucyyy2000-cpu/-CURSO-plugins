"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import {
  DEFAULT_BROWSE_LANGUAGE,
  browseGames,
  browseLanguages,
  browseProductTypes,
  browseSorts,
  browseStatuses,
  collectionSearchPresets,
  filterProducts,
  sortProducts,
  type BrowseFilters,
  type BrowseSort,
} from "@/data/browse";
import type { Product } from "@/data/products";

export function BrowseConsole({
  products,
  initialGame,
  initialQuery = "",
  initialSort = "featured",
  initialStatus = "all",
  initialLanguage = DEFAULT_BROWSE_LANGUAGE,
}: {
  products: Product[];
  initialGame?: BrowseFilters["game"];
  initialQuery?: string;
  initialSort?: BrowseSort;
  initialStatus?: BrowseFilters["status"];
  initialLanguage?: BrowseFilters["language"];
}) {
  const [game, setGame] = useState<BrowseFilters["game"]>(initialGame ?? "all");
  const [language, setLanguage] = useState<BrowseFilters["language"]>(
    initialLanguage ?? DEFAULT_BROWSE_LANGUAGE,
  );
  const [productType, setProductType] = useState<BrowseFilters["productType"]>("all");
  const [status, setStatus] = useState<BrowseFilters["status"]>(initialStatus ?? "all");
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<BrowseSort>(initialSort);

  const filtered = useMemo(() => {
    const matched = filterProducts(products, {
      game,
      language,
      productType,
      status,
      query,
    });
    return sortProducts(matched, sort);
  }, [products, game, language, productType, status, query, sort]);

  function reset() {
    setGame(initialGame ?? "all");
    setLanguage(initialLanguage ?? DEFAULT_BROWSE_LANGUAGE);
    setProductType("all");
    setStatus(initialStatus ?? "all");
    setQuery(initialQuery);
    setSort(initialSort);
  }

  const languageHint =
    language === "english"
      ? " · English first — switch Language for Japanese"
      : language === "japanese"
        ? " · Japanese sealed"
        : language === "all"
          ? " · all languages"
          : "";

  return (
    <div className="browse-console">
      <div className="browse-steps">
        <p className="browse-flow">
          Search or filter → confirm <strong>language</strong> + sealed type → inspect photos →
          inquire or add the correct SKU
        </p>
        <div className="browse-presets" aria-label="Collection shortcuts">
          {collectionSearchPresets.map((preset) => (
            <button
              key={preset.href}
              type="button"
              className="confirm-chip browse-preset"
              onClick={() => {
                setQuery(preset.query);
                setGame("all");
                // Cross-language collection searches should not hide JP OCG behind EN filter.
                setLanguage("all");
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="browse-grid">
          <label className="browse-field browse-field-wide">
            <span>Search</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, set, Yu-Gi-Oh, OP-18…"
              aria-label="Search catalog"
            />
          </label>
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
              value={language ?? DEFAULT_BROWSE_LANGUAGE}
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
          <label className="browse-field">
            <span>Sort</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as BrowseSort)}
            >
              {browseSorts.map((option) => (
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
        {query.trim() ? ` · search “${query.trim()}”` : ""}
        {languageHint}
      </div>

      {filtered.length === 0 ? (
        <div className="panel empty-state">
          <p>No products match this search / filter combination.</p>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ marginTop: "1rem" }}
            onClick={reset}
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
