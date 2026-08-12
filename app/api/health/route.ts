export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    {
      ok: true,
      service: "rcp-services-web",
      version: "6.0.0-rc.2",
      runtime: "vercel-node-ready",
      deliveryMode: process.env.RCP_INTAKE_DELIVERY_MODE === "crm" ? "crm" : "email",
      timestamp: new Date().toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
