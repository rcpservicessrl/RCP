import { catalog, publicCapabilities, searchRecords, technologySolutions } from "@/lib/content";
import { loadPublishedCatalog } from "@/lib/public-site-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const published = await loadPublishedCatalog();
  const byId = new Map(published.items.map((entry) => [entry.id, entry]));
  const records = searchRecords.map((record) => {
    if (record.type !== "service") return record;
    const item = byId.get(record.id.slice(8));
    return item ? { ...record, title: item.title, description: item.result, keywords: [item.category, item.pillar, ...item.tags, ...item.includes.flatMap((line) => [line.es, line.en])] } : record;
  });
  return Response.json(
    {
      version: "6.0.0-rc.2",
      generatedAt: new Date().toISOString(),
      policy: "public-commercial-content-only",
      counts: {
        services: catalog.length,
        solutions: technologySolutions.length,
        capabilityTerms: publicCapabilities.length,
      },
      records,
    },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60" } },
  );
}
