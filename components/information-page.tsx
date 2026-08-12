import type { Metadata } from "next";
import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { InteriorShell } from "@/components/interior-shell";
import { Pulso, type PulsoScene } from "@/components/pulso";
import { catalog, methodSteps, t } from "@/lib/content";
import { createPublicPageMetadata } from "@/lib/metadata";
import type { Locale, LocalText, PillarId } from "@/lib/types";
import styles from "./information-page.module.css";

export type InformationPageKind =
  | "renewal"
  | "consulting"
  | "advertising"
  | "howWeWork"
  | "customSoftware"
  | "electronicInvoicing"
  | "sectors"
  | "contact"
  | "resources";

interface PageLink {
  label: LocalText;
  href: LocalText;
}

interface PageCard {
  kicker: LocalText;
  title: LocalText;
  text: LocalText;
  link?: PageLink;
}

interface PageDetail {
  title: LocalText;
  text: LocalText;
  link?: PageLink;
}

interface InformationPageConfig {
  paths: LocalText;
  seoTitle: LocalText;
  seoDescription: LocalText;
  eyebrow: LocalText;
  title: LocalText;
  lead: LocalText;
  facts: LocalText[];
  scene: PulsoScene;
  introEyebrow: LocalText;
  introTitle: LocalText;
  introText: LocalText;
  cards: PageCard[];
  detailEyebrow: LocalText;
  detailTitle: LocalText;
  detailText: LocalText;
  details?: PageDetail[];
  pillar?: PillarId;
  method?: boolean;
  boundaryTitle: LocalText;
  boundaryText: LocalText;
  boundaryItems: LocalText[];
  ctaTitle: LocalText;
  ctaText: LocalText;
  primary: PageLink;
  secondary: PageLink;
}

const lt = (es: string, en: string): LocalText => ({ es, en });
const link = (esLabel: string, enLabel: string, esHref: string, enHref: string): PageLink => ({
  label: lt(esLabel, enLabel),
  href: lt(esHref, enHref),
});
const card = (kickerEs: string, kickerEn: string, titleEs: string, titleEn: string, textEs: string, textEn: string, pageLink?: PageLink): PageCard => ({
  kicker: lt(kickerEs, kickerEn),
  title: lt(titleEs, titleEn),
  text: lt(textEs, textEn),
  link: pageLink,
});
const detail = (titleEs: string, titleEn: string, textEs: string, textEn: string, pageLink?: PageLink): PageDetail => ({
  title: lt(titleEs, titleEn),
  text: lt(textEs, textEn),
  link: pageLink,
});

const diagnosis = link("Solicitar evaluación sin costo", "Request a free assessment", "/diagnostico", "/en/diagnosis");
const services = link("Ver todos los servicios", "View all services", "/servicios", "/en/services");
const catalogLink = link("Explorar el catálogo", "Explore the catalog", "/catalogo", "/en/catalog");
const technology = link("Ver capacidades tecnológicas", "View technology capabilities", "/soluciones-tecnologicas", "/en/technology-solutions");

