import { NextResponse } from "next/server";
import { clearSetCookie, CSRF_COOKIE, SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.append("Set-Cookie", clearSetCookie(SESSION_COOKIE));
  response.headers.append("Set-Cookie", clearSetCookie(CSRF_COOKIE));
  return response;
}
