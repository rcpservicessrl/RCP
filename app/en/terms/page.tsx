import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.terms.en;

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Terms of use",
  description: content.summary,
  canonical: "/en/terms",
  paths: { es: "/terminos", en: "/en/terms" },
});

export default function TermsPage() {
  return <LegalDocument content={content} />;
}
