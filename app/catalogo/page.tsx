import { CatalogExplorer } from "@/components/catalog-explorer";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { catalog } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Catálogo de productos y servicios",
  description: "Explora servicios de Renovación, Consultoría y Publicidad. Publicidad 360 reúne canales digitales, impresos y letreros; la tecnología se aplica según la necesidad.",
  canonical: "/catalogo",
  paths: { es: "/catalogo", en: "/en/catalog" },
});

export default async function CatalogPage({ searchParams }: { searchParams: Promise<{ servicio?: string }> }) {
  const { servicio } = await searchParams;
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Catálogo de productos y servicios RCP Services",
    numberOfItems: catalog.length,
    itemListElement: catalog.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://rcp.services/catalogo?servicio=${entry.id}`,
      name: entry.title.es,
    })),
  };
  return (
    <InteriorShell locale="es">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <section className="interior-hero interior-hero--catalog">
        <div className="container interior-hero__grid">
          <div><p className="section-eyebrow">Catálogo RCP</p><h1>Explora por necesidad. Compara con contexto.</h1><p>Este catálogo organiza productos y servicios sin convertirlos en soluciones universales. Selecciona hasta cuatro rutas y utilízalas como punto de partida para el Diagnóstico RCP 360.</p><div className="interior-hero__facts"><span>Sin precios públicos rígidos</span><span>Alcance por diagnóstico</span><span>Un responsable contractual</span></div></div>
          <Pulso scene="analyze" size="large" label="Pulso, guía del catálogo RCP" />
        </div>
      </section>
      <section className="catalog-page-section"><div className="container"><CatalogExplorer locale="es" initialService={servicio} /></div></section>
    </InteriorShell>
  );
}
