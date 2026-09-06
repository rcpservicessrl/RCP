import { BusinessSector, sectorMetadata } from "@/components/business-sector";
export const metadata = sectorMetadata("services", "es");
export default function Page() { return <BusinessSector audience="services" locale="es" />; }
