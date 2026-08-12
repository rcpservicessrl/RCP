import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("advertising", "es");

export default function AdvertisingPage() {
  return <InformationPage locale="es" page="advertising" />;
}
