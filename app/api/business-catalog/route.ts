import { estimateForService, estimateTerms } from "@/lib/pricing";
import { loadPublishedCatalog } from "@/lib/public-site-catalog";

export const dynamic = "force-dynamic";

/** Public commercial data only. These estimates never become checkout prices. */
export async function GET() {
  const published = await loadPublishedCatalog();
  return Response.json({
    version: "1.0.0",
    source: "rcp.services",
    contentSource: published.source,
    revisions: published.revisions,
    pricingPolicy: estimateTerms.es,
    items: published.items.map((entry) => {
      const price = estimateForService(entry.id);
      return {
        id: entry.id, name: entry.title.es, description: entry.result.es,
        title: entry.title, result: entry.result,
        includes_localized: entry.includes,
        category: entry.pillar, includes: entry.includes.map((line) => line.es),
        price_min: price?.min ?? null, price_max: price?.max ?? null,
        currency: "DOP", price_type: price?.cadence ?? "quote",
      };
    }),
  }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" } });
}