const configs: Record<InformationPageKind, InformationPageConfig> = {
  renewal: {
    paths: lt("/servicios/renovacion", "/en/services/renewal"),
    seoTitle: lt("Renovación para pequeños negocios", "Renewal for small businesses"),
    seoDescription: lt("Ordena procesos, responsabilidades y experiencia de servicio con una renovación ajustada a la realidad de tu negocio.", "Organize processes, responsibilities and service experience through a renewal shaped around your business."),
    eyebrow: lt("Renovación", "Renewal"),
    title: lt("Ponemos orden para que tu negocio vuelva a tomar impulso.", "We bring order so your business can regain momentum."),
    lead: lt("Si la operación depende de una sola persona, la información está repartida o el equipo trabaja cada día de una forma distinta, empezamos por entender el problema y organizar una manera más clara de avanzar.", "If operations depend on one person, information is scattered or the team works differently every day, we begin by understanding the problem and organizing a clearer way forward."),
    facts: [lt("Procesos más claros", "Clearer processes"), lt("Responsables definidos", "Defined ownership"), lt("Alcance por diagnóstico", "Scope defined by diagnosis")],
    scene: "progress",
    introEyebrow: lt("Cuándo hace falta", "When it helps"),
    introTitle: lt("Renovar no es cambiarlo todo. Es corregir lo que hoy te frena.", "Renewal is not changing everything. It is fixing what holds you back."),
    introText: lt("La intervención se concentra en los procesos, hábitos y puntos de servicio que más afectan la operación.", "The work focuses on the processes, habits and service points that most affect operations."),
    cards: [
      card("01", "01", "Orden y procesos", "Order and processes", "Documentamos cómo se trabaja, dónde se detiene el flujo y qué debe quedar bajo control.", "We document how work happens, where the flow stops and what needs to be controlled."),
      card("02", "02", "Equipo y responsabilidades", "Team and ownership", "Definimos quién decide, quién ejecuta y cómo se mantiene la nueva forma de trabajar.", "We define who decides, who executes and how the new way of working is sustained."),
      card("03", "03", "Servicio y seguimiento", "Service and follow-up", "Alineamos la experiencia del cliente con pasos, controles e indicadores que el negocio pueda usar.", "We align customer experience with steps, controls and indicators the business can use."),
    ],
    detailEyebrow: lt("Servicios de Renovación", "Renewal services"),
    detailTitle: lt("Capacidades que pueden combinarse según la necesidad.", "Capabilities that can be combined around the need."),
    detailText: lt("Cada servicio tiene alcance, responsables y forma de aprobación propios. El diagnóstico define cuáles hacen falta.", "Each service has its own scope, owners and approval method. Diagnosis determines which ones are needed."),
    pillar: "renovacion",
    boundaryTitle: lt("Primero entendemos. Después proponemos.", "We understand first. Then we propose."),
    boundaryText: lt("No recomendamos sistemas, capacitaciones ni rediseños completos antes de conocer la causa del problema.", "We do not recommend systems, training or a full redesign before understanding the cause of the problem."),
    boundaryItems: [lt("La tecnología solo entra cuando mejora el proceso.", "Technology is added only when it improves the process."), lt("Los cambios se preparan para que el equipo pueda adoptarlos.", "Changes are prepared so the team can adopt them."), lt("Precio y calendario se confirman con el alcance.", "Price and schedule are confirmed with the scope.")],
    ctaTitle: lt("Comencemos por lo que hoy te quita tiempo o control.", "Let us begin with what is costing you time or control."),
    ctaText: lt("Cuéntanos qué está pasando. RCP determinará si conviene una conversación inicial, un diagnóstico o una propuesta puntual.", "Tell us what is happening. RCP will determine whether an initial conversation, a diagnosis or a focused proposal makes sense."),
    primary: diagnosis,
    secondary: catalogLink,
  },
  consulting: {
    paths: lt("/servicios/consultoria", "/en/services/consulting"),
    seoTitle: lt("Consultoría para pequeños negocios", "Consulting for small businesses"),
    seoDescription: lt("Consultoría impositiva, contable y financiera con alcance, controles y responsables definidos según cada caso.", "Tax, accounting and financial consulting with scope, controls and owners defined for each case."),
    eyebrow: lt("Consultoría", "Consulting"),
    title: lt("Decisiones importantes, con números, documentos y respaldo.", "Important decisions backed by numbers, documents and professional support."),
    lead: lt("Organizamos obligaciones, riesgos y decisiones para que sepas qué toca, quién lo revisa y cuál es el próximo paso. Cuando la materia lo exige, interviene el profesional autorizado correspondiente.", "We organize obligations, risks and decisions so you know what comes next, who reviews it and which step follows. When required, the appropriate authorized professional takes part."),
    facts: [lt("Impuestos y contabilidad", "Tax and accounting"), lt("Control financiero", "Financial control"), lt("Revisión profesional", "Professional review")],
    scene: "analyze",
    introEyebrow: lt("Apoyo con criterio", "Support with judgment"),
    introTitle: lt("Menos asuntos sueltos. Más claridad para decidir.", "Fewer loose ends. More clarity to decide."),
    introText: lt("La consultoría conecta documentos, fechas, responsables y evidencia alrededor de una necesidad concreta.", "Consulting connects documents, dates, owners and evidence around a specific need."),
    cards: [
      card("01", "01", "Impuestos y contabilidad", "Tax and accounting", "Igualas contables, preparación documental, calendarios y controles según el alcance acordado.", "Accounting retainers, document readiness, calendars and controls according to the agreed scope."),
      card("02", "02", "Presupuesto y control financiero", "Budgeting and financial control", "Costos, márgenes, escenarios e indicadores organizados para apoyar decisiones.", "Costs, margins, scenarios and indicators organized to support decisions."),
      card("03", "03", "Controles y documentación administrativa", "Controls and administrative records", "Riesgos, formularios, expedientes, aprobaciones y evidencias organizados para facilitar seguimiento.", "Risks, forms, records, approvals and evidence organized for easier follow-up."),
    ],
    detailEyebrow: lt("Servicios de Consultoría", "Consulting services"),
    detailTitle: lt("Apoyo profesional conectado con la operación real.", "Professional support connected to real operations."),
    detailText: lt("El servicio exacto depende del caso, la información disponible y la revisión del profesional responsable.", "The exact service depends on the case, available information and review by the responsible professional."),
    pillar: "consultoria",
    boundaryTitle: lt("La orientación no sustituye la revisión del caso.", "General guidance does not replace case review."),
    boundaryText: lt("No prometemos resultados fiscales, legales, financieros ni regulatorios. Cada recomendación se limita a la información y al alcance confirmados.", "We do not promise tax, legal, financial or regulatory outcomes. Each recommendation is limited to the confirmed information and scope."),
    boundaryItems: [lt("Los asuntos regulados requieren un profesional autorizado.", "Regulated matters require an authorized professional."), lt("Los documentos se revisan antes de considerarse finales.", "Documents are reviewed before they are considered final."), lt("Honorarios, terceros e impuestos se aclaran en la propuesta.", "Fees, third parties and taxes are clarified in the proposal.")],
    ctaTitle: lt("Pon en orden la decisión que no puedes seguir posponiendo.", "Bring structure to the decision you cannot keep postponing."),
    ctaText: lt("Describe el asunto y la fecha que te preocupa. Te indicaremos qué información hace falta para evaluar el siguiente paso.", "Describe the matter and the date that concerns you. We will explain what information is needed to assess the next step."),
    primary: diagnosis,
    secondary: catalogLink,
  },
  advertising: {
    paths: lt("/servicios/publicidad", "/en/services/advertising"),
    seoTitle: lt("Publicidad para pequeños negocios", "Advertising for small businesses"),
    seoDescription: lt("Marca, web, redes, campañas, impresos, letreros y promocionales coordinados alrededor de una necesidad comercial.", "Brand, web, social, campaigns, print, signage and promotional materials coordinated around a commercial need."),
    eyebrow: lt("Publicidad 360", "360 Advertising"),
    title: lt("Haz que tu negocio se vea claro, se recuerde y conecte mejor.", "Help your business look clear, stay memorable and connect better."),
    lead: lt("Publicidad 360 reúne marca, contenido, web, redes, anuncios, impresos, letreros y materiales promocionales bajo una misma intención comercial. Se activa solo lo que tu negocio necesita.", "360 Advertising brings brand, content, web, social, ads, print, signage and promotional materials under one commercial purpose. Only what your business needs is activated."),
    facts: [lt("Digital y físico", "Digital and physical"), lt("Una marca coherente", "A consistent brand"), lt("Medición sin promesas", "Measurement without promises")],
    scene: "present",
    introEyebrow: lt("Presencia completa", "Complete presence"),
    introTitle: lt("Desde el letrero hasta el buscador, todo debe contar la misma historia.", "From the storefront sign to search, everything should tell the same story."),
    introText: lt("La publicidad se organiza según la audiencia, el canal, el presupuesto y el siguiente paso que quieres provocar.", "Advertising is organized around the audience, channel, budget and next step you want to encourage."),
    cards: [
      card("01", "01", "Marca y contenido", "Brand and content", "Posicionamiento, identidad visual, fotografía, video y mensajes preparados para aplicarse.", "Positioning, visual identity, photography, video and messages prepared for use."),
      card("02", "02", "Web, redes y campañas", "Web, social and campaigns", "Páginas, contenido, community management, SEO, AEO, pauta y seguimiento comercial.", "Websites, content, community management, SEO, AEO, paid media and commercial follow-up."),
      card("03", "03", "Impresos y presencia física", "Print and physical presence", "Papelería, volantes, empaques, letreros, rotulación, uniformes y promocionales.", "Stationery, flyers, packaging, signs, branding, uniforms and promotional materials."),
    ],
    detailEyebrow: lt("Servicios de Publicidad", "Advertising services"),
    detailTitle: lt("Un solo pilar para lo digital, lo impreso y lo que se ve en la calle.", "One pillar for digital, print and what customers see on the street."),
    detailText: lt("Los materiales, cantidades, medios, instalaciones y presupuestos publicitarios se cotizan según especificación.", "Materials, quantities, media, installation and advertising budgets are quoted according to specification."),
    pillar: "publicidad",
    boundaryTitle: lt("Publicidad con objetivos claros, no con garantías inventadas.", "Advertising with clear goals, not invented guarantees."),
    boundaryText: lt("Podemos diseñar, producir, publicar y medir. No garantizamos ventas, posiciones en buscadores ni resultados que dependan del mercado o de terceros.", "We can design, produce, publish and measure. We do not guarantee sales, search rankings or results that depend on the market or third parties."),
    boundaryItems: [lt("Pauta, impresión, instalación y terceros se presupuestan aparte cuando aplica.", "Media, printing, installation and third parties are budgeted separately when applicable."), lt("Toda pieza pasa por aprobación antes de publicarse o producirse.", "Every piece is approved before publication or production."), lt("La medición se define según los canales realmente activados.", "Measurement is defined according to the channels actually activated.")],
    ctaTitle: lt("Dale una presencia más fuerte y coherente a tu negocio.", "Give your business a stronger, more consistent presence."),
    ctaText: lt("Cuéntanos qué vendes, a quién quieres llegar y qué necesitas producir o mejorar.", "Tell us what you sell, who you want to reach and what you need to produce or improve."),
    primary: diagnosis,
    secondary: catalogLink,
  },
  howWeWork: {
    paths: lt("/como-trabajamos", "/en/how-we-work"),
    seoTitle: lt("Cómo trabajamos", "How we work"),
    seoDescription: lt("Conoce la ruta RCP para escuchar, diagnosticar, diseñar, asignar, ejecutar, verificar y evolucionar cada intervención.", "Learn the RCP route to listen, diagnose, design, assign, execute, verify and evolve each engagement."),
    eyebrow: lt("Método RCP", "RCP method"),
    title: lt("Una ruta clara desde el problema hasta la mejora.", "A clear route from the problem to the improvement."),
    lead: lt("No empezamos vendiéndote una herramienta. Primero entendemos qué está pasando, definimos el alcance y dejamos claro quién hará qué y cómo se aprobará.", "We do not begin by selling you a tool. We first understand what is happening, define the scope and make clear who will do what and how it will be approved."),
    facts: [lt("7 momentos", "7 stages"), lt("Responsables visibles", "Visible ownership"), lt("Avances comprobables", "Verifiable progress")],
    scene: "progress",
    introEyebrow: lt("La forma de avanzar", "How progress works"),
    introTitle: lt("Cada paso responde una pregunta sencilla.", "Each stage answers a simple question."),
    introText: lt("La profundidad cambia según la necesidad, pero el criterio se mantiene: entender, acordar, ejecutar y comprobar.", "Depth changes with the need, but the principle remains: understand, agree, execute and verify."),
    cards: [
      card("Antes", "Before", "Entender antes de proponer", "Understand before proposing", "Escuchamos el problema, revisamos el contexto y ordenamos las prioridades.", "We listen to the problem, review the context and organize priorities."),
      card("Durante", "During", "Un responsable por etapa", "An owner for every stage", "Asignamos especialistas, registramos decisiones y comunicamos los avances.", "We assign specialists, record decisions and communicate progress."),
      card("Al cerrar", "At closure", "Comprobar y dejar continuidad", "Verify and leave continuity", "Probamos lo entregado, atendemos ajustes y definimos soporte o transferencia.", "We test what was delivered, address adjustments and define support or transfer."),
    ],
    detailEyebrow: lt("Los siete momentos", "The seven stages"),
    detailTitle: lt("Así se mueve una intervención RCP.", "How an RCP engagement moves forward."),
    detailText: lt("Cada etapa deja una acción clara y una forma concreta de comprobar el avance.", "Every stage leaves a clear action and a concrete way to verify progress."),
    method: true,
    boundaryTitle: lt("El método se adapta; el control no se improvisa.", "The method adapts; control is not improvised."),
    boundaryText: lt("Un trabajo puntual puede necesitar menos etapas y una transformación amplia puede requerir varias vueltas. Los cambios siempre se acuerdan.", "A focused task may need fewer stages and a broad transformation may require several cycles. Changes are always agreed."),
    boundaryItems: [lt("Ningún especialista recibe más acceso del necesario.", "No specialist receives more access than necessary."), lt("Los entregables tienen criterios de aprobación.", "Deliverables have approval criteria."), lt("La continuidad y la salida se definen desde el alcance.", "Continuity and exit are defined in the scope.")],
    ctaTitle: lt("Empieza con una necesidad, no con una lista de herramientas.", "Start with a need, not a list of tools."),
    ctaText: lt("Describe el proceso que quieres mejorar y te ayudaremos a identificar el punto de partida correcto.", "Describe the process you want to improve and we will help identify the right starting point."),
    primary: diagnosis,
    secondary: services,
  },
  customSoftware: {
    paths: lt("/software-a-la-medida", "/en/custom-software"),
    seoTitle: lt("Software a la medida para pequeños negocios", "Custom software for small businesses"),
    seoDescription: lt("Diseño e integración de CRM, ERP, POS, portales y automatizaciones alrededor del proceso real de cada negocio.", "Design and integration of CRM, ERP, POS, portals and automation around each business's real process."),
    eyebrow: lt("Tecnología aplicada", "Applied technology"),
    title: lt("Software hecho alrededor de tu forma real de trabajar.", "Software built around how your business actually works."),
    lead: lt("Podemos diseñar, adaptar o integrar CRM, ERP, POS, portales, inventario y automatizaciones cuando una herramienta genérica no resuelve el proceso. La tecnología acompaña a Renovación, Consultoría o Publicidad; no es un cuarto pilar.", "We can design, adapt or integrate CRM, ERP, POS, portals, inventory and automation when a generic tool does not fit the process. Technology supports Renewal, Consulting or Advertising; it is not a fourth pillar."),
    facts: [lt("Proceso antes que software", "Process before software"), lt("Datos y permisos definidos", "Defined data and permissions"), lt("Propiedad según contrato", "Ownership defined by contract")],
    scene: "analyze",
    introEyebrow: lt("Diseño con propósito", "Purposeful design"),
    introTitle: lt("No necesitas más funciones. Necesitas que las correctas funcionen bien.", "You do not need more features. You need the right ones to work well."),
    introText: lt("La solución se diseña según usuarios, tareas, datos, controles, integraciones y capacidad de mantenimiento.", "The solution is designed around users, tasks, data, controls, integrations and maintenance capacity."),
    cards: [
      card("01", "01", "El proceso manda", "The process leads", "Definimos primero qué trabajo debe mejorar, quién lo hace y qué decisión necesita apoyar.", "We first define which work must improve, who does it and which decision it needs to support."),
      card("02", "02", "Datos bajo control", "Data under control", "Separamos permisos, información del cliente y responsabilidades de operación desde el diseño.", "We separate permissions, customer information and operating responsibilities from the design stage."),
      card("03", "03", "Entrega sin amarre oculto", "Delivery without hidden lock-in", "Infraestructura, soporte, propiedad, exportación y salida quedan definidos en la propuesta.", "Infrastructure, support, ownership, export and exit are defined in the proposal."),
    ],
    detailEyebrow: lt("Ruta de construcción", "Delivery route"),
    detailTitle: lt("De la necesidad a un sistema que pueda operar.", "From the need to a system that can operate."),
    detailText: lt("El alcance puede ser una integración puntual, un módulo o una aplicación completa.", "Scope may be a focused integration, a module or a complete application."),
    details: [
      detail("Entender el flujo", "Understand the flow", "Usuarios, tareas, excepciones, datos y resultado esperado.", "Users, tasks, exceptions, data and expected outcome."),
      detail("Diseñar el alcance", "Design the scope", "Pantallas, reglas, permisos, integraciones y criterios de aprobación.", "Screens, rules, permissions, integrations and approval criteria."),
      detail("Construir por etapas", "Build in stages", "Entregas pequeñas que pueden revisarse antes de seguir avanzando.", "Small deliveries that can be reviewed before moving forward."),
      detail("Probar con el proceso real", "Test with the real process", "Validación funcional, seguridad proporcional y correcciones documentadas.", "Functional validation, proportionate security and documented corrections."),
      detail("Operar o transferir", "Operate or transfer", "Soporte, monitoreo, documentación y salida según el modelo acordado.", "Support, monitoring, documentation and exit according to the agreed model."),
    ],
    boundaryTitle: lt("No vendemos una suite universal.", "We do not sell a universal suite."),
    boundaryText: lt("Una solución a la medida no significa construir todo desde cero. Reutilizamos componentes seguros cuando aportan valor y personalizamos donde el proceso lo exige.", "A custom solution does not mean building everything from scratch. We reuse secure components when they add value and customize where the process requires it."),
    boundaryItems: [lt("El alcance se confirma después del diagnóstico.", "Scope is confirmed after diagnosis."), lt("Las integraciones dependen del acceso y las condiciones de cada proveedor.", "Integrations depend on each provider's access and conditions."), lt("Costos de terceros y continuidad se presentan por separado.", "Third-party costs and continuity are presented separately.")],
    ctaTitle: lt("Muéstranos el proceso que hoy no encaja en una herramienta genérica.", "Show us the process that does not fit a generic tool."),
    ctaText: lt("Revisaremos si conviene integrar, adaptar o construir, y qué parte debe resolverse primero.", "We will assess whether integration, adaptation or custom development makes sense, and which part should be solved first."),
    primary: diagnosis,
    secondary: technology,
  },
  electronicInvoicing: {
    paths: lt("/facturacion-electronica", "/en/electronic-invoicing"),
    seoTitle: lt("Facturación electrónica e-CF", "Electronic invoicing and e-CF"),
    seoDescription: lt("Guía educativa para entender la preparación operativa, fiscal y técnica de la facturación electrónica e-CF en República Dominicana.", "Educational guide to understand operational, tax and technical readiness for electronic invoicing in the Dominican Republic."),
    eyebrow: lt("Guía educativa e-CF · En desarrollo", "Educational e-invoicing guide · In development"),
    title: lt("Prepara tu negocio para facturar electrónicamente sin improvisar.", "Prepare your business for electronic invoicing without improvising."),
    lead: lt("Esta página explica qué debe preparar un negocio antes de integrar e-CF. La integración de facturación electrónica de RCP está en desarrollo y no está disponible para contratación.", "This page explains what a business should prepare before integrating electronic invoicing. RCP's electronic invoicing integration is in development and unavailable for contracting."),
    facts: [lt("Contenido educativo", "Educational content"), lt("Integración en desarrollo", "Integration in development"), lt("Sin contratación disponible", "Not available for engagement")],
    scene: "analyze",
    introEyebrow: lt("Antes de integrar", "Before integration"),
    introTitle: lt("La factura electrónica toca más que un botón de emitir.", "Electronic invoicing involves more than an issue button."),
    introText: lt("Ventas, clientes, productos, impuestos, secuencias, contingencia y conservación de evidencia deben funcionar como un solo proceso.", "Sales, customers, products, taxes, sequences, contingency and evidence retention must work as one process."),
    cards: [
      card("01", "01", "Proceso y responsabilidades", "Process and ownership", "Aclaramos quién prepara, revisa, emite, corrige y conserva cada evidencia.", "We clarify who prepares, reviews, issues, corrects and retains each piece of evidence."),
      card("02", "02", "Datos y sistemas", "Data and systems", "Revisamos clientes, productos, impuestos y puntos de integración que deben quedar listos.", "We review customers, products, taxes and integration points that must be ready."),
      card("03", "03", "Pruebas y continuidad", "Testing and continuity", "Definimos casos de prueba, manejo de errores, soporte y próximos pasos.", "We define test cases, error handling, support and next steps."),
    ],
    detailEyebrow: lt("Alcance posible", "Possible scope"),
    detailTitle: lt("Lo que conviene preparar antes de escoger una integración.", "What to prepare before choosing an integration."),
    detailText: lt("La condición del contribuyente, los sistemas actuales y las instrucciones oficiales determinan el orden y la profundidad. Esta guía no sustituye revisión fiscal ni confirma disponibilidad comercial.", "Taxpayer status, current systems and official instructions determine order and depth. This guide does not replace tax review or confirm commercial availability."),
    details: [
      detail("Evaluación de preparación", "Readiness assessment", "Revisión del proceso actual, actores, datos, documentos y dependencias.", "Review of the current process, actors, data, documents and dependencies."),
      detail("Organización fiscal y operativa", "Tax and operational organization", "Reglas, catálogos, responsables y escenarios que deben quedar claros.", "Rules, catalogs, owners and scenarios that must be clear."),
      detail("Puntos de integración", "Integration points", "Inventario educativo de datos, accesos y sistemas que una futura integración tendría que considerar.", "Educational inventory of data, access and systems a future integration would need to consider."),
      detail("Pruebas y salida", "Testing and handoff", "Casos acordados, evidencia, correcciones y plan de operación o soporte.", "Agreed cases, evidence, corrections and an operating or support plan."),
    ],
    boundaryTitle: lt("Orientación, no oferta de implementación.", "Guidance, not an implementation offer."),
    boundaryText: lt("RCP no ofrece actualmente la integración e-CF ni afirma una condición de proveedor autorizado. La emisión y aceptación dependen de la normativa, el contribuyente y las capacidades autorizadas aplicables.", "RCP does not currently offer e-invoicing integration or claim authorized-provider status. Issuance and acceptance depend on regulation, taxpayer status and applicable authorized capabilities."),
    boundaryItems: [lt("Consulta siempre las instrucciones vigentes de la DGII.", "Always consult current DGII guidance."), lt("Una revisión fiscal requiere el profesional autorizado correspondiente.", "A tax review requires the appropriate authorized professional."), lt("La disponibilidad se actualizará solo cuando exista evidencia operativa y contractual.", "Availability will be updated only when operational and contractual evidence exists.")],
    ctaTitle: lt("Sigue aprendiendo antes de escoger una herramienta.", "Keep learning before choosing a tool."),
    ctaText: lt("Explora cómo RCP separa las necesidades del negocio, las capacidades tecnológicas y los límites profesionales.", "Explore how RCP separates business needs, technology capabilities and professional boundaries."),
    primary: technology,
    secondary: link("Explorar recursos", "Explore resources", "/recursos", "/en/resources"),
  },
  sectors: {
    paths: lt("/sectores", "/en/sectors"),
    seoTitle: lt("Soluciones por sector", "Solutions by sector"),
    seoDescription: lt("Rutas de Renovación, Consultoría, Publicidad y tecnología adaptadas a comercios, imprentas y empresas de servicios.", "Renewal, Consulting, Advertising and technology routes adapted to retail, print and service businesses."),
    eyebrow: lt("Soluciones por sector", "Solutions by sector"),
    title: lt("La misma disciplina, adaptada a cómo opera tu negocio.", "The same discipline, adapted to how your business operates."),
    lead: lt("No aplicamos una receta universal. Partimos de los procesos, obligaciones, clientes y canales que realmente existen en cada tipo de negocio.", "We do not apply a universal recipe. We start from the processes, obligations, customers and channels that actually exist in each type of business."),
    facts: [lt("Comercio e inventario", "Retail and inventory"), lt("Imprentas y personalización", "Print and personalization"), lt("Empresas de servicios", "Service businesses")],
    scene: "present",
    introEyebrow: lt("Rutas iniciales", "Initial routes"),
    introTitle: lt("Empieza por el sector; termina con un alcance propio.", "Start with the sector; end with a scope of your own."),
    introText: lt("Estas rutas sirven para reconocer problemas comunes. El diagnóstico confirma qué aplica y qué no.", "These routes help identify common problems. Diagnosis confirms what applies and what does not."),
    cards: [
      card("Comercio", "Retail", "Ventas, inventario y caja", "Sales, inventory and checkout", "Procesos de venta, POS, existencias, compras, cierres, clientes y seguimiento comercial.", "Sales processes, POS, stock, purchasing, closing, customers and commercial follow-up."),
      card("Producción", "Production", "Imprentas y personalización", "Print and personalization", "Cotización, artes, aprobación, materiales, producción, avance, entrega y recompra.", "Quoting, artwork, approval, materials, production, progress, delivery and repeat business."),
      card("Servicios", "Services", "Proyectos, clientes y documentos", "Projects, customers and documents", "Captación, propuestas, expedientes, responsables, entregables, facturación y continuidad.", "Lead capture, proposals, records, owners, deliverables, invoicing and continuity."),
    ],
    detailEyebrow: lt("Qué observamos", "What we review"),
    detailTitle: lt("Tres preguntas para encontrar la ruta correcta.", "Three questions to find the right route."),
    detailText: lt("El sector orienta la conversación, pero la solución se define alrededor del proceso que más afecta el negocio.", "The sector guides the conversation, but the solution is defined around the process that most affects the business."),
    details: [
      detail("¿Dónde se pierde tiempo o control?", "Where are time or control being lost?", "Revisamos tareas repetidas, información dispersa, inventario, aprobaciones y responsables.", "We review repeated tasks, scattered information, inventory, approvals and ownership."),
      detail("¿Qué obligación o riesgo pesa más?", "Which obligation or risk weighs most?", "Identificamos fechas, documentos, controles y revisión profesional que puedan hacer falta.", "We identify dates, documents, controls and professional review that may be needed."),
      detail("¿Cómo llegan y avanzan los clientes?", "How do customers arrive and move forward?", "Observamos marca, canales, seguimiento, experiencia y próximos pasos comerciales.", "We review brand, channels, follow-up, experience and commercial next steps."),
    ],
    boundaryTitle: lt("El sector ayuda a orientar; no reemplaza el diagnóstico.", "The sector guides the work; it does not replace diagnosis."),
    boundaryText: lt("Dos negocios del mismo sector pueden necesitar soluciones distintas por tamaño, equipo, proceso, regulación o herramientas actuales.", "Two businesses in the same sector may need different solutions because of size, team, process, regulation or current tools."),
    boundaryItems: [lt("No asumimos que todos necesitan el mismo software.", "We do not assume everyone needs the same software."), lt("Cada pilar puede participar en distinta proporción.", "Each pillar may participate in a different proportion."), lt("El alcance final se documenta antes de ejecutar.", "Final scope is documented before execution.")],
    ctaTitle: lt("Cuéntanos cómo funciona tu negocio hoy.", "Tell us how your business works today."),
    ctaText: lt("Identificaremos el proceso que conviene revisar primero y los pilares que podrían intervenir.", "We will identify the process that should be reviewed first and the pillars that may be involved."),
    primary: diagnosis,
    secondary: services,
  },
  contact: {
    paths: lt("/contacto", "/en/contact"),
    seoTitle: lt("Contacto", "Contact"),
    seoDescription: lt("Contacta a RCP Services en Santo Domingo para conversar sobre Renovación, Consultoría, Publicidad o software a la medida.", "Contact RCP Services in Santo Domingo to discuss Renewal, Consulting, Advertising or custom software."),
    eyebrow: lt("Hablemos", "Let us talk"),
    title: lt("Cuéntanos qué está frenando tu negocio.", "Tell us what is holding your business back."),
    lead: lt("No tienes que saber el nombre técnico de la solución. Explica qué está pasando, qué quieres lograr y cuándo necesitas avanzar.", "You do not need to know the technical name of the solution. Explain what is happening, what you want to achieve and when you need to move forward."),
    facts: [lt("Santo Domingo, R. D.", "Santo Domingo, D.R."), lt("Respuesta por el canal elegido", "Reply through your chosen channel"), lt("Alcance antes de contratar", "Scope before engagement")],
    scene: "consider",
    introEyebrow: lt("Canales de contacto", "Contact channels"),
    introTitle: lt("Elige la forma más cómoda de comenzar.", "Choose the easiest way to begin."),
    introText: lt("Para una necesidad que requiere contexto, el Diagnóstico RCP 360 es la mejor puerta de entrada.", "For a need that requires context, the RCP 360 Diagnosis is the best starting point."),
    cards: [
      card("Correo", "Email", "info@rcp.services", "info@rcp.services", "Úsalo para una consulta general o para dar seguimiento a una conversación existente.", "Use it for a general question or to follow up on an existing conversation.", link("Escribir por correo", "Send an email", "mailto:info@rcp.services", "mailto:info@rcp.services")),
      card("WhatsApp", "WhatsApp", "+1 829 806 8092", "+1 829 806 8092", "Canal directo para explicar brevemente la necesidad y confirmar cómo continuar.", "A direct channel to briefly explain the need and confirm how to continue.", link("Abrir WhatsApp", "Open WhatsApp", "https://wa.me/18298068092", "https://wa.me/18298068092")),
      card("Diagnóstico", "Diagnosis", "Diagnóstico RCP 360", "RCP 360 Diagnosis", "Formulario guiado para organizar el problema, el resultado esperado y los servicios que quieres evaluar.", "A guided form to organize the problem, expected outcome and services you want to evaluate.", diagnosis),
    ],
    detailEyebrow: lt("Qué pasa después", "What happens next"),
    detailTitle: lt("Una conversación clara, sin obligarte a comprar.", "A clear conversation without pressure to buy."),
    detailText: lt("La información inicial se usa para determinar el canal y el siguiente paso adecuado.", "Initial information is used to determine the appropriate channel and next step."),
    details: [
      detail("Revisamos la solicitud", "We review the request", "Confirmamos que entendimos la necesidad y si hace falta información adicional.", "We confirm that we understand the need and whether more information is required."),
      detail("Definimos el siguiente paso", "We define the next step", "Puede ser una orientación inicial, un diagnóstico o una conversación con el especialista adecuado.", "It may be initial guidance, a diagnosis or a conversation with the right specialist."),
      detail("Acordamos antes de ejecutar", "We agree before execution", "Alcance, responsables, precio, calendario y condiciones se presentan antes de comenzar.", "Scope, owners, price, schedule and conditions are presented before work begins."),
    ],
    boundaryTitle: lt("Protege tu información desde el primer contacto.", "Protect your information from the first contact."),
    boundaryText: lt("No envíes cédulas, claves, estados financieros, contratos completos ni otros documentos sensibles por el formulario o WhatsApp sin recibir instrucciones.", "Do not send identification documents, passwords, financial statements, full contracts or other sensitive documents through the form or WhatsApp without instructions."),
    boundaryItems: [lt("Comparte solo el contexto necesario para comenzar.", "Share only the context needed to begin."), lt("Los documentos se solicitan por un canal acordado cuando hacen falta.", "Documents are requested through an agreed channel when needed."), lt("Una consulta inicial no constituye asesoría profesional ni contratación.", "An initial inquiry does not constitute professional advice or an engagement.")],
    ctaTitle: lt("Organiza tu necesidad en pocos minutos.", "Organize your need in a few minutes."),
    ctaText: lt("El diagnóstico te ayuda a explicar el problema sin tener que conocer de antemano el servicio correcto.", "The diagnosis helps you explain the problem without having to know the correct service in advance."),
    primary: diagnosis,
    secondary: services,
  },
  resources: {
    paths: lt("/recursos", "/en/resources"),
    seoTitle: lt("Recursos para dueños de negocio", "Resources for business owners"),
    seoDescription: lt("Catálogo, guías, videos y explicaciones para conocer cómo RCP Services aborda procesos, riesgos, publicidad y tecnología.", "Catalog, guides, videos and explanations about how RCP Services approaches processes, risk, advertising and technology."),
    eyebrow: lt("Recursos RCP", "RCP resources"),
    title: lt("Información clara para entender antes de decidir.", "Clear information to understand before deciding."),
    lead: lt("Explora los servicios, el método y las capacidades tecnológicas sin tener que descifrar términos complicados. La oferta vigente siempre se confirma en el catálogo y mediante diagnóstico.", "Explore services, the method and technology capabilities without decoding complicated terms. The current offer is always confirmed in the catalog and through diagnosis."),
    facts: [lt("Contenido en español e inglés", "Content in Spanish and English"), lt("Sin precios rígidos", "No rigid public pricing"), lt("Alcance verificable", "Verifiable scope")],
    scene: "present",
    introEyebrow: lt("Empieza aquí", "Start here"),
    introTitle: lt("Tres formas de conocer el ecosistema RCP.", "Three ways to understand the RCP ecosystem."),
    introText: lt("Elige según lo que quieras resolver: servicios, tecnología o contenido educativo.", "Choose according to what you want to solve: services, technology or educational content."),
    cards: [
      card("Servicios", "Services", "Catálogo de productos y servicios", "Product and service catalog", "Renovación, Consultoría y Publicidad organizadas por necesidad y resultado esperado.", "Renewal, Consulting and Advertising organized by need and expected outcome.", catalogLink),
      card("Tecnología", "Technology", "Capacidades explicadas en contexto", "Capabilities explained in context", "CRM, ERP, POS, automatización y otros sistemas explicados por el problema que ayudan a resolver.", "CRM, ERP, POS, automation and other systems explained through the problems they help solve.", technology),
      card("Biblioteca", "Library", "Videos y conversaciones", "Videos and conversations", "Contenido original para conocer ideas, decisiones y aprendizajes relacionados con el negocio.", "Original content about ideas, decisions and lessons related to business.", link("Abrir biblioteca", "Open library", "/media", "/en/media")),
    ],
    detailEyebrow: lt("Conoce el modelo", "Understand the model"),
    detailTitle: lt("Profundiza solo en lo que te resulte útil.", "Go deeper only where it is useful."),
    detailText: lt("Estas páginas explican cómo trabaja RCP y dónde están los límites de cada propuesta.", "These pages explain how RCP works and where each offer's boundaries are."),
    details: [
      detail("Cómo trabajamos", "How we work", "Los siete momentos del método RCP, desde escuchar hasta verificar y evolucionar.", "The seven stages of the RCP method, from listening to verifying and evolving.", link("Ver el método", "View the method", "/como-trabajamos", "/en/how-we-work")),
      detail("Quiénes somos", "About RCP Services", "El modelo de tres pilares, la tecnología transversal y la responsabilidad de coordinación.", "The three-pillar model, cross-cutting technology and coordination responsibility.", link("Conocer RCP", "About RCP", "/nosotros", "/en/about")),
      detail("Red de especialistas", "Specialist network", "Cómo se revisan categorías, experiencia, acceso y condiciones antes de una asignación.", "How categories, experience, access and conditions are reviewed before an assignment.", link("Ver la red", "View the network", "/especialistas", "/en/specialists")),
    ],
    boundaryTitle: lt("El contenido orienta; el diagnóstico define.", "Content provides guidance; diagnosis defines scope."),
    boundaryText: lt("Una página informativa no sustituye la revisión de tu negocio, la validación profesional ni una propuesta de alcance.", "An informational page does not replace review of your business, professional validation or a scoped proposal."),
    boundaryItems: [lt("Los servicios disponibles se confirman en el catálogo vigente.", "Available services are confirmed in the current catalog."), lt("Las capacidades reguladas muestran sus límites.", "Regulated capabilities show their boundaries."), lt("Los casos y resultados solo se publican con evidencia y permiso.", "Cases and results are published only with evidence and permission.")],
    ctaTitle: lt("¿Ya identificaste lo que quieres mejorar?", "Have you identified what you want to improve?"),
    ctaText: lt("Pasa al diagnóstico para organizar la necesidad y recibir orientación sobre el siguiente paso.", "Move to the diagnosis to organize the need and receive guidance on the next step."),
    primary: diagnosis,
    secondary: services,
  },
};

