import type { NeedId } from "./types";

export function normalizeNeed(value: unknown): NeedId | undefined {
  return value === "ordenar" || value === "cumplir" || value === "crecer" ? value : undefined;
}

/** A scenario supplied by the visitor, not a prediction of business results. */
export function estimateMonthlyTime(tasks: number, minutes: number, days: number, reduction: number) {
  if (![tasks, minutes, days, reduction].every(Number.isFinite) || !Number.isInteger(tasks) || !Number.isInteger(days) || tasks < 1 || tasks > 500 || minutes < 1 || minutes > 120 || days < 1 || days > 31 || reduction < 0 || reduction > 100) return null;
  const current = tasks * minutes * days / 60;
  return { current, potential: current * reduction / 100 };
}
