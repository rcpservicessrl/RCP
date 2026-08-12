import { DiagnosisPage } from "@/components/diagnosis-page";
import { normalizeCapabilitySelection } from "@/lib/capability-selection";
import { normalizeCatalogSelection } from "@/lib/catalog-selection";
import { createPublicPageMetadata } from "@/lib/metadata";
import { normalizeSolutionSelection } from "@/lib/solution-selection";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Evaluación Inicial RCP 360°",
  description: "Solicita una conversación inicial de 45 minutos, sin costo y sujeta a confirmación, para entender la necesidad de tu negocio y definir el próximo paso.",
  canonical: "/diagnostico",
  paths: { es: "/diagnostico", en: "/en/diagnosis" },
});

export default async function DiagnosisRoute({ searchParams }: { searchParams: Promise<{ servicios?: string; services?: string; capacidad?: string; capability?: string; solucion?: string; solution?: string }> }) {
  const params = await searchParams;
  return <DiagnosisPage locale="es" selectedServiceIds={normalizeCatalogSelection(params.servicios ?? params.services)} selectedCapabilityId={normalizeCapabilitySelection(params.capacidad ?? params.capability)} selectedSolutionId={normalizeSolutionSelection(params.solucion ?? params.solution)} />;
}
