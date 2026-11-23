/**
 * Import additional English sealed SKUs beyond the Apex-exact wave (#18):
 * - TCGPlayer CDN packaging for named gaps (Black Bolt, White Flare, ME sets, OP-12/13, GD01, UA Bleach)
 * - Salvage Apex closest-line rows whose matchedProductName clearly is the same set
 *
 * Prices stay 0 (price-pending). Never invent Fuji retail USD.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsDir = path.join(root, "public/images/products");
const apexDir = path.join(root, "public/images/apex");

const accents = [
  ["#0f766e", "#5eead4"],
  ["#1d4ed8", "#93c5fd"],
  ["#7c2d12", "#fdba74"],
  ["#4c1d95", "#c4b5fd"],
  ["#9f1239", "#fda4af"],
  ["#065f46", "#6ee7b7"],
];

/** @type {Array<{
 *  slug: string,
 *  name: string,
 *  category: string,
 *  packaging: string,
 *  localImage: string,
 *  sourcePageUrl: string,
 *  sourceImageUrl: string,
 *  jpCounterpart?: string | null,
 *  notes: string,
 * }>} */
const TCGPLAYER_IMPORTS = [
  {
    slug: "en-pokemon-black-bolt-elite-trainer-box",
    name: "Pokémon Scarlet & Violet Black Bolt Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-black-bolt-elite-trainer-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/630686",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/630686_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN Black Bolt ETB; TCGPlayer CDN packaging (exact product id 630686).",
  },
  {
    slug: "en-pokemon-white-flare-elite-trainer-box",
    name: "Pokémon Scarlet & Violet White Flare Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-white-flare-elite-trainer-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/630689",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/630689_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN White Flare ETB; TCGPlayer CDN packaging (exact product id 630689).",
  },
  {
    slug: "en-pokemon-black-bolt-booster-bundle",
    name: "Pokémon Scarlet & Violet Black Bolt Booster Bundle English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-black-bolt-booster-bundle.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/630431",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/630431_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN Black Bolt Booster Bundle; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-white-flare-booster-bundle",
    name: "Pokémon Scarlet & Violet White Flare Booster Bundle English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-white-flare-booster-bundle.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/630696",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/630696_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN White Flare Booster Bundle; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-mega-evolution-booster-box",
    name: "Pokémon Mega Evolution Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    localImage: "en-pokemon-mega-evolution-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/644298",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/644298_in_1000x1000.jpg",
    jpCounterpart: "m2a-mega-dream-ex-booster-box",
    notes: "EN ME01 Mega Evolution booster box; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-mega-evolution-enhanced-booster-box",
    name: "Pokémon Mega Evolution Enhanced Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    localImage: "en-pokemon-mega-evolution-enhanced-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/644300",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/644300_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME01 Enhanced booster box; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-mega-evolution-elite-trainer-box-mega-gardevoir",
    name: "Pokémon Mega Evolution Elite Trainer Box Mega Gardevoir English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-mega-evolution-elite-trainer-box-mega-gardevoir.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/644279",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/644279_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME01 Elite Trainer Box (Mega Gardevoir); TCGPlayer CDN packaging (product id 644279).",
  },
  {
    slug: "en-pokemon-mega-evolution-elite-trainer-box-mega-lucario",
    name: "Pokémon Mega Evolution Elite Trainer Box Mega Lucario English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-mega-evolution-elite-trainer-box-mega-lucario.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/648394",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/648394_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME01 Elite Trainer Box (Mega Lucario); TCGPlayer CDN packaging (product id 648394).",
  },
  {
    slug: "en-pokemon-mega-evolution-booster-bundle",
    name: "Pokémon Mega Evolution Booster Bundle English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-mega-evolution-booster-bundle.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/644362",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/644362_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME01 Booster Bundle; TCGPlayer CDN packaging (product id 644362).",
  },
  {
    slug: "en-pokemon-phantasmal-flames-booster-box",
    name: "Pokémon Mega Evolution Phantasmal Flames Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    localImage: "en-pokemon-phantasmal-flames-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/654137",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/654137_in_1000x1000.jpg",
    jpCounterpart: "m3-munikis-zero-booster-box",
    notes: "EN ME02 Phantasmal Flames booster box; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-phantasmal-flames-elite-trainer-box",
    name: "Pokémon Mega Evolution Phantasmal Flames Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-phantasmal-flames-elite-trainer-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/654136",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/654136_in_1000x1000.jpg",
    jpCounterpart: "m3-munikis-zero-booster-box",
    notes: "EN ME02 Phantasmal Flames ETB; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-perfect-order-booster-box",
    name: "Pokémon Mega Evolution Perfect Order Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    localImage: "en-pokemon-perfect-order-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/672394",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/672394_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME03 Perfect Order booster box; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-pitch-black-booster-box",
    name: "Pokémon Mega Evolution Pitch Black Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    localImage: "en-pokemon-pitch-black-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/692939",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/692939_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME05 Pitch Black booster box; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-pokemon-pitch-black-elite-trainer-box",
    name: "Pokémon Mega Evolution Pitch Black Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    localImage: "en-pokemon-pitch-black-elite-trainer-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/692947",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/692947_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN ME05 Pitch Black ETB; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-one-piece-op-12-legacy-of-the-master-booster-box",
    name: "ONE PIECE Card Game OP-12 Legacy of the Master Booster Box English",
    category: "one-piece",
    packaging: "booster-box",
    localImage: "en-one-piece-op-12-legacy-of-the-master-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/628346",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/628346_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN OP-12 Legacy of the Master; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-one-piece-op-13-carrying-on-his-will-booster-box",
    name: "ONE PIECE Card Game OP-13 Carrying On His Will Booster Box English",
    category: "one-piece",
    packaging: "booster-box",
    localImage: "en-one-piece-op-13-carrying-on-his-will-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/628352",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/628352_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN OP-13 Carrying On His Will; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-gundam-gd01-newtype-rising-booster-box",
    name: "Gundam Card Game GD01 Newtype Rising Booster Box English",
    category: "gundam",
    packaging: "booster-box",
    localImage: "en-gundam-gd01-newtype-rising-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/619072",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/619072_in_1000x1000.jpg",
    jpCounterpart: null,
    notes: "EN GD01 Newtype Rising; TCGPlayer CDN packaging.",
  },
  {
    slug: "en-union-arena-bleach-thousand-year-blood-war-booster-box",
    name: "UNION ARENA BLEACH Thousand-Year Blood War Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    localImage: "en-union-arena-bleach-thousand-year-blood-war-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/552230",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/552230_in_1000x1000.jpg",
    jpCounterpart: "union-arena-bleach-ex15bt",
    notes: "EN UA Bleach UE01BT booster box; TCGPlayer CDN packaging. JP storefront has EX15BT Vol.3 line.",
  },
  {
    slug: "en-union-arena-bleach-thousand-year-blood-war-vol-2-booster-box",
    name: "UNION ARENA BLEACH Thousand-Year Blood War Vol.2 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    localImage: "en-union-arena-bleach-thousand-year-blood-war-vol-2-booster-box.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/607851",
    sourceImageUrl: "https://tcgplayer-cdn.tcgplayer.com/product/607851_in_1000x1000.jpg",
    jpCounterpart: "union-arena-bleach-ex15bt",
    notes: "EN UA Bleach UEX01BT Vol.2 booster box; TCGPlayer CDN packaging.",
  },
];

