import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("sectors", "en");

export default function SectorsPage() {
  return <InformationPage locale="en" page="sectors" />;
}
