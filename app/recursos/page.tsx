import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("resources", "es");

export default function ResourcesPage() {
  return <InformationPage locale="es" page="resources" />;
}
