import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Red de Especialistas RCP",
  description: "Conoce las categorías, estándares y proceso de revisión de la Red de Especialistas RCP. La postulación no implica empleo ni asignaciones.",
  canonical: "/especialistas",
  paths: { es: "/especialistas", en: "/en/specialists" },
});

export default function SpecialistsPage() {
  return <EditorialPage locale="es" page="careers" />;
}
