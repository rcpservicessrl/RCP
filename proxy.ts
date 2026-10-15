import { NextResponse, type NextRequest } from "next/server";
import { safePulsoEndpoint } from "@/lib/pulso-endpoint";

const pulsoEndpoint = safePulsoEndpoint(process.env.NEXT_PUBLIC_PULSO_WORKER_URL);

const basePolicy = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  `connect-src 'self'${pulsoEndpoint ? ` ${new URL(pulsoEndpoint).origin}` : ""}`,
  "frame-src https://www.youtube-nocookie.com https://open.spotify.com https://challenges.cloudflare.com",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' mailto:",
  "frame-ancestors 'self'",
].join("; ");

export function proxy(request: NextRequest) {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-csp-nonce", nonce);
  requestHeaders.set("x-nonce", nonce);
  const scriptPolicy = process.env.NODE_ENV === "development"
    ? `${basePolicy}; script-src 'self' 'nonce-${nonce}' 'unsafe-eval' https://challenges.cloudflare.com`
    : `${basePolicy}; script-src 'self' 'nonce-${nonce}' https://challenges.cloudflare.com`;
  requestHeaders.set("Content-Security-Policy", scriptPolicy);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", scriptPolicy);
  return response;
}

export const config = {
  // Only repository-owned static resources bypass nonce generation. Document,
  // API and private routes retain the per-request CSP and existing guards.
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico$|assets(?:/|$)|theme-init\\.js$|manifest\\.webmanifest$|icono-rcp\\.png$|logo_rcp_[^/]+\\.(?:png|svg)$).*)"],
};
