import { ServiceDirectory } from "@/components/service-directory";
import { catalog } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { loadPublishedCatalog } from "@/lib/public-site-catalog";

export const dynamic = "force-dynamic";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Servicios empresariales",
  description: "Renovación, Consultoría y Publicidad para pequeños negocios, con tecnología transversal. Publicidad 360 integra lo digital, los impresos, los letreros y la presencia física dentro del pilar Publicidad.",
  canonical: "/servicios",
  paths: { es: "/servicios", en: "/en/services" },
});

export default async function ServicesPage() {
  const { items: entries } = await loadPublishedCatalog();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de RCP Services",
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title.es,
      url: `https://rcp.services/catalogo?servicio=${entry.id}`,
      item: {
        "@type": "Service",
        name: entry.title.es,
        url: `https://rcp.services/catalogo?servicio=${entry.id}`,
        provider: { "@id": "https://rcp.services/#organization" },
        areaServed: { "@type": "Country", name: "República Dominicana" },
      },
    })),
  };
  return <><JsonLd data={structuredData} /><ServiceDirectory locale="es" entries={entries} /></>;
}
