import { homeDescriptions } from "@/lib/public-contact";
import { HomeExperience } from "@/components/home-experience";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Business transformation company for small businesses",
  description: homeDescriptions.en,
  canonical: "/en",
  paths: { es: "/", en: "/en" },
});

export default function EnglishHomePage() {
  return <HomeExperience locale="en" />;
}
