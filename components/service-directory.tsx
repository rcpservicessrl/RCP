import Link from "next/link";
import { ArrowIcon } from "@/components/icons";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso } from "@/components/pulso";
import { catalog, pillars, publicCatalogByPillar, t } from "@/lib/content";
import type { Locale } from "@/lib/types";
import styles from "./service-directory.module.css";

export function ServiceDirectory({ locale }: { locale: Locale }) {
  const catalogHref = locale === "es" ? "/catalogo" : "/en/catalog";
  const technologyHref = locale === "es" ? "/soluciones-tecnologicas" : "/en/technology-solutions";
  const diagnosisHref = locale === "es" ? "/diagnostico" : "/en/diagnosis";
  const pillarHref = (pillarId: string) => locale === "es"
    ? `/servicios/${pillarId}`
    : `/en/services/${pillarId === "renovacion" ? "renewal" : pillarId === "consultoria" ? "consulting" : "advertising"}`;

  return (
    <InteriorShell locale={locale}>
      <section className="interior-hero">
        <div className="container interior-hero__grid">
          <div>
            <p className="section-eyebrow">{locale === "es" ? "Servicios RCP" : "RCP services"}</p>
            <h1>{locale === "es" ? "Tres pilares. Una intervención conectada." : "Three pillars. One connected intervention."}</h1>
            <p>{locale === "es" ? "Renovación, Consultoría y Publicidad trabajan como puertas de entrada complementarias. La tecnología se incorpora únicamente cuando mejora el proceso, el control o el resultado que la empresa necesita." : "Renewal, Consulting and Advertising work as complementary entry points. Technology is introduced only when it improves the process, control or outcome the business needs."}</p>
            <div className="interior-hero__facts">
              <span>{locale === "es" ? `${catalog.length} rutas documentadas` : `${catalog.length} documented routes`}</span>
              <span>{locale === "es" ? "Alcance por diagnóstico" : "Scope defined by diagnosis"}</span>
              <span>{locale === "es" ? "Evidencia y aceptación" : "Evidence and acceptance"}</span>
            </div>
          </div>
          <Pulso scene="present" size="large" label={locale === "es" ? "Pulso presenta los tres pilares de RCP Services" : "Pulso presents the three RCP Services pillars"} />
        </div>
      </section>

      <section className={styles.directory}>
        <div className="container">
          <div className={styles.intro}>
            <p className="section-eyebrow">{locale === "es" ? "Directorio de capacidades" : "Capability directory"}</p>
            <h2>{locale === "es" ? "Empieza por el resultado, no por una herramienta." : "Start with the outcome, not with a tool."}</h2>
            <p>{locale === "es" ? "Cada servicio puede activarse de forma independiente o combinarse en un Blueprint de intervención con especialistas, entregables, controles y propiedad definidos." : "Each service can be activated independently or combined into an intervention blueprint with defined specialists, deliverables, controls and ownership."}</p>
          </div>

          <div className={styles.pillars}>
            {pillars.map((pillar, index) => {
              const items = publicCatalogByPillar[pillar.id];
              return (
                <article id={pillar.id} className={styles.pillar} data-accent={pillar.accent} key={pillar.id}>
                  <header>
                    <span>0{index + 1}</span>
                    <div><small>{t(pillar.eyebrow, locale)}</small><h2>{t(pillar.title, locale)}</h2></div>
                  </header>
                  <p>{t(pillar.summary, locale)}</p>
                  <strong>{t(pillar.outcome, locale)}</strong>
                  <ul className={styles.coreServices}>
                    {pillar.services.map((service) => <li key={service.es}>{t(service, locale)}</li>)}
                  </ul>
                  <div className={styles.catalogList}>
                    <small>{locale === "es" ? `${items.length} productos y servicios documentados` : `${items.length} documented products and services`}</small>
                    <ul>{items.map((entry) => <li key={entry.id}>{t(entry.title, locale)}</li>)}</ul>
                  </div>
                  <Link className="text-link" href={pillarHref(pillar.id)}>{locale === "es" ? `Conocer ${pillar.title.es}` : `Explore ${pillar.title.en}`}<ArrowIcon size={16} /></Link>
                </article>
              );
            })}
          </div>

          <div className={styles.bridge}>
            <div>
              <p className="section-eyebrow">{locale === "es" ? "Tecnología transversal" : "Cross-cutting technology"}</p>
              <h2>{locale === "es" ? "CRM, ERP, POS, BI y automatización se adaptan al caso." : "CRM, ERP, POS, BI and automation adapt to the case."}</h2>
              <p>{locale === "es" ? "No forman un cuarto pilar ni una suite obligatoria. Se diseñan, integran o despliegan según el proceso, los datos, la regulación y el modelo de propiedad acordado." : "They are not a fourth pillar or a mandatory suite. They are designed, integrated or deployed according to the process, data, regulation and agreed ownership model."}</p>
            </div>
            <Link className="button button--secondary" href={technologyHref}>{locale === "es" ? "Explorar capacidades" : "Explore capabilities"}</Link>
          </div>

          <div className={styles.actions}>
            <Link className="button button--secondary button--large" href={catalogHref}>{locale === "es" ? "Ver catálogo completo" : "View full catalog"}</Link>
            <Link className="button button--primary button--large" href={diagnosisHref}>{locale === "es" ? "Iniciar diagnóstico" : "Start diagnosis"}</Link>
          </div>
        </div>
      </section>
    </InteriorShell>
  );
}
