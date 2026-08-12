import { EditorialPage } from "@/components/editorial-page";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Biblioteca multimedia",
  description: "Videos, conversaciones y recursos de RCP Services sobre estrategia, validación y transformación empresarial.",
  canonical: "/media",
  paths: { es: "/media", en: "/en/media" },
});

export default function MediaPage() {
  return <EditorialPage locale="es" page="media" />;
}
