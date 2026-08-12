import { CatalogExplorer } from "@/components/catalog-explorer";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
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
          <div><p className="section-eyebrow">RCP Catalog</p><h1>Explore by need. Compare with context.</h1><p>This catalog organizes products and services without turning them into universal solutions. Select up to four routes and use them as a starting point for an RCP 360 Diagnosis.</p><div className="interior-hero__facts"><span>No rigid public prices</span><span>Scope by diagnosis</span><span>One contractual owner</span></div></div>
          <Pulso scene="analyze" size="large" label="Pulso, RCP catalog guide" />
        </div>
      </section>
      <section className="catalog-page-section"><div className="container"><CatalogExplorer locale="en" initialService={service} /></div></section>
    </InteriorShell>
  );
}
