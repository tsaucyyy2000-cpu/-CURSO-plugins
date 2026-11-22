import { z } from "zod";
import type { CartLine } from "@/lib/cart";

export const PAYMENT_METHODS = [
  { value: "card", label: "Credit Card" },
  { value: "google", label: "Google Pay" },
  { value: "apple", label: "Apple Pay" },
  { value: "paypal", label: "PayPal" },
] as const;

export const SHIPPING_COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "EU", label: "European Union" },
  { value: "AU", label: "Australia" },
  { value: "JP", label: "Japan" },
  { value: "OTHER", label: "Other" },
] as const;

export const CheckoutDetailsSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your full name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address.")
    .max(200, "Email is too long."),
  country: z.union([
    z.literal("US"),
    z.literal("CA"),
    z.literal("GB"),
    z.literal("EU"),
    z.literal("AU"),
    z.literal("JP"),
    z.literal("OTHER"),
  ]),
  address: z
    .string()
    .trim()
    .min(8, "Enter a complete shipping address.")
    .max(500, "Address is too long."),
  payment: z.union([
    z.literal("card"),
    z.literal("google"),
    z.literal("apple"),
    z.literal("paypal"),
  ]),
});

export const ContactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Enter your name.")
    .max(120, "Name is too long."),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address.")
    .email("Enter a valid email address.")
    .max(200, "Email is too long."),
  order: z.string().trim().max(80, "Order number is too long.").optional(),
  message: z
    .string()
    .trim()
    .min(10, "Enter a message of at least 10 characters.")
    .max(2000, "Message is too long."),
});

export type CheckoutDetails = z.infer<typeof CheckoutDetailsSchema>;
export type ContactFormValues = z.infer<typeof ContactFormSchema>;

export type DemoOrderLine = {
  slug: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type DemoOrder = {
  id: string;
  createdAt: string;
  details: CheckoutDetails;
  lines: DemoOrderLine[];
  itemCount: number;
  subtotal: number;
};

const DRAFT_KEY = "fuji-card-shop-checkout-draft-v1";
const ORDER_KEY = "fuji-card-shop-demo-order-v1";

export const emptyCheckoutDetails: CheckoutDetails = {
  name: "",
  email: "",
  country: "US",
  address: "",
  payment: "card",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function paymentLabel(value: CheckoutDetails["payment"]): string {
  for (const method of PAYMENT_METHODS) {
    if (method.value === value) {
      return method.label;
    }
  }
  return "Payment method";
}

export function countryLabel(value: CheckoutDetails["country"]): string {
  for (const country of SHIPPING_COUNTRIES) {
    if (country.value === value) {
      return country.label;
    }
  }
  return value;
}

export function readCheckoutDraft(): CheckoutDetails {
  if (typeof window === "undefined") {
    return emptyCheckoutDetails;
  }
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) {
      return emptyCheckoutDetails;
    }
    const parsed: unknown = JSON.parse(raw);
    const result = CheckoutDetailsSchema.safeParse(parsed);
    return result.success ? result.data : emptyCheckoutDetails;
  } catch {
    return emptyCheckoutDetails;
  }
}

export function writeCheckoutDraft(details: CheckoutDetails): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(details));
}

export function clearCheckoutDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.removeItem(DRAFT_KEY);
}

export function createDemoOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0")
    .slice(-4);
  return `DEMO-${stamp}-${random}`;
}

export function writeDemoOrder(order: DemoOrder): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  clearCheckoutDraft();
}

export function readDemoOrder(): DemoOrder | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) {
      return null;
    }
    const detailsResult = CheckoutDetailsSchema.safeParse(parsed.details);
    if (!detailsResult.success) {
      return null;
    }
    if (typeof parsed.id !== "string" || typeof parsed.createdAt !== "string") {
      return null;
    }
    if (!Array.isArray(parsed.lines)) {
      return null;
    }
    const lines: DemoOrderLine[] = [];
    for (const entry of parsed.lines) {
      if (!isRecord(entry)) {
        return null;
      }
      if (
        typeof entry.slug !== "string" ||
        typeof entry.name !== "string" ||
        typeof entry.quantity !== "number" ||
        typeof entry.unitPrice !== "number" ||
        typeof entry.lineTotal !== "number"
      ) {
        return null;
      }
      lines.push({
        slug: entry.slug,
        name: entry.name,
        quantity: entry.quantity,
        unitPrice: entry.unitPrice,
        lineTotal: entry.lineTotal,
      });
    }
    if (typeof parsed.itemCount !== "number" || typeof parsed.subtotal !== "number") {
      return null;
    }
    return {
      id: parsed.id,
      createdAt: parsed.createdAt,
      details: detailsResult.data,
      lines,
      itemCount: parsed.itemCount,
      subtotal: parsed.subtotal,
    };
  } catch {
    return null;
  }
}

export function fieldErrorsFromZod(
  error: z.ZodError,
): Record<string, string> {
  const next: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in next)) {
      next[key] = issue.message;
    }
  }
  return next;
}

export function buildDemoOrderLines(
  lines: CartLine[],
  resolve: (slug: string) => { name: string; price: number } | undefined,
): DemoOrderLine[] {
  const result: DemoOrderLine[] = [];
  for (const line of lines) {
    const product = resolve(line.slug);
    if (!product) {
      continue;
    }
    result.push({
      slug: line.slug,
      name: product.name,
      quantity: line.quantity,
      unitPrice: product.price,
      lineTotal: product.price * line.quantity,
    });
  }
  return result;
}
