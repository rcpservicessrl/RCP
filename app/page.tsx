import { HomeExperience } from "@/components/home-experience";
import { createPublicPageMetadata } from "@/lib/metadata";

export const metadata = createPublicPageMetadata({
  locale: "es",
  title: "Empresa de transformación para pequeños negocios",
  description: "Le damos nuevo impulso a tu negocio con Renovación, Consultoría y Publicidad, apoyadas por tecnología cuando aporta valor.",
  canonical: "/",
  paths: { es: "/", en: "/en" },
});

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "https://rcp.services/#organization",
  name: "RCP Services SRL",
  alternateName: "RCP Services",
  url: "https://rcp.services",
  logo: "https://rcp.services/logo_rcp_master_vectorial.png",
  taxID: "132-147103",
  email: "info@rcp.services",
  telephone: "+1-829-806-8092",
  slogan: "Estrategia que transforma. Tecnología que impulsa.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Rómulo Betancourt 1302, Bella Vista",
    addressLocality: "Santo Domingo",
    addressCountry: "DO",
  },
  areaServed: { "@type": "Country", name: "República Dominicana" },
  sameAs: ["https://www.instagram.com/rcp.services_/"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://rcp.services/#website",
  url: "https://rcp.services/",
  name: "RCP Services",
  inLanguage: ["es-DO", "en-US"],
  publisher: { "@id": "https://rcp.services/#organization" },
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      <HomeExperience locale="es" />
    </>
  );
}
