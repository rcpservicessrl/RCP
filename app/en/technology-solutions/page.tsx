import { CapabilityExplorer } from "@/components/capability-explorer";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { createPublicPageMetadata } from "@/lib/metadata";
import { glossaryCapabilities, technologySolutions } from "@/lib/content";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Technology solutions in context",
  description: "Explore MIS, ERP, POS, CRM, CMS, PIM, WMS, SCM, MRP, HRMS, LMS, BPA, RPA, BI and e-invoicing according to the process and outcome they support.",
  canonical: "/en/technology-solutions",
  paths: { es: "/soluciones-tecnologicas", en: "/en/technology-solutions" },
});

export default async function EnglishTechnologySolutionsPage({ searchParams }: { searchParams: Promise<{ capability?: string }> }) {
  const { capability } = await searchParams;
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "RCP Services technology solutions",
      itemListElement: technologySolutions.map((entry, index) => ({ "@type": "ListItem", position: index + 1, name: entry.title.en, description: entry.description.en, url: `https://rcp.services${entry.href.en}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "DefinedTermSet",
      name: "RCP Services technology glossary",
      hasDefinedTerm: glossaryCapabilities.map((entry) => ({ "@type": "DefinedTerm", name: entry.acronym, description: `${entry.name.en}. ${entry.result.en}`, url: `https://rcp.services/en/technology-solutions#capability-${entry.id}` })),
    },
  ];
  return (
    <InteriorShell locale="en">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="interior-hero interior-hero--technology">
        <div className="container interior-hero__grid">
          <div><p className="section-eyebrow">Transversal technology</p><h1>Your need comes first. Technology follows.</h1><p>Explore six solutions explained in plain language. Acronyms remain a search and learning guide; they do not represent sixteen ready-to-install products.</p><div className="interior-hero__facts"><span>Six clear routes</span><span>Custom software</span><span>Ownership by project</span></div></div>
          <Pulso scene="present" size="large" label="Pulso presents technology capabilities" />
        </div>
      </section>
      <section className="technology-page-section"><div className="container"><CapabilityExplorer locale="en" initialCapability={capability} /></div></section>
    </InteriorShell>
  );
}
