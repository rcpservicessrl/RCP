import { publicContact } from "@/lib/public-contact";

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": ["Organization", "ProfessionalService"],
  "@id": "https://rcp.services/#organization",
  name: "RCP Services SRL",
  alternateName: "RCP Services",
  url: "https://rcp.services",
  logo: "https://rcp.services/logo_rcp_master_vectorial.png",
  taxID: "132-147103",
  email: "info@rcp.services",
  telephone: publicContact.telephone,
  slogan: "Estrategia que transforma. Tecnología que impulsa.",
  description: "Consultoría empresarial y transformación digital para MIPYMES en República Dominicana. RCP Services combina Renovación, Consultoría y Publicidad con tecnología seleccionada según el proceso de cada negocio.",
  knowsAbout: [
    "Consultoría empresarial para MIPYMES",
    "Transformación digital",
    "Mejora de procesos",
    "Publicidad 360",
    "Software a la medida",
    "Facturación electrónica",
  ],
  address: {
    "@type": "PostalAddress",
    streetAddress: "Av. Rómulo Betancourt 1302, Bella Vista",
    addressLocality: "Santo Domingo",
    addressCountry: "DO",
  },
  areaServed: { "@type": "Country", name: "República Dominicana" },
  audience: { "@type": "BusinessAudience", audienceType: "Micro, pequeñas y medianas empresas" },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servicios de transformación empresarial RCP",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Consultoría empresarial para MIPYMES",
          serviceType: "Business consulting and digital transformation",
          url: "https://rcp.services/servicios/consultoria",
          provider: { "@id": "https://rcp.services/#organization" },
          areaServed: { "@type": "Country", name: "República Dominicana" },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Renovación y mejora de procesos",
          serviceType: "Business process improvement",
          url: "https://rcp.services/servicios/renovacion",
          provider: { "@id": "https://rcp.services/#organization" },
          areaServed: { "@type": "Country", name: "República Dominicana" },
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Publicidad 360 para pequeños negocios",
          serviceType: "Integrated advertising and marketing",
          url: "https://rcp.services/servicios/publicidad",
          provider: { "@id": "https://rcp.services/#organization" },
          areaServed: { "@type": "Country", name: "República Dominicana" },
        },
      },
    ],
  },
  sameAs: publicContact.socialProfiles.map((profile) => profile.href),
};

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://rcp.services/#website",
  url: "https://rcp.services/",
  name: "RCP Services",
  inLanguage: ["es-DO", "en-US"],
  publisher: { "@id": "https://rcp.services/#organization" },
};
