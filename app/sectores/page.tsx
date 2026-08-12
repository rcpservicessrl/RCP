import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("sectors", "es");

export default function SectorsPage() {
  return <InformationPage locale="es" page="sectors" />;
}
