export type CommercialOffer = "WEB" | "SOFTWARE" | "OTHER";
export const campaignKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;
export type CampaignContext = Partial<Record<typeof campaignKeys[number], string>> & { landingPath?: string };
export function normalizeOffer(value: unknown): CommercialOffer | undefined {
  return value === "WEB" || value === "SOFTWARE" || value === "OTHER" ? value : undefined;
}
export function normalizeCampaign(value: unknown): CampaignContext {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const raw = value as Record<string, unknown>;
  const result: CampaignContext = {};
  for (const key of campaignKeys) {
    const entry = raw[key];
    if (typeof entry === "string" && /^[a-zA-Z0-9._~-]{1,96}$/.test(entry)) result[key] = entry;
  }
  // Store a public route only; never retain queries, fragments or referrer URLs.
  if (typeof raw.landingPath === "string" && /^\/(?:en\/)?(?:[a-z-]+\/?){0,3}$/.test(raw.landingPath) && raw.landingPath.length <= 120) result.landingPath = raw.landingPath;
  return result;
}
export function campaignFromUrl(url: URL): CampaignContext {
  return normalizeCampaign({ ...Object.fromEntries(campaignKeys.map(key => [key, url.searchParams.get(key)])), landingPath: url.pathname });
}
const storageKey = "rcp-inquiry-campaign-v1";
export function captureInquiryCampaign(): CampaignContext {
  if (typeof window === "undefined") return {};
  const current = campaignFromUrl(new URL(window.location.href));
  try {
    const saved = normalizeCampaign(JSON.parse(sessionStorage.getItem(storageKey) ?? "{}"));
    const context = campaignKeys.some(key => current[key]) ? current : Object.keys(saved).length ? saved : current;
    sessionStorage.setItem(storageKey, JSON.stringify(context));
    return context;
  } catch { return current; }
}
export function parseCampaignJson(value: unknown): CampaignContext {
  if (typeof value !== "string" || value.length > 1000) return {};
  try { return normalizeCampaign(JSON.parse(value)); } catch { return {}; }
}
/** The current CRM accepts the original assessment contract. Preserve new context
 * in its existing problem field until a coordinated structured-contract upgrade. */
export function legacyAssessmentContext(offer: CommercialOffer | undefined, mode: string, campaign: CampaignContext): string {
  return ["", "Commercial context:", `Offer: ${offer ?? "OTHER"}`, `Intake: ${mode}`, ...Object.entries(campaign).map(([key, value]) => `${key}: ${value}`)].join("\n");
}

/** Adapt a detailed assessment to the existing CRM's 1000-character problem
 * field. Never send a payload that would silently discard attribution or answers. */
export function detailedCrmProblem(problem: string, offer: CommercialOffer | undefined, campaign: CampaignContext): string | null {
  if (!offer && Object.keys(campaign).length === 0) return problem;
  const attributed = `${legacyAssessmentContext(offer, "detailed", campaign).trim()}\n\nProblem:\n${problem}`;
  return attributed.length <= 1000 ? attributed : null;
}
