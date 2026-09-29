import { ServiceDirectory } from "@/components/service-directory";
import { catalog } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { loadPublishedCatalog } from "@/lib/public-site-catalog";

export const dynamic = "force-dynamic";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Business services",
  description: "Renewal, Consulting and Advertising for small businesses, with cross-cutting technology and 360 Advertising spanning digital, print and physical presence.",
  canonical: "/en/services",
  paths: { es: "/servicios", en: "/en/services" },
});

export default async function ServicesPage() {
  const { items: entries } = await loadPublishedCatalog();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RCP Services business services",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title.en,
      url: `https://rcp.services/en/catalog?service=${entry.id}`,
      item: {
        "@type": "Service",
        name: entry.title.en,
        url: `https://rcp.services/en/catalog?service=${entry.id}`,
        provider: { "@id": "https://rcp.services/#organization" },
        areaServed: { "@type": "Country", name: "Dominican Republic" },
      },
    })),
  };
  return <><JsonLd data={structuredData} /><ServiceDirectory locale="en" entries={entries} /></>;
}
