import { CapabilityExplorer } from "@/components/capability-explorer";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { createPublicPageMetadata } from "@/lib/metadata";
import { glossaryCapabilities, technologySolutions } from "@/lib/content";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Soluciones tecnológicas en contexto",
  description: "Explora MIS, ERP, POS, CRM, CMS, PIM, WMS, SCM, MRP, HRMS, LMS, BPA, RPA, BI y e-CF según el proceso y resultado que deben apoyar.",
  canonical: "/soluciones-tecnologicas",
  paths: { es: "/soluciones-tecnologicas", en: "/en/technology-solutions" },
});

export default async function TechnologySolutionsPage({ searchParams }: { searchParams: Promise<{ capacidad?: string }> }) {
  const { capacidad } = await searchParams;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Soluciones tecnológicas RCP Services",
      itemListElement: technologySolutions.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.title.es, description: entry.description.es, url: `https://rcp.services${entry.href.es}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "Glosario tecnológico RCP Services",
      hasDefinedTerm: glossaryCapabilities.map((entry) => ({ "@type": "DefinedTerm", name: entry.acronym, description: `${entry.name.es}. ${entry.result.es}`, url: `https://rcp.services/soluciones-tecnologicas#capability-${entry.id}` })),
    },
  ];
  return (
    <InteriorShell locale="es">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="interior-hero interior-hero--technology">
        <div className="container interior-hero__grid">
          <div><p className="section-eyebrow">Tecnología transversal</p><h1>Primero tu necesidad. Después la tecnología.</h1><p>Explora seis soluciones explicadas en lenguaje claro. Las siglas quedan como guía para buscar y entender; no representan dieciséis productos listos para instalar.</p><div className="interior-hero__facts"><span>Seis rutas claras</span><span>Software a la medida</span><span>Propiedad por proyecto</span></div></div>
          <Pulso scene="present" size="large" label="Pulso presenta las capacidades tecnológicas" />
        </div>
      </section>
      <section className="technology-page-section"><div className="container"><CapabilityExplorer locale="es" initialCapability={capacidad} /></div></section>
    </InteriorShell>
  );
}
