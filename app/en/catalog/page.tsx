import { BusinessVisual } from "@/components/business-visual";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { InteriorShell } from "@/components/interior-shell";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Products and services catalog",
  description: "Explore Renewal, Consulting and Advertising services. Our 360 Advertising scope integrates digital channels, print and signage, while technology is applied according to each need.",
  canonical: "/en/catalog",
  paths: { es: "/catalogo", en: "/en/catalog" },
});

export default async function EnglishCatalogPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  return (
    <InteriorShell locale="en">
      <section className="interior-hero interior-hero--catalog">
        <div className="container interior-hero__grid">
          <div><p className="section-eyebrow">RCP Catalog</p><h1>Explore by need. Compare with context.</h1><p>Find what your business needs: processes, advice, a digital presence and print. Choose up to four options to discuss during your free initial assessment.</p><div className="interior-hero__facts"><span>Made for your business</span><span>Scope agreed with you</span><span>One team to coordinate</span></div><div className="editorial-hero-actions"><a className="button button--primary" href="#explorar">Explore the catalog ↗</a></div></div>
          <BusinessVisual kind="catalog" locale="en" />
        </div>
      </section>
      <section className="catalog-page-section" id="explorar"><div className="container"><h2 className="explorer-heading">Services and products for your business</h2><CatalogExplorer locale="en" initialService={service} /></div></section>
    </InteriorShell>
  );
}
