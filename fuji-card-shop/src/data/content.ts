export const brand = {
  name: "FUJI CARD",
  legalName: "FUJI CARD",
  domain: "www.fuji-card.com",
  tagline: "English & Japanese sealed TCG — shipped from Japan",
  email: "support@fujicardshop.com",
  phone: "+81 47-707-3321",
  /** Authorized store WhatsApp for availability / wholesale inquiries (not payment). */
  whatsappE164: "12109018399",
  whatsappDisplay: "+1 210-901-8399",
  address: "2-12-24 MinatoCyo, MinatoCyo Nihonbashi Building, 6F, 273-0011, Funabashi City, Japan",
  instagram: "https://www.instagram.com/fujicardshop/",
  facebook: "https://www.facebook.com/Fujicardshop/",
  trustpilotScore: "4.9★",
  trustpilotLabel: "Trustpilot rated",
  sourceUrl: "https://www.fuji-card.com/",
  currencyNote: "Catalog prices are USD when verified. Product language defaults to English.",
};

export const navLinks = [
  { href: "/store", label: "Store" },
  { href: "/category/pokemon", label: "Pokémon" },
  { href: "/category/one-piece", label: "ONE PIECE" },
  { href: "/category/other-tcg", label: "Other TCG" },
  { href: "/store?q=yu-gi-oh&language=all", label: "Yu-Gi-Oh!" },
  { href: "/apex", label: "Wholesale" },
  { href: "/info", label: "Card lists" },
  { href: "/gallery", label: "Photos" },
  { href: "/shipping", label: "Shipping" },
  { href: "/about", label: "Our story" },
  { href: "/contact", label: "Contact" },
];

