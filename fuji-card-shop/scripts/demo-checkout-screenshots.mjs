import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.FUJI_BASE_URL ?? "http://127.0.0.1:3010";
const OUT = process.env.FUJI_SHOT_DIR ?? "/cursor/stores/bc-4def6ec3-e169-4d36-ace1-7746b505cc6d/media";
const PRODUCT = "/product/m7-aura-seeker-booster-box";

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}${PRODUCT}`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /pre-order|add to cart/i }).first().click();
  await page.waitForTimeout(400);

  await page.goto(`${BASE}/cart`, { waitUntil: "networkidle" });
  await page.waitForSelector("text=Your cart");
  await page.screenshot({
    path: path.join(OUT, "fuji-checkout-cart.png"),
    fullPage: true,
  });

  await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle" });
  await page.getByLabel("Full name").fill("Demo Collector");
  await page.getByLabel("Email").fill("demo@example.com");
  await page.getByLabel("Address").fill("123 Demo Street, Funabashi, 273-0011");
  await page.screenshot({
    path: path.join(OUT, "fuji-checkout-checkout.png"),
    fullPage: true,
  });

  await page.getByRole("button", { name: "Continue to review" }).click().catch(async () => {
    await page.getByRole("button", { name: "Review" }).click();
  });
  await page.waitForSelector("text=Confirm details");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Place demo order" }).first().click();
  await page.waitForURL("**/checkout/confirmation");
  await page.waitForSelector("text=Demo order recorded locally");
  await page.screenshot({
    path: path.join(OUT, "fuji-checkout-confirmation.png"),
    fullPage: true,
  });

  // Validation smoke: empty cart blocks checkout
  await page.goto(`${BASE}/checkout`, { waitUntil: "networkidle" });
  const emptyCopy = await page.locator("text=Your cart is empty").count();
  if (emptyCopy < 1) {
    throw new Error("Expected empty-cart guard on checkout after confirmation");
  }

  // Contact validation smoke
  await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Stage demo message" }).click();
  const contactErrors = await page.locator(".field-error").count();
  if (contactErrors < 1) {
    throw new Error("Expected contact form validation errors");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        shots: [
          "fuji-checkout-cart.png",
          "fuji-checkout-checkout.png",
          "fuji-checkout-confirmation.png",
        ],
        emptyCartGuard: true,
        contactValidation: true,
      },
      null,
      2,
    ),
  );

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
