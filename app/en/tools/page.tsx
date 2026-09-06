import { BusinessTools } from "@/components/business-tools";
import { createPublicPageMetadata } from "@/lib/metadata";
export const metadata = createPublicPageMetadata({ locale: "en", title: "Tools for better decisions", description: "Find your business priority and calculate the time spent on a repetitive task using your own figures.", canonical: "/en/tools", paths: { es: "/herramientas", en: "/en/tools" } });
export default function Page() { return <BusinessTools locale="en" />; }
