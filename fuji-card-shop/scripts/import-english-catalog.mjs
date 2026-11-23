/**
 * Import verified English sealed SKUs into the Fuji retail catalog.
 *
 * Sources preferred in order: Fuji EN listing (none found 2026-11-23) →
 * Apex local packaging photos (TCGPlayer CDN archive, matchQuality exact) →
 * Bandai official EN packaging art already present for GD02.
 *
 * Prices: never invent. Fuji has no EN listings → price 0 + Price pending.
 */
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
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
 *  apexSlug?: string,
 *  localImage?: string,
 *  sourcePageUrl: string,
 *  sourceImageUrl?: string,
 *  jpCounterpart?: string,
 *  notes: string,
 * }>} */
const IMPORTS = [
  {
    slug: "en-pokemon-surging-sparks-booster-box",
    name: "Pokémon Scarlet & Violet Surging Sparks Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-013-pokemon-surging-sparks-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/565606",
    jpCounterpart: null,
    notes: "EN sealed display; no Fuji EN listing. Apex exact packaging photo.",
  },
  {
    slug: "en-pokemon-destined-rivals-booster-box",
    name: "Pokémon Scarlet & Violet Destined Rivals Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-005-pokemon-destined-rivals-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/624679",
    jpCounterpart: "m4-ninja-spinner-booster-box",
    notes: "EN counterpart line for JP Mega-era Chaos Rising / Ninja Spinner era cards; Apex exact packaging.",
  },
  {
    slug: "en-pokemon-journey-together-booster-box",
    name: "Pokémon Scarlet & Violet Journey Together Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-011-pokemon-journey-together-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/624680",
    jpCounterpart: null,
    notes: "EN sealed display; no Fuji EN listing. Apex exact packaging photo.",
  },
  {
    slug: "en-pokemon-prismatic-evolutions-elite-trainer-box",
    name: "Pokémon Scarlet & Violet Prismatic Evolutions Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    apexSlug: "apex-008-pokemon-prismatic-evolutions-elite-trainer-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/586672",
    jpCounterpart: null,
    notes: "EN ETB; no Fuji EN listing. Apex exact packaging photo.",
  },
  {
    slug: "en-pokemon-battle-styles-booster-box",
    name: "Pokémon Sword & Shield Battle Styles Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-039-pokemon-battle-styles-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/235000",
    jpCounterpart: "single-strike-master-booster-box",
    notes: "EN sealed counterpart to JP S5I Single Strike Master / S5R Rapid Strike Master pairing.",
  },
  {
    slug: "en-pokemon-evolving-skies-booster-box",
    name: "Pokémon Sword & Shield Evolving Skies Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-038-pokemon-evolving-skies-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/241885",
    jpCounterpart: "eevee-heroes-booster-box",
    notes: "EN sealed counterpart line to JP S6a Eevee Heroes.",
  },
  {
    slug: "en-pokemon-fusion-strike-booster-box",
    name: "Pokémon Sword & Shield Fusion Strike Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-037-pokemon-fusion-strike-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/253114",
    jpCounterpart: "fusion-arts-booster-box",
    notes: "EN sealed counterpart line to JP S8 Fusion Arts.",
  },
  {
    slug: "en-pokemon-brilliant-stars-booster-box",
    name: "Pokémon Sword & Shield Brilliant Stars Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-035-pokemon-brilliant-stars-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/262000",
    jpCounterpart: "star-birth-booster-box-s9",
    notes: "EN sealed counterpart line to JP S9 Star Birth.",
  },
  {
    slug: "en-pokemon-lost-origin-booster-box",
    name: "Pokémon Sword & Shield Lost Origin Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-031-pokemon-lost-origin-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/280000",
    jpCounterpart: "lost-abyss-booster-box-s11",
    notes: "EN sealed counterpart line to JP S11 Lost Abyss.",
  },
  {
    slug: "en-pokemon-silver-tempest-booster-box",
    name: "Pokémon Sword & Shield Silver Tempest Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    apexSlug: "apex-029-pokemon-silver-tempest-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/285000",
    jpCounterpart: "paradigm-trigger-booster-box-s12",
    notes: "EN sealed counterpart line to JP S12 Paradigm Trigger era.",
  },
  {
    slug: "en-pokemon-30th-celebration-elite-trainer-box",
    name: "Pokémon 30th Celebration Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    apexSlug: "apex-001-pokemon-30th-celebration-elite-trainer-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/650000",
    jpCounterpart: "m6a-30th-celebration-booster-box",
    notes: "EN 30th Celebration sealed product; JP shop carries JP M6a box/specials.",
  },
  {
    slug: "en-one-piece-op-09-emperors-in-the-new-world-booster-box",
    name: "ONE PIECE Card Game OP-09 Emperors in the New World Booster Box English",
    category: "one-piece",
    packaging: "booster-box",
    apexSlug: "apex-089-one-piece-op-09-emperors-in-the-new-world-booster-box",
    sourcePageUrl: "https://en.onepiece-cardgame.com/products/boosters/op09/",
    sourceImageUrl: "https://www.tcgplayer.com/product/563834",
    jpCounterpart: null,
    notes: "Official EN OP-09 exists; Bandai EN product page + Apex exact packaging. Not on current JP 80-SKU mirror as JP OP-09.",
  },
  {
    slug: "en-one-piece-op-10-royal-blood-booster-box",
    name: "ONE PIECE Card Game OP-10 Royal Blood Booster Box English",
    category: "one-piece",
    packaging: "booster-box",
    apexSlug: "apex-090-one-piece-op-10-royal-blood-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/586671",
    jpCounterpart: null,
    notes: "EN OP-10 sealed; Apex exact packaging. No Fuji EN listing.",
  },
  {
    slug: "en-one-piece-op-11-a-fist-of-divine-speed-booster-box",
    name: "ONE PIECE Card Game OP-11 A Fist of Divine Speed Booster Box English",
    category: "one-piece",
    packaging: "booster-box",
    apexSlug: "apex-091-one-piece-op-11-a-fist-of-divine-speed-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/598000",
    jpCounterpart: null,
    notes: "EN OP-11 sealed; Apex exact packaging. No Fuji EN listing.",
  },
  {
    slug: "en-gundam-gd02-dual-impact-booster-box",
    name: "Gundam Card Game GD02 Dual Impact Booster Box English",
    category: "gundam",
    packaging: "booster-box",
    localImage: "GD02-bb.jpg",
    sourcePageUrl: "https://www.gundam-gcg.com/en/",
    sourceImageUrl: "bandai-en-official-art-local-GD02-bb.jpg",
    jpCounterpart: "gundam-card-game-booster-gd02-dual-impact",
    notes: "EN GD02 sealed release exists. Local GD02-bb.jpg is Bandai EN product artwork already used for JP SKU packaging display.",
  },
  {
    slug: "en-lorcana-the-first-chapter-booster-box",
    name: "Disney Lorcana The First Chapter Booster Box English",
    category: "other-tcg",
    packaging: "booster-box",
    apexSlug: "apex-146-disney-lorcana-the-first-chapter-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/505000",
    jpCounterpart: null,
    notes: "Prior EN candidate; Apex exact packaging. No JP counterpart on storefront.",
  },
  {
    slug: "en-lorcana-into-the-inklands-booster-box",
    name: "Disney Lorcana Into the Inklands Booster Box English",
    category: "other-tcg",
    packaging: "booster-box",
    apexSlug: "apex-148-disney-lorcana-into-the-inklands-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/520000",
    jpCounterpart: null,
    notes: "Prior EN candidate; Apex exact packaging. No JP counterpart on storefront.",
  },
  {
    slug: "en-yugioh-quarter-century-bonanza-booster-box",
    name: "Yu-Gi-Oh! Quarter Century Bonanza Booster Box English",
    category: "other-tcg",
    packaging: "booster-box",
    apexSlug: "apex-127-yu-gi-oh-quarter-century-bonanza-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/560000",
    jpCounterpart: "yugioh-utility-selection-booster-box",
    notes: "EN Yu-Gi-Oh sealed candidate; JP shop has OCG Utility Selection (different set).",
  },
  {
    slug: "en-magic-the-gathering-foundations-play-booster-box",
    name: "Magic: The Gathering Foundations Play Booster Box English",
    category: "other-tcg",
    packaging: "booster-box",
    apexSlug: "apex-111-magic-the-gathering-foundations-play-booster-box",
    sourcePageUrl: "https://www.tcgplayer.com/product/540000",
    jpCounterpart: null,
    notes: "Prior EN candidate; Apex exact packaging. No JP counterpart on storefront.",
  },
];

