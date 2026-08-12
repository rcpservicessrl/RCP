import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.terms.es;

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Términos de uso",
  description: content.summary,
  canonical: "/terminos",
  paths: { es: "/terminos", en: "/en/terms" },
});

export default function TermsPage() {
  return <LegalDocument content={content} />;
}
