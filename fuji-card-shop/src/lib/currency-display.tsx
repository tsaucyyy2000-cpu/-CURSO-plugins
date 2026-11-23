/**
 * Catalog amounts stay USD. There is no GBP/FX display toggle in the storefront
 * chrome — Trey wants English *product language*, not a currency switcher.
 * Do not invent FX rates. Settlement currency (if any) is confirmed on inquiry.
 */

export const CATALOG_CURRENCY = "USD" as const;

export const catalogCurrencyNote =
  "Catalog prices are listed in USD when verified. No FX conversion is applied on this site.";
