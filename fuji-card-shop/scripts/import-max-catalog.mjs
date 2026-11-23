/**
 * Max sealed catalog pass: import every additional EN sealed SKU with exact
 * TCGPlayer CDN packaging (or Apex closest-line when matchedProductName is the
 * same sealed line). Prices stay 0 / Price pending. No OP-14–18 invent.
 */
import { copyFileSync, createWriteStream, existsSync, readFileSync, writeFileSync } from "node:fs";
import { get } from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pipeline } from "node:stream/promises";

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
 *  tcgplayerId: number,
 *  jpCounterpart?: string | null,
 *  notes: string,
 * }>} */
const TCGPLAYER_IMPORTS = [
  {
    slug: "en-union-arena-rezero-starting-life-in-another-world-booster-box",
    name: "UNION ARENA Re:ZERO -Starting Life in Another World- Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 696138,
    jpCounterpart: "union-arena-rezero-vol-2-ex17bt",
    notes: "EN UE24BT Re:ZERO sealed box. Related to JP Re:ZERO line (EX17BT is JP Vol.2 code; EN uses UE24BT).",
  },
  {
    slug: "en-union-arena-rezero-starting-life-in-another-world-starter-deck",
    name: "UNION ARENA Re:ZERO -Starting Life in Another World- Starter Deck English",
    category: "union-arena",
    packaging: "deck",
    tcgplayerId: 696143,
    jpCounterpart: "union-arena-rezero-vol-2-ex17bt",
    notes: "EN UE24ST Re:ZERO starter. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-bleach-thousand-year-blood-war-vol-3-booster-box",
    name: "UNION ARENA BLEACH Thousand-Year Blood War Vol.3 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 708750,
    jpCounterpart: "union-arena-bleach-ex15bt",
    notes: "EN UEX08BT Bleach Vol.3 display. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-bleach-thousand-year-blood-war-advanced-deck",
    name: "UNION ARENA BLEACH Thousand-Year Blood War Advanced Deck English",
    category: "union-arena",
    packaging: "deck",
    tcgplayerId: 708476,
    jpCounterpart: "union-arena-bleach-ex15bt",
    notes: "EN UE10DC Bleach advanced deck. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-nikke-precious-booster-box",
    name: "UNION ARENA Goddess of Victory: NIKKE Precious Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 704492,
    jpCounterpart: "weiss-schwarz-nikke-vol-2",
    notes: "EN UP01BT NIKKE Precious Booster. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-nikke-booster-box",
    name: "UNION ARENA Goddess of Victory: NIKKE Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 638096,
    jpCounterpart: "weiss-schwarz-nikke-vol-2",
    notes: "EN UE14BT NIKKE booster. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-fullmetal-alchemist-booster-box",
    name: "UNION ARENA Fullmetal Alchemist Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 625108,
    notes: "EN UE09BT Fullmetal Alchemist. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-inuyasha-booster-box",
    name: "UNION ARENA Inuyasha Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 692504,
    notes: "EN UE23BT Inuyasha. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-yu-yu-hakusho-ghost-files-booster-box",
    name: "UNION ARENA Yu Yu Hakusho: Ghost Files Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 635348,
    notes: "EN UE13BT Yu Yu Hakusho. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-sword-art-online-vol-2-booster-box",
    name: "UNION ARENA Sword Art Online Vol.2 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 660047,
    notes: "EN UEX06BT SAO Vol.2. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-sword-art-online-booster-box",
    name: "UNION ARENA Sword Art Online Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 620565,
    notes: "EN UE07BT Sword Art Online. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-attack-on-titan-vol-2-booster-box",
    name: "UNION ARENA Attack on Titan Vol.2 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 696147,
    notes: "EN UEX07BT Attack on Titan Vol.2. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-attack-on-titan-booster-box",
    name: "UNION ARENA Attack on Titan Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 625102,
    notes: "EN UE10BT Attack on Titan. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-code-geass-lelouch-of-the-rebellion-booster-box",
    name: "UNION ARENA Code Geass: Lelouch of the Rebellion Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 585094,
    notes: "EN UE04BT Code Geass. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-kagurabachi-booster-box",
    name: "UNION ARENA Kagurabachi Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 660060,
    notes: "EN UE16BT Kagurabachi. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-tokyo-ghoul-booster-box",
    name: "UNION ARENA Tokyo Ghoul Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 660072,
    notes: "EN UE18BT Tokyo Ghoul. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-my-hero-academia-special-booster-box",
    name: "UNION ARENA My Hero Academia Special Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 714370,
    notes: "EN UE25BT My Hero Academia Special Booster. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-sakamoto-days-booster-box",
    name: "UNION ARENA Sakamoto Days Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 666606,
    notes: "EN UE19BT Sakamoto Days. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-black-clover-booster-box",
    name: "UNION ARENA Black Clover Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 607857,
    notes: "EN UE08BT Black Clover. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-chainsaw-man-booster-box",
    name: "UNION ARENA Chainsaw Man Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 685552,
    notes: "EN UE22BT Chainsaw Man. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-jujutsu-kaisen-booster-box",
    name: "UNION ARENA Jujutsu Kaisen Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 552477,
    notes: "EN UE03BT Jujutsu Kaisen. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-jujutsu-kaisen-vol-2-booster-box",
    name: "UNION ARENA Jujutsu Kaisen Vol.2 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 607882,
    notes: "EN UEX02BT Jujutsu Kaisen Vol.2. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-rurouni-kenshin-booster-box",
    name: "UNION ARENA Rurouni Kenshin Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 626502,
    notes: "EN UE11BT Rurouni Kenshin. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-kaiju-no-8-booster-box",
    name: "UNION ARENA Kaiju No. 8 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 625081,
    notes: "EN UE12BT Kaiju No. 8. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-hunter-x-hunter-booster-box",
    name: "UNION ARENA Hunter x Hunter Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 552227,
    notes: "EN UE02BT Hunter x Hunter. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-hunter-x-hunter-vol-2-booster-box",
    name: "UNION ARENA Hunter x Hunter Vol.2 Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 624229,
    notes: "EN UEX04BT Hunter x Hunter Vol.2. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-evangelion-new-theatrical-edition-booster-box",
    name: "UNION ARENA Evangelion: New Theatrical Edition Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 660052,
    notes: "EN UE15BT Evangelion. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-solo-leveling-booster-box-first-edition",
    name: "UNION ARENA Solo Leveling Booster Box First Edition English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 660067,
    notes: "EN UE17BT Solo Leveling First Edition. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-solo-leveling-booster-box-second-edition",
    name: "UNION ARENA Solo Leveling Booster Box Second Edition English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 709842,
    notes: "EN UE17BT Solo Leveling Second Edition. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-umamusume-pretty-derby-booster-box",
    name: "UNION ARENA Umamusume: Pretty Derby Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 729782,
    notes: "EN UE27BT Umamusume Pretty Derby. Exact TCGPlayer packaging.",
  },
  {
    slug: "en-union-arena-one-punch-man-booster-box",
    name: "UNION ARENA One Punch Man Booster Box English",
    category: "union-arena",
    packaging: "booster-box",
    tcgplayerId: 604236,
    notes: "EN UE06BT One Punch Man under explicit slug (replaces generic naming elsewhere if present).",
  },
];

