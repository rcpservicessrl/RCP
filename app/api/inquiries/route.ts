import { normalizeOffer, parseCampaignJson, legacyAssessmentContext, detailedCrmProblem } from "@/lib/commercial-intake";
import { normalizeCapabilitySelection } from "@/lib/capability-selection";
import { normalizeCatalogSelection } from "@/lib/catalog-selection";
import { deliverCrm, deliverEmail, resolveDeliveryMode, validIdempotencyKey } from "@/lib/server/delivery";
import { consumeRateLimit } from "@/lib/server/rate-limit";
import { PayloadTooLargeError, readLimitedRequestBody } from "@/lib/server/request-body";
import { normalizeSolutionSelection } from "@/lib/solution-selection";
import { isAllowedRequestOrigin, isAllowedTurnstileHostname, isTurnstileRequired } from "@/lib/server/request-security";

const MAX_BODY_BYTES = 24_000;
const WHATSAPP_NUMBER = "18298068092";
const noStoreHeaders = { "Cache-Control": "no-store" };

type InquiryPayload = {
  intakeMode?: unknown;
  offer?: unknown;
  campaign?: unknown;
  name?: unknown;
  company?: unknown;
  contact?: unknown;
  email?: unknown;
  phone?: unknown;
  need?: unknown;
  sector?: unknown;
  problem?: unknown;
  expectedOutcome?: unknown;
  contactPreference?: unknown;
  consent?: unknown;
  website?: unknown;
  locale?: unknown;
  selectedServices?: unknown;
  selectedCapability?: unknown;
  selectedSolution?: unknown;
  turnstileToken?: unknown;
};

const text = (value: unknown, max: number) => typeof value === "string" ? value.trim().slice(0, max) : "";
const byteLength = (value: string) => new TextEncoder().encode(value).byteLength;
const invalid = (message: string, status = 400) => Response.json({ accepted: false, recorded: false, message }, { status, headers: noStoreHeaders });
const needOptions = new Set(["ordenar", "cumplir", "crecer"]);
const sectorOptions = new Set(["imprenta", "comercio", "servicios", "otro"]);
const contactOptions = new Set(["whatsapp", "email", "call"]);

const stableReference = async (idempotencyKey: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`rcp-evaluation:${idempotencyKey}`));
  const suffix = Array.from(new Uint8Array(digest).slice(0, 5), (entry) => entry.toString(16).padStart(2, "0")).join("").toUpperCase();
  return `RCP-EVAL-${suffix}`;
};

const verifyTurnstile = async (token: unknown) => {
  if (!isTurnstileRequired()) return true;
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || typeof token !== "string" || !token || token.length > 2_048) return false;
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }).toString(),
      signal: AbortSignal.timeout(5_000),
      redirect: "error",
    });
    const result = await response.json() as { success?: boolean; hostname?: unknown };
    return response.ok && result.success === true && isAllowedTurnstileHostname(result.hostname);
  } catch {
    return false;
  }
};

