/**
 * Multilang sealed catalog: import verified packaging only.
 * - ZH sealed from Cardmarket product images (language-tagged product pages)
 * - Latest/upcoming EN + JP sealed from TCGPlayer CDN
 * Prices stay 0 / Price pending. Box and case remain separate SKUs.
 * No DE/KR/FR/IT invent when packaging is missing or mismatched.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const productsDir = path.join(root, "public/images/products");
const stagingDir = "/tmp/ml-import";

const accents = [
  ["#0f766e", "#5eead4"],
  ["#1d4ed8", "#93c5fd"],
  ["#7c2d12", "#fdba74"],
  ["#4c1d95", "#c4b5fd"],
  ["#9f1239", "#fda4af"],
  ["#065f46", "#6ee7b7"],
  ["#b45309", "#fcd34d"],
  ["#be123c", "#fecdd3"],
];

/** @typedef {{
 *  slug: string,
 *  name: string,
 *  category: string,
 *  packaging: string,
 *  language: string,
 *  stagingFile: string,
 *  sourceUrl: string,
 *  sourcePageUrl: string,
 *  matchQuality: "exact",
 *  notes: string,
 *  status?: string,
 *  releaseDate?: string,
 * }} ImportItem */

/** @type {ImportItem[]} */
const IMPORTS = [
  // —— Simplified Chinese (Cardmarket language-specific SKUs) ——
  {
    slug: "zh-pokemon-30th-celebration-booster-box",
    name: "Pokémon 30th Celebration Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-30th-celebration-sch.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/908934/908934.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/30th-Celebration-Simplified-Chinese-Booster-Box",
    matchQuality: "exact",
    notes: "Cardmarket S-Chinese product; packaging shows Chinese branding.",
  },
  {
    slug: "zh-pokemon-csv10c-chasing-glory-together-booster-box",
    name: "Pokémon CSV10C Chasing Glory Together Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv10c-chasing-glory.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/895486/895486.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV10C-Chasing-Glory-Together-Booster-Box",
    matchQuality: "exact",
    notes: "Mainland China CSV10C sealed box; Simplified Chinese packaging verified.",
  },
  {
    slug: "zh-pokemon-csv10c-chasing-glory-together-jumbo-booster-box",
    name: "Pokémon CSV10C Chasing Glory Together Jumbo Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv10c-chasing-glory-jumbo.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/895487/895487.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV10C-Chasing-Glory-Together-Jumbo-Booster-Box",
    matchQuality: "exact",
    notes: "Jumbo box SKU kept separate from standard CSV10C box.",
  },
  {
    slug: "zh-pokemon-csv9c-stellar-crystal-booster-box",
    name: "Pokémon CSV9C Stellar Crystal Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv9c-stellar-crystal.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/885520/885520.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV9C-Stellar-Crystal-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese CSV9C sealed box.",
  },
  {
    slug: "zh-pokemon-csv95c-terastal-gathering-booster-box",
    name: "Pokémon CSV9.5C Terastal Gathering Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv95c-terastal-gathering.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/889724/889724.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV95C-Terastal-Gathering-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese CSV9.5C sealed box.",
  },
  {
    slug: "zh-pokemon-csv8c-brilliant-fantasy-booster-box",
    name: "Pokémon CSV8C Brilliant Fantasy Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv8c-brilliant-fantasy.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/873184/873184.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV8C-Brilliant-Fantasy-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese CSV8C sealed box.",
  },
  {
    slug: "zh-pokemon-csv5c-dark-crystal-blaze-booster-box",
    name: "Pokémon CSV5C Dark Crystal Blaze Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv5c-dark-crystal-blaze.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/840065/840065.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV5C-Dark-Crystal-Blaze-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese CSV5C sealed box.",
  },
  {
    slug: "zh-pokemon-csv4c-bonus-round-booster-box",
    name: "Pokémon CSV4C Bonus Round Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-csv4c-bonus-round.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/829953/829953.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CSV4C-Bonus-Round-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese CSV4C sealed box.",
  },
  {
    slug: "zh-pokemon-151c-collect-151-surprises-booster-box",
    name: "Pokémon 151C Collect 151 Surprises Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-151c-collect-151-surprises.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/829955/829955.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/151C-Collect-151-Surprises-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese 151C Surprises sealed box.",
  },
  {
    slug: "zh-pokemon-151c-collect-151-hope-booster-box",
    name: "Pokémon 151C Collect 151 Hope Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-151c-collect-151-hope.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/819063/819063.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/151C-Collect-151-Hope-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese 151C Hope sealed box.",
  },
  {
    slug: "zh-pokemon-151c-collect-151-gathering-booster-box",
    name: "Pokémon 151C Collect 151 Gathering Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-151c-collect-151-gathering.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/829957/829957.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/151C-Collect-151-Gathering-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese 151C Gathering sealed box.",
  },
  {
    slug: "zh-pokemon-cbb2c-gem-pack-vol-2-booster-box",
    name: "Pokémon CBB2C Gem Pack Vol. 2 Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-cbb2c-gem-pack-vol-2.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/821700/821700.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CBB2C-Gem-Pack-Vol-2-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese Gem Pack Vol. 2.",
  },
  {
    slug: "zh-pokemon-cbb3c-gem-pack-vol-3-booster-box",
    name: "Pokémon CBB3C Gem Pack Vol. 3 Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-cbb3c-gem-pack-vol-3.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/845908/845908.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CBB3C-Gem-Pack-Vol-3-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese Gem Pack Vol. 3.",
  },
  {
    slug: "zh-pokemon-cbb4c-gem-pack-vol-4-booster-box",
    name: "Pokémon CBB4C Gem Pack Vol. 4 Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-cbb4c-gem-pack-vol-4.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/866295/866295.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CBB4C-Gem-Pack-Vol-4-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese Gem Pack Vol. 4.",
  },
  {
    slug: "zh-pokemon-cbb5c-gem-pack-vol-5-booster-box",
    name: "Pokémon CBB5C Gem Pack Vol. 5 Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-cbb5c-gem-pack-vol-5.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/880331/880331.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CBB5C-Gem-Pack-Vol-5-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese Gem Pack Vol. 5.",
  },
  {
    slug: "zh-pokemon-cbb6c-gem-pack-vol-6-booster-box",
    name: "Pokémon CBB6C Gem Pack Vol. 6 Booster Box Simplified Chinese",
    category: "pokemon",
    packaging: "booster-box",
    language: "chinese",
    stagingFile: "zh-cbb6c-gem-pack-vol-6.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/898585/898585.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/CBB6C-Gem-Pack-Vol-6-Booster-Box",
    matchQuality: "exact",
    notes: "Simplified Chinese Gem Pack Vol. 6.",
  },
  {
    slug: "id-th-pokemon-30th-celebration-booster-box",
    name: "Pokémon 30th Celebration Booster Box Indonesian & Thai",
    category: "pokemon",
    packaging: "booster-box",
    language: "other",
    stagingFile: "id-th-30th-celebration.jpg",
    sourceUrl: "https://product-images.s3.cardmarket.com/53/895622/895622.jpg",
    sourcePageUrl:
      "https://www.cardmarket.com/en/Pokemon/Products/Booster-Boxes/30th-Celebration-Indonesian-Thai-Booster-Box",
    matchQuality: "exact",
    notes: "Cardmarket Indonesian & Thai SKU; tagged Other (not a single language).",
  },

  // —— Latest / upcoming English (TCGPlayer CDN) ——
  {
    slug: "en-pokemon-delta-reign-booster-box",
    name: "Pokémon Delta Reign Booster Box English",
    category: "pokemon",
    packaging: "booster-box",
    language: "english",
    stagingFile: "en-pokemon-delta-reign-booster-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/712094_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/712094",
    matchQuality: "exact",
    notes: "Upcoming EN Delta Reign sealed box. Exact TCGPlayer packaging.",
    status: "preorder",
  },
  {
    slug: "en-pokemon-delta-reign-booster-box-case",
    name: "Pokémon Delta Reign Booster Box Case English",
    category: "pokemon",
    packaging: "sealed-case",
    language: "english",
    stagingFile: "en-pokemon-delta-reign-booster-box-case.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/712096_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/712096",
    matchQuality: "exact",
    notes: "EN Delta Reign sealed case kept separate from single box.",
    status: "preorder",
  },
  {
    slug: "en-pokemon-delta-reign-booster-bundle",
    name: "Pokémon Delta Reign Booster Bundle English",
    category: "pokemon",
    packaging: "special-set",
    language: "english",
    stagingFile: "en-pokemon-delta-reign-booster-bundle.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/712097_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/712097",
    matchQuality: "exact",
    notes: "EN Delta Reign booster bundle.",
    status: "preorder",
  },
  {
    slug: "en-pokemon-delta-reign-elite-trainer-box",
    name: "Pokémon Delta Reign Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    language: "english",
    stagingFile: "en-pokemon-delta-reign-elite-trainer-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/712102_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/712102",
    matchQuality: "exact",
    notes: "EN Delta Reign ETB.",
    status: "preorder",
  },
  {
    slug: "en-pokemon-ascended-heroes-elite-trainer-box",
    name: "Pokémon Ascended Heroes Elite Trainer Box English",
    category: "pokemon",
    packaging: "special-set",
    language: "english",
    stagingFile: "en-pokemon-ascended-heroes-elite-trainer-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/668496_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/668496",
    matchQuality: "exact",
    notes: "EN Ascended Heroes ETB.",
  },
  {
    slug: "en-pokemon-ascended-heroes-booster-bundle-display",
    name: "Pokémon Ascended Heroes Booster Bundle Display English",
    category: "pokemon",
    packaging: "special-set",
    language: "english",
    stagingFile: "en-pokemon-ascended-heroes-booster-bundle-display.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/692362_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/692362",
    matchQuality: "exact",
    notes: "EN Ascended Heroes booster bundle display.",
  },
  {
    slug: "en-pokemon-phantasmal-flames-booster-bundle",
    name: "Pokémon Phantasmal Flames Booster Bundle English",
    category: "pokemon",
    packaging: "special-set",
    language: "english",
    stagingFile: "en-pokemon-phantasmal-flames-booster-bundle.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/654160_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/654160",
    matchQuality: "exact",
    notes: "EN Phantasmal Flames booster bundle (box/ETB already catalogued).",
  },
  {
    slug: "en-pokemon-phantasmal-flames-booster-box-case",
    name: "Pokémon Phantasmal Flames Booster Box Case English",
    category: "pokemon",
    packaging: "sealed-case",
    language: "english",
    stagingFile: "en-pokemon-phantasmal-flames-booster-box-case.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/655281_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/655281",
    matchQuality: "exact",
    notes: "EN Phantasmal Flames sealed case kept separate from single box.",
  },

  // —— Latest Japanese (TCGPlayer CDN) ——
  {
    slug: "jp-pokemon-storm-emeralda-booster-box",
    name: "Pokémon Storm Emeralda Booster Box Japanese",
    category: "pokemon",
    packaging: "booster-box",
    language: "japanese",
    stagingFile: "jp-pokemon-storm-emeralda-booster-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/709110_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/709110",
    matchQuality: "exact",
    notes: "JP M6 Storm Emeralda sealed box. Exact TCGPlayer packaging.",
  },
  {
    slug: "jp-pokemon-abyss-eye-booster-box",
    name: "Pokémon Abyss Eye Booster Box Japanese",
    category: "pokemon",
    packaging: "booster-box",
    language: "japanese",
    stagingFile: "jp-pokemon-abyss-eye-booster-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/695112_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/695112",
    matchQuality: "exact",
    notes: "JP M5 Abyss Eye sealed box.",
  },
  {
    slug: "jp-pokemon-mega-brave-booster-box",
    name: "Pokémon Mega Brave Booster Box Japanese",
    category: "pokemon",
    packaging: "booster-box",
    language: "japanese",
    stagingFile: "jp-pokemon-mega-brave-booster-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/647500_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/647500",
    matchQuality: "exact",
    notes: "JP m1L Mega Brave sealed box.",
  },
  {
    slug: "jp-pokemon-nihil-zero-booster-box",
    name: "Pokémon Nihil Zero Booster Box Japanese",
    category: "pokemon",
    packaging: "booster-box",
    language: "japanese",
    stagingFile: "jp-pokemon-nihil-zero-booster-box.jpg",
    sourceUrl: "https://tcgplayer-cdn.tcgplayer.com/product/674449_in_1000x1000.jpg",
    sourcePageUrl: "https://www.tcgplayer.com/product/674449",
    matchQuality: "exact",
    notes: "JP M3 Nihil Zero sealed box.",
  },
];

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

