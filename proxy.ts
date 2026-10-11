import { NextResponse, type NextRequest } from "next/server";

const basePolicy = [
  "default-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "media-src 'self'",
  "connect-src 'self'",
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
