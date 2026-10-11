import { catalog } from "@/lib/content";

/** Published, versioned copy only; this endpoint never exposes a draft. */
export function GET() {
  return Response.json({ source: "rcp.services", items: catalog.map(({ id, pillar, title, result, includes }) => ({ id, pillar, content: { title, result, includes } })) },
    { headers: { "cache-control": "public, max-age=3600" } });
}
