import type { Locale, LocalText } from "@/lib/types";

export const posOffer = {
  implementation: { startingPrice: 9900, currency: "DOP", cadence: "one-time" },
  accompaniment: { startingPrice: 1990, currency: "DOP", cadence: "monthly", optional: true },
  scope: {
    es: "Una sucursal, una caja y hasta tres usuarios. Ventas, inventario, clientes, cierre de caja y reportes; configuración inicial, importación de hasta 300 productos desde una plantilla acordada y una capacitación remota de dos horas.",
    en: "One location, one register and up to three users. Sales, inventory, customers, cash closing and reports; initial configuration, import of up to 300 products from an agreed template and one two-hour remote training session.",
  } satisfies LocalText,
  separateCosts: {
    es: "La licencia del sistema y el plan de emisión e-CF se cotizan aparte, según usuarios y volumen. También se cotizan por separado el certificado digital y sus renovaciones, equipos, sucursales adicionales, integraciones personalizadas y visitas presenciales.",
    en: "The system license and e-CF issuance plan are quoted separately, based on users and volume. Digital certificates and renewals, hardware, additional locations, custom integrations and on-site visits are also quoted separately.",
  } satisfies LocalText,
  requirements: {
    es: "La activación fiscal requiere la habilitación del contribuyente ante la DGII y un certificado digital vigente. Revisamos tus requisitos y acordamos pruebas y fecha de activación según tu caso.",
    en: "Fiscal activation requires taxpayer authorization by DGII and a valid digital certificate. We review your requirements and agree testing and an activation date for your case.",
  } satisfies LocalText,
  terms: {
    es: "Precios desde, en pesos dominicanos; impuestos aplicables no incluidos. La cotización escrita confirma alcance, costos iniciales y recurrentes, volumen e-CF y horario de soporte antes de contratar. La evaluación inicial de 45 minutos es sin costo.",
    en: "Starting prices in Dominican pesos; applicable taxes excluded. A written quote confirms scope, setup and recurring costs, e-CF volume and support hours before engagement. The initial 45-minute assessment is free.",
  } satisfies LocalText,
} as const;

export function posOfferDiagnosisHref(locale: Locale) {
  return locale === "es"
    ? "/diagnostico?offer=SOFTWARE&servicios=facturacion-electronica&capacidad=pos&solucion=ventas-inventario#solicitud"
    : "/en/diagnosis?offer=SOFTWARE&services=facturacion-electronica&capability=pos&solution=ventas-inventario#solicitud";
}

export function posOfferStructuredData(locale: Locale) {
  const url = `https://rcp.services${locale === "es" ? "/facturacion-electronica" : "/en/electronic-invoicing"}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#pos-implementation`,
    url,
    name: locale === "es" ? "Implementación de POS con facturación electrónica" : "POS implementation with electronic invoicing",
    description: `${posOffer.scope[locale]} ${posOffer.separateCosts[locale]} ${posOffer.requirements[locale]}`,
    provider: { "@type": "Organization", name: "RCP Services SRL", url: "https://rcp.services" },
    areaServed: { "@type": "Country", name: "Dominican Republic" },
    offers: {
      "@type": "Offer",
      url: `${url}#pos-ecf`,
      name: locale === "es" ? "Implementación inicial desde RD$9,900" : "Initial implementation from RD$9,900",
      description: `${locale === "es" ? "Pago único de implementación. " : "One-time implementation fee. "}${posOffer.separateCosts[locale]} ${posOffer.terms[locale]}`,
      priceSpecification: { "@type": "PriceSpecification", minPrice: posOffer.implementation.startingPrice, priceCurrency: "DOP" },
    },
  };
}
