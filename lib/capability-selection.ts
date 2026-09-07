import { selectableCapabilities } from "@/lib/content";

export function normalizeCapabilitySelection(value?: unknown) {
  if (typeof value !== "string" || !value) return undefined;
  const normalized = value.trim().toLowerCase();
  return selectableCapabilities.some((entry) => entry.id === normalized) ? normalized : undefined;
}