export function getInformationPageMetadata(page: InformationPageKind, locale: Locale): Metadata {
  const config = configs[page];
  const canonical = t(config.paths, locale);
  return createPublicPageMetadata({
    locale,
    title: t(config.seoTitle, locale),
    description: t(config.seoDescription, locale),
    canonical,
    paths: config.paths,
  });
}

function ActionLink({ item, locale, className }: { item: PageLink; locale: Locale; className?: string }) {
  const href = t(item.href, locale);
  const label = t(item.label, locale);
  const content = <>{label}<ArrowIcon size={16} /></>;
  if (href.startsWith("http")) return <a className={className} href={href} target="_blank" rel="noreferrer">{content}</a>;
  if (href.startsWith("mailto:")) return <a className={className} href={href}>{content}</a>;
  return <Link className={className} href={href}>{content}</Link>;
}

function resolveDetails(config: InformationPageConfig, locale: Locale): Array<{ title: string; text: string; href?: string; linkLabel?: string }> {
  if (config.pillar) {
    return catalog
      .filter((entry) => entry.pillar === config.pillar && entry.kind !== "entry")
      .map((entry) => ({
        title: t(entry.title, locale),
        text: t(entry.result, locale),
        href: locale === "es" ? `/catalogo?servicio=${entry.id}` : `/en/catalog?service=${entry.id}`,
        linkLabel: locale === "es" ? "Ver en el catálogo" : "View in catalog",
      }));
  }
  if (config.method) {
    return methodSteps.map((step) => ({
      title: `${step.number} · ${t(step.title, locale)}`,
      text: `${t(step.action, locale)} ${locale === "es" ? "Cómo lo comprobamos:" : "How we verify it:"} ${t(step.outcome, locale)}`,
    }));
  }
  return (config.details ?? []).map((entry) => ({
    title: t(entry.title, locale),
    text: t(entry.text, locale),
    href: entry.link ? t(entry.link.href, locale) : undefined,
    linkLabel: entry.link ? t(entry.link.label, locale) : undefined,
  }));
}

