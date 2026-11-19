import { NextResponse } from "next/server";
import {
  createCsrfToken,
  csrfSetCookie,
  getAdminSession,
  isAdminConfigured,
} from "@/lib/admin-auth";

export async function GET() {
  const configured = isAdminConfigured();
  const authenticated = configured ? await getAdminSession() : false;
  const csrf = createCsrfToken();
  const response = NextResponse.json({
    success: true,
    data: { configured, authenticated },
  });
  response.headers.append("Set-Cookie", csrfSetCookie(csrf));
  return response;
}
