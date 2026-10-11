import Link from "next/link";
import type { Locale } from "@/lib/types";
import { priceEstimates, priceLabel } from "@/lib/pricing";
import styles from "./commercial-offers.module.css";
export function CommercialOffers({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const web = priceEstimates.find(entry => entry.serviceId === "sitios-web")!;
  const route = es ? "/diagnostico" : "/en/diagnosis";
  return <section className={styles.section} id="ofertas" aria-labelledby="commercial-title"><div className="container">
    <p className="section-eyebrow">{es ? "Dos formas de empezar" : "Two ways to start"}</p>
    <h2 id="commercial-title">{es ? "Una web para conectar. Software para tu proceso." : "A website to connect. Software for your workflow."}</h2>
    <div className={styles.grid}>
      <article><span>WEB</span><h3>{es ? "Tu negocio, visible" : "Make your business visible"}</h3>
        <p>{es ? "Una web con tus servicios y acceso a WhatsApp para que puedan consultar contigo." : "A website with your services and access to WhatsApp so customers can contact you."}</p>
        <strong>{priceLabel(web, locale)} {es ? "orientativos · impuestos aparte" : "planning estimate · taxes excluded"}</strong>
        <p>{web.scope[locale]}</p><p>{web.exclusions[locale]}</p>
        <Link className="button button--primary" href={`${route}?offer=WEB&${es ? "servicios" : "services"}=sitios-web#solicitud`}>{es ? "Consultar por mi web" : "Ask about my website"} →</Link>
      </article>
      <article><span>SOFTWARE</span><h3>{es ? "Software a la medida de tu negocio" : "Software tailored to your business"}</h3>
        <p>{es ? "Una solución adaptada al proceso de tu negocio, con las funciones e integraciones que hagan falta." : "A solution adapted to your business workflow, with the features and integrations you need."}</p>
        <strong>{es ? "Presupuesto después de validar alcance y viabilidad" : "Quote after validating scope and feasibility"}</strong>
        <p>{es ? "Primero revisamos proceso, usuarios, funciones, integraciones y viabilidad. Después acordamos alcance, presupuesto y plazo en una propuesta." : "We first review workflow, users, features, integrations and feasibility. Then we agree scope, budget and timing in a proposal."}</p>
        <p>{es ? "La facturación electrónica e-CF sigue en desarrollo y no está disponible para contratar." : "e-CF electronic invoicing is in development and is not available to contract."}</p>
        <Link className="button button--primary" href={`${route}?offer=SOFTWARE#solicitud`}>{es ? "Consultar por mi software" : "Ask about my software"} →</Link>
      </article>
    </div>
  </div></section>;
}
