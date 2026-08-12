import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("customSoftware", "es");

export default function CustomSoftwarePage() {
  return <InformationPage locale="es" page="customSoftware" />;
}
