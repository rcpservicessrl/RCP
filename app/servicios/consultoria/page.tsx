import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("consulting", "es");

export default function ConsultingPage() {
  return <InformationPage locale="es" page="consulting" />;
}
