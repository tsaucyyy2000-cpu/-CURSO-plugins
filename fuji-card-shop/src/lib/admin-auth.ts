import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "fuji_admin_session";
export const CSRF_COOKIE = "fuji_admin_csrf";

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 1000 * 60 * 15;

type AttemptState = { count: number; lockedUntil: number };

const loginAttempts = new Map<string, AttemptState>();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_SESSION_SECRET);
}

/** Colon-delimited so dotenv won't expand `$N` segments from scrypt params. */
export function hashPassword(password: string, salt?: Buffer): string {
  const usedSalt = salt ?? randomBytes(16);
  const derived = scryptSync(password, usedSalt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:16384:8:1:${usedSalt.toString("base64url")}:${derived.toString("base64url")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const normalized = stored.includes("$") ? stored.replaceAll("$", ":") : stored;
  const parts = normalized.split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") {
    return false;
  }
  const n = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  const salt = Buffer.from(parts[4], "base64url");
  const expected = Buffer.from(parts[5], "base64url");
  const derived = scryptSync(password, salt, expected.length, { N: n, r, p });
  if (derived.length !== expected.length) {
    return false;
  }
  return timingSafeEqual(derived, expected);
}

function sign(payload: string): string {
  const secret = requireEnv("ADMIN_SESSION_SECRET");
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_TTL_MS;
  const nonce = randomBytes(16).toString("base64url");
  const payload = `admin|${exp}|${nonce}`;
  return `${payload}|${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  const parts = token.split("|");
  if (parts.length !== 4 || parts[0] !== "admin") {
    return false;
  }
  const exp = Number(parts[1]);
  if (!Number.isFinite(exp) || Date.now() > exp) {
    return false;
  }
  const payload = `${parts[0]}|${parts[1]}|${parts[2]}`;
  const expected = sign(payload);
  const provided = Buffer.from(parts[3]);
  const want = Buffer.from(expected);
  if (provided.length !== want.length) {
    return false;
  }
  return timingSafeEqual(provided, want);
}

export function createCsrfToken(): string {
  return randomBytes(24).toString("base64url");
}

export function checkLoginAllowed(ip: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const state = loginAttempts.get(ip);
  if (!state) {
    return { ok: true };
  }
  if (state.lockedUntil > Date.now()) {
    return { ok: false, retryAfterSec: Math.ceil((state.lockedUntil - Date.now()) / 1000) };
  }
  if (state.lockedUntil && state.lockedUntil <= Date.now()) {
    loginAttempts.delete(ip);
  }
  return { ok: true };
}

export function recordLoginFailure(ip: string): void {
  const current = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  const count = current.count + 1;
  if (count >= MAX_ATTEMPTS) {
    loginAttempts.set(ip, { count, lockedUntil: Date.now() + LOCKOUT_MS });
    return;
  }
  loginAttempts.set(ip, { count, lockedUntil: 0 });
}

export function clearLoginFailures(ip: string): void {
  loginAttempts.delete(ip);
}

export async function getAdminSession(): Promise<boolean> {
  if (!isAdminConfigured()) {
    return false;
  }
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

export async function requireAdminSession(): Promise<boolean> {
  return getAdminSession();
}

function cookieSecure(): boolean {
  if (process.env.ADMIN_COOKIE_SECURE === "true") {
    return true;
  }
  if (process.env.ADMIN_COOKIE_SECURE === "false") {
    return false;
  }
  // Default off so local `next start` over http://127.0.0.1 works.
  // Set ADMIN_COOKIE_SECURE=true on HTTPS/production hosts.
  return false;
}

/** Build Set-Cookie manually — NextResponse.cookies.set may force Secure in production. */
export function serializeCookie(
  name: string,
  value: string,
  options: { httpOnly: boolean; maxAge: number },
): string {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${Math.floor(options.maxAge)}`,
    "SameSite=Strict",
  ];
  if (options.httpOnly) {
    parts.push("HttpOnly");
  }
  if (cookieSecure()) {
    parts.push("Secure");
  }
  return parts.join("; ");
}

export function sessionSetCookie(token: string): string {
  return serializeCookie(SESSION_COOKIE, token, {
    httpOnly: true,
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function csrfSetCookie(token: string): string {
  return serializeCookie(CSRF_COOKIE, token, {
    httpOnly: false,
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export function clearSetCookie(name: string): string {
  return serializeCookie(name, "", {
    httpOnly: name === SESSION_COOKIE,
    maxAge: 0,
  });
}
