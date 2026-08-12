import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("advertising", "en");

export default function AdvertisingPage() {
  return <InformationPage locale="en" page="advertising" />;
}
