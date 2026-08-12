import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("customSoftware", "en");

export default function CustomSoftwarePage() {
  return <InformationPage locale="en" page="customSoftware" />;
}
