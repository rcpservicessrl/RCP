import { DiagnosisForm } from "@/components/diagnosis-form";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { methodSteps, t } from "@/lib/content";
import type { Locale } from "@/lib/types";
import styles from "./diagnosis-page.module.css";

export function DiagnosisPage({ locale, selectedServiceIds = [], selectedCapabilityId, selectedSolutionId }: { locale: Locale; selectedServiceIds?: string[]; selectedCapabilityId?: string; selectedSolutionId?: string }) {
  return (
    <InteriorShell locale={locale}>
      <section className="interior-hero">
        <div className="container interior-hero__grid">
          <div>
            <p className="section-eyebrow">{locale === "es" ? "Evaluación Inicial RCP 360°" : "RCP 360° Initial Assessment"}</p>
            <h1>{locale === "es" ? "Cuéntanos qué está frenando tu negocio." : "Tell us what is holding your business back."}</h1>
            <p>{locale === "es" ? "Solicita una conversación de 45 minutos, sin costo y sujeta a confirmación. Escuchamos la situación, ubicamos la prioridad y te explicamos cuál puede ser el próximo paso." : "Request a free 45-minute conversation, subject to confirmation. We listen, identify the priority and explain what the next step may be."}</p>
            <div className="interior-hero__facts"><span>{locale === "es" ? "45 minutos" : "45 minutes"}</span><span>{locale === "es" ? "Sin costo" : "No cost"}</span><span>{locale === "es" ? "Sujeta a confirmación" : "Subject to confirmation"}</span></div>
          </div>
          <Pulso scene="analyze" size="large" label={locale === "es" ? "Pulso acompaña la evaluación inicial" : "Pulso accompanies the initial assessment"} />
        </div>
      </section>

      <section className={styles.method}>
        <div className="container">
          <div className={styles.heading}>
            <p className="section-eyebrow">{locale === "es" ? "Método verificable" : "Verifiable method"}</p>
            <h2>{locale === "es" ? "Una ruta clara, desde escucharte hasta comprobar el resultado." : "A clear route from listening to verifying the outcome."}</h2>
          </div>
          <ol className={styles.steps}>
            {methodSteps.map((step) => (
              <li key={step.id}>
                <span>{step.number}</span>
                <h3>{t(step.title, locale)}</h3>
                <p>{t(step.action, locale)}</p>
                <small>{locale === "es" ? "Cómo lo comprobamos" : "How we confirm it"}: {t(step.outcome, locale)}</small>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className={styles.stages} aria-labelledby="assessment-stages-title">
        <div className="container">
          <div className={styles.heading}>
            <p className="section-eyebrow">{locale === "es" ? "Dos etapas diferentes" : "Two different stages"}</p>
            <h2 id="assessment-stages-title">{locale === "es" ? "La evaluación inicial no es el diagnóstico pagado." : "The initial assessment is not the paid diagnosis."}</h2>
          </div>
          <div className={styles.stageGrid}>
            <article><span>01</span><h3>{locale === "es" ? "Evaluación Inicial RCP 360°" : "RCP 360° Initial Assessment"}</h3><p>{locale === "es" ? "Conversación de 45 minutos, sin costo y sujeta a confirmación. Sirve para entender la necesidad y recomendar el próximo paso." : "A free 45-minute conversation, subject to confirmation. It helps us understand the need and recommend the next step."}</p></article>
            <article><span>02</span><h3>{locale === "es" ? "Diagnóstico RCP 360" : "RCP 360 Diagnosis"}</h3><p>{locale === "es" ? "Trabajo posterior y pagado cuando hace falta investigar con más profundidad. Su alcance, entregables e inversión se acuerdan antes de comenzar." : "A later paid engagement when deeper investigation is needed. Its scope, deliverables and investment are agreed before work begins."}</p></article>
          </div>
        </div>
      </section>

      <section className="diagnosis-section" id="solicitud">
        <div className="container diagnosis-section__grid">
          <div>
            <p className="section-eyebrow">{locale === "es" ? "Solicita tu evaluación" : "Request your assessment"}</p>
            <h2>{locale === "es" ? "Explícalo como tú lo conoces." : "Explain it in your own words."}</h2>
            <p className="section-lead">{locale === "es" ? "No tienes que conocer siglas ni escoger una herramienta. El equipo revisa la solicitud y confirma la conversación, el pilar que debe liderar y el próximo paso adecuado." : "You do not need to know acronyms or choose a tool. The team reviews the request and confirms the conversation, the lead pillar and the right next step."}</p>
          </div>
          <DiagnosisForm locale={locale} selectedServiceIds={selectedServiceIds} selectedCapabilityId={selectedCapabilityId} selectedSolutionId={selectedSolutionId} guided />
        </div>
      </section>
    </InteriorShell>
  );
}