/** Apex closest-line salvage only when matchedProductName is clearly that sealed line. */
const APEX_SALVAGE = [
  {
    apexSlug: "apex-197-battle-spirits-saga-booster-box",
    slug: "en-battle-spirits-saga-false-gods-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-199-sorcery-contested-realm-booster-box",
    slug: "en-sorcery-contested-realm-beta-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-185-star-wars-unlimited-starter-set",
    slug: "en-star-wars-unlimited-shadows-of-the-galaxy-two-player-starter",
    category: "other-tcg",
    packaging: "deck",
  },
  {
    apexSlug: "apex-194-dragon-ball-super-fusion-world-starter-deck",
    slug: "en-dragon-ball-super-fusion-world-starter-deck-21",
    category: "other-tcg",
    packaging: "deck",
  },
  {
    apexSlug: "apex-165-digimon-bt-18-element-successor-booster-box",
    slug: "en-digimon-exceed-apocalypse-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-166-digimon-bt-19-xros-evolution-booster-box",
    slug: "en-digimon-xros-encounter-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-167-digimon-bt-20-over-the-x-booster-box",
    slug: "en-digimon-world-convergence-booster-box",
    category: "other-tcg",
    packaging: "booster-box",
  },
  {
    apexSlug: "apex-139-yu-gi-oh-2023-mega-tin",
    slug: "en-yu-gi-oh-25th-anniversary-tin-dueling-heroes",
    category: "other-tcg",
    packaging: "special-set",
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
    .replace(/union arena\s+/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    get(url, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      pipeline(res, file).then(resolve).catch(reject);
    }).on("error", reject);
  });
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
    return false;
  }
  const rel = imagePath.replace(/^\//, "");
  if (!existsSync(path.join(root, "public", rel))) {
    skipped.push({ slug: item.slug, reason: `missing_file:${rel}` });
    return false;
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
  return true;
}

for (const item of TCGPLAYER_IMPORTS) {
  const filename = `${item.slug}.jpg`;
  const dest = path.join(productsDir, filename);
  const cdn = `https://tcgplayer-cdn.tcgplayer.com/product/${item.tcgplayerId}_in_1000x1000.jpg`;
  const page = `https://www.tcgplayer.com/product/${item.tcgplayerId}`;
  try {
    if (!existsSync(dest)) {
      await download(cdn, dest);
    }
  } catch (error) {
    skipped.push({ slug: item.slug, reason: `cdn_download_failed:${String(error)}` });
    continue;
  }
  pushProduct(
    {
      ...item,
      sourcePageUrl: page,
      jpCounterpart: item.jpCounterpart ?? null,
    },
    `/images/products/${filename}`,
    filename,
    cdn,
    "exact",
    "Packaging photo via TCGPlayer CDN (exact product id). Trademarks belong to rights holders.",
  );
}

for (const salvage of APEX_SALVAGE) {
  const meta = apexImages[salvage.apexSlug];
  if (!meta?.image || !meta.matchedProductName) {
    skipped.push({ slug: salvage.slug, reason: "missing_apex_meta" });
    continue;
  }
  const filename = meta.filename || path.basename(meta.image);
  const apexFile = path.join(apexDir, filename);
  if (!existsSync(apexFile)) {
    skipped.push({ slug: salvage.slug, reason: `missing_apex_file:${filename}` });
    continue;
  }
  pushProduct(
    {
      slug: salvage.slug,
      name: withEnglish(meta.matchedProductName),
      category: salvage.category,
      packaging: salvage.packaging,
      sourcePageUrl: meta.source_url || "https://www.tcgplayer.com/",
      jpCounterpart: null,
      notes: `Apex closest-line salvage: packaging is for matchedProductName "${meta.matchedProductName}" (not the Apex generic/wrong-code title).`,
    },
    meta.image.startsWith("/") ? meta.image : `/images/apex/${filename}`,
    filename,
    meta.source_url || "",
    "closest-line",
    "Packaging photo via Apex/TCGPlayer archive (closest-line, matchedProductName used as SKU title). Trademarks belong to rights holders.",
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
  imagedTotal: imaged.length,
};

writeJson(path.join(root, "scripts/.max-catalog-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
