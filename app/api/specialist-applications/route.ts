import { deliverCrm, deliverEmail, resolveDeliveryMode, validIdempotencyKey } from "@/lib/server/delivery";
import { consumeRateLimit } from "@/lib/server/rate-limit";

const MAX_BODY_BYTES = 16_000;
const noStoreHeaders = { "Cache-Control": "no-store" };
const fallbackEmail = "talento@rcp.services";
const categories = new Set(["renovacion", "consultoria", "publicidad", "tecnologia"]);
const availabilityOptions = new Set(["por-proyecto", "parcial", "segun-alcance"]);

type SpecialistApplicationPayload = {
  name?: unknown;
  email?: unknown;
  category?: unknown;
  experience?: unknown;
  portfolioUrl?: unknown;
  availability?: unknown;
  consent?: unknown;
  website?: unknown;
  locale?: unknown;
  turnstileToken?: unknown;
};

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;
const invalid = (message: string, status = 400) => Response.json({ accepted: false, recorded: false, message }, { status, headers: noStoreHeaders });

const stableReference = async (idempotencyKey: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`rcp-specialist:${idempotencyKey}`));
  const suffix = Array.from(new Uint8Array(digest).slice(0, 5), (entry) => entry.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `RCP-TAL-${suffix}`;
};

const validPortfolioUrl = (value: string) => {
  if (!value) return true;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
};

const verifyTurnstile = async (token: string) => {
  if (process.env.RCP_REQUIRE_TURNSTILE !== "true") return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !token) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
      signal: AbortSignal.timeout(5_000),
    });
    const result = await response.json() as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
};

const fallbackUrl = (locale: "es" | "en", reference: string) => {
  const subject = locale === "es" ? `Postulación a la Red de Especialistas RCP — ${reference}` : `RCP Specialist Network application — ${reference}`;
  return `mailto:${fallbackEmail}?subject=${encodeURIComponent(subject)}`;
};

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return invalid("unsupported_media_type", 415);
  const idempotencyKey = request.headers.get("idempotency-key");
  if (!validIdempotencyKey(idempotencyKey)) return invalid("invalid_idempotency_key");

  const limit = await consumeRateLimit(request, "specialist-application");
  if (!limit.allowed) return Response.json({ accepted: false, recorded: false, message: "rate_limit_exceeded" }, { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfter) } });

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return invalid("payload_too_large", 413);

  let raw: SpecialistApplicationPayload;
  try {
    const body = await request.text();
    if (byteLength(body) > MAX_BODY_BYTES) return invalid("payload_too_large", 413);
    raw = JSON.parse(body) as SpecialistApplicationPayload;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return invalid("invalid_json");
  } catch {
    return invalid("invalid_json");
  }

  if (text(raw.website, 200)) return Response.json({ accepted: false, recorded: false, discarded: true }, { status: 202, headers: noStoreHeaders });
  if (raw.consent !== "true" && raw.consent !== true) return invalid("consent_required");

  const locale: "es" | "en" = text(raw.locale, 2) === "en" ? "en" : "es";
  const application = {
    name: text(raw.name, 80),
    email: text(raw.email, 120).toLowerCase(),
    category: text(raw.category, 40),
    experience: text(raw.experience, 900),
    portfolioUrl: text(raw.portfolioUrl, 300),
    availability: text(raw.availability, 40),
    locale,
  };
  if (application.name.length < 2 || application.experience.length < 40 || !categories.has(application.category) || !availabilityOptions.has(application.availability)) return invalid("incomplete_request");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email)) return invalid("invalid_email");
  if (!validPortfolioUrl(application.portfolioUrl)) return invalid("invalid_portfolio_url");
  if (!await verifyTurnstile(text(raw.turnstileToken, 2_000))) return invalid("human_verification_failed");

  const reference = await stableReference(idempotencyKey!);
  const mailFallback = fallbackUrl(locale, reference);
  const commonRecord = {
    ...application,
    reference,
    source: "rcp.services",
    type: "specialist_application",
    journeyStage: "specialist_application_review",
  };

  if (resolveDeliveryMode() === "crm") {
    const url = process.env.RCP_CRM_SPECIALIST_INGEST_URL;
    const token = process.env.RCP_CRM_SPECIALIST_INGEST_TOKEN;
    const hmacSecret = process.env.RCP_CRM_SPECIALIST_HMAC_SECRET ?? process.env.RCP_CRM_HMAC_SECRET;
    if (!url || !token || !hmacSecret) return Response.json({ accepted: false, recorded: false, reference, message: "specialist_crm_unavailable", fallbackUrl: mailFallback }, { status: 503, headers: noStoreHeaders });
    const confirmation = await deliverCrm({ url, token, hmacSecret, idempotencyKey: idempotencyKey!, body: commonRecord });
    if (!confirmation || confirmation.reference !== reference) return Response.json({ accepted: false, recorded: false, reference, message: "specialist_registration_not_confirmed", fallbackUrl: mailFallback }, { status: 503, headers: noStoreHeaders });
    return Response.json({ accepted: true, registered: true, ...confirmation, reference, next: "specialist_review" }, { status: 202, headers: noStoreHeaders });
  }

  const lines = [
    `Reference: ${reference}`,
    "Stage: Manual specialist application review",
    `Name: ${application.name}`,
    `Email: ${application.email}`,
    `Category: ${application.category}`,
    `Availability: ${application.availability}`,
    `Portfolio: ${application.portfolioUrl || "Not provided"}`,
    "",
    "Experience:",
    application.experience,
  ];
  const delivery = await deliverEmail({
    idempotencyKey: `specialist-application:${idempotencyKey}`,
    from: process.env.RCP_INQUIRY_EMAIL_FROM ?? "",
    to: process.env.RCP_SPECIALIST_EMAIL_TO ?? "",
    replyTo: application.email,
    subject: `RCP specialist application ${reference} — ${application.name}`,
    content: lines.join("\n"),
  });
  if (!delivery.accepted) return Response.json({ accepted: false, recorded: false, reference, message: "email_delivery_not_confirmed", fallbackUrl: mailFallback }, { status: 503, headers: noStoreHeaders });

  return Response.json({ accepted: true, recorded: true, registered: true, duplicate: false, reference, contactId: null, opportunityId: null, stage: "specialist_review", next: "specialist_review" }, { status: 202, headers: noStoreHeaders });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...noStoreHeaders } });
}