export const footerLinks = [
  { href: "/apex", label: "Apex TCG wholesale" },
  { href: "/apex/catalog", label: "Apex planning catalog" },
  { href: "/apex/cases", label: "Apex B2B case pricing" },
  { href: "/apex/wholesale", label: "Wholesale docs & quotes" },
  { href: "/info", label: "Official card lists" },
  { href: "/payment-methods", label: "Payment methods" },
  { href: "/shipping", label: "Shipping & taxes" },
  { href: "/right-to-cancel", label: "Right to cancel" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/privacy", label: "Privacy policy" },
  { href: "/specified-commercial-transaction-act", label: "Specified Commercial Transaction Act" },
  { href: "/fake-accounts", label: "Beware of fake accounts" },
  { href: "/contact", label: "Contact" },
  { href: "/admin", label: "Staff login" },
];

export const heroSpotlight = {
  setCode: "SV08",
  title: "Surging Sparks",
  language: "English",
  sealedType: "Booster box",
  href: "/product/en-pokemon-surging-sparks-booster-box",
  image: "/images/products/en-pokemon-surging-sparks-booster-box.jpg",
  lead: "English sealed first — confirm packaging photos, then inquire. Japanese sealed stays one Language filter away.",
};

export const heroReleases = [
  {
    title: "English sealed catalog",
    subtitle: "225 EN SKUs with packaging evidence",
    href: "/store",
    status: "live" as const,
    config: "Store defaults to English",
  },
  {
    title: "Prismatic Evolutions ETB",
    subtitle: "Elite Trainer Box · English",
    href: "/product/en-pokemon-prismatic-evolutions-elite-trainer-box",
    status: "live" as const,
    config: "Packaging photo on file",
  },
  {
    title: "OP-18 The Dominance of God",
    subtitle: "Booster box · Japanese",
    href: "/product/op-18-the-dominance-of-god-booster-box",
    status: "preorder" as const,
    config: "USD catalog price synced",
  },
  {
    title: "OP-14 The Azure Sea’s Seven",
    subtitle: "Box + sealed case · distinct photos",
    href: "/product/op-14-the-azure-seas-seven-sealed-case",
    status: "live" as const,
    config: "Case carton face verified",
  },
];

export const collectionLanes = [
  {
    title: "Pokémon",
    href: "/category/pokemon",
    blurb: "English sealed first, plus Japanese boosters and Center sets.",
  },
  {
    title: "ONE PIECE",
    href: "/category/one-piece",
    blurb: "Boxes and factory sealed cases with distinct photos.",
  },
  {
    title: "Yu-Gi-Oh!",
    href: "/store?q=yu-gi-oh&language=all",
    blurb: "Verified OCG / EN sealed boxes already in the catalog.",
  },
  {
    title: "Other TCG",
    href: "/category/other-tcg",
    blurb: "UNION ARENA, Weiss, hololive, Gundam, Lorcana, and more.",
  },
];

export const ourStory = {
  title: "Our story",
  paragraphs: [
    "Fuji Card is an online store based in Japan, dedicated to selling authentic Japanese and English sealed trading cards to collectors worldwide.",
    "We aim to offer fair and competitive prices while providing careful packaging, reliable shipping, and clear communication.",
    "Our goal is simple: to serve collectors and players with honesty, respect, and the best service we can deliver.",
  ],
};

export const whyFuji = [
  {
    title: "Catalog packaging photos",
    body: "Listings show packaging photography when available. Closest-line stand-ins are labeled so you can confirm sealed type before checkout.",
  },
  {
    title: "Ships from Japan",
    body: "Dispatched from Funabashi with tracked, insured express carriers — FedEx, DHL, or UPS — so packages arrive collector-ready.",
  },
  {
    title: "Trusted by collectors",
    body: "4.9★ Trustpilot rating. Customers call out fast international delivery, secure packaging, and verified authenticity.",
  },
  {
    title: "Clear policies",
    body: "Transparent shipping, tariff, cancellation, and import-charge guidance — including the 12.5% US tariff collected at checkout on applicable goods.",
  },
];

export const announcements = [
  {
    slug: "domain-merge",
    title: "fuji-card.com now serves the full Fuji sealed catalog",
    date: "Live",
    excerpt:
      "One storefront: Japanese + English sealed SKUs, verified OP-14 box/case photography, OP-18 catalog prices, and the cart → checkout demo — on www.fuji-card.com.",
  },
  {
    slug: "us-tariff-update",
    title: "U.S. Tariff Update: 12.5% on Orders from Japan (Effective July 24, 2026)",
    date: "24 Jul",
    excerpt:
      "We collect our configured US tariff of 12.5% on applicable goods. You can see the collected amount in your order summary; shipping and handling are listed separately.",
  },
  {
    slug: "eb-05-arrival",
    title: "New Arrival! ONE PIECE CARD GAME EB-05 – ONE PIECE Heroines Edition vol.2",
    date: "New",
    excerpt:
      "The Japanese EB-05 Booster Boxes have arrived. Soft pink packaging, a new Nico Robin Leader, and heroine artwork including Nami by Kentaro Yabuki.",
  },
  {
    slug: "30th-celebration-arrival",
    title: "New Arrivals! Pokémon 30th CELEBRATION",
    date: "New",
    excerpt:
      "30th CELEBRATION Booster Boxes and the Premium Deck Set – Espeon & Umbreon have arrived. Orders are shipping in batches.",
  },
];

export const shippingTransit = [
  { destination: "North America", days: "2–4" },
  { destination: "Europe", days: "3–6" },
  { destination: "Asia", days: "2–5" },
  { destination: "Oceania", days: "3–6" },
  { destination: "South America", days: "3–6" },
];

export const commercialTransaction = [
  { label: "Name of the Business", value: "FUJI CARD" },
  { label: "Email Address", value: "support@fujicardshop.com" },
  {
    label: "Sales Price",
    value: "The price displayed on each product page at the time the order is placed.",
  },
  {
    label: "Additional Charges",
    value:
      "Shipping charges are displayed at checkout. Customs duties, import taxes, VAT, GST, handling fees, and other destination charges are generally the recipient’s responsibility except where collected at checkout.",
  },
  {
    label: "Accepted Payment Methods",
    value: "Credit Card / Google Pay / Apple Pay / PayPal (stubbed in this rebuild)",
  },
  {
    label: "Payment Period",
    value: "Payment is processed immediately when the order is placed.",
  },
  {
    label: "Delivery Time",
    value:
      "Orders normally process and ship within 1 to 5 business days after payment. Pre-orders normally ship within 1 to 3 business days after the official release date.",
  },
];
