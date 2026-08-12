import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("renewal", "en");

export default function RenewalPage() {
  return <InformationPage locale="en" page="renewal" />;
}
