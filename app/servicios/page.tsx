import { ServiceDirectory } from "@/components/service-directory";
import { catalog } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Servicios empresariales",
  description: "Renovación, Consultoría y Publicidad para pequeños negocios, con tecnología transversal. Publicidad 360 integra lo digital, los impresos, los letreros y la presencia física dentro del pilar Publicidad.",
  canonical: "/servicios",
  paths: { es: "/servicios", en: "/en/services" },
});

export default function ServicesPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de RCP Services",
    numberOfItems: catalog.length,
    itemListElement: catalog.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.title.es, url: `https://rcp.services/catalogo?servicio=${entry.id}` })),
  };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><ServiceDirectory locale="es" /></>;
}
