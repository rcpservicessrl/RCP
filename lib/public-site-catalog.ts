import { catalog } from "@/lib/content";
import type { CatalogItem } from "@/lib/types";

export type PublishedCatalog = { items: CatalogItem[]; revisions: Record<string, number>; source: "published" | "fallback" };

function validText(value: unknown, max: number): value is { es: string; en: string } {
  if (!value || typeof value !== "object") return false;
  const text = value as Record<string, unknown>;
  return typeof text.es === "string" && text.es.trim().length >= 1 && text.es.length <= max
    && typeof text.en === "string" && text.en.trim().length >= 1 && text.en.length <= max;
}

export function mergePublishedCatalog(value: unknown): PublishedCatalog {
  const merged = catalog.map((item) => ({ ...item }));
  const revisions: Record<string, number> = {};
  if (!value || typeof value !== "object" || !Array.isArray((value as { items?: unknown }).items)) {
    return { items: merged, revisions, source: "fallback" };
  }
  const overrides = (value as { items: unknown[] }).items;
  for (const candidate of overrides) {
    if (!candidate || typeof candidate !== "object") continue;
    const row = candidate as Record<string, unknown>;
    const index = merged.findIndex((item) => item.id === row.id);
    if (index < 0 || !Number.isSafeInteger(row.revision) || Number(row.revision) < 1 || !row.content || typeof row.content !== "object") continue;
    const content = row.content as Record<string, unknown>;
    if (!validText(content.title, 160) || !validText(content.result, 1500)
      || !Array.isArray(content.includes) || content.includes.length < 1 || content.includes.length > 12
      || !content.includes.every((line) => validText(line, 500))) continue;
    merged[index] = { ...merged[index], title: content.title, result: content.result, includes: content.includes };
    revisions[String(row.id)] = Number(row.revision);
  }
  return { items: merged, revisions, source: Object.keys(revisions).length > 0 ? "published" : "fallback" };
}

export async function loadPublishedCatalog(): Promise<PublishedCatalog> {
  try {
    const response = await fetch("https://app.rcp.services/corporate/api/public/site-catalog", {
      next: { revalidate: 30 }, redirect: "error", signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) throw new Error(`catalog_http_${response.status}`);
    const body = await response.text();
    if (body.length > 500_000) throw new Error("catalog_too_large");
    return mergePublishedCatalog(JSON.parse(body));
  } catch (error) {
    console.error("public_site_catalog_fallback", error instanceof Error ? error.message : "unknown");
    return mergePublishedCatalog(null);
  }
}
