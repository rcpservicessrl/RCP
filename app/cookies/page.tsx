import { LegalDocument } from "@/components/legal-document";
import { legalDocuments } from "@/lib/legal-content";
import { createPublicPageMetadata } from "@/lib/metadata";

const content = legalDocuments.cookies.es;

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Política de cookies",
  description: content.summary,
  canonical: "/cookies",
  paths: { es: "/cookies", en: "/en/cookies" },
});

export default function CookiesPage() {
  return <LegalDocument content={content} />;
}
