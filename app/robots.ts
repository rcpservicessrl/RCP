import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rcp.services";
  const deploymentEnvironment = process.env.RCP_DEPLOYMENT_ENV ?? process.env.VERCEL_ENV ?? "development";
  if (deploymentEnvironment !== "production") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: baseUrl,
    };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/", "/portal", "/en/portal", "/checkout", "/en/request", "/dashboard", "/onboarding", "/propuesta-inversion"] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
