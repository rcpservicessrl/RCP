import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "RCP Specialist Network",
  description: "Explore the categories, standards and review process of the RCP Specialist Network. Applying does not imply employment or assignments.",
  canonical: "/en/specialists",
  paths: { es: "/especialistas", en: "/en/specialists" },
});

export default function SpecialistsPage() {
  return <EditorialPage locale="en" page="careers" />;
}
