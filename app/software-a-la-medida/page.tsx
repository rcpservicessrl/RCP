import { normalizeSolutionSelection } from "@/lib/solution-selection";
import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("customSoftware", "es");

export default async function CustomSoftwarePage({ searchParams }: { searchParams: Promise<{ solucion?: string; solution?: string }> }) {
  const params = await searchParams;
  return <InformationPage locale="es" page="customSoftware" selectedSolutionId={normalizeSolutionSelection(params.solucion ?? params.solution)} />;
}