export function InformationPage({ locale, page }: { locale: Locale; page: InformationPageKind }) {
  const config = configs[page];
  const details = resolveDetails(config, locale);
  const pageUrl = `https://rcp.services${t(config.paths, locale)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: t(config.seoTitle, locale),
    description: t(config.seoDescription, locale),
    inLanguage: locale === "es" ? "es-DO" : "en-US",
    isPartOf: { "@id": "https://rcp.services/#website" },
  };

  return (
    <InteriorShell locale={locale}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className={styles.page}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{t(config.eyebrow, locale)}</p>
              <h1>{t(config.title, locale)}</h1>
              <p className={styles.heroLead}>{t(config.lead, locale)}</p>
              <ul className={styles.facts}>{config.facts.map((fact) => <li key={fact.es}>{t(fact, locale)}</li>)}</ul>
            </div>
            <div className={styles.heroVisual}>
              <div className={styles.heroOrbit} aria-hidden="true" />
              <Pulso scene={config.scene} size="large" label={locale === "es" ? `Pulso presenta ${t(config.eyebrow, locale)}` : `Pulso presents ${t(config.eyebrow, locale)}`} />
            </div>
          </div>
        </header>

        <section className={styles.section}>
          <div className="container">
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{t(config.introEyebrow, locale)}</p>
              <h2>{t(config.introTitle, locale)}</h2>
              <p>{t(config.introText, locale)}</p>
            </div>
            <div className={styles.cards}>
              {config.cards.map((entry) => (
                <article className={styles.card} key={entry.title.es}>
                  <small>{t(entry.kicker, locale)}</small>
                  <h3>{t(entry.title, locale)}</h3>
                  <p>{t(entry.text, locale)}</p>
                  {entry.link && <ActionLink item={entry.link} locale={locale} />}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={`${styles.section} ${styles.sectionSurface}`}>
          <div className="container">
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{t(config.detailEyebrow, locale)}</p>
              <h2>{t(config.detailTitle, locale)}</h2>
              <p>{t(config.detailText, locale)}</p>
            </div>
            <div className={styles.details}>
              {details.map((entry, index) => (
                <article className={styles.detail} key={`${entry.title}-${index}`}>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                  <div>
                    <h3>{entry.title}</h3>
                    <p>{entry.text}</p>
                    {entry.href && entry.linkLabel && <Link href={entry.href}>{entry.linkLabel}<ArrowIcon size={15} /></Link>}
                  </div>
                </article>
              ))}
            </div>
            <aside className={styles.boundary}>
              <div>
                <p className={styles.eyebrow}>{locale === "es" ? "Alcance claro" : "Clear scope"}</p>
                <h3>{t(config.boundaryTitle, locale)}</h3>
                <p>{t(config.boundaryText, locale)}</p>
              </div>
              <ul>{config.boundaryItems.map((item) => <li key={item.es}><CheckIcon size={18} /><span>{t(item, locale)}</span></li>)}</ul>
            </aside>
          </div>
        </section>

        <section className={styles.cta}>
          <div className="container">
            <div className={styles.ctaCard}>
              <div>
                <p className={styles.eyebrow}>{locale === "es" ? "Siguiente paso" : "Next step"}</p>
                <h2>{t(config.ctaTitle, locale)}</h2>
                <p>{t(config.ctaText, locale)}</p>
              </div>
              <div className={styles.actions}>
                <ActionLink item={config.primary} locale={locale} className="button button--primary button--large" />
                <ActionLink item={config.secondary} locale={locale} className="button button--secondary button--large" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </InteriorShell>
  );
}
