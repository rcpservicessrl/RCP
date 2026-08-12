import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("howWeWork", "es");

export default function HowWeWorkPage() {
  return <InformationPage locale="es" page="howWeWork" />;
}
