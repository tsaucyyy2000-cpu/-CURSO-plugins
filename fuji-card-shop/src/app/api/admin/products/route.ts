import { NextResponse } from "next/server";
import { z } from "zod";
import { CSRF_COOKIE, getAdminSession } from "@/lib/admin-auth";
import { listAdminCatalog, updateAdminItem } from "@/lib/admin-store";

const PatchSchema = z.object({
  catalog: z.enum(["fuji", "apex"]),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(200).optional(),
  price: z.number().finite().min(0).max(1_000_000).optional(),
  image: z
    .string()
    .max(500)
    .regex(/^(\/images\/[a-zA-Z0-9._/-]+)?$/)
    .optional(),
  visible: z.boolean().optional(),
  status: z.string().min(1).max(80).optional(),
  stock: z.number().int().min(0).max(1_000_000).optional(),
  csrfToken: z.string().min(16).max(200),
});

function readCsrf(request: Request): string {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = new RegExp(`(?:^|;\\s*)${CSRF_COOKIE}=([^;]+)`).exec(cookieHeader);
  return match ? decodeURIComponent(match[1]) : "";
}

export async function GET() {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  const products = await listAdminCatalog();
  return NextResponse.json({
    success: true,
    data: {
      products,
      counts: {
        total: products.length,
        fuji: products.filter((item) => item.catalog === "fuji").length,
        apex: products.filter((item) => item.catalog === "apex").length,
        withImage: products.filter((item) => Boolean(item.image)).length,
        hidden: products.filter((item) => !item.visible).length,
      },
    },
  });
}

export async function PATCH(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = PatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Validation failed.", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const csrfCookie = readCsrf(request);
  if (!csrfCookie || csrfCookie !== parsed.data.csrfToken) {
    return NextResponse.json({ success: false, error: "Invalid CSRF token." }, { status: 403 });
  }

  const updated = await updateAdminItem(parsed.data.catalog, parsed.data.slug, {
    name: parsed.data.name,
    price: parsed.data.price,
    unitPrice: parsed.data.price,
    image: parsed.data.image,
    visible: parsed.data.visible,
    status: parsed.data.status,
    stock: parsed.data.stock,
  });

  if (!updated) {
    return NextResponse.json({ success: false, error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: { product: updated } });
}
