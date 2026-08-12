import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("electronicInvoicing", "en");

export default function ElectronicInvoicingPage() {
  return <InformationPage locale="en" page="electronicInvoicing" />;
}