/** Apex closest-line salvage: same-set matched names (do not invent packaging). */
const APEX_SALVAGE = [
  {
    apexSlug: "apex-183-star-wars-unlimited-twilight-of-the-republic-booster-box",
    slug: "en-star-wars-unlimited-twilight-of-the-republic-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-184-star-wars-unlimited-jump-to-lightspeed-booster-box",
    slug: "en-star-wars-unlimited-jump-to-lightspeed-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-188-riftbound-proving-grounds-starter-deck",
    slug: "en-riftbound-proving-grounds-starter-deck",
    category: "other-tcg",
    packaging: "deck",
  },
  {
    apexSlug: "apex-191-dragon-ball-super-fusion-world-fb01-booster-box",
    slug: "en-dragon-ball-super-fusion-world-awakened-pulse-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
    useMatchedName: true,
  },
  {
    apexSlug: "apex-192-dragon-ball-super-fusion-world-fb02-booster-box",
    slug: "en-dragon-ball-super-fusion-world-blazing-aura-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
    useMatchedName: true,
  },
  {
    apexSlug: "apex-193-dragon-ball-super-fusion-world-fb03-booster-box",
    slug: "en-dragon-ball-super-fusion-world-raging-roar-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
    useMatchedName: true,
  },
];

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function withEnglish(name) {
  return /\benglish\b/i.test(name) ? name : `${name} English`;
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\benglish\b/g, "")
    .replace(/disney\s+/g, "")
    .replace(/yu-gi-oh!?/g, "yugioh")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const apexImages = JSON.parse(readFileSync(path.join(root, "src/data/apex-images.json"), "utf8"));
const imaged = JSON.parse(readFileSync(path.join(root, "src/data/imaged-products.json"), "utf8"));
const productImages = JSON.parse(readFileSync(path.join(root, "src/data/product-images.json"), "utf8"));
const overrides = JSON.parse(
  readFileSync(path.join(root, "src/data/image-import-overrides.json"), "utf8"),
);

