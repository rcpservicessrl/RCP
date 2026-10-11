import { DemoOverview } from "@/components/demo-overview";
import { createPublicPageMetadata } from "@/lib/metadata";
export const metadata = createPublicPageMetadata({ locale: "es", title: "Prueba nuestro sistema de ventas e inventario", description: "Demo abierta de POS, inventario, compras, caja y contabilidad. B01/B02 y facturación electrónica simulada con datos ficticios.", canonical: "/demo", paths: { es: "/demo", en: "/en/demo" } });
export default function DemoPage() { return <DemoOverview locale="es" />; }