export async function POST(request: Request) {
  if (!isAllowedRequestOrigin(request)) return invalid("origin_not_allowed", 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return invalid("unsupported_media_type", 415);

  const idempotencyKey = request.headers.get("idempotency-key");
  if (!validIdempotencyKey(idempotencyKey)) return invalid("invalid_idempotency_key");

  const limit = await consumeRateLimit(request, "site-intake");
  if (!limit.allowed) {
    return Response.json({ accepted: false, recorded: false, message: "rate_limit_exceeded" }, { status: 429, headers: { ...noStoreHeaders, "Retry-After": String(limit.retryAfter) } });
  }

  const contentLength = Number.parseInt(request.headers.get("content-length") ?? "0", 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return invalid("payload_too_large", 413);

  let raw: InquiryPayload;
  try {
    const body = await readLimitedRequestBody(request, MAX_BODY_BYTES);
    if (byteLength(body) > MAX_BODY_BYTES) return invalid("payload_too_large", 413);
    raw = JSON.parse(body) as InquiryPayload;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return invalid("invalid_json");
  } catch (error) {
    if (error instanceof PayloadTooLargeError) return invalid("payload_too_large", 413);
    return invalid("invalid_json");
  }

  if (text(raw.website, 200)) return Response.json({ accepted: false, recorded: false, discarded: true }, { status: 202, headers: noStoreHeaders });
  if (raw.consent !== "true" && raw.consent !== true) return invalid("consent_required");

  const locale: "es" | "en" = text(raw.locale, 2) === "en" ? "en" : "es";
  const selectedServices = normalizeCatalogSelection(text(raw.selectedServices, 500));
  const selectedCapability = normalizeCapabilitySelection(text(raw.selectedCapability, 80));
  const selectedSolution = normalizeSolutionSelection(text(raw.selectedSolution, 80));
  const intakeMode = raw.intakeMode === "brief" ? "brief" : "detailed";
  if (raw.intakeMode != null && raw.intakeMode !== "brief" && raw.intakeMode !== "detailed") return invalid("invalid_intake_mode");
  const offer = normalizeOffer(raw.offer);
  if ((intakeMode === "brief" || raw.offer != null) && !offer) return invalid("invalid_offer");
  const campaign = parseCampaignJson(raw.campaign);
  const inquiry = {
    name: text(raw.name, 80),
    company: text(raw.company, 120),
    email: text(raw.email ?? raw.contact, 120).toLowerCase(),
    phone: text(raw.phone, 30),
    need: text(raw.need, 30) || (intakeMode === "brief" ? (offer === "WEB" ? "crecer" : "ordenar") : ""),
    sector: text(raw.sector, 60) || (intakeMode === "brief" ? "otro" : ""),
    problem: text(raw.problem, 1000),
    expectedOutcome: text(raw.expectedOutcome, 600),
    contactPreference: text(raw.contactPreference, 20),
    selectedServices,
    selectedCapability: selectedCapability ?? null,
    selectedSolution: selectedSolution ?? null,
    locale,
  };

  if (inquiry.name.length < 2 || inquiry.company.length < 2 || (!inquiry.email && !inquiry.phone)) return invalid("incomplete_request");
  if (intakeMode === "detailed" && (inquiry.problem.length < 20 || inquiry.expectedOutcome.length < 10)) return invalid("incomplete_request");
  if (!needOptions.has(inquiry.need) || !sectorOptions.has(inquiry.sector) || !contactOptions.has(inquiry.contactPreference)) return invalid("invalid_selection");
  if (inquiry.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email)) return invalid("invalid_email");
  if (inquiry.phone && inquiry.phone.replace(/\D/g, "").length < 7) return invalid("invalid_phone");
  if ((inquiry.contactPreference === "email" && !inquiry.email) || ((inquiry.contactPreference === "whatsapp" || inquiry.contactPreference === "call") && !inquiry.phone)) return invalid("preferred_contact_required");
  if (!await verifyTurnstile(raw.turnstileToken)) return invalid("human_verification_failed");

  const reference = await stableReference(idempotencyKey!);
  const whatsappMessage = locale === "es"
    ? `Hola, RCP Services. Quiero continuar la solicitud ${reference} para ${inquiry.company}.`
    : `Hello, RCP Services. I want to continue request ${reference} for ${inquiry.company}.`;
  const handoffContext = [`Oferta / Offer: ${offer ?? "OTHER"}`, ...Object.entries(campaign).map(([key, value]) => `${key}: ${value}`)].join("\n");
  const handoffUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`${whatsappMessage}\n${handoffContext}`)}`;
  const commonRecord = {
    ...inquiry,
    // Status notes are explicit; never invent client answers for omitted fields.
    problem: intakeMode === "brief" ? legacyAssessmentContext(offer, intakeMode, campaign) + "\n\nProblem:\n" + (inquiry.problem || "Consulta inicial. Proceso pendiente de evaluar con el cliente.") : inquiry.problem,
    expectedOutcome: inquiry.expectedOutcome || "Resultado pendiente de definir con el cliente en la evaluación.",
    offer: offer ?? null,
    intakeMode,
    campaign,
    reference,
    source: "rcp.services",
    type: "initial_assessment_request",
    journeyStage: "initial_evaluation_request",
    next: "initial_evaluation_review",
  };

  if (resolveDeliveryMode() === "crm") {
    if (intakeMode === "detailed") {
      const problem = detailedCrmProblem(inquiry.problem, offer, campaign);
      if (problem === null) return Response.json({ accepted: false, recorded: false, reference, handoffUrl, message: "crm_attribution_capacity_exceeded" }, { status: 503, headers: noStoreHeaders });
      commonRecord.problem = problem;
    }
    const url = process.env.RCP_CRM_INGEST_URL;
    const token = process.env.RCP_CRM_INGEST_TOKEN;
    const hmacSecret = process.env.RCP_CRM_HMAC_SECRET;
    if (!url || !token || !hmacSecret) return Response.json({ accepted: false, recorded: false, reference, handoffUrl, message: "crm_temporarily_unavailable" }, { status: 503, headers: noStoreHeaders });

    const confirmation = await deliverCrm({ url, token, hmacSecret, idempotencyKey: idempotencyKey!, body: commonRecord });
    if (!confirmation || confirmation.reference !== reference) return Response.json({ accepted: false, recorded: false, reference, handoffUrl, message: "crm_record_not_confirmed" }, { status: 503, headers: noStoreHeaders });
    return Response.json({ accepted: true, ...confirmation, reference, handoffUrl, next: "initial_evaluation_review" }, { status: 202, headers: noStoreHeaders });
  }

  const lines = [
    `Reference: ${reference}`,
    `Offer: ${offer ?? "OTHER"}`,
    `Intake: ${intakeMode}`,
    ...Object.entries(campaign).map(([key, value]) => `${key}: ${value}`),
    "Stage: Initial RCP 360 assessment request",
    `Name: ${inquiry.name}`,
    `Company: ${inquiry.company}`,
    `Email: ${inquiry.email || "Not provided"}`,
    `WhatsApp: ${inquiry.phone || "Not provided"}`,
    `Primary need: ${inquiry.need}`,
    `Sector: ${inquiry.sector}`,
    `Preferred channel: ${inquiry.contactPreference}`,
    `Selected solution: ${inquiry.selectedSolution || "None"}`,
    `Selected services: ${inquiry.selectedServices.join(", ") || "None"}`,
    `Selected capability: ${inquiry.selectedCapability || "None"}`,
    "",
    "Problem:",
    inquiry.problem || "Not supplied; discuss during assessment.",
    "",
    "Expected outcome:",
    inquiry.expectedOutcome || "To be defined with the requester.",
  ];
  const delivery = await deliverEmail({
    idempotencyKey: `site-intake:${idempotencyKey}`,
    from: process.env.RCP_INQUIRY_EMAIL_FROM ?? "",
    to: process.env.RCP_INQUIRY_EMAIL_TO ?? "",
    replyTo: inquiry.email || undefined,
    subject: `RCP evaluation ${reference} — ${inquiry.company}`,
    content: lines.join("\n"),
  });
  if (!delivery.accepted) return Response.json({ accepted: false, recorded: false, notified: false, reference, handoffUrl, message: "email_delivery_not_confirmed" }, { status: 503, headers: noStoreHeaders });

  return Response.json({ accepted: true, recorded: true, notified: true, duplicate: false, reference, contactId: null, opportunityId: null, stage: "evaluation_requested", handoffUrl, next: "initial_evaluation_review" }, { status: 202, headers: noStoreHeaders });
}

export function GET() {
  return new Response(null, { status: 405, headers: { Allow: "POST", ...noStoreHeaders } });
}
