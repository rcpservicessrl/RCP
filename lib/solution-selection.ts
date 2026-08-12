import { technologySolutions } from "@/lib/content";

const solutionIds = new Set(technologySolutions.map((entry) => entry.id));

export function normalizeSolutionSelection(value?: string) {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return solutionIds.has(normalized) ? normalized : undefined;
}
