import Link from "next/link";
import { ExternalMedia } from "@/components/external-media";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso, type PulsoScene } from "@/components/pulso";
import { pillars, t } from "@/lib/content";
import type { Locale, LocalText } from "@/lib/types";
import styles from "./editorial-page.module.css";

export type EditorialPageKind = "about" | "media" | "careers";

interface EditorialPageProps {
  locale: Locale;
  page: EditorialPageKind;
}

interface HeroCopy {
  eyebrow: LocalText;
  title: LocalText;
  lead: LocalText;
  facts: LocalText[];
  scene: PulsoScene;
}

const lt = (es: string, en: string): LocalText => ({ es, en });

const route = (locale: Locale, es: string, en: string) => (locale === "es" ? es : en);

const heroCopy: Record<EditorialPageKind, HeroCopy> = {
  about: {
    eyebrow: lt("Equipo de transformación para pequeños negocios", "Business transformation team for small businesses"),
    title: lt(
      "Un solo responsable para convertir necesidades en capacidad instalada.",
      "One accountable lead to turn needs into lasting capability.",
    ),
    lead: lt(
      "RCP Services diagnostica, organiza y ejecuta transformaciones empresariales a la medida. Integra Renovación, Consultoría y Publicidad, y aplica tecnología cuando el proceso realmente la necesita.",
      "RCP Services diagnoses, organizes and delivers tailored business transformations. It brings together Renewal, Consulting and Advertising, applying technology when the process genuinely needs it.",
    ),
    facts: [
      lt("Tres pilares de resultado", "Three outcome pillars"),
      lt("Especialistas según la necesidad", "Specialists selected for the need"),
      lt("Tecnología aplicada con propósito", "Purposeful applied technology"),
    ],
    scene: "present",
  },
  media: {
    eyebrow: lt("Biblioteca RCP", "RCP library"),
    title: lt("Recursos para comprender antes de decidir.", "Resources to understand before deciding."),
    lead: lt(
      "Videos y conversaciones sobre estrategia, validación y transformación empresarial. Cada pieza aporta contexto; la oferta vigente siempre se consulta en el catálogo y el Blueprint 5.0.",
      "Videos and conversations about strategy, validation and business transformation. Each piece adds context; the current offer is always defined by the catalog and Blueprint 5.0.",
    ),
    facts: [
      lt("2 videos", "2 videos"),
      lt("2 episodios de podcast", "2 podcast episodes"),
      lt("Contenido original en español", "Original content in Spanish"),
    ],
    scene: "analyze",
  },
  careers: {
    eyebrow: lt("Red de Especialistas RCP", "RCP Specialist Network"),
    title: lt(
      "El conocimiento adecuado, activado con contexto y responsabilidad.",
      "The right expertise, activated with context and accountability.",
    ),
    lead: lt(
      "RCP amplía su capacidad mediante profesionales y empresas especializadas que pasan por un proceso proporcional de revisión. No somos un marketplace abierto: RCP conserva el alcance, la coordinación, la evidencia y la responsabilidad ante el cliente.",
      "RCP expands its capacity through professionals and specialist companies that complete a proportionate review process. We are not an open marketplace: RCP retains scope, coordination, evidence and accountability to the client.",
    ),
    facts: [
      lt("Postular no garantiza asignaciones", "Applying does not guarantee assignments"),
      lt("Validación según categoría y riesgo", "Validation based on category and risk"),
      lt("Cada relación se documenta", "Every relationship is documented"),
    ],
    scene: "consider",
  },
};

function EditorialHero({ locale, page }: EditorialPageProps) {
  const copy = heroCopy[page];
  const label = {
    about: lt("Pulso presenta el modelo de RCP Services", "Pulso presents the RCP Services model"),
    media: lt("Pulso acompaña la biblioteca de recursos", "Pulso accompanies the resource library"),
    careers: lt("Pulso orienta sobre la Red de Especialistas", "Pulso explains the Specialist Network"),
  }[page];

  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{t(copy.eyebrow, locale)}</p>
          <h1>{t(copy.title, locale)}</h1>
          <p className={styles.heroLead}>{t(copy.lead, locale)}</p>
          <ul className={styles.heroFacts} aria-label={locale === "es" ? "Principios de la página" : "Page principles"}>
            {copy.facts.map((fact) => <li key={fact.es}>{t(fact, locale)}</li>)}
          </ul>
        </div>
        <div className={styles.heroVisual}>
          <span className={styles.heroOrbit} aria-hidden="true" />
          <Pulso scene={copy.scene} size="large" label={t(label, locale)} />
          <p>{locale === "es" ? "Guía visual · Pulso" : "Visual guide · Pulso"}</p>
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ eyebrow, title, lead }: { eyebrow: string; title: string; lead?: string }) {
  return (
    <div className={styles.sectionHeading}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2>{title}</h2>
      {lead && <p>{lead}</p>}
    </div>
  );
}