const existingSlugs = new Set([...imaged.map((p) => p.slug), ...Object.keys(productImages)]);
const existingNormNames = new Set(
  imaged.filter((p) => p.slug.startsWith("en-")).map((p) => normalizeName(p.name)),
);

const added = [];
const skipped = [];
let index = 0;

function pushProduct(item, imagePath, filename, sourceUrl, matchQuality, attribution) {
  if (existingSlugs.has(item.slug) || existingNormNames.has(normalizeName(item.name))) {
    skipped.push({ slug: item.slug, reason: "already_present" });
    return;
  }
  if (!existsSync(path.join(root, "public", imagePath.replace(/^\//, "")))) {
    // imagePath like /images/products/x.jpg → public/images/products/x.jpg
    const rel = imagePath.replace(/^\//, "");
    if (!existsSync(path.join(root, "public", rel))) {
      skipped.push({ slug: item.slug, reason: `missing_file:${rel}` });
      return;
    }
  }

  const [accent, accentSecondary] = accents[index % accents.length];
  index += 1;

  imaged.push({
    slug: item.slug,
    name: item.name,
    price: 0,
    currency: "USD",
    category: item.category,
    status: "available",
    badge: "Price pending",
    accent,
    accentSecondary,
    shortDescription: `English sealed ${item.packaging.replace(/-/g, " ")}. Price pending — no Fuji Card Shop EN listing.`,
    description: [
      "Language: English. Condition: Sealed packaging photo on file.",
      "No Fuji Card Shop English retail listing found; USD sell price not invented.",
      item.notes,
      item.jpCounterpart
        ? `Related Japanese storefront SKU: ${item.jpCounterpart}.`
        : "No direct Japanese twin mapped on the current Fuji JP storefront mirror.",
    ],
    features: [
      "English sealed product",
      "Verified packaging photo on file",
      "Tracked shipping options shown at checkout demo",
    ],
    image: imagePath,
    imageRef: item.sourcePageUrl,
  });

  productImages[item.slug] = {
    title: item.name,
    image: imagePath,
    filename,
    source_url: sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality,
    locked: true,
    attribution,
  };

  overrides.overrides[item.slug] = {
    image: imagePath,
    filename,
    source_url: sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality,
    locked: true,
    note: null,
  };

  added.push({
    slug: item.slug,
    category: item.category,
    packaging: item.packaging,
    image: imagePath,
    source: item.sourcePageUrl,
  });
  existingSlugs.add(item.slug);
  existingNormNames.add(normalizeName(item.name));
}

for (const item of TCGPLAYER_IMPORTS) {
  const imagePath = `/images/products/${item.localImage}`;
  pushProduct(
    item,
    imagePath,
    item.localImage,
    item.sourceImageUrl,
    "exact",
    "Packaging photo via TCGPlayer CDN (exact product id). Trademarks belong to rights holders.",
  );
}

for (const salvage of APEX_SALVAGE) {
  const meta = apexImages[salvage.apexSlug];
  if (!meta?.image) {
    skipped.push({ slug: salvage.slug, reason: "missing_apex_meta" });
    continue;
  }
  const filename = meta.filename || path.basename(meta.image);
  const apexFile = path.join(apexDir, filename);
  if (!existsSync(apexFile)) {
    skipped.push({ slug: salvage.slug, reason: `missing_apex_file:${filename}` });
    continue;
  }
  const display = withEnglish(
    salvage.useMatchedName && meta.matchedProductName
      ? meta.matchedProductName
      : meta.title || salvage.slug,
  );
  pushProduct(
    {
      slug: salvage.slug,
      name: display,
      category: salvage.category,
      packaging: salvage.packaging,
      sourcePageUrl: meta.source_url || `https://www.tcgplayer.com/`,
      jpCounterpart: null,
      notes: `Apex closest-line salvage: matchedProductName "${meta.matchedProductName}" aligns with this sealed line; packaging reused from ${salvage.apexSlug}.`,
    },
    meta.image.startsWith("/") ? meta.image : `/images/apex/${filename}`,
    filename,
    meta.source_url || "",
    "closest-line",
    "Packaging photo via Apex/TCGPlayer archive (closest-line, same-set name overlap). Trademarks belong to rights holders.",
  );
}

writeJson(path.join(root, "src/data/imaged-products.json"), imaged);
writeJson(path.join(root, "src/data/product-images.json"), productImages);
writeJson(path.join(root, "src/data/image-import-overrides.json"), overrides);

const byCategory = {};
for (const row of added) {
  byCategory[row.category] = (byCategory[row.category] || 0) + 1;
}

const report = {
  added: added.length,
  skipped,
  byCategory,
  addedSlugs: added.map((r) => r.slug),
  enTotal: imaged.filter((p) => p.slug.startsWith("en-")).length,
};

writeJson(path.join(root, "scripts/.en-more-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
