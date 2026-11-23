/**
 * Legacy URL aliases from the previous www.fuji-card.com (japan2uk-style)
 * storefront. Permanent redirects keep bookmarks and shared links working.
 */
export const legacyProductRedirects: { source: string; destination: string }[] = [
  { source: "/product/jp-m4-bb", destination: "/product/m4-ninja-spinner-booster-box" },
  { source: "/product/jp-m2a-bb", destination: "/product/m2a-mega-dream-ex-booster-box" },
  { source: "/product/jp-m3-bb", destination: "/product/m3-munikis-zero-booster-box" },
  {
    source: "/product/jp-op15-bb",
    destination: "/product/op-15-adventure-on-kamis-island-booster-box",
  },
  { source: "/product/jp-eb04-bb", destination: "/product/eb-04-egghead-crisis-booster-box" },
  { source: "/product/pk-151-bb", destination: "/product/en-pokemon-151-booster-bundle" },
  {
    source: "/product/jp-op14-bb",
    destination: "/product/op-14-the-azure-seas-seven-booster-box",
  },
  {
    source: "/product/jp-op14-case",
    destination: "/product/op-14-the-azure-seas-seven-sealed-case",
  },
  {
    source: "/product/jp-op18-bb",
    destination: "/product/op-18-the-dominance-of-god-booster-box",
  },
  {
    source: "/product/jp-op18-case",
    destination: "/product/op-18-the-dominance-of-god-sealed-case",
  },
];

export const legacyPathRedirects: { source: string; destination: string }[] = [
  { source: "/products", destination: "/store" },
  { source: "/products/:path*", destination: "/store" },
  { source: "/login", destination: "/admin" },
  { source: "/account", destination: "/admin" },
  { source: "/info", destination: "/about" },
];
