import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "Red de Especialistas RCP",
  description: "Conoce las categorías, estándares y proceso de revisión de la Red de Especialistas RCP. La postulación no implica empleo ni asignaciones.",
  alternates: { canonical: "/carreras", languages: { "es-DO": "/carreras", "en-US": "/en/careers" } },
};

export default function CareersPage() {
  return <EditorialPage locale="es" page="careers" />;
}
