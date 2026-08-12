import Link from "next/link";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { SpecialistApplicationForm } from "@/components/specialist-application-form";
import type { Locale } from "@/lib/types";
import styles from "./specialist-application-page.module.css";

export function SpecialistApplicationPage({ locale }: { locale: Locale }) {
  const isSpanish = locale === "es";

  return (
    <InteriorShell locale={locale}>
      <article className={styles.page} lang={isSpanish ? "es-DO" : "en-US"}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div>
              <p className={styles.eyebrow}>{isSpanish ? "Red de Especialistas RCP" : "RCP Specialist Network"}</p>
              <h1>{isSpanish ? "Presenta tu experiencia con claridad y sin documentos sensibles." : "Introduce your experience clearly and without sensitive documents."}</h1>
              <p className={styles.heroLead}>{isSpanish ? "Esta solicitud breve nos permite conocer tu área, experiencia y disponibilidad. RCP solo confirma la recepción cuando el registro queda guardado en su sistema." : "This brief application helps us understand your area, experience and availability. RCP only confirms receipt after the record is saved in its system."}</p>
              <ul className={styles.heroFacts}>
                <li>{isSpanish ? "Sin archivos adjuntos" : "No file uploads"}</li>
                <li>{isSpanish ? "Revisión proporcional" : "Proportionate review"}</li>
                <li>{isSpanish ? "Sin promesa de asignación" : "No assignment promise"}</li>
              </ul>
            </div>
            <div className={styles.heroVisual}>
              <Pulso scene="consider" size="large" label={isSpanish ? "Pulso acompaña la postulación a la Red de Especialistas" : "Pulso accompanies the Specialist Network application"} />
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className={`container ${styles.contentGrid}`}>
            <div className={styles.intro}>
              <p className={styles.eyebrow}>{isSpanish ? "Solicitud inicial" : "Initial application"}</p>
              <h2>{isSpanish ? "Primero entendemos el perfil. Las credenciales vienen después." : "First we understand the profile. Credentials come later."}</h2>
              <p>{isSpanish ? "Comparte únicamente información profesional básica y un enlace público si lo tienes. Si tu perfil avanza, RCP solicitará credenciales y documentación mediante un flujo controlado." : "Share only basic professional information and a public link if you have one. If your profile advances, RCP will request credentials and documentation through a controlled process."}</p>
              <aside className={styles.boundaryCard}>
                <strong>{isSpanish ? "Antes de continuar" : "Before you continue"}</strong>
                <ul>
                  <li>{isSpanish ? "La postulación no crea una relación laboral o contractual." : "Applying does not create an employment or contractual relationship."}</li>
                  <li>{isSpanish ? "La incorporación no garantiza proyectos ni asignaciones." : "Network admission does not guarantee projects or assignments."}</li>
                  <li>{isSpanish ? "No compartas cédula, RNC, certificados ni datos bancarios." : "Do not share identity documents, tax IDs, certificates or banking data."}</li>
                </ul>
              </aside>
              <Link className={styles.backLink} href={isSpanish ? "/especialistas" : "/en/specialists"}>
                {isSpanish ? "Conocer primero la Red de Especialistas" : "Learn about the Specialist Network first"}
              </Link>
            </div>
            <div className={styles.formCard}>
              <SpecialistApplicationForm locale={locale} />
            </div>
          </div>
        </section>
      </article>
    </InteriorShell>
  );
}
