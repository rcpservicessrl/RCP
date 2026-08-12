import { catalog, publicCapabilities, searchRecords, technologySolutions } from "@/lib/content";

export const revalidate = 3600;

export function GET() {
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
      records: searchRecords,
    },
    { headers: { "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400" } },
  );
}
