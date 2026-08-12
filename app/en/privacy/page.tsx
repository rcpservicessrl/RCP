import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.privacy.en;

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Privacy policy",
  description: content.summary,
  canonical: "/en/privacy",
  paths: { es: "/privacidad", en: "/en/privacy" },
});

export default function PrivacyPage() {
  return <LegalDocument content={content} />;
}
