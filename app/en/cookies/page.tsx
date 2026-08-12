import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.cookies.en;

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Cookie policy",
  description: content.summary,
  canonical: "/en/cookies",
  paths: { es: "/cookies", en: "/en/cookies" },
});

export default function CookiesPage() {
  return <LegalDocument content={content} />;
}
