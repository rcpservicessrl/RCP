import type { Metadata } from "next";
import { EditorialPage } from "@/components/editorial-page";

export const metadata: Metadata = {
  title: "RCP Specialist Network",
  description: "Explore the categories, standards and review process of the RCP Specialist Network. Applying does not imply employment or assignments.",
  alternates: { canonical: "/en/careers", languages: { "es-DO": "/carreras", "en-US": "/en/careers" } },
};

export default function CareersPage() {
  return <EditorialPage locale="en" page="careers" />;
}