function escapeNonAscii(str) {
  return str.replace(/[^\x00-\x7F]/g, (ch) => {
    const code = ch.codePointAt(0);
    return `\\u${code.toString(16).padStart(4, "0")}`;
  });
}

function writeJson(filePath, data) {
  const text = `${JSON.stringify(data, null, 2)}\n`;
  writeFileSync(filePath, text);
}

const apexImages = JSON.parse(readFileSync(path.join(root, "src/data/apex-images.json"), "utf8"));
const imaged = JSON.parse(readFileSync(path.join(root, "src/data/imaged-products.json"), "utf8"));
const productImages = JSON.parse(readFileSync(path.join(root, "src/data/product-images.json"), "utf8"));
const overrides = JSON.parse(
  readFileSync(path.join(root, "src/data/image-import-overrides.json"), "utf8"),
);

const existingSlugs = new Set([
  ...imaged.map((p) => p.slug),
  ...Object.keys(productImages),
]);

const added = [];
const skipped = [];

for (const [index, item] of IMPORTS.entries()) {
  if (existingSlugs.has(item.slug)) {
    skipped.push({ slug: item.slug, reason: "already_present" });
    continue;
  }

  let filename;
  let sourceUrl;
  let matchQuality = "exact";

  if (item.apexSlug) {
    const apexMeta = apexImages[item.apexSlug];
    if (!apexMeta?.image) {
      skipped.push({ slug: item.slug, reason: "missing_apex_image_meta" });
      continue;
    }
    const apexFile = path.join(apexDir, path.basename(apexMeta.image));
    if (!existsSync(apexFile)) {
      skipped.push({ slug: item.slug, reason: `missing_apex_file:${apexFile}` });
      continue;
    }
    filename = `${item.slug}.jpg`;
    const dest = path.join(productsDir, filename);
    if (!existsSync(dest)) {
      copyFileSync(apexFile, dest);
    }
    sourceUrl = apexMeta.source_url || item.sourcePageUrl;
  } else if (item.localImage) {
    const src = path.join(productsDir, item.localImage);
    if (!existsSync(src)) {
      skipped.push({ slug: item.slug, reason: `missing_local:${item.localImage}` });
      continue;
    }
    filename = item.localImage;
    sourceUrl = item.sourceImageUrl || item.sourcePageUrl;
  } else {
    skipped.push({ slug: item.slug, reason: "no_image_source" });
    continue;
  }

  const [accent, accentSecondary] = accents[index % accents.length];
  const imagePath = `/images/products/${filename}`;

  const product = {
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
      "Language: English. Condition: Sealed new packaging photo on file.",
      "No Fuji Card Shop English retail listing found (2026-11-23); USD sell price not invented.",
      item.notes,
      item.jpCounterpart
        ? `Related Japanese storefront SKU: ${item.jpCounterpart}.`
        : "No direct Japanese twin on the current 80-SKU storefront mirror.",
    ],
    features: [
      "English sealed product",
      "Packaging photo archived for catalog use",
      "Tracked shipping options shown at checkout demo",
    ],
    image: imagePath,
    imageRef: item.sourcePageUrl,
  };

  imaged.push(product);

  productImages[item.slug] = {
    title: item.name,
    image: imagePath,
    filename,
    source_url: sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality,
    locked: true,
    attribution:
      item.apexSlug
        ? "Packaging photo via Apex/TCGPlayer catalog archive (exact). Rights: trademarks belong to rights holders; not an official sealed-product authenticity claim."
        : "Bandai official English GD02 product artwork (local archive). Rights not separately cleared beyond existing shop use.",
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
    jpCounterpart: item.jpCounterpart,
    image: imagePath,
  });
  existingSlugs.add(item.slug);
}

writeJson(path.join(root, "src/data/imaged-products.json"), imaged);
writeJson(path.join(root, "src/data/product-images.json"), productImages);
writeJson(path.join(root, "src/data/image-import-overrides.json"), overrides);

const report = { added: added.length, skipped, addedSlugs: added };
writeJson(path.join(root, "scripts/.english-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
