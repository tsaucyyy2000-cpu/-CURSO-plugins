export type CategorySlug =
  | "pokemon"
  | "one-piece"
  | "other-tcg"
  | "weiss-schwarz"
  | "union-arena"
  | "hololive-cg"
  | "gundam";

export type ProductStatus = "available" | "preorder" | "out-of-stock" | "sale";

export type Product = {
  slug: string;
  name: string;
  price: number;
  compareAt?: number;
  currency: "USD";
  category: CategorySlug;
  status: ProductStatus;
  badge?: string;
  accent: string;
  accentSecondary: string;
  releaseDate?: string;
  shipNote?: string;
  stock?: number;
  shortDescription: string;
  description: string[];
  features?: string[];
  contents?: string[];
  weight?: string;
  dimensions?: string;
  featured?: boolean;
  onSale?: boolean;
  /** Local path under /public, e.g. /images/products/M2a-bb.jpg */
  image?: string;
  imageRef?: string;
  imageMatchQuality?: "exact" | "closest-line";
  imageNote?: string;
};

export const categories: {
  slug: CategorySlug;
  name: string;
  href: string;
  description: string;
}[] = [
  {
    slug: "pokemon",
    name: "Pokémon",
    href: "/category/pokemon",
    description: "Japanese Pokémon TCG booster boxes, special sets, and Pokémon Center exclusives.",
  },
  {
    slug: "one-piece",
    name: "ONE PIECE",
    href: "/category/one-piece",
    description: "Official Japanese ONE PIECE CARD GAME boxes, sealed cases, and promos.",
  },
  {
    slug: "other-tcg",
    name: "Other TCG",
    href: "/category/other-tcg",
    description: "UNION ARENA, Weiss Schwarz, hololive, Gundam, Palworld, Yu-Gi-Oh!, and more.",
  },
  {
    slug: "weiss-schwarz",
    name: "Weiss Schwarz",
    href: "/category/weiss-schwarz",
    description: "Japanese Weiss Schwarz booster boxes and sealed cases.",
  },
  {
    slug: "union-arena",
    name: "UNION ARENA",
    href: "/category/union-arena",
    description: "Japanese UNION ARENA sets across anime and game crossovers.",
  },
  {
    slug: "hololive-cg",
    name: "hololive OFFICIAL CG",
    href: "/category/hololive-cg",
    description: "Official hololive card game starters and booster volumes.",
  },
  {
    slug: "gundam",
    name: "Gundam Card Game",
    href: "/category/gundam",
    description: "Japanese Gundam Card Game boosters, extras, and starters.",
  },
];

