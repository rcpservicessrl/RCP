import { BusinessSector, sectorMetadata } from "@/components/business-sector";
export const metadata = sectorMetadata("commerce", "en");
export default function Page() { return <BusinessSector audience="commerce" locale="en" />; }
