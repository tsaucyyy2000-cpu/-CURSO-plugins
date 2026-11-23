/**
 * Import every English Apex sealed SKU with exact packaging evidence into the
 * Fuji retail catalog. Reuses /images/apex/* (no copy) to avoid publish zip bloat.
 *
 * Prices: never invent Fuji retail USD — price stays 0 + "Price pending".
 * Skips Japanese Apex section and closest-line image matches.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apexDir = path.join(root, "public/images/apex");

const accents = [
  ["#0f766e", "#5eead4"],
  ["#1d4ed8", "#93c5fd"],
  ["#7c2d12", "#fdba74"],
  ["#4c1d95", "#c4b5fd"],
  ["#9f1239", "#fda4af"],
  ["#065f46", "#6ee7b7"],
];

/** Known JP storefront twins for EN Apex lines (slug → jp slug). */
const JP_COUNTERPARTS = {
  "en-pokemon-destined-rivals-booster-box": "m4-ninja-spinner-booster-box",
  "en-pokemon-destined-rivals-elite-trainer-box": "m4-ninja-spinner-booster-box",
  "en-pokemon-battle-styles-booster-box": "single-strike-master-booster-box",
  "en-pokemon-evolving-skies-booster-box": "eevee-heroes-booster-box",
  "en-pokemon-fusion-strike-booster-box": "fusion-arts-booster-box",
  "en-pokemon-brilliant-stars-booster-box": "star-birth-booster-box-s9",
  "en-pokemon-lost-origin-booster-box": "lost-abyss-booster-box-s11",
  "en-pokemon-silver-tempest-booster-box": "paradigm-trigger-booster-box-s12",
  "en-pokemon-30th-celebration-elite-trainer-box": "m6a-30th-celebration-booster-box",
  "en-pokemon-30th-celebration-booster-bundle": "m6a-30th-celebration-booster-box",
  "en-pokemon-crown-zenith-elite-trainer-box": "vstar-universe-booster-box-s12a",
  "en-pokemon-crown-zenith-booster-bundle": "vstar-universe-booster-box-s12a",
  "en-pokemon-me-chaos-rising-booster-box": "m5-abyss-eye-booster-box",
  "en-pokemon-me-chaos-rising-elite-trainer-box": "m5-abyss-eye-booster-box",
};

