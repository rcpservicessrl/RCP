import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Nosotros",
  description: "Conoce el modelo de RCP Services: tres pilares de transformación empresarial, tecnología transversal y una red de especialistas coordinada con evidencia.",
  canonical: "/nosotros",
  paths: { es: "/nosotros", en: "/en/about" },
});

export default function AboutPage() {
  return <EditorialPage locale="es" page="about" />;
}
