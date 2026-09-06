import { BusinessTools } from "@/components/business-tools";
import { createPublicPageMetadata } from "@/lib/metadata";
export const metadata = createPublicPageMetadata({ locale: "es", title: "Herramientas para decidir", description: "Ubica la prioridad de tu negocio y calcula el tiempo de una tarea repetitiva con tus propios datos.", canonical: "/herramientas", paths: { es: "/herramientas", en: "/en/tools" } });
export default function Page() { return <BusinessTools locale="es" />; }
