import { ServiceDirectory } from "@/components/service-directory";
import { catalog } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Business services",
  description: "Renewal, Consulting and Advertising for small businesses, with cross-cutting technology and 360 Advertising spanning digital, print and physical presence.",
  canonical: "/en/services",
  paths: { es: "/servicios", en: "/en/services" },
});

export default function ServicesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "RCP Services business services",
    numberOfItems: catalog.length,
    itemListElement: catalog.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.title.en, url: `https://rcp.services/en/catalog?service=${entry.id}` })),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><ServiceDirectory locale="en" /></>;
}
