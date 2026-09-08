const productionOrigins = new Set(["https://rcp.services", "https://www.rcp.services"]);

const configuredOrigin = () => {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && process.env.NODE_ENV === "production") return null;
    return url.origin;
  } catch {
    return null;
  }
};

export const isAllowedRequestOrigin = (request: Request) => {
  const origin = request.headers.get("origin")?.trim();
  const fetchSite = request.headers.get("sec-fetch-site")?.trim().toLowerCase();
  if (fetchSite === "cross-site") return false;
  if (!origin) return true;

  const allowed = new Set(productionOrigins);
  const configured = configuredOrigin();
  if (configured) allowed.add(configured);
  return allowed.has(origin);
};

export const isTurnstileRequired = () => process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production" || process.env.RCP_DEPLOYMENT_ENV === "production" || process.env.RCP_REQUIRE_TURNSTILE === "true";

const hostMatches = (hostname: string, pattern: string) => hostname === pattern || hostname.endsWith(`.${pattern}`);

export const isSafeCrmUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return false;
    const hostname = url.hostname.toLowerCase();
    // CRM destinations must be named HTTPS hosts. Reject every literal IPv4 or
    // IPv6 address so a permissive allowlist cannot become an SSRF primitive.
    if (hostname === "localhost" || hostname.endsWith(".localhost") || hostname.startsWith("[") || hostname.includes(":")) return false;
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false;

    const configuredHosts = (process.env.RCP_CRM_ALLOWED_HOSTS ?? "")
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
    if (configuredHosts.length === 0) return false;
    return configuredHosts.some((pattern) => hostMatches(hostname, pattern));
  } catch {
    return false;
  }
};