export const products: Product[] = [
  {
    slug: "m7-aura-seeker-booster-box",
    name: "[Pre-Order Ship Nov 30] M7 Aura Seeker Booster Box Japanese Pokemon Card",
    price: 82,
    currency: "USD",
    category: "pokemon",
    status: "preorder",
    badge: "Pre-Order",
    accent: "#1f6feb",
    accentSecondary: "#7dd3fc",
    releaseDate: "November 27",
    shipNote: "Ships Nov 30",
    shortDescription: "Upcoming Japanese Pokémon Mega-era booster box.",
    description: [
      "Condition: Sealed New (with shrink wrap).",
      "Language: Japanese. Sales unit: individual booster boxes in line with The Pokémon Company’s policy.",
      "Pre-order for M7 Aura Seeker — release window late November with dispatch from Japan shortly after.",
    ],
    features: [
      "Japanese Pokémon TCG Mega Evolution series",
      "Sealed new booster box",
      "Tracked & insured express shipping from Japan",
    ],
    featured: true,
    imageRef: "https://www.fujicardshop.com/product-category/pokemon/",
  },
  {
    slug: "op-18-the-dominance-of-god-booster-box",
    name: "[Pre-Order Ship Nov 24] OP-18 The Dominance of God Booster Box Japanese ONE PIECE CARD",
    price: 88,
    currency: "USD",
    category: "one-piece",
    status: "preorder",
    badge: "Pre-Order",
    accent: "#c2410c",
    accentSecondary: "#fbbf24",
    releaseDate: "November 21",
    shipNote: "Ships Nov 24",
    shortDescription: "OP-18 The Dominance of God Warriors Japanese booster box.",
    description: [
      "Condition: Sealed New.",
      "Language: Japanese ONE PIECE CARD GAME.",
      "Pre-order for OP-18 — release on November 21 with shipping from Japan shortly after.",
    ],
    featured: true,
  },
  {
    slug: "op-18-the-dominance-of-god-sealed-case",
    name: "[Pre-Order Ship Nov 24] OP-18 The Dominance of God Sealed Case (12 boxes) Japanese ONE PIECE CARD",
    price: 1358,
    currency: "USD",
    category: "one-piece",
    status: "preorder",
    badge: "Pre-Order · Case",
    accent: "#9a3412",
    accentSecondary: "#fdba74",
    releaseDate: "November 21",
    shipNote: "Ships Nov 24",
    shortDescription: "Factory sealed case of 12 OP-18 booster boxes.",
    description: [
      "Sealed case containing 12 Japanese OP-18 The Dominance of God booster boxes.",
      "Ideal for shops and serious collectors seeking sealed-case provenance.",
    ],
    featured: true,
    onSale: true,
  },
  {
    slug: "eb-05-one-piece-heroines-edition-vol-2-booster-box",
    name: "EB-05 ONE PIECE Heroines Edition vol.2 Booster Box Japanese ONE PIECE CARD",
    price: 88,
    currency: "USD",
    category: "one-piece",
    status: "available",
    badge: "New Arrival",
    accent: "#db2777",
    accentSecondary: "#f9a8d4",
    releaseDate: "October 31",
    shortDescription: "Heroine-focused ONE PIECE extra booster with soft pink packaging.",
    description: [
      "Japanese EB-05 ONE PIECE Heroines Edition vol.2 booster boxes have arrived at Fuji Card Shop.",
      "Highlights include a new Nico Robin Leader card, heroine artwork featuring Baby 5, Boa Hancock, and Perona, and Nami artwork by Kentaro Yabuki.",
    ],
    features: [
      "New Nico Robin Leader card",
      "Heroine alternate art line-up",
      "Distinctive pink packaging",
    ],
    featured: true,
    onSale: true,
  },
  {
    slug: "eb-05-one-piece-heroines-edition-vol-2-sealed-case",
    name: "EB-05 ONE PIECE Heroines Edition vol.2 Sealed Case (12 boxes) Japanese ONE PIECE CARD",
    price: 1290,
    currency: "USD",
    category: "one-piece",
    status: "available",
    badge: "Case",
    accent: "#be185d",
    accentSecondary: "#fbcfe8",
    shortDescription: "Sealed case of 12 EB-05 Heroines Edition vol.2 boxes.",
    description: [
      "Factory sealed case (12 boxes) of EB-05 ONE PIECE Heroines Edition vol.2.",
    ],
    onSale: true,
  },
  {
    slug: "m6a-30th-celebration-booster-box",
    name: "M6a 30th CELEBRATION booster box Japanese Pokemon Card",
    price: 147,
    currency: "USD",
    category: "pokemon",
    status: "available",
    badge: "Anniversary",
    accent: "#eab308",
    accentSecondary: "#fef08a",
    releaseDate: "September 16",
    shortDescription: "Pokémon 30th CELEBRATION anniversary booster box.",
    description: [
      "Special anniversary arrival celebrating 30 years of Pokémon.",
      "Pikachu, Mew, and Mewtwo take center stage on packaging with rainbow finish and gold details.",
    ],
    featured: true,
  },
  {
    slug: "30th-celebration-premium-deck-set-espeon-umbreon",
    name: "30th CELEBRATION Premium Deck Set Espeon Umbreon Japanese Pokemon Card",
    price: 113,
    currency: "USD",
    category: "pokemon",
    status: "available",
    badge: "Premium",
    accent: "#a855f7",
    accentSecondary: "#fde047",
    shortDescription: "Premium Deck Set featuring Espeon ex and Umbreon ex anniversary artwork.",
    description: [
      "Bright sunlit Espeon ex scene paired with illuminated nighttime Umbreon ex artwork.",
      "A collectible anniversary set with matching design details.",
    ],
    featured: true,
  },
  {
    slug: "30th-celebration-futuristic-box",
    name: "30th CELEBRATION FUTURISTIC BOX Japanese Pokemon Card",
    price: 394,
    currency: "USD",
    category: "pokemon",
    status: "available",
    badge: "Special Set",
    accent: "#0ea5e9",
    accentSecondary: "#eab308",
    shortDescription: "Limited Japanese 30th CELEBRATION Futuristic Box.",
    description: [
      "Premium anniversary special set from the Japanese Pokémon 30th CELEBRATION line.",
    ],
    featured: true,
  },
  {
    slug: "30th-celebration-card-set-9-type-bundle",
    name: "30th CELEBRATION Card Set 9 Type Bundle Japanese Pokemon Card",
    price: 103,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#f59e0b",
    accentSecondary: "#fde68a",
    shortDescription: "Nine-type anniversary card set bundle.",
    description: [
      "Japanese 30th CELEBRATION Card Set 9 Type Bundle for collectors completing the anniversary lineup.",
    ],
    featured: true,
  },
  {
    slug: "m6-storm-emeralda-booster-box",
    name: "M6 Storm Emeralda booster box Japanese Pokemon Card",
    price: 65,
    currency: "USD",
    category: "pokemon",
    status: "available",
    badge: "New Arrival",
    accent: "#059669",
    accentSecondary: "#6ee7b7",
    shortDescription: "M6 Storm Emeralda featuring Mega Rayquaza ex.",
    description: [
      "Japanese M6 Storm Emeralda puts legendary Mega Rayquaza ex in the spotlight.",
      "Highlights include Mega Rayquaza ex MUR & SAR, Zinnia’s Trust SAR, Raikou ex SAR, Mega Golisopod ex SAR, plus Groudon AR and Kyogre AR.",
    ],
    features: [
      "Mega Rayquaza ex chase cards",
      "Hoenn legendary trio representation",
      "Sealed Japanese booster box",
    ],
    featured: true,
  },
  {
    slug: "op-17-the-worlds-strongest-warriors-booster-box",
    name: "OP-17 The World’s Strongest Warriors booster box Japanese ONE PIECE CARD",
    price: 82,
    currency: "USD",
    category: "one-piece",
    status: "available",
    badge: "In Stock",
    accent: "#b45309",
    accentSecondary: "#fcd34d",
    shortDescription: "4th anniversary ONE PIECE set with Four Emperors and Rocks D. Xebec.",
    description: [
      "OP-17 celebrates the 4th anniversary of the ONE PIECE CARD GAME.",
      "Highlights include Rocks D. Xebec and Monkey D. Luffy Pirate Crew Super Parallel cards, Manga Alternate Art cards, and Lucky Roux Treasure Rare.",
    ],
    featured: true,
  },
  {
    slug: "op-17-the-worlds-strongest-warriors-sealed-case",
    name: "OP-17 The World’s Strongest Warriors Sealed Case (12 boxes) Japanese ONE PIECE CARD",
    price: 1154,
    currency: "USD",
    category: "one-piece",
    status: "available",
    badge: "Case",
    accent: "#92400e",
    accentSecondary: "#fbbf24",
    shortDescription: "Sealed case of 12 OP-17 booster boxes.",
    description: [
      "Factory sealed case containing 12 Japanese OP-17 The World’s Strongest Warriors booster boxes.",
    ],
  },
  {
    slug: "one-piece-magazine-vol-21-promo-luffy",
    name: "[Pre-Order/Ship December] ONE PIECE magazine vol.21 Promo Monkey D. Luffy {ST29-001} Japanese ONE PIECE CARD",
    price: 26,
    currency: "USD",
    category: "one-piece",
    status: "preorder",
    badge: "Promo",
    accent: "#dc2626",
    accentSecondary: "#fecaca",
    shipNote: "Ships December",
    shortDescription: "Magazine promo Monkey D. Luffy {ST29-001}.",
    description: [
      "Japanese ONE PIECE magazine vol.21 promo card featuring Monkey D. Luffy {ST29-001}.",
    ],
    featured: true,
  },
  {
    slug: "pokemon-center-fukuoka-special-box",
    name: "Pokemon Center Fukuoka Special Box Japanese Pokemon Card",
    price: 96,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#2563eb",
    accentSecondary: "#93c5fd",
    shortDescription: "Pokémon Center Fukuoka exclusive special box.",
    description: [
      "Japanese Pokémon Center Fukuoka Special Box — exclusive regional product shipped sealed from Japan.",
    ],
    featured: true,
  },
  {
    slug: "pokemon-center-hiroshima-special-box",
    name: "Pokemon Center Hiroshima Special Box Japanese Pokemon Card",
    price: 103,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#ea580c",
    accentSecondary: "#fdba74",
    shortDescription: "Pokémon Center Hiroshima exclusive special box.",
    description: [
      "Japanese Pokémon Center Hiroshima Special Box — exclusive regional product shipped sealed from Japan.",
    ],
    featured: true,
  },
  {
    slug: "pokemon-center-tohoku-special-box",
    name: "Pokemon Center Tohoku Special Box Japanese Pokemon Card",
    price: 89,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#0d9488",
    accentSecondary: "#99f6e4",
    shortDescription: "Pokémon Center Tohoku exclusive special box.",
    description: [
      "Japanese Pokémon Center Tohoku Special Box — exclusive regional product shipped sealed from Japan.",
    ],
    featured: true,
  },
  {
    slug: "m5-abyss-eye-booster-box",
    name: "M5 Abyss Eye booster box Japanese Pokemon Card",
    price: 62,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#312e81",
    accentSecondary: "#818cf8",
    releaseDate: "May 22, 2026",
    stock: 16,
    shortDescription: "Mega Darkrai ex–centered Abyss Eye expansion.",
    description: [
      "Condition: Sealed New (with shrink wrap).",
      "Sales unit: Individual booster boxes, not a factory-sealed case.",
      "Contents: 1 pack = 5 cards · 1 box = 30 packs · Language: Japanese.",
      "Abyss Eye (M5) is a Japanese Pokémon TCG expansion centered around Mega Darkrai ex, introducing dark-themed strategies and Mega Evolution cards inspired by Pokémon Legends: Z-A. The set includes 81 cards in the main set (excluding secret rares).",
    ],
    features: [
      "118 cards to collect across rarities",
      "30 booster packs per box",
      "Chase cards include Mega Darkrai ex and Mega Zeraora ex",
    ],
    contents: ["1 pack = 5 cards", "1 box = 30 packs"],
    weight: "0.32 kg",
    dimensions: "14 × 13.7 × 3.6 cm",
    imageRef: "https://www.fujicardshop.com/wp-content/uploads/2026/04/M5-bb.jpg",
  },
  {
    slug: "m2a-mega-dream-ex-booster-box",
    name: "M2a MEGA Dream ex booster box Japanese Pokemon Card",
    price: 86,
    currency: "USD",
    category: "pokemon",
    status: "available",
    stock: 41,
    accent: "#7c3aed",
    accentSecondary: "#c4b5fd",
    releaseDate: "November 28, 2025",
    shortDescription: "MEGA Dream ex Japanese booster box with Mega Evolution Pokémon ex.",
    description: [
      "Condition: Sealed New. Language: Japanese.",
      "Contents: 1 pack = 10 cards · 1 box = 10 packs.",
      "MEGA Dream ex focuses on powerful Mega Evolution Pokémon as Pokémon ex with dynamic artwork.",
    ],
    features: [
      "Over 130 cards to collect",
      "10 packs per box",
      "10 cards per pack",
    ],
  },
  {
    slug: "m4-ninja-spinner-booster-box",
    name: "M4 Ninja Spinner booster box Japanese Pokemon Card",
    price: 69,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#334155",
    accentSecondary: "#94a3b8",
    shortDescription: "Japanese M4 Ninja Spinner booster box.",
    description: ["Sealed Japanese Pokémon TCG M4 Ninja Spinner booster box."],
  },
  {
    slug: "m3-munikis-zero-booster-box",
    name: "M3 Munikis Zero (Nihil Zero) booster box Japanese Pokemon Card",
    price: 62,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#1e293b",
    accentSecondary: "#64748b",
    shortDescription: "Japanese M3 Munikis Zero booster box.",
    description: ["Sealed Japanese Pokémon TCG M3 Munikis Zero (Nihil Zero) booster box."],
  },
  {
    slug: "gundam-gd06-stardust-trails-booster-box",
    name: "GUNDAM CARD GAME GD06 Stardust Trails Booster Box Japanese",
    price: 44,
    currency: "USD",
    category: "gundam",
    status: "out-of-stock",
    badge: "Out of stock",
    accent: "#dc2626",
    accentSecondary: "#fecaca",
    shortDescription: "GD06 Stardust Trails Japanese booster box.",
    description: ["Japanese Gundam Card Game GD06 Stardust Trails booster box."],
    onSale: true,
  },
  {
    slug: "union-arena-rezero-vol-2-ex17bt",
    name: "UNION ARENA Re:ZERO -Starting Life in Another World- Vol.2 EX17BT Booster Box Japanese",
    price: 62,
    currency: "USD",
    category: "union-arena",
    status: "available",
    accent: "#ef4444",
    accentSecondary: "#fecdd3",
    shortDescription: "UNION ARENA Re:ZERO Vol.2 EX17BT booster box.",
    description: [
      "Japanese UNION ARENA Re:ZERO -Starting Life in Another World- Vol.2 EX17BT booster box.",
    ],
    onSale: true,
  },
  {
    slug: "union-arena-madoka-magica-ex16bt",
    name: "UNION ARENA Puella Magi Madoka Magica: Magia Exedra EX16BT Booster Box Japanese",
    price: 44,
    currency: "USD",
    category: "union-arena",
    status: "out-of-stock",
    badge: "Out of stock",
    accent: "#ec4899",
    accentSecondary: "#f9a8d4",
    shortDescription: "UNION ARENA Madoka Magica Magia Exedra booster box.",
    description: [
      "Japanese UNION ARENA Puella Magi Madoka Magica: Magia Exedra EX16BT booster box.",
    ],
    onSale: true,
  },
  {
    slug: "hololive-start-deck-achichi-mela",
    name: "hololive OFFICIAL CARD GAME Start Deck Asobi★Mawaritai! Oshi Achichi Mela Japanese",
    price: 16,
    currency: "USD",
    category: "hololive-cg",
    status: "available",
    accent: "#f97316",
    accentSecondary: "#fdba74",
    shortDescription: "hololive start deck — Oshi Achichi Mela.",
    description: [
      "Japanese hololive OFFICIAL CARD GAME Start Deck Asobi★Mawaritai! featuring Oshi Achichi Mela.",
    ],
    onSale: true,
  },
  {
    slug: "hololive-start-deck-hyakuto-kyoko",
    name: "hololive OFFICIAL CARD GAME Start Deck Asobi★Mawaritai! Oshi Hyakuto Kyoko Japanese",
    price: 13,
    currency: "USD",
    category: "hololive-cg",
    status: "available",
    accent: "#8b5cf6",
    accentSecondary: "#ddd6fe",
    shortDescription: "hololive start deck — Oshi Hyakuto Kyoko.",
    description: [
      "Japanese hololive OFFICIAL CARD GAME Start Deck Asobi★Mawaritai! featuring Oshi Hyakuto Kyoko.",
    ],
    onSale: true,
  },
  {
    slug: "palworld-bp02-legends-awaken",
    name: "Palworld Official Card Game BP02 Legends Awaken Japanese",
    price: 38,
    compareAt: 377,
    currency: "USD",
    category: "other-tcg",
    status: "sale",
    badge: "Sale",
    accent: "#22c55e",
    accentSecondary: "#bbf7d0",
    shortDescription: "Palworld BP02 Legends Awaken — box or case pricing.",
    description: [
      "Japanese Palworld Official Card Game BP02 Legends Awaken. Price range on the live shop spans booster box through sealed case options.",
    ],
    onSale: true,
  },
  {
    slug: "weiss-schwarz-nikke-vol-2",
    name: "Weiss Schwarz Booster Goddess of Victory: NIKKE Vol.2 Japanese Trading Card",
    price: 57,
    currency: "USD",
    category: "weiss-schwarz",
    status: "available",
    accent: "#64748b",
    accentSecondary: "#cbd5e1",
    shortDescription: "Weiss Schwarz NIKKE Vol.2 Japanese booster.",
    description: [
      "Japanese Weiss Schwarz Booster Goddess of Victory: NIKKE Vol.2. Multiple variants may be available on the product page.",
    ],
  },
  {
    slug: "weiss-schwarz-frieren-vol-2",
    name: "Weiss Schwarz Booster Frieren: Beyond Journey’s End Vol.2 Japanese Trading Card",
    price: 29,
    currency: "USD",
    category: "weiss-schwarz",
    status: "out-of-stock",
    badge: "Out of stock",
    accent: "#38bdf8",
    accentSecondary: "#e0f2fe",
    shortDescription: "Weiss Schwarz Frieren Vol.2 Japanese booster.",
    description: [
      "Japanese Weiss Schwarz Booster Frieren: Beyond Journey’s End Vol.2.",
    ],
  },
  {
    slug: "hololive-volume-vortex",
    name: "hololive OFFICIAL CG Booster Vol.9 Volume Vortex Japanese Trading Card",
    price: 34,
    compareAt: 404,
    currency: "USD",
    category: "hololive-cg",
    status: "available",
    accent: "#06b6d4",
    accentSecondary: "#a5f3fc",
    releaseDate: "2026-09-19",
    shortDescription: "Vol.9 Volume Vortex — choose booster box or sealed case.",
    description: [
      "Japanese edition. Choose a Booster Box or a Sealed Case (12 boxes).",
      "Condition: Sealed New. Contents: Booster Box 12 packs · 8 cards per pack · Sealed Case 12 booster boxes.",
      "Volume Vortex features 25 hololive talents, including Oozora Subaru, Shirogane Noel and Yukihana Lamy.",
    ],
    features: [
      "125 base card types and 130 parallel types",
      "New Oshi Stage Skills and alternate color combinations",
    ],
    weight: "0.45 kg",
    dimensions: "16.1 × 7.7 × 5 cm",
  },
  {
    slug: "one-piece-saikyo-jump-promo-pack",
    name: "ONE PIECE Card Saikyo Jump Promo Pack “Summit Powerhouse Pack” Japanese ONE PIECE CARD",
    price: 22,
    currency: "USD",
    category: "one-piece",
    status: "available",
    accent: "#ef4444",
    accentSecondary: "#fecaca",
    shortDescription: "Saikyo Jump Summit Powerhouse promo pack.",
    description: [
      "Japanese ONE PIECE Card Saikyo Jump Promo Pack “Summit Powerhouse Pack”.",
    ],
  },
  {
    slug: "yugioh-utility-selection-booster-box",
    name: "Yu-Gi-Oh! OCG UTILITY SELECTION Booster Box Japanese Trading Card",
    price: 64,
    currency: "USD",
    category: "other-tcg",
    status: "available",
    accent: "#ca8a04",
    accentSecondary: "#fde047",
    shortDescription: "Japanese Yu-Gi-Oh! OCG Utility Selection booster box.",
    description: ["Japanese Yu-Gi-Oh! OCG UTILITY SELECTION Booster Box."],
  },
  {
    slug: "union-arena-bleach-ex15bt",
    name: "UNION ARENA BLEACH Thousand-Year Blood War Vol.3 EX15BT Booster Box Japanese Trading Card",
    price: 69,
    currency: "USD",
    category: "union-arena",
    status: "available",
    accent: "#111827",
    accentSecondary: "#f87171",
    shortDescription: "UNION ARENA BLEACH TYBW Vol.3 booster box.",
    description: [
      "Japanese UNION ARENA BLEACH Thousand-Year Blood War Vol.3 EX15BT booster box.",
    ],
  },
  {
    slug: "mcdonalds-2025-promo-pack",
    name: "McDonald’s 2025 Promo Pack Japanese Pokemon Card",
    price: 28,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#dc2626",
    accentSecondary: "#fde047",
    shortDescription: "Japanese McDonald’s 2025 Pokémon promo pack.",
    description: ["Japanese McDonald’s 2025 Promo Pack Pokémon cards."],
  },
  {
    slug: "start-deck-100-battle-collection",
    name: "Start Deck 100 Battle Collection Japanese Pokemon Card",
    price: 16,
    currency: "USD",
    category: "pokemon",
    status: "available",
    accent: "#2563eb",
    accentSecondary: "#93c5fd",
    shortDescription: "Start Deck 100 Battle Collection.",
    description: ["Japanese Pokémon Start Deck 100 Battle Collection."],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: CategorySlug): Product[] {
  if (category === "other-tcg") {
    return products.filter((product) =>
      ["other-tcg", "weiss-schwarz", "union-arena", "hololive-cg", "gundam"].includes(
        product.category,
      ),
    );
  }
  return products.filter((product) => product.category === category);
}

export function formatPrice(product: Product): string {
  if (product.compareAt && product.compareAt > product.price) {
    return `From $${product.price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `$ ${product.price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getSaleProducts(): Product[] {
  return products.filter((product) => product.onSale);
}
