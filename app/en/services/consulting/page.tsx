import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("consulting", "en");

export default function ConsultingPage() {
  return <InformationPage locale="en" page="consulting" />;
}
