import Link from "next/link";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import type { Locale } from "@/lib/types";
import styles from "./quote-review.module.css";

const allowedReference = /^[A-Za-z0-9-]{2,80}$/;

export function parseQuoteReferences(value?: string) {
  if (!value) return [];
  return [...new Set(value.split(",").map((entry) => entry.trim()).filter((entry) => allowedReference.test(entry)))].slice(0, 20);
}

export function QuoteReview({ locale, references }: { locale: Locale; references: string[] }) {
  const homeHref = locale === "es" ? "/catalogo" : "/en/catalog";
  const diagnosisBase = locale === "es" ? "/diagnostico" : "/en/diagnosis";
  const diagnosisHref = references.length ? `${diagnosisBase}?servicios=${encodeURIComponent(references.join(","))}` : diagnosisBase;

  return (
    <InteriorShell locale={locale}>
      <section className="interior-hero">
        <div className="container interior-hero__grid">
          <div>
            <p className="section-eyebrow">{locale === "es" ? "Revisión de solicitud" : "Request review"}</p>
            <h1>{locale === "es" ? "Una selección no es todavía una cotización." : "A selection is not yet a quote."}</h1>
            <p>{locale === "es" ? "Conservamos las referencias recibidas desde el catálogo anterior, pero no reutilizamos precios, alcance ni disponibilidad obsoletos. El equipo debe validar la necesidad y preparar una propuesta vigente." : "We preserve references received from the former catalog, but we do not reuse obsolete prices, scope or availability. The team must validate the need and prepare a current proposal."}</p>
            <div className="interior-hero__facts"><span>{locale === "es" ? "Sin pago" : "No payment"}</span><span>{locale === "es" ? "Sin precio automático" : "No automatic price"}</span><span>{locale === "es" ? "Validación humana" : "Human validation"}</span></div>
          </div>
          <Pulso scene="consider" size="large" label={locale === "es" ? "Pulso acompaña la revisión de referencias" : "Pulso accompanies the reference review"} />
        </div>
      </section>

      <section className={styles.section}>
        <div className={`container ${styles.grid}`}>
          <div className={styles.summary}>
            <p className="section-eyebrow">{locale === "es" ? "Referencias recibidas" : "Received references"}</p>
            <h2>{references.length ? (locale === "es" ? `${references.length} elemento${references.length === 1 ? "" : "s"} por validar` : `${references.length} item${references.length === 1 ? "" : "s"} to validate`) : (locale === "es" ? "No recibimos una selección válida." : "No valid selection was received.")}</h2>
            {references.length > 0 ? (
              <ul>{references.map((reference) => <li key={reference}><code>{reference}</code><span>{locale === "es" ? "Alcance y vigencia pendientes" : "Scope and currency pending"}</span></li>)}</ul>
            ) : (
              <p>{locale === "es" ? "Puedes regresar al catálogo y elegir hasta cuatro rutas actuales, o describir directamente el problema en el diagnóstico." : "You can return to the catalog and select up to four current routes, or describe the problem directly in the diagnosis."}</p>
            )}
          </div>
          <aside className={styles.nextStep}>
            <small>{locale === "es" ? "Próximo paso" : "Next step"}</small>
            <h3>{locale === "es" ? "Calificar la necesidad" : "Qualify the need"}</h3>
            <p>{locale === "es" ? "El Diagnóstico RCP 360 conserva estas referencias como contexto, identifica el pilar líder y define si corresponde una propuesta, derivación o conversación adicional." : "The RCP 360 Diagnosis preserves these references as context, identifies the lead pillar and defines whether a proposal, referral or further conversation is appropriate."}</p>
            <Link className="button button--primary button--large" href={diagnosisHref}>{locale === "es" ? "Continuar al diagnóstico" : "Continue to diagnosis"}</Link>
            <Link className="button button--secondary" href={homeHref}>{locale === "es" ? "Volver al catálogo" : "Back to catalog"}</Link>
          </aside>
        </div>
      </section>
    </InteriorShell>
  );
}
