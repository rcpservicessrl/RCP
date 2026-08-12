import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "About",
  description: "Learn about the RCP Services model: three business transformation pillars, cross-cutting technology and a specialist network coordinated through evidence.",
  canonical: "/en/about",
  paths: { es: "/nosotros", en: "/en/about" },
});

export default function AboutPage() {
  return <EditorialPage locale="en" page="about" />;
}
