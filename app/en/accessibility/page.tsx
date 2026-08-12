import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.accessibility.en;

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Accessibility statement",
  description: content.summary,
  canonical: "/en/accessibility",
  paths: { es: "/accesibilidad", en: "/en/accessibility" },
});

export default function AccessibilityPage() {
  return <LegalDocument content={content} />;
}
