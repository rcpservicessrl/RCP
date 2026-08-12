import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("contact", "en");

export default function ContactPage() {
  return <InformationPage locale="en" page="contact" />;
}
