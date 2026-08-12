import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.privacy.es;

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Política de privacidad",
  description: content.summary,
  canonical: "/privacidad",
  paths: { es: "/privacidad", en: "/en/privacy" },
});

export default function PrivacyPage() {
  return <LegalDocument content={content} />;
}