function writeJson(filePath, data) {
  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

function retailSlug(apexSlug) {
  return `en-${apexSlug.replace(/^apex-\d+-/, "")}`;
}

function mapCategory(category) {
  if (category === "mtg" || category === "yugioh" || category === "lorcana") {
    return "other-tcg";
  }
  if (category === "pokemon" || category === "one-piece" || category === "other-tcg") {
    return category;
  }
  return "other-tcg";
}

function packagingFrom(product) {
  const text = `${product.slug} ${product.name} ${product.format}`.toLowerCase();
  if (/sealed[- ]case|\(\d+\s*boxes?\)/.test(text)) {
    return "sealed-case";
  }
  if (/booster bundle|bundle/.test(text)) {
    return "special-set";
  }
  if (/elite trainer|\betb\b|1 etb/.test(text)) {
    return "special-set";
  }
  if (/collection|tin|premium collection|super premium/.test(text)) {
    return "special-set";
  }
  if (/starter|deck/.test(text)) {
    return "deck";
  }
  if (/booster[- ]box|display|1 box/.test(text)) {
    return "booster-box";
  }
  if (/^\d+ packs$/.test(product.format.toLowerCase())) {
    return "booster-box";
  }
  return "other";
}

function isEnglishApexProduct(product) {
  if (/japanese/i.test(product.section)) {
    return false;
  }
  if (/japanese|\bjp\b/i.test(product.name)) {
    return false;
  }
  return true;
}

const GENERIC_APEX_TITLES = new Set([
  "weiss schwarz booster box",
  "union arena booster box",
  "grand archive booster box",
  "altered tcg booster box",
  "metazoo wilderness booster box",
]);

function displayName(name, matchedProductName) {
  const useMatched =
    matchedProductName && GENERIC_APEX_TITLES.has(name.toLowerCase().trim());
  const raw = useMatched ? matchedProductName : name;
  if (/\benglish\b/i.test(raw)) {
    return raw;
  }
  return `${raw} English`;
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

const apex = JSON.parse(readFileSync(path.join(root, "src/data/apex-catalog.json"), "utf8"));
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

/** Map apex base id → already-imported en slug (e.g. pokemon-destined-rivals-booster-box). */
const existingApexBases = new Set();
const existingNormNames = new Set();
for (const product of imaged) {
  if (product.slug.startsWith("en-")) {
    existingApexBases.add(product.slug.replace(/^en-/, ""));
    existingNormNames.add(normalizeName(product.name));
  }
}
for (const slug of existingSlugs) {
  if (slug.startsWith("en-")) {
    existingApexBases.add(slug.replace(/^en-/, ""));
  }
}

const added = [];
const skipped = [];

let index = 0;
for (const product of apex) {
  if (!isEnglishApexProduct(product)) {
    skipped.push({ apexSlug: product.slug, reason: "japanese_apex_section_or_name" });
    continue;
  }

  const meta = apexImages[product.slug];
  if (!meta?.image) {
    skipped.push({ apexSlug: product.slug, reason: "missing_apex_image_meta" });
    continue;
  }
  if (meta.matchQuality !== "exact") {
    skipped.push({
      apexSlug: product.slug,
      reason: `image_not_exact:${meta.matchQuality || "unknown"}`,
    });
    continue;
  }

  const filename = meta.filename || path.basename(meta.image);
  const apexFile = path.join(apexDir, filename);
  if (!existsSync(apexFile)) {
    skipped.push({ apexSlug: product.slug, reason: `missing_apex_file:${filename}` });
    continue;
  }

  const slug = retailSlug(product.slug);
  const apexBase = product.slug.replace(/^apex-\d+-/, "");
  const name = displayName(product.name, meta.matchedProductName);
  if (
    existingSlugs.has(slug) ||
    existingApexBases.has(apexBase) ||
    existingNormNames.has(normalizeName(name))
  ) {
    skipped.push({ apexSlug: product.slug, slug, reason: "already_present" });
    continue;
  }

  const category = mapCategory(product.category);
  const packaging = packagingFrom(product);
  const [accent, accentSecondary] = accents[index % accents.length];
  index += 1;

  const imagePath = meta.image.startsWith("/") ? meta.image : `/images/apex/${filename}`;
  const sourceUrl = meta.source_url || "";
  const jpCounterpart = JP_COUNTERPARTS[slug] || null;

  const entry = {
    slug,
    name,
    price: 0,
    currency: "USD",
    category,
    status: "available",
    badge: "Price pending",
    accent,
    accentSecondary,
    shortDescription: `English sealed ${packaging.replace(/-/g, " ")}. Price pending — no Fuji Card Shop EN listing.`,
    description: [
      "Language: English. Condition: Sealed packaging photo on file (Apex/TCGPlayer exact archive).",
      "No Fuji Card Shop English retail listing found; USD sell price not invented (Apex B2B unit price is not used as retail).",
      `Apex wholesale reference format: ${product.format}. Section: ${product.section}.`,
      jpCounterpart
        ? `Related Japanese storefront SKU: ${jpCounterpart}.`
        : "No direct Japanese twin mapped on the current Fuji JP storefront mirror.",
    ],
    features: [
      "English sealed product",
      "Exact packaging photo from Apex/TCGPlayer catalog archive",
      "Tracked shipping options shown at checkout demo",
    ],
    image: imagePath,
    imageRef: sourceUrl,
  };

  imaged.push(entry);

  productImages[slug] = {
    title: name,
    image: imagePath,
    filename,
    source_url: sourceUrl,
    source_page_url: sourceUrl,
    matchQuality: "exact",
    locked: true,
    attribution:
      "Packaging photo via Apex/TCGPlayer catalog archive (exact). Trademarks belong to rights holders; not an official authenticity claim.",
  };

  overrides.overrides[slug] = {
    image: imagePath,
    filename,
    source_url: sourceUrl,
    source_page_url: sourceUrl,
    matchQuality: "exact",
    locked: true,
    note: null,
  };

  added.push({
    slug,
    apexSlug: product.slug,
    category,
    packaging,
    format: product.format,
    jpCounterpart,
    image: imagePath,
  });
  existingSlugs.add(slug);
  existingApexBases.add(apexBase);
  existingNormNames.add(normalizeName(name));
}

writeJson(path.join(root, "src/data/imaged-products.json"), imaged);
writeJson(path.join(root, "src/data/product-images.json"), productImages);
writeJson(path.join(root, "src/data/image-import-overrides.json"), overrides);

const byCategory = {};
const byPackaging = {};
for (const row of added) {
  byCategory[row.category] = (byCategory[row.category] || 0) + 1;
  byPackaging[row.packaging] = (byPackaging[row.packaging] || 0) + 1;
}

const report = {
  added: added.length,
  skipped: skipped.length,
  byCategory,
  byPackaging,
  skipReasons: skipped.reduce((acc, row) => {
    const key = row.reason.split(":")[0];
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {}),
  addedSlugs: added.map((row) => row.slug),
};

writeJson(path.join(root, "scripts/.english-full-apex-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
