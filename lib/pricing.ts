import type { Locale, LocalText } from "./types";

/** Planning estimates authorized by the owner; never used as checkout prices. */
export interface PriceEstimate {
  serviceId: string;
  min: number;
  max: number;
  cadence: "project" | "month";
  title: LocalText;
  scope: LocalText;
  exclusions: LocalText;
}

export const priceEstimates: readonly PriceEstimate[] = [
  { serviceId: "sitios-web", min: 15000, max: 30000, cadence: "project", title: { es: "Tu negocio, visible", en: "Make your business visible" }, scope: { es: "Una página de hasta 5 secciones, adaptación móvil, formulario, enlace a WhatsApp y 2 rondas de ajustes. Textos y marca suministrados por el cliente.", en: "One page with up to 5 sections, mobile layout, form, WhatsApp link and 2 revision rounds. Client supplies copy and brand assets." }, exclusions: { es: "Dominio, hosting, mantenimiento, tienda y fotografía se cotizan aparte.", en: "Domain, hosting, maintenance, store and photography quoted separately." } },
  { serviceId: "procesos-operativos", min: 12000, max: 28000, cadence: "project", title: { es: "Orden para avanzar", en: "Clarity to move forward" }, scope: { es: "Revisión de un proceso, hasta 3 entrevistas, mapa actual y propuesta de mejora con responsables. Una reunión de entrega.", en: "Review of one process, up to 3 interviews, current workflow and improvement proposal with owners. One handover meeting." }, exclusions: { es: "Implementación, software, licencias y visitas fuera de Santo Domingo se cotizan aparte.", en: "Implementation, software, licenses and travel outside Santo Domingo quoted separately." } },
  { serviceId: "redes-community", min: 8000, max: 15000, cadence: "month", title: { es: "Una marca presente", en: "Keep your brand present" }, scope: { es: "8 piezas estáticas adaptadas a Instagram y Facebook, calendario, programación y reporte mensual. Material suministrado y aprobado por el cliente.", en: "8 static pieces adapted for Instagram and Facebook, calendar, scheduling and monthly report. Client supplies and approves material." }, exclusions: { es: "Pauta, grabación, fotografía y atención continua de mensajes se cotizan aparte.", en: "Ad spend, filming, photography and ongoing inbox management quoted separately." } },
  { serviceId: "branding-identidad", min: 12000, max: 25000, cadence: "project", title: { es: "Identidad que conecta", en: "An identity that connects" }, scope: { es: "Una dirección visual, logotipo, paleta, tipografías, guía breve y 2 rondas de ajustes.", en: "One visual direction, logo, palette, typography, short guide and 2 revision rounds." }, exclusions: { es: "Naming, registro de marca, impresión y licencias de tipografías se cotizan aparte.", en: "Naming, trademark registration, printing and font licenses quoted separately." } },
  { serviceId: "formacion-intervencion", min: 5000, max: 10000, cadence: "project", title: { es: "Un equipo preparado", en: "A prepared team" }, scope: { es: "Un taller remoto de 2 horas para hasta 8 personas sobre un proceso acordado, guía y ejercicio práctico.", en: "One 2-hour remote workshop for up to 8 people on an agreed process, guide and practical exercise." }, exclusions: { es: "Desarrollo de sistemas, certificaciones y sesiones adicionales se cotizan aparte.", en: "System development, certifications and additional sessions quoted separately." } },
];

export function priceLabel(estimate: PriceEstimate, locale: Locale): string {
  const number = new Intl.NumberFormat(locale === "es" ? "es-DO" : "en-US");
  return `RD$ ${number.format(estimate.min)}–${number.format(estimate.max)}`;
}

export function estimateForService(id: string) {
  return priceEstimates.find((entry) => entry.serviceId === id);
}

export const estimateTerms: LocalText = {
  es: "Estimaciones en pesos dominicanos para planificar, sujetas a evaluación y cotización escrita. Impuestos aplicables no incluidos. El precio final depende del alcance, volumen y materiales. No se realiza ningún cobro desde esta guía.",
  en: "Planning estimates in Dominican pesos, subject to assessment and a written quote. Applicable taxes excluded. Final price depends on scope, volume and materials. This guide does not charge you.",
};
