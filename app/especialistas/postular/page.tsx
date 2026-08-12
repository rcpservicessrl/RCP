import { SpecialistApplicationPage } from "@/components/specialist-application-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Postular a la Red de Especialistas RCP",
  description: "Presenta tu experiencia profesional para una revisión inicial de la Red de Especialistas RCP, sin enviar documentos sensibles.",
  canonical: "/especialistas/postular",
  paths: { es: "/especialistas/postular", en: "/en/specialists/apply" },
});

export default function SpecialistApplicationRoute() {
  return <SpecialistApplicationPage locale="es" />;
}
