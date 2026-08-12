import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.accessibility.es;

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Declaración de accesibilidad",
  description: content.summary,
  canonical: "/accesibilidad",
  paths: { es: "/accesibilidad", en: "/en/accessibility" },
});

export default function AccessibilityPage() {
  return <LegalDocument content={content} />;
}