const imagedPath = path.join(root, "src/data/imaged-products.json");
const productImagesPath = path.join(root, "src/data/product-images.json");
const overridesPath = path.join(root, "src/data/image-import-overrides.json");

const imaged = readJson(imagedPath);
const productImages = readJson(productImagesPath);
const overrides = readJson(overridesPath);
if (!overrides.overrides) {
  overrides.overrides = {};
}

const existingSlugs = new Set(imaged.map((p) => p.slug));
const existingNormNames = new Set(imaged.map((p) => normalizeName(p.name)));

const added = [];
const skipped = [];
let index = imaged.length;

for (const item of IMPORTS) {
  if (existingSlugs.has(item.slug)) {
    skipped.push({ slug: item.slug, reason: "slug_exists" });
    continue;
  }
  if (existingNormNames.has(normalizeName(item.name))) {
    skipped.push({ slug: item.slug, reason: "name_exists" });
    continue;
  }

  const staging = path.join(stagingDir, item.stagingFile);
  if (!existsSync(staging)) {
    skipped.push({ slug: item.slug, reason: `missing_staging:${item.stagingFile}` });
    continue;
  }

  const filename = `${item.slug}.jpg`;
  const dest = path.join(productsDir, filename);
  if (!existsSync(dest)) {
    copyFileSync(staging, dest);
  }

  const imagePath = `/images/products/${filename}`;
  const [accent, accentSecondary] = accents[index % accents.length];
  index += 1;

  const languageLabel =
    item.language === "chinese"
      ? "Chinese"
      : item.language === "japanese"
        ? "Japanese"
        : item.language === "english"
          ? "English"
          : "Other";

  imaged.push({
    slug: item.slug,
    name: item.name,
    price: 0,
    currency: "USD",
    category: item.category,
    status: item.status ?? "available",
    badge: "Price pending",
    accent,
    accentSecondary,
    shortDescription: `${languageLabel} sealed ${item.packaging.replace(/-/g, " ")}. Price pending.`,
    description: [
      `Language: ${languageLabel}. Condition: Sealed packaging photo on file.`,
      "No Fuji Card Shop retail price invented; USD sell price pending.",
      item.notes,
    ],
    features: [
      `${languageLabel} sealed product`,
      "Verified packaging photo on file",
      "Tracked shipping options shown at checkout demo",
    ],
    image: imagePath,
    imageRef: item.sourcePageUrl,
    ...(item.releaseDate ? { releaseDate: item.releaseDate } : {}),
  });

  productImages[item.slug] = {
    title: item.name,
    image: imagePath,
    filename,
    source_url: item.sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality: item.matchQuality,
    locked: true,
    attribution:
      item.sourcePageUrl.includes("cardmarket")
        ? "Packaging photo via Cardmarket product image. Trademarks belong to rights holders."
        : "Packaging photo via TCGPlayer CDN (exact product id). Trademarks belong to rights holders.",
  };

  overrides.overrides[item.slug] = {
    image: imagePath,
    filename,
    source_url: item.sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality: item.matchQuality,
    locked: true,
    note: null,
  };

  added.push({
    slug: item.slug,
    language: item.language,
    category: item.category,
    packaging: item.packaging,
    image: imagePath,
    source: item.sourcePageUrl,
  });
  existingSlugs.add(item.slug);
  existingNormNames.add(normalizeName(item.name));
}

writeJson(imagedPath, imaged);
writeJson(productImagesPath, productImages);
writeJson(overridesPath, overrides);

const byLanguage = {};
for (const row of added) {
  byLanguage[row.language] = (byLanguage[row.language] || 0) + 1;
}

const report = {
  added: added.length,
  skipped,
  byLanguage,
  addedSlugs: added.map((r) => r.slug),
  imagedTotal: imaged.length,
};

writeJson(path.join(root, "scripts/.multilang-catalog-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
