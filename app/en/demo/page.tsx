import { DemoOverview } from "@/components/demo-overview";
import { createPublicPageMetadata } from "@/lib/metadata";
export const metadata = createPublicPageMetadata({ locale: "en", title: "Try our sales and inventory system", description: "Open demo of checkout, inventory, purchases, cash and automatic accounting. Simulated E31/E32/E34 electronic invoicing with fictional data.", canonical: "/en/demo", paths: { es: "/demo", en: "/en/demo" } });
export default function DemoPage() { return <DemoOverview locale="en" />; }
