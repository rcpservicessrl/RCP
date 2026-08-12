export type DeliveryMode = "email" | "crm";

export type CrmConfirmation = {
  recorded: boolean;
  reference: string;
  duplicate: boolean;
  contactId: string | null;
  opportunityId: string | null;
  stage: string;
};

type EmailDeliveryInput = {
  idempotencyKey: string;
  from: string;
  to: string;
  subject: string;
  content: string;
  replyTo?: string;
};

type CrmDeliveryInput = {
  url: string;
  token: string;
  hmacSecret: string;
  idempotencyKey: string;
  body: Record<string, unknown>;
};

const encoder = new TextEncoder();

export const resolveDeliveryMode = (): DeliveryMode => process.env.RCP_INTAKE_DELIVERY_MODE === "crm" ? "crm" : "email";

export const validIdempotencyKey = (value: string | null) => Boolean(value && /^[A-Za-z0-9._:-]{8,100}$/.test(value));

const toHex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");

export async function createHmacSignature(secret: string, timestamp: string, body: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${body}`)));
}

export async function deliverEmail(input: EmailDeliveryInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !input.from || !input.to) return { accepted: false, providerId: null };

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "Idempotency-Key": input.idempotencyKey,
      },
      body: JSON.stringify({
        from: input.from,
        to: [input.to],
        reply_to: input.replyTo || undefined,
        subject: input.subject,
        text: input.content,
      }),
      signal: AbortSignal.timeout(8_000),
    });
    const result = await response.json().catch(() => null) as { id?: unknown } | null;
    const providerId = typeof result?.id === "string" ? result.id.trim().slice(0, 160) : "";
    return { accepted: response.ok && providerId.length > 0, providerId: providerId || null };
  } catch {
    return { accepted: false, providerId: null };
  }
}

export async function deliverCrm(input: CrmDeliveryInput): Promise<CrmConfirmation | null> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const body = JSON.stringify(input.body);
  const signature = await createHmacSignature(input.hmacSecret, timestamp, body);

  try {
    const response = await fetch(input.url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${input.token}`,
        "Idempotency-Key": input.idempotencyKey,
        "X-RCP-Timestamp": timestamp,
        "X-RCP-Signature": `sha256=${signature}`,
      },
      body,
      signal: AbortSignal.timeout(8_000),
    });
    const result = await response.json().catch(() => null) as Partial<CrmConfirmation> | null;
    if (!response.ok || result?.recorded !== true || typeof result.reference !== "string") return null;
    return {
      recorded: true,
      reference: result.reference.slice(0, 160),
      duplicate: result.duplicate === true,
      contactId: typeof result.contactId === "string" ? result.contactId.slice(0, 160) : null,
      opportunityId: typeof result.opportunityId === "string" ? result.opportunityId.slice(0, 160) : null,
      stage: typeof result.stage === "string" ? result.stage.slice(0, 80) : "received",
    };
  } catch {
    return null;
  }
}
