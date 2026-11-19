import { NextResponse } from "next/server";
import { z } from "zod";
import {
  checkLoginAllowed,
  clearLoginFailures,
  createCsrfToken,
  createSessionToken,
  csrfSetCookie,
  isAdminConfigured,
  recordLoginFailure,
  sessionSetCookie,
  verifyPassword,
} from "@/lib/admin-auth";

const LoginSchema = z.object({
  password: z.string().min(1).max(200),
  csrfToken: z.string().min(16).max(200),
});

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { success: false, error: "Admin auth is not configured on this server." },
      { status: 503 },
    );
  }

  const ip = clientIp(request);
  const allowed = checkLoginAllowed(ip);
  if (!allowed.ok) {
    return NextResponse.json(
      { success: false, error: "Too many attempts. Try again later.", retryAfterSec: allowed.retryAfterSec },
      { status: 429, headers: { "Retry-After": String(allowed.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid credentials payload." }, { status: 400 });
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const csrfMatch = /(?:^|;\s*)fuji_admin_csrf=([^;]+)/.exec(cookieHeader);
  const csrfCookie = csrfMatch ? decodeURIComponent(csrfMatch[1]) : "";
  if (!csrfCookie || csrfCookie !== parsed.data.csrfToken) {
    recordLoginFailure(ip);
    return NextResponse.json({ success: false, error: "Invalid CSRF token." }, { status: 403 });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !verifyPassword(parsed.data.password, hash)) {
    recordLoginFailure(ip);
    return NextResponse.json({ success: false, error: "Invalid password." }, { status: 401 });
  }

  clearLoginFailures(ip);
  const session = createSessionToken();
  const csrf = createCsrfToken();
  const response = NextResponse.json({ success: true, data: { ok: true } });
  response.headers.append("Set-Cookie", sessionSetCookie(session));
  response.headers.append("Set-Cookie", csrfSetCookie(csrf));
  return response;
}
