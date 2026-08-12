import { getInformationPageMetadata, InformationPage } from "@/components/information-page";

export const metadata = getInformationPageMetadata("electronicInvoicing", "es");

export default function ElectronicInvoicingPage() {
  return <InformationPage locale="es" page="electronicInvoicing" />;
}
