import { selectableCatalog } from "@/lib/content";

const catalogIds = new Set(selectableCatalog.map((item) => item.id));

export function normalizeCatalogSelection(raw?: unknown): string[] {
  if (typeof raw !== "string" || !raw) return [];

  return [...new Set(raw
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value) => catalogIds.has(value)))]
    .slice(0, 4);
}
