import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("contact", "es");

export default function ContactPage() {
  return <InformationPage locale="es" page="contact" />;
}
