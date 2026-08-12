import { DiagnosisPage } from "@/components/diagnosis-page";
import { normalizeCapabilitySelection } from "@/lib/capability-selection";
import { normalizeCatalogSelection } from "@/lib/catalog-selection";
import { createPublicPageMetadata } from "@/lib/metadata";
import { normalizeSolutionSelection } from "@/lib/solution-selection";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "RCP 360° Initial Assessment",
  description: "Request a free 45-minute initial conversation, subject to confirmation, to understand your business need and define the next step.",
  canonical: "/en/diagnosis",
  paths: { es: "/diagnostico", en: "/en/diagnosis" },
});

export default async function DiagnosisRoute({ searchParams }: { searchParams: Promise<{ services?: string; servicios?: string; capability?: string; capacidad?: string; solution?: string; solucion?: string }> }) {
  const params = await searchParams;
  return <DiagnosisPage locale="en" selectedServiceIds={normalizeCatalogSelection(params.services ?? params.servicios)} selectedCapabilityId={normalizeCapabilitySelection(params.capability ?? params.capacidad)} selectedSolutionId={normalizeSolutionSelection(params.solution ?? params.solucion)} />;
}
