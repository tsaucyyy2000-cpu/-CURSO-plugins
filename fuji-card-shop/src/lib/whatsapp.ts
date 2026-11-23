/**
 * WhatsApp inquiry helpers (ported from Codex fuji-card order-request patterns).
 * Opening a wa.me link is a request only — never payment, acceptance, or reservation.
 */

export const FUJI_WHATSAPP_E164 = "12109018399";
export const FUJI_WHATSAPP_DISPLAY = "+1 210-901-8399";

export type WhatsAppLine = {
  name: string;
  quantity: number;
  unitPriceUsd?: number;
  slug?: string;
};

function sanitizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildWhatsAppUrl(message: string, phoneDigits = FUJI_WHATSAPP_E164): string {
  const digits = phoneDigits.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralInquiryMessage(): string {
  return [
    "Hello Fuji Cards,",
    "",
    "I have a general question about your sealed TCG catalog / shipping.",
    "Please reply when you can — this is an inquiry only, not a paid order.",
    "",
    "Thank you.",
  ].join("\n");
}

export function buildProductInquiryMessage(input: {
  name: string;
  slug?: string;
  unitPriceUsd?: number;
  quantity?: number;
  statusLabel?: string;
}): string {
  const qty = Math.max(1, Math.floor(input.quantity ?? 1));
  const priceLine =
    typeof input.unitPriceUsd === "number"
      ? `• Listed unit price (USD catalog): $${input.unitPriceUsd.toFixed(2)}`
      : "• Listed unit price: see storefront catalog";
  const statusLine = input.statusLabel
    ? `• Storefront status: ${sanitizeText(input.statusLabel)}`
    : null;
  const slugLine = input.slug ? `• Product path: /product/${sanitizeText(input.slug)}` : null;

  return [
    "Hello Fuji Cards,",
    "",
    "I would like to inquire about availability for this product:",
    `• Product: ${sanitizeText(input.name)}`,
    `• Quantity interested in: ${qty}`,
    priceLine,
    statusLine,
    slugLine,
    "",
    "Please confirm current availability, shipping options, and payment method.",
    "This WhatsApp message is an inquiry only — not payment, acceptance, or a reservation.",
    "",
    "Thank you.",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function buildCartInquiryMessage(input: {
  lines: WhatsAppLine[];
  subtotalUsd?: number;
}): string {
  const body: string[] = [
    "Hello Fuji Cards,",
    "",
    "I would like to inquire about availability for these sealed products:",
    "",
  ];

  for (const [index, line] of input.lines.entries()) {
    const qty = Math.max(1, Math.floor(line.quantity));
    const price =
      typeof line.unitPriceUsd === "number"
        ? `$${line.unitPriceUsd.toFixed(2)} USD catalog`
        : "see catalog";
    body.push(
      `[Item ${index + 1}] ${sanitizeText(line.name)}`,
      `   • Quantity: ${qty}`,
      `   • Unit price: ${price}`,
      line.slug ? `   • Path: /product/${sanitizeText(line.slug)}` : "",
      "",
    );
  }

  if (typeof input.subtotalUsd === "number") {
    body.push(`Listed items subtotal (USD catalog): $${input.subtotalUsd.toFixed(2)}`);
  }

  body.push(
    "Shipping, taxes, and final amount: to be confirmed by Fuji Cards.",
    "",
    "Please confirm availability and next steps.",
    "This WhatsApp message is an inquiry only — not payment, acceptance, or a reservation.",
    "",
    "Thank you.",
  );

  return body.filter((line) => line !== "").join("\n");
}

export function buildWholesaleInquiryMessage(): string {
  return [
    "Hello Fuji Cards,",
    "",
    "I am interested in wholesale / Apex B2B sealed product pricing.",
    "Please share current availability, case packs, and quote requirements.",
    "",
    "This WhatsApp message is an inquiry only — not a purchase order or payment.",
    "",
    "Thank you.",
  ].join("\n");
}

export function buildContactInquiryMessage(input?: {
  name?: string;
  email?: string;
  orderRef?: string;
  message?: string;
}): string {
  const lines = [
    "Hello Fuji Cards,",
    "",
    "Contact inquiry from the storefront:",
  ];
  if (input?.name) {
    lines.push(`• Name: ${sanitizeText(input.name)}`);
  }
  if (input?.email) {
    lines.push(`• Email: ${sanitizeText(input.email)}`);
  }
  if (input?.orderRef) {
    lines.push(`• Order / reference: ${sanitizeText(input.orderRef)}`);
  }
  if (input?.message) {
    lines.push("", sanitizeText(input.message));
  }
  lines.push(
    "",
    "This WhatsApp message is an inquiry only — not payment, acceptance, or a reservation.",
    "",
    "Thank you.",
  );
  return lines.join("\n");
}

export const whatsappLinks = {
  general: () => buildWhatsAppUrl(buildGeneralInquiryMessage()),
  product: (input: Parameters<typeof buildProductInquiryMessage>[0]) =>
    buildWhatsAppUrl(buildProductInquiryMessage(input)),
  cart: (input: Parameters<typeof buildCartInquiryMessage>[0]) =>
    buildWhatsAppUrl(buildCartInquiryMessage(input)),
  wholesale: () => buildWhatsAppUrl(buildWholesaleInquiryMessage()),
  contact: (input?: Parameters<typeof buildContactInquiryMessage>[0]) =>
    buildWhatsAppUrl(buildContactInquiryMessage(input)),
};
