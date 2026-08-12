import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Media library",
  description: "RCP Services videos, conversations and resources about strategy, validation and business transformation.",
  canonical: "/en/media",
  paths: { es: "/media", en: "/en/media" },
});

export default function MediaPage() {
  return <EditorialPage locale="en" page="media" />;
}
