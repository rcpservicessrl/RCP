import { SpecialistApplicationPage } from "@/components/specialist-application-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "en",
  title: "Apply to the RCP Specialist Network",
  description: "Introduce your professional experience for an initial RCP Specialist Network review without sending sensitive documents.",
  canonical: "/en/specialists/apply",
  paths: { es: "/especialistas/postular", en: "/en/specialists/apply" },
});

export default function SpecialistApplicationRoute() {
  return <SpecialistApplicationPage locale="en" />;
}
