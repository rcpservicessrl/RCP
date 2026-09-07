import { canonicalSolution } from "@/lib/discovery-context";
import { technologySolutions } from "@/lib/content";

const solutionIds = new Set(technologySolutions.map((entry) => entry.id));

export function normalizeSolutionSelection(value?: unknown) {
  const normalized = canonicalSolution(value);
  if (!normalized) return undefined;
  return solutionIds.has(normalized) ? normalized : undefined;
}
