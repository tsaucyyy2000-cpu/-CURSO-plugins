import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FUJI_WHATSAPP_E164,
  buildCartInquiryMessage,
  buildProductInquiryMessage,
  buildWhatsAppUrl,
  whatsappLinks,
} from "../src/lib/whatsapp.ts";

describe("whatsapp inquiry builders", () => {
  it("targets the authorized wa.me number", () => {
    const url = whatsappLinks.general();
    assert.ok(url.startsWith(`https://wa.me/${FUJI_WHATSAPP_E164}?text=`));
  });

  it("encodes product inquiry without payment claims", () => {
    const message = buildProductInquiryMessage({
      name: "OP-18 The Dominance of God Booster Box",
      slug: "op-18-the-dominance-of-god-booster-box",
      unitPriceUsd: 76,
      quantity: 2,
      statusLabel: "Pre-order",
    });
    assert.match(message, /Fuji Cards/);
    assert.match(message, /Quantity interested in: 2/);
    assert.match(message, /\$76\.00/);
    assert.match(message, /inquiry only/);
    assert.doesNotMatch(message, /paid order|payment received|reserved/i);

    const url = buildWhatsAppUrl(message);
    assert.ok(url.includes(encodeURIComponent("inquiry only")));
  });

  it("builds cart inquiry with catalog subtotal disclaimer", () => {
    const message = buildCartInquiryMessage({
      lines: [
        {
          name: "M4 Ninja Spinner Booster Box",
          quantity: 1,
          unitPriceUsd: 80,
          slug: "m4-ninja-spinner-booster-box",
        },
      ],
      subtotalUsd: 80,
    });
    assert.match(message, /Listed items subtotal \(USD catalog\): \$80\.00/);
    assert.match(message, /not payment, acceptance, or a reservation/);
  });

  it("builds wholesale and contact links", () => {
    assert.ok(whatsappLinks.wholesale().includes("wa.me/12109018399"));
    assert.ok(whatsappLinks.contact({ name: "Trey" }).includes(encodeURIComponent("Trey")));
  });
});
