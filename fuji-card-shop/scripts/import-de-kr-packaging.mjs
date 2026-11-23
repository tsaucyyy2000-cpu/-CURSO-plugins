/**
 * DE / KR (+ FR / IT) sealed packaging import.
 * Only language-verified packaging photos (official Pokémon Center / tcg.pokemon.com
 * or clear retailer product photography with Hangul / Sammelkartenspiel / etc.).
 * Prices stay 0 / Price pending. English-first default unchanged.
 * Checked 2026-11-23.
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
 *  attribution: string,
 *  status?: string,
 * }} ImportItem */

/** @type {ImportItem[]} */
const IMPORTS = [
  // —— German (official Pokémon Center DE + tcg.pokemon.com DE + DE retailers) ——
  {
    slug: "de-pokemon-dunkelnacht-booster-display",
    name: "Pokémon Mega-Entwicklung Dunkelnacht Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-dunkelnacht-display.jpg",
    sourceUrl:
      "https://www.pokemoncenter.com/images/DAMRoot/High/10035/P11220_10-10425-103_01.jpg",
    sourcePageUrl:
      "https://www.pokemoncenter.com/de-de/product/10-10425-103/pokemon-sammelkartenspiel-boosterpack-display-box-mega-entwicklung-dunkelnacht-36-boosterpacks",
    matchQuality: "exact",
    notes:
      "Official Pokémon Center DE product photo. Packaging shows SAMMELKARTENSPIEL + DUNKELNACHT. Checked 2026-11-23.",
    attribution:
      "Official packaging photo via Pokémon Center Deutschland. Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-delta-herrschaft-booster-display",
    name: "Pokémon Mega-Entwicklung Delta-Herrschaft Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-delta-herrschaft-display.jpg",
    sourceUrl:
      "https://www.pokemoncenter.com/images/DAMRoot/High/10060/P11222_10-10446-103_01.jpg",
    sourcePageUrl:
      "https://www.pokemoncenter.com/de-de/product/10-10446-103/pokemon-sammelkartenspiel-boosterpack-display-box-mega-entwicklung-delta-herrschaft-36-boosterpacks",
    matchQuality: "exact",
    notes:
      "Official Pokémon Center DE product photo. Packaging shows SAMMELKARTENSPIEL + DELTA-HERRSCHAFT. Checked 2026-11-23.",
    attribution:
      "Official packaging photo via Pokémon Center Deutschland. Trademarks belong to rights holders.",
    status: "preorder",
  },
  {
    slug: "de-pokemon-fatale-flammen-booster-display",
    name: "Pokémon Mega-Entwicklung Fatale Flammen Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-fatale-flammen-display.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/de-de/me02-booster-display-de.png",
    sourcePageUrl: "https://tcg.pokemon.com/de-de/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes:
      "Official tcg.pokemon.com DE expansion asset (me02-booster-display-de). Shows SAMMELKARTENSPIEL + FATALE FLAMMEN. Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (DE). Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-fatale-flammen-pokemon-center-top-trainer-box",
    name: "Pokémon Mega-Entwicklung Fatale Flammen Pokémon Center Top-Trainer-Box German",
    category: "pokemon",
    packaging: "special-set",
    language: "german",
    stagingFile: "de-fatale-flammen-pc-etb.jpg",
    sourceUrl:
      "https://www.pokemoncenter.com/images/DAMRoot/High/10025/P10347_10-10186-110_01.jpg",
    sourcePageUrl:
      "https://www.pokemoncenter.com/de-de/product/10-10186-110/pokemon-tcg-mega-evolution-phantasmal-flames-pokemon-center-elite-trainer-box-de",
    matchQuality: "exact",
    notes:
      "Official Pokémon Center DE exclusive Top-Trainer-Box. Packaging shows SAMMELKARTENSPIEL + FATALE FLAMMEN + Pokémon Center. Checked 2026-11-23.",
    attribution:
      "Official packaging photo via Pokémon Center Deutschland. Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-fatale-flammen-top-trainer-box",
    name: "Pokémon Mega-Entwicklung Fatale Flammen Top-Trainer-Box German",
    category: "pokemon",
    packaging: "special-set",
    language: "german",
    stagingFile: "de-fatale-flammen-etb.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/de-de/me02-etb-de.png",
    sourcePageUrl: "https://tcg.pokemon.com/de-de/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes:
      "Official tcg.pokemon.com DE ETB asset (me02-etb-de). Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (DE). Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-fatale-flammen-booster-bundle",
    name: "Pokémon Mega-Entwicklung Fatale Flammen Boosterbundle German",
    category: "pokemon",
    packaging: "special-set",
    language: "german",
    stagingFile: "de-fatale-flammen-bundle.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/de-de/me02-booster-bundle-de.png",
    sourcePageUrl: "https://tcg.pokemon.com/de-de/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes:
      "Official tcg.pokemon.com DE booster bundle asset (me02-booster-bundle-de). Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (DE). Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-mega-entwicklung-booster-display",
    name: "Pokémon Mega-Entwicklung Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-mega-entwicklung-display.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me01/collections/de-de/me01-booster-display-de.png",
    sourcePageUrl: "https://tcg.pokemon.com/de-de/expansions/mega-evolution/",
    matchQuality: "exact",
    notes:
      "Official tcg.pokemon.com DE ME01 booster display asset. Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (DE). Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-wachsendes-chaos-booster-display",
    name: "Pokémon Mega-Entwicklung Wachsendes Chaos Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-wachsendes-chaos-display.jpg",
    sourceUrl:
      "https://games-island.eu/media/image/product/1132542/lg/pokemon-tcg-mega-entwicklung-04-wachsendes-chaos-booster-display-deutsch.webp",
    sourcePageUrl:
      "https://games-island.eu/Pokemon-TCG-Mega-Entwicklung-04-Wachsendes-Chaos-Booster-Display-Deutsch",
    matchQuality: "exact",
    notes:
      "DE retailer product photo. Packaging shows SAMMELKARTENSPIEL + WACHSENDES CHAOS. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via Games Island (DE listing). Trademarks belong to rights holders.",
  },
  {
    slug: "de-pokemon-ewige-rivalen-booster-display",
    name: "Pokémon Karmesin & Purpur Ewige Rivalen Booster-Display German",
    category: "pokemon",
    packaging: "booster-box",
    language: "german",
    stagingFile: "de-ewige-rivalen-display.jpg",
    sourceUrl:
      "https://www.tabletop-dragon.de/media/catalog/product/cache/678f0f442fd72d9e0c1cda66621015b6/x/_/x_pci11077.jpg",
    sourcePageUrl:
      "https://www.tabletop-dragon.de/shop_de/kp10-karmesin-purpur-ewige-rivalen-display-deutsch-36-booster.html",
    matchQuality: "exact",
    notes:
      "DE retailer product photo. Packaging shows SAMMELKARTENSPIEL + Ewige Rivalen. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via tabletop-dragon.de. Trademarks belong to rights holders.",
  },

  // —— Korean (PokeUnlimited retailer product photography; Hangul verified) ——
  {
    slug: "kr-pokemon-inferno-x-booster-box",
    name: "Pokémon MEGA Inferno X M2 Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-inferno-x.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-inferno-x-booster-box-m2-korean-4231938.jpg?v=1793712968&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-mega-inferno-x-booster-box-korean",
    matchQuality: "exact",
    notes:
      "Retailer sealed photo. Hangul 인페르노X + 포켓몬 카드 게임 verified on packaging. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-mega-brave-booster-box",
    name: "Pokémon Mega Brave M1L Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-mega-brave.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-brave-booster-box-m1l-korean-4687893.jpg?v=1793713027&width=900",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-mega-brave-m1l-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 메가브레이브 packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-nihil-zero-booster-box",
    name: "Pokémon Nihil Zero M3 Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-nihil-zero.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-nihil-zero-booster-box-m3-korean-9050090.jpg?v=1793712847&width=900",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-mega-nihil-zero-m3-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 니힐제로 + M3 packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-terastal-festival-booster-box",
    name: "Pokémon Terastal Festival ex SV8a Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-terastal-festival.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-scarlet-violet-terastal-festival-booster-box-sv8a-korean-9803750.jpg?v=1793713269&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-terastal-festival-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 테라스탈페스타 ex + sv8a packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-dream-ex-booster-box",
    name: "Pokémon MEGA Dream ex M2a Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-dream-ex.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-dream-ex-booster-box-m2a-korean-9453732.jpg?v=1793712908&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-mega-dream-ex-m2a-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 드림 ex + M2a high-class pack packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-heat-wave-arena-booster-box",
    name: "Pokémon Heat Wave Arena SV9a Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-heat-wave-arena.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-scarlet-violet-heat-wave-arena-booster-box-sv9a-korean-5987383.jpg?v=1793713148&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-heat-wave-arena-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 열풍의 아레나 + SV9a packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-mega-symphonia-booster-box",
    name: "Pokémon Mega Symphonia M1S Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-mega-symphonia.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-symphonia-booster-box-m1s-korean-4725603.jpg?v=1793713028&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-mega-symphonia-m1s-booster-box-korean",
    matchQuality: "exact",
    notes: "Korean Mega Symphonia M1S sealed box packaging. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-glory-of-team-rocket-booster-box",
    name: "Pokémon The Glory of Team Rocket SV10 Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-glory-team-rocket.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-scarlet-violet-the-glory-of-team-rocket-booster-box-sv10-korean-5207241.jpg?v=1793713147&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-tcg-the-glory-of-team-rocket-booster-box-korean",
    matchQuality: "exact",
    notes: "Korean SV10 Glory of Team Rocket sealed box. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },
  {
    slug: "kr-pokemon-ninja-spinner-booster-box",
    name: "Pokémon Ninja Spinner M4 Booster Box Korean",
    category: "pokemon",
    packaging: "booster-box",
    language: "korean",
    stagingFile: "kr-ninja-spinner.jpg",
    sourceUrl:
      "https://pokeunlimited.com/cdn/shop/files/pokemon-tcg-mega-ninja-spinner-booster-box-m4-korean-6167001.jpg?v=1793712788&width=1600",
    sourcePageUrl:
      "https://pokeunlimited.com/products/pokemon-mega-ninja-spinner-m4-booster-box-korean",
    matchQuality: "exact",
    notes: "Hangul 닌자스피너 + M4 packaging verified. Checked 2026-11-23.",
    attribution:
      "Retailer packaging photo via PokeUnlimited (Korean listing). Trademarks belong to rights holders.",
  },

  // —— French (official tcg.pokemon.com FR assets) ——
  {
    slug: "fr-pokemon-flammes-fantasmagoriques-booster-display",
    name: "Pokémon Méga-Évolution Flammes Fantasmagoriques Booster Display French",
    category: "pokemon",
    packaging: "booster-box",
    language: "french",
    stagingFile: "fr-flammes-fantasmagoriques-display.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/fr-fr/me02-booster-display-fr.png",
    sourcePageUrl: "https://tcg.pokemon.com/fr-fr/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes:
      "Official FR asset. Packaging shows CARTES À JOUER ET À COLLECTIONNER + FLAMMES FANTASMAGORIQUES. Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (FR). Trademarks belong to rights holders.",
  },
  {
    slug: "fr-pokemon-flammes-fantasmagoriques-top-trainer-box",
    name: "Pokémon Méga-Évolution Flammes Fantasmagoriques Coffret Dresseur d'élite French",
    category: "pokemon",
    packaging: "special-set",
    language: "french",
    stagingFile: "fr-flammes-fantasmagoriques-etb.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/fr-fr/me02-etb-fr.png",
    sourcePageUrl: "https://tcg.pokemon.com/fr-fr/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes: "Official FR ETB asset (me02-etb-fr). Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (FR). Trademarks belong to rights holders.",
  },

  // —— Italian (official tcg.pokemon.com IT assets) ——
  {
    slug: "it-pokemon-fiamme-spettrali-booster-display",
    name: "Pokémon Megaevoluzione Fiamme Spettrali Booster Display Italian",
    category: "pokemon",
    packaging: "booster-box",
    language: "italian",
    stagingFile: "it-fiamme-spettrali-display.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/it-it/me02-booster-display-it.png",
    sourcePageUrl: "https://tcg.pokemon.com/it-it/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes:
      "Official IT asset. Packaging shows GIOCO DI CARTE COLLEZIONABILI + FIAMME SPETTRALI. Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (IT). Trademarks belong to rights holders.",
  },
  {
    slug: "it-pokemon-fiamme-spettrali-top-trainer-box",
    name: "Pokémon Megaevoluzione Fiamme Spettrali Set Allenatore Fuoriclasse Italian",
    category: "pokemon",
    packaging: "special-set",
    language: "italian",
    stagingFile: "it-fiamme-spettrali-etb.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me02/collections/it-it/me02-etb-it.png",
    sourcePageUrl: "https://tcg.pokemon.com/it-it/expansions/phantasmal-flames/",
    matchQuality: "exact",
    notes: "Official IT ETB asset (me02-etb-it). Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (IT). Trademarks belong to rights holders.",
  },
  {
    slug: "it-pokemon-megaevoluzione-booster-display",
    name: "Pokémon Megaevoluzione Booster Display Italian",
    category: "pokemon",
    packaging: "booster-box",
    language: "italian",
    stagingFile: "it-megaevoluzione-display.jpg",
    sourceUrl:
      "https://d1i787aglh9bmb.cloudfront.net/assets/img/me-expansions/me01/collections/it-it/me01-booster-display-it.png",
    sourcePageUrl: "https://tcg.pokemon.com/it-it/expansions/mega-evolution/",
    matchQuality: "exact",
    notes: "Official IT ME01 booster display asset. Checked 2026-11-23.",
    attribution:
      "Official packaging render via Pokémon TCG portal (IT). Trademarks belong to rights holders.",
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

function languageLabel(language) {
  switch (language) {
    case "german":
      return "German";
    case "korean":
      return "Korean";
    case "french":
      return "French";
    case "italian":
      return "Italian";
    case "chinese":
      return "Chinese";
    case "japanese":
      return "Japanese";
    case "english":
      return "English";
    default:
      return "Other";
  }
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

  const label = languageLabel(item.language);

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
    shortDescription: `${label} sealed ${item.packaging.replace(/-/g, " ")}. Price pending.`,
    description: [
      `Language: ${label}. Condition: Sealed packaging photo on file.`,
      "No Fuji Card Shop retail price invented; USD sell price pending.",
      item.notes,
    ],
    features: [
      `${label} sealed product`,
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
    source_url: item.sourceUrl,
    source_page_url: item.sourcePageUrl,
    matchQuality: item.matchQuality,
    locked: true,
    attribution: item.attribution,
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
  checkedDate: "2026-11-23",
};

writeJson(path.join(root, "scripts/.de-kr-packaging-import-result.json"), report);
console.log(JSON.stringify(report, null, 2));
