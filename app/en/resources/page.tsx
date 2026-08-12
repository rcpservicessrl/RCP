import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("resources", "en");

export default function ResourcesPage() {
  return <InformationPage locale="en" page="resources" />;
}