const operatingSteps = [
  {
    title: lt("Diagnóstico", "Diagnosis"),
    text: lt("Comprendemos el problema, el contexto y el resultado que debe cambiar.", "We understand the problem, context and outcome that must change."),
  },
  {
    title: lt("Expediente de necesidad", "Needs dossier"),
    text: lt("Convertimos la situación en alcance, riesgos, decisiones y evidencia esperada.", "We turn the situation into scope, risks, decisions and expected evidence."),
  },
  {
    title: lt("Plan y contrato", "Plan and contract"),
    text: lt("Definimos responsabilidades, propiedad, hitos, aceptación y condiciones de salida.", "We define responsibilities, ownership, milestones, acceptance and exit conditions."),
  },
  {
    title: lt("Equipo y ejecución", "Team and delivery"),
    text: lt("RCP coordina especialistas y capacidades según el riesgo y el resultado.", "RCP coordinates specialists and capabilities according to risk and outcome."),
  },
  {
    title: lt("Evidencia y aprobación", "Evidence and approval"),
    text: lt("Cada entrega se contrasta con criterios acordados antes de considerarse aceptada.", "Each delivery is checked against agreed criteria before it is considered accepted."),
  },
  {
    title: lt("Adopción, soporte o egreso", "Adoption, support or exit"),
    text: lt("La solución se opera, transfiere o continúa bajo la modalidad pactada.", "The solution is operated, transferred or continued under the agreed model."),
  },
];

