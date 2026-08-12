import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("howWeWork", "en");

export default function HowWeWorkPage() {
  return <InformationPage locale="en" page="howWeWork" />;
}
