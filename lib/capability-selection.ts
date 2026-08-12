import { selectableCapabilities } from "@/lib/content";

export function normalizeCapabilitySelection(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return selectableCapabilities.some((entry) => entry.id === normalized) ? normalized : undefined;
}
