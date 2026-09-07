import Link from "next/link";
import type { Locale } from "@/lib/types";
import { estimateTerms, priceEstimates, priceLabel } from "@/lib/pricing";

export function PriceGuide({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return <section className="price-guide" id="precios"><div className="container">
    <p className="section-eyebrow">{es ? "Empieza con una inversión clara" : "Start with a clear investment"}</p>
    <h2>{es ? "Un primer paso a tu alcance." : "A first step within reach."}</h2>
    <p className="price-guide__lead">{es ? "Elige una prioridad. Define el alcance con nosotros. Amplía cuando tu negocio lo necesite." : "Choose a priority. Define the scope with us. Expand when your business needs it."}</p>
    <div className="price-guide__grid">{priceEstimates.slice(0, 3).map(entry => <article key={entry.serviceId}>
      <span className="price-guide__tag">{es ? "Inversión estimada" : "Estimated investment"}</span>
      <h3>{entry.title[locale]}</h3><p className="price-guide__amount">{priceLabel(entry, locale)}</p>
      <small>{entry.cadence === "month" ? (es ? "por mes" : "per month") : (es ? "por proyecto" : "per project")}</small>
      <p>{entry.scope[locale]}</p>
      <details><summary>{es ? "Qué se cotiza aparte" : "What is quoted separately"}</summary><p>{entry.exclusions[locale]}</p></details>
      <Link className="button button--primary" href={`${es ? "/diagnostico?servicios=" : "/en/diagnosis?services="}${entry.serviceId}#solicitud`}>{es ? "Conversar sobre este alcance" : "Discuss this scope"} ↗</Link>
    </article>)}</div>
    <p className="price-guide__terms">{estimateTerms[locale]}</p>
    <p className="price-guide__free">{es ? "¿Todavía no sabes por dónde empezar?" : "Not sure where to start?"} <Link href={es ? "/diagnostico#solicitud" : "/en/diagnosis#solicitud"}>{es ? "Evaluación inicial de 45 minutos sin costo, sujeta a confirmación" : "45-minute initial assessment at no cost, subject to confirmation"} ↗</Link></p>
  </div></section>;
}
