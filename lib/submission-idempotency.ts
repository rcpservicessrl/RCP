export type SubmissionIdempotency = Readonly<{
  key: string;
  fingerprint: string;
}>;

const nonSemanticFields = new Set(["turnstileToken", "website"]);

function canonicalValue(value: FormDataEntryValue) {
  if (typeof value === "string") return value;
  return {
    name: value.name,
    size: value.size,
    type: value.type,
    lastModified: value.lastModified,
  };
}

export async function fingerprintSubmissionPayload(payload: Record<string, FormDataEntryValue>) {
  const canonicalPayload = Object.entries(payload)
    .filter(([field]) => !nonSemanticFields.has(field))
    .sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)
    .map(([field, value]) => [field, canonicalValue(value)]);
  const encoded = new TextEncoder().encode(JSON.stringify(canonicalPayload));
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function resolveSubmissionIdempotency(
  current: SubmissionIdempotency | null,
  fingerprint: string,
  createKey: () => string = () => crypto.randomUUID(),
): SubmissionIdempotency {
  if (current?.fingerprint === fingerprint) return current;
  return { key: createKey(), fingerprint };
}
