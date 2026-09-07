export type BusinessSector = "comercio" | "servicios" | "imprenta" | "otro";

export function normalizeBusinessSector(value: unknown): BusinessSector | undefined {
  return value === "comercio" || value === "servicios" || value === "imprenta" || value === "otro" ? value : undefined;
}

const solutionAliases: Record<string, string> = {
  "organize-operations": "organiza-operacion",
  "sales-inventory": "ventas-inventario",
  "automation-data": "automatizacion-datos",
  "managed-operations": "operacion-administrada",
};

export function canonicalSolution(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const normalized = value.trim().toLowerCase();
  return Object.hasOwn(solutionAliases, normalized) ? solutionAliases[normalized] : normalized;
}
