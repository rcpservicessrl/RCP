import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("renewal", "es");

export default function RenewalPage() {
  return <InformationPage locale="es" page="renewal" />;
}
