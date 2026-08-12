import { HomeExperience } from "@/components/home-experience";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Business transformation company for small businesses",
  description: "We give your business new momentum through Renewal, Consulting and Advertising, supported by technology when it adds value.",
  canonical: "/en",
  paths: { es: "/", en: "/en" },
});

export default function EnglishHomePage() {
  return <HomeExperience locale="en" />;
}