function AboutContent({ locale }: { locale: Locale }) {
  const technologyHref = route(locale, "/soluciones-tecnologicas", "/en/technology-solutions");
  const diagnosisHref = route(locale, "/diagnostico", "/en/diagnosis");
  const servicesHref = route(locale, "/servicios", "/en/services");
  const distinctions = [
    {
      index: "01",
      title: lt("Entiende y define", "Understand and define"),
      text: lt("El punto de partida es el proceso y el resultado empresarial, no una herramienta predeterminada.", "The starting point is the business process and outcome, not a predetermined tool."),
    },
    {
      index: "02",
      title: lt("Forma el equipo correcto", "Build the right team"),
      text: lt("RCP selecciona y coordina las disciplinas necesarias sin trasladar esa complejidad al cliente.", "RCP selects and coordinates the disciplines required without shifting that complexity to the client."),
    },
    {
      index: "03",
      title: lt("Deja capacidad instalada", "Leave lasting capability"),
      text: lt("La intervención debe producir evidencia, adopción y una ruta clara de continuidad o egreso.", "The intervention must produce evidence, adoption and a clear continuity or exit path."),
    },
  ];
  const boundaries = [
    lt("No es una plataforma SaaS genérica.", "It is not a generic SaaS platform."),
    lt("No es un marketplace abierto de freelancers.", "It is not an open freelancer marketplace."),
    lt("No es una agencia ni una fábrica de software aislada.", "It is not an isolated agency or software factory."),
    lt("No sustituye las credenciales profesionales que un servicio regulado requiere.", "It does not replace the professional credentials required for regulated work."),
  ];

  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Qué hace diferente a RCP" : "What makes RCP different"}
            title={locale === "es" ? "Dirección, criterio y ejecución conectados." : "Connected direction, judgment and delivery."}
            lead={locale === "es" ? "El producto real no es una colección de servicios sueltos. Es una intervención coordinada con un responsable visible, especialistas adecuados y una cadena de evidencia." : "The real product is not a collection of disconnected services. It is a coordinated intervention with a visible accountable lead, the right specialists and an evidence chain."}
          />
          <div className={styles.valueGrid}>
            {distinctions.map((item) => (
              <article className={styles.valueCard} key={item.index}>
                <span>{item.index}</span>
                <h3>{t(item.title, locale)}</h3>
                <p>{t(item.text, locale)}</p>
              </article>
            ))}
          </div>
          <aside className={styles.boundaryCard}>
            <div>
              <p className={styles.eyebrow}>{locale === "es" ? "Límites claros" : "Clear boundaries"}</p>
              <h3>{locale === "es" ? "Lo que RCP no pretende ser" : "What RCP does not claim to be"}</h3>
            </div>
            <ul>{boundaries.map((item) => <li key={item.es}>{t(item, locale)}</li>)}</ul>
          </aside>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSurface}`}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Arquitectura 3P+T" : "3P+T architecture"}
            title={locale === "es" ? "Tres pilares comprados por resultado." : "Three pillars purchased by outcome."}
            lead={locale === "es" ? "Cada proyecto tiene un pilar líder. Los demás pueden apoyar, pero la responsabilidad sobre el resultado no se diluye." : "Each project has a lead pillar. The others may support it, but accountability for the outcome does not become diluted."}
          />
          <div className={styles.pillarGrid}>
            {pillars.map((pillar, index) => (
              <article className={styles.pillarCard} data-accent={pillar.accent} key={pillar.id}>
                <header><span>0{index + 1}</span><small>{t(pillar.eyebrow, locale)}</small></header>
                <h3>{t(pillar.title, locale)}</h3>
                <p>{t(pillar.summary, locale)}</p>
                <strong>{t(pillar.outcome, locale)}</strong>
                <ul>{pillar.services.slice(0, 3).map((service) => <li key={service.es}>{t(service, locale)}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className={styles.technologyBridge}>
            <div>
              <p className={styles.eyebrow}>{locale === "es" ? "Tecnología transversal" : "Cross-cutting technology"}</p>
              <h3>{locale === "es" ? "Software, automatización y datos al servicio del pilar líder." : "Software, automation and data in service of the lead pillar."}</h3>
              <p>{locale === "es" ? "CRM, ERP, POS, portales, analítica e integraciones se diseñan o incorporan cuando mejoran el proceso, el control o la continuidad. No constituyen un cuarto pilar." : "CRM, ERP, POS, portals, analytics and integrations are designed or introduced when they improve process, control or continuity. They are not a fourth pillar."}</p>
            </div>
            <Link className="button button--secondary" href={technologyHref}>{locale === "es" ? "Explorar tecnología aplicada" : "Explore applied technology"}</Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Cómo trabaja RCP" : "How RCP works"}
            title={locale === "es" ? "Del diagnóstico a una salida controlada." : "From diagnosis to a controlled exit."}
          />
          <ol className={styles.timeline}>
            {operatingSteps.map((step, index) => (
              <li key={step.title.es}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><h3>{t(step.title, locale)}</h3><p>{t(step.text, locale)}</p></div>
              </li>
            ))}
          </ol>
          <div className={styles.centerActions}>
            <Link className="button button--secondary button--large" href={servicesHref}>{locale === "es" ? "Conocer los servicios" : "Explore services"}</Link>
            <Link className="button button--primary button--large" href={diagnosisHref}>{locale === "es" ? "Solicitar diagnóstico" : "Request a diagnosis"}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

interface VideoResource {
  id: string;
  label: LocalText;
  title: string;
  description: LocalText;
}

const videos: VideoResource[] = [
  {
    id: "3uyrVE2TepY",
    label: lt("Video corporativo · Archivo", "Corporate video · Archive"),
    title: "RCP: Crecimiento Imparable",
    description: lt("Una introducción al origen de la visión RCP y a la relación entre Renovación, Consultoría y Publicidad.", "An introduction to the origin of the RCP vision and the relationship between Renewal, Consulting and Advertising."),
  },
  {
    id: "hrlKiOTJ_RI",
    label: lt("Presentación estratégica · Archivo", "Strategy presentation · Archive"),
    title: "Plan para Reanimar una Economía",
    description: lt("Una pieza de contexto sobre formalización, tecnología y desarrollo del tejido empresarial dominicano.", "A contextual piece about formalization, technology and the development of the Dominican business ecosystem."),
  },
];

const podcasts = [
  {
    id: "02EtL8PAFf932ZlVZ00Z2t",
    title: lt("Pretotipado y el costo real de crecer", "Pretotyping and the real cost of growth"),
    description: lt("Validación de ideas y reducción de riesgo antes de comprometer una inversión mayor.", "Idea validation and risk reduction before committing to a larger investment."),
  },
  {
    id: "6YuiTIdA2ZcACgZRxjP6jE",
    title: lt("Conversación estratégica RCP · Episodio 2", "RCP strategic conversation · Episode 2"),
    description: lt("Continuación de la biblioteca de conversaciones empresariales de RCP Services.", "A continuation of the RCP Services business conversation library."),
  },
];

function MediaContent({ locale }: { locale: Locale }) {
  const diagnosisHref = route(locale, "/diagnostico", "/en/diagnosis");
  const catalogHref = route(locale, "/catalogo", "/en/catalog");
  const learningRoutes = [
    { title: lt("Renovación", "Renewal"), text: lt("Procesos, propuesta de valor, experiencia y adopción.", "Processes, value proposition, experience and adoption.") },
    { title: lt("Consultoría", "Consulting"), text: lt("Decisiones, riesgos, obligaciones y evidencia.", "Decisions, risks, obligations and evidence.") },
    { title: lt("Publicidad", "Advertising"), text: lt("Marca, demanda, contenido y medición.", "Brand, demand, content and measurement.") },
    { title: lt("Tecnología aplicada", "Applied technology"), text: lt("Software y automatización diseñados alrededor del proceso.", "Software and automation designed around the process.") },
  ];

  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Videoteca" : "Video library"}
            title={locale === "es" ? "Ideas que explican de dónde venimos." : "Ideas that explain where we come from."}
            lead={locale === "es" ? "Estas producciones conservan el contexto de su fecha de publicación. No sustituyen una propuesta, cotización ni descripción contractual del servicio vigente." : "These productions preserve the context of their publication date. They do not replace a current proposal, quote or contractual service description."}
          />
          <div className={styles.videoGrid}>
            {videos.map((video) => (
              <article className={styles.mediaCard} key={video.id}>
                <div className={styles.videoFrame}>
                  <ExternalMedia
                    locale={locale}
                    title={video.title}
                    embedSrc={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
                    externalHref={`https://www.youtube.com/watch?v=${video.id}`}
                    provider="YouTube"
                    mode="video"
                  />
                </div>
                <div className={styles.mediaCopy}>
                  <small>{t(video.label, locale)}</small>
                  <h3>{video.title}</h3>
                  <p>{t(video.description, locale)}</p>
                  <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer">{locale === "es" ? "Abrir en YouTube" : "Open on YouTube"}<span aria-hidden="true">↗</span></a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionSurface}`}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Podcast" : "Podcast"}
            title={locale === "es" ? "Conversaciones para validar antes de escalar." : "Conversations to validate before scaling."}
            lead={locale === "es" ? "Escucha las piezas originales en Spotify. Los títulos descriptivos de esta página no alteran el contenido publicado en la plataforma." : "Listen to the original pieces on Spotify. Descriptive titles on this page do not alter the content published on the platform."}
          />
          <div className={styles.podcastStack}>
            {podcasts.map((podcast, index) => (
              <article className={styles.podcastCard} key={podcast.id}>
                <div className={styles.podcastHeader}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><small>{locale === "es" ? "Episodio" : "Episode"}</small><h3>{t(podcast.title, locale)}</h3><p>{t(podcast.description, locale)}</p></div>
                </div>
                <ExternalMedia
                  locale={locale}
                  title={`${locale === "es" ? "Podcast RCP Services" : "RCP Services podcast"}: ${t(podcast.title, locale)}`}
                  embedSrc={`https://open.spotify.com/embed/episode/${podcast.id}?utm_source=generator&theme=0`}
                  externalHref={`https://open.spotify.com/episode/${podcast.id}`}
                  provider="Spotify"
                  mode="audio"
                />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Rutas de aprendizaje" : "Learning paths"}
            title={locale === "es" ? "Explora con la misma lógica 3P+T." : "Explore through the same 3P+T logic."}
          />
          <div className={styles.learningGrid}>
            {learningRoutes.map((item, index) => <article key={item.title.es}><span>0{index + 1}</span><h3>{t(item.title, locale)}</h3><p>{t(item.text, locale)}</p></article>)}
          </div>
          <aside className={styles.archiveNote}>
            <strong>{locale === "es" ? "Nota de vigencia" : "Currency note"}</strong>
            <p>{locale === "es" ? "Los recursos pueden reflejar etapas anteriores de RCP Services. Para servicios, límites, propiedad y modalidad vigentes prevalecen el Blueprint 5.0, el catálogo publicado y el contrato aplicable." : "Resources may reflect earlier stages of RCP Services. For current services, boundaries, ownership and delivery models, Blueprint 5.0, the published catalog and the applicable contract prevail."}</p>
          </aside>
          <div className={styles.centerActions}>
            <Link className="button button--secondary button--large" href={catalogHref}>{locale === "es" ? "Explorar catálogo" : "Explore the catalog"}</Link>
            <Link className="button button--primary button--large" href={diagnosisHref}>{locale === "es" ? "Solicitar diagnóstico" : "Request a diagnosis"}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

const specialistCategories = [
  {
    label: lt("Pilar 01", "Pillar 01"),
    title: lt("Renovación", "Renewal"),
    roles: [
      lt("Análisis y rediseño de procesos", "Process analysis and redesign"),
      lt("Operaciones, cambio y experiencia", "Operations, change and experience"),
      lt("Documentación, SOP y productividad", "Documentation, SOPs and productivity"),
    ],
  },
  {
    label: lt("Pilar 02", "Pillar 02"),
    title: lt("Consultoría", "Consulting"),
    roles: [
      lt("Contabilidad, impuestos y finanzas", "Accounting, tax and finance"),
      lt("Derecho corporativo y contractual", "Corporate and contract law"),
      lt("Cumplimiento, control y e-CF", "Compliance, controls and e-invoicing"),
    ],
  },
  {
    label: lt("Pilar 03", "Pillar 03"),
    title: lt("Publicidad", "Advertising"),
    roles: [
      lt("Marca, diseño y producción", "Brand, design and production"),
      lt("Contenido, comunidad y medios", "Content, community and media"),
      lt("SEO, AEO, web y e-commerce", "SEO, AEO, web and e-commerce"),
    ],
  },
  {
    label: lt("Capacidad transversal", "Cross-cutting capability"),
    title: lt("Tecnología aplicada", "Applied technology"),
    roles: [
      lt("Producto, UX, frontend y backend", "Product, UX, frontend and backend"),
      lt("Datos, BI, QA y ciberseguridad", "Data, BI, QA and cybersecurity"),
      lt("Nube, integraciones, soporte y e-CF", "Cloud, integrations, support and e-invoicing"),
    ],
  },
];

const specialistSteps = [
  {
    title: lt("Solicitud inicial", "Initial application"),
    text: lt("Recibimos identidad, contacto, categoría, experiencia y portafolio básico.", "We receive identity, contact, category, experience and a basic portfolio."),
  },
  {
    title: lt("Revisión proporcional", "Proportionate review"),
    text: lt("Evaluamos experiencia, referencias, disponibilidad y ajuste a la categoría.", "We review experience, references, availability and category fit."),
  },
  {
    title: lt("Verificación", "Verification"),
    text: lt("Cuando el riesgo lo exige, validamos credenciales, vigencia, conflictos y capacidad documental.", "When risk requires it, we validate credentials, currency, conflicts and documentary capacity."),
  },
  {
    title: lt("Relación documentada", "Documented relationship"),
    text: lt("La modalidad aplicable se formaliza antes de compartir información o activar una asignación.", "The applicable model is formalized before information is shared or an assignment is activated."),
  },
  {
    title: lt("Invitación por necesidad", "Invitation based on need"),
    text: lt("RCP invita perfiles activos cuando existe alcance, disponibilidad y compatibilidad. La incorporación no garantiza proyectos.", "RCP invites active profiles when scope, availability and compatibility align. Joining does not guarantee projects."),
  },
];

function CareersContent({ locale }: { locale: Locale }) {
  const aboutHref = route(locale, "/nosotros", "/en/about");
  const applicationHref = route(locale, "/especialistas/postular", "/en/specialists/apply");
  const standards = [
    lt("Acceso mínimo, individual y con fecha de cierre.", "Minimum, individual access with a defined end date."),
    lt("Confidencialidad, conflicto y uso de datos documentados.", "Documented confidentiality, conflicts and data use."),
    lt("Evidencia, archivos fuente y criterios de aceptación según la categoría.", "Evidence, source files and acceptance criteria according to category."),
    lt("Comunicación y decisiones registradas dentro del proyecto RCP.", "Communication and decisions recorded within the RCP project."),
  ];

  return (
    <>
      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Áreas de incorporación" : "Network categories"}
            title={locale === "es" ? "Una red coordinada para sumar la capacidad que cada proyecto necesita." : "A coordinated network that adds the capability each project needs."}
            lead={locale === "es" ? "Las categorías describen posibles áreas de colaboración, no vacantes activas. Tecnología permanece transversal y cada asignación responde a un pilar dueño del resultado." : "Categories describe possible areas of collaboration, not active vacancies. Technology remains cross-cutting and every assignment supports a pillar accountable for the outcome."}
          />
          <div className={styles.categoryGrid}>
            {specialistCategories.map((category) => (
              <article key={category.title.es}>
                <small>{t(category.label, locale)}</small>
                <h3>{t(category.title, locale)}</h3>
                <ul>{category.roles.map((role) => <li key={role.es}>{t(role, locale)}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={locale === "es" ? "Proceso de incorporación" : "Network onboarding"}
            title={locale === "es" ? "Verificar antes de asignar." : "Verify before assigning."}
          />
          <ol className={styles.specialistTimeline}>
            {specialistSteps.map((step, index) => (
              <li key={step.title.es}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{t(step.title, locale)}</h3><p>{t(step.text, locale)}</p></div></li>
            ))}
          </ol>
          <aside className={styles.standardsCard}>
            <div><p className={styles.eyebrow}>{locale === "es" ? "Estándares de trabajo" : "Working standards"}</p><h3>{locale === "es" ? "Confianza verificable en cada entrega." : "Verifiable trust in every delivery."}</h3></div>
            <ul>{standards.map((standard) => <li key={standard.es}>{t(standard, locale)}</li>)}</ul>
          </aside>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={`container ${styles.ctaCard}`}>
          <div>
            <p className={styles.eyebrow}>{locale === "es" ? "Solicitud inicial" : "Initial application"}</p>
            <h2>{locale === "es" ? "Presenta tu experiencia sin enviar información sensible." : "Introduce your experience without sending sensitive information."}</h2>
            <p>{locale === "es" ? "En el primer contacto comparte únicamente nombre, categoría, experiencia, portafolio y disponibilidad general. Si el perfil avanza, RCP solicitará credenciales y documentación mediante un flujo controlado. Recibir una solicitud no implica empleo, activación ni asignación futura." : "In the first contact, share only your name, category, experience, portfolio and general availability. If the profile advances, RCP will request credentials and documentation through a controlled flow. Receiving an application does not imply employment, activation or a future assignment."}</p>
          </div>
          <div className={styles.ctaActions}>
            <Link className="button button--primary button--large" href={applicationHref}>{locale === "es" ? "Postular a la red" : "Apply to the network"}</Link>
            <Link className="button button--secondary button--large" href={aboutHref}>{locale === "es" ? "Conocer el modelo RCP" : "Explore the RCP model"}</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function pageSchema(locale: Locale, page: EditorialPageKind) {
  const localizedPath = {
    about: route(locale, "/nosotros", "/en/about"),
    media: route(locale, "/media", "/en/media"),
    careers: route(locale, "/especialistas", "/en/specialists"),
  }[page];
  const names = {
    about: lt("Nosotros — RCP Services", "About RCP Services"),
    media: lt("Biblioteca multimedia — RCP Services", "RCP Services media library"),
    careers: lt("Red de Especialistas RCP", "RCP Specialist Network"),
  }[page];

  return {
    "@context": "https://schema.org",
    "@type": page === "about" ? "AboutPage" : page === "media" ? "CollectionPage" : "WebPage",
    name: t(names, locale),
    url: `https://rcp.services${localizedPath}`,
    inLanguage: locale === "es" ? "es-DO" : "en-US",
    isPartOf: { "@id": "https://rcp.services/#website" },
    about: { "@id": "https://rcp.services/#organization" },
  };
}

export function EditorialPage({ locale, page }: EditorialPageProps) {
  const schema = JSON.stringify(pageSchema(locale, page)).replace(/</g, "\\u003c");

  return (
    <InteriorShell locale={locale}>
      <article className={styles.page} lang={locale === "es" ? "es-DO" : "en-US"}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        <EditorialHero locale={locale} page={page} />
        {page === "about" && <AboutContent locale={locale} />}
        {page === "media" && <MediaContent locale={locale} />}
        {page === "careers" && <CareersContent locale={locale} />}
      </article>
    </InteriorShell>
  );
}
