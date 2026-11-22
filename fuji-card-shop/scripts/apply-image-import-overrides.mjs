#!/usr/bin/env node
/**
 * Apply locked per-SKU image overrides so sealed-case fronts cannot be
 * re-merged onto booster-box CDN assets during catalog re-import.
 *
 * Usage: node scripts/apply-image-import-overrides.mjs [--dry-run]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dryRun = process.argv.includes("--dry-run");

function loadJson(rel) {
  return JSON.parse(readFileSync(join(root, rel), "utf8"));
}

function stringifyJson(data, { escapeNonAscii }) {
  const raw = JSON.stringify(data, null, 2);
  if (!escapeNonAscii) {
    return `${raw}\n`;
  }
  // imaged-products.json historically stores non-ASCII as \\u escapes.
  return `${raw.replace(/[\u007f-\uffff]/g, (ch) => {
    const code = ch.codePointAt(0);
    if (code === undefined || code <= 0xffff) {
      return `\\u${(code ?? 0).toString(16).padStart(4, "0")}`;
    }
    const hi = Math.floor((code - 0x10000) / 0x400) + 0xd800;
    const lo = ((code - 0x10000) % 0x400) + 0xdc00;
    return `\\u${hi.toString(16).padStart(4, "0")}\\u${lo.toString(16).padStart(4, "0")}`;
  })}\n`;
}

function writeJson(rel, data, { escapeNonAscii = false } = {}) {
  if (dryRun) {
    console.log(`[dry-run] would write ${rel}`);
    return;
  }
  writeFileSync(join(root, rel), stringifyJson(data, { escapeNonAscii }));
  console.log(`wrote ${rel}`);
}

const { overrides } = loadJson("src/data/image-import-overrides.json");
const productImages = loadJson("src/data/product-images.json");
const imagedProducts = loadJson("src/data/imaged-products.json");

let blocked = 0;
let applied = 0;

for (const [slug, override] of Object.entries(overrides)) {
  const forbidden = override.forbidden_image_substrings ?? [];
  const candidateImage = override.image;
  for (const needle of forbidden) {
    if (candidateImage.includes(needle)) {
      console.error(`BLOCKED: override for ${slug} uses forbidden image substring ${needle}`);
      blocked += 1;
    }
  }

  const existing = productImages[slug] ?? {};
  const next = {
    ...existing,
    title: existing.title ?? override.title,
    image: override.image,
    filename: override.filename ?? existing.filename,
    source_url: override.source_url ?? existing.source_url,
    source_page_url: override.source_page_url ?? existing.source_page_url,
    matchQuality: override.matchQuality ?? existing.matchQuality ?? "exact",
    imageAlt: override.imageAlt ?? existing.imageAlt,
    note: override.note ?? existing.note,
    attribution: override.attribution ?? existing.attribution,
    locked: true,
  };

  for (const needle of forbidden) {
    if (typeof next.image === "string" && next.image.includes(needle)) {
      console.error(`BLOCKED write: ${slug} would keep forbidden image ${next.image}`);
      blocked += 1;
      continue;
    }
  }

  productImages[slug] = next;
  applied += 1;

  if (Array.isArray(imagedProducts)) {
    const idx = imagedProducts.findIndex((row) => row.slug === slug);
    if (idx >= 0) {
      const row = imagedProducts[idx];
      const nextImage = override.image;
      for (const needle of forbidden) {
        if (nextImage.includes(needle)) {
          console.error(`BLOCKED imaged-products: ${slug}`);
          blocked += 1;
          continue;
        }
      }
      imagedProducts[idx] = {
        ...row,
        image: override.image,
        imageRef: override.source_url ?? row.imageRef,
      };
    }
  }
}

// Guard: OP-14 case fallback must keep closest-line + Booster box shown note
const box = productImages["op-14-the-azure-seas-seven-booster-box"];
const cas = productImages["op-14-the-azure-seas-seven-sealed-case"];
if (cas?.matchQuality !== "closest-line" || cas?.note !== "Booster box shown.") {
  console.error("BLOCKED: OP-14 sealed-case must stay closest-line with note 'Booster box shown.'");
  process.exit(1);
}
if (cas?.image?.includes("op-14-the-azure-seas-seven-sealed-case.jpg")) {
  console.error("BLOCKED: OP-14 case must not use unverified eBay carton path while rights/set ID unconfirmed");
  process.exit(1);
}
if (!box?.image?.includes("OP-14-bb")) {
  console.error("BLOCKED: OP-14 booster-box front missing");
  process.exit(1);
}

writeJson("src/data/product-images.json", productImages, { escapeNonAscii: false });
writeJson("src/data/imaged-products.json", imagedProducts, { escapeNonAscii: true });

console.log(
  JSON.stringify(
    {
      applied,
      blocked,
      dryRun,
      op14: { box: box?.image, case: cas?.image, distinct: box?.image !== cas?.image },
    },
    null,
    2,
  ),
);

if (blocked > 0) {
  process.exit(1);
}
