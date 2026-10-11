import { HomeExperience } from "@/components/home-experience";
import { homeDescriptions } from "@/lib/public-contact";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Empresa de transformación para pequeños negocios",
  description: homeDescriptions.es,
  canonical: "/",
  paths: { es: "/", en: "/en" },
});

export default function HomePage() {
  return (
    <HomeExperience locale="es" />
  );
}
