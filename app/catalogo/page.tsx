import { BusinessVisual } from "@/components/business-visual";
import { PriceGuide } from "@/components/price-guide";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { InteriorShell } from "@/components/interior-shell";
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
          <div><p className="section-eyebrow">Catálogo RCP</p><h1>Explora por necesidad. Compara con contexto.</h1><p>Encuentra lo que tu negocio necesita: procesos, asesoría, presencia digital e impresos. Selecciona hasta cuatro opciones y llévalas a tu evaluación inicial sin costo.</p><div className="interior-hero__facts"><span>Hecho para tu negocio</span><span>Alcance acordado contigo</span><span>Una sola coordinación</span></div><div className="editorial-hero-actions"><a className="button button--primary" href="#explorar">Explorar el catálogo ↗</a></div></div>
          <BusinessVisual kind="catalog" locale="es" />
        </div>
      </section>
      <PriceGuide locale="es" />
      <section className="catalog-page-section" id="explorar"><div className="container"><h2 className="explorer-heading">Servicios y productos para tu negocio</h2><CatalogExplorer locale="es" initialService={servicio} /></div></section>
    </InteriorShell>
  );
}
