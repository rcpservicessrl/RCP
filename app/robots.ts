import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rcp.services";
  const deploymentEnvironment = process.env.RCP_DEPLOYMENT_ENV ?? process.env.VERCEL_ENV ?? "development";
  const privatePaths = ["/api/", "/app/", "/portal", "/en/portal", "/checkout", "/en/request", "/dashboard", "/onboarding", "/private/"];
  if (deploymentEnvironment !== "production") {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      host: baseUrl,
    };
  }
  return {
    rules: [
      {
        userAgent: ["Googlebot", "Google-Extended", "OAI-SearchBot", "PerplexityBot", "Bingbot", "DuckDuckBot", "Applebot", "Claude-SearchBot", "Claude-User"],
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: ["CCBot", "GPTBot", "ClaudeBot", "Bytespider", "Applebot-Extended"],
        disallow: "/",
      },
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
