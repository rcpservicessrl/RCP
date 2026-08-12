import type {
  Capability,
  CapabilityFamily,
  CatalogItem,
  Locale,
  LocalText,
  MethodStep,
  NeedRoute,
  Pillar,
  PillarId,
  SearchRecord,
  TechnologySolution,
} from "@/lib/types";

export const t = (value: LocalText, locale: Locale) => value[locale];

const lt = (es: string, en: string): LocalText => ({ es, en });

export const pillars: Pillar[] = [
  {
    id: "renovacion",
    eyebrow: lt("Ordenar para avanzar", "Build order to move forward"),
    title: lt("Renovación", "Renewal"),
    summary: lt(
      "Modernizamos procesos, experiencia, identidad y capacidad de ejecución.",
      "We modernize processes, experience, identity and execution capacity.",
    ),
    outcome: lt(
      "Una empresa más clara, adoptable y preparada para operar el cambio.",
      "A clearer, adoptable business prepared to operate change.",
    ),
    services: [
      lt("Procesos, SOP y modelo operativo", "Processes, SOPs and operating model"),
      lt("Experiencia de cliente y servicio", "Customer and service experience"),
      lt("Identidad empresarial y adopción", "Business identity and adoption"),
      lt("Formación, indicadores y rituales", "Training, indicators and operating rhythms"),
    ],
    technologies: ["CRM", "ERP", "POS", "WMS", "MRP", "BPA", "BI"],
    accent: "amber",
  },
  {
    id: "consultoria",
    eyebrow: lt("Decidir con respaldo", "Decide with professional support"),
    title: lt("Consultoría", "Consulting"),
    summary: lt(
      "Convertimos obligaciones, riesgos y decisiones en acciones verificables.",
      "We turn obligations, risks and decisions into verifiable actions.",
    ),
    outcome: lt(
      "Más control, trazabilidad y criterio profesional en cada decisión sensible.",
      "More control, traceability and professional judgment for every sensitive decision.",
    ),
    services: [
      lt("Impositiva, contable y financiera", "Tax, accounting and finance"),
      lt("Legal corporativa y contractual", "Corporate legal and contracts"),
      lt("Formalización y documentación empresarial", "Formalization and business documentation"),
      lt("Preparación e integración e-CF", "e-invoicing readiness and integration"),
    ],
    technologies: ["MIS", "ERP", "e-CF", "BI", "BPA", "RPA"],
    accent: "white",
  },
  {
    id: "publicidad",
    eyebrow: lt("Publicidad 360", "360 Advertising"),
    title: lt("Publicidad", "Advertising"),
    summary: lt(
      "Hacemos que tu negocio se vea, se entienda y conecte mejor, en digital y en la calle.",
      "We help your business look clear, feel consistent and connect better, online and offline.",
    ),
    outcome: lt(
      "Una presencia clara y coherente, desde el letrero y los impresos hasta la web y las redes.",
      "A clear and consistent presence, from signs and print to websites and social media.",
    ),
    services: [
      lt("Branding e imagen corporativa", "Branding and corporate identity"),
      lt("Web, redes y community management", "Web, social and community management"),
      lt("SEO, AEO, pauta y analítica", "SEO, AEO, paid media and analytics"),
      lt("Impresos, letreros y materiales", "Print, signage and commercial materials"),
    ],
    technologies: ["CRM", "CMS", "PIM", "SaaS", "BI", "BPA"],
    accent: "green",
  },
];

export const needs: NeedRoute[] = [
  {
    id: "ordenar",
    label: lt("Quiero ordenar mi empresa", "I want to organize my company"),
    helper: lt("Procesos, operación y adopción", "Processes, operations and adoption"),
    pillar: "renovacion",
    capabilities: ["CRM", "ERP", "POS", "Inventario", "Portales"],
  },
  {
    id: "cumplir",
    label: lt("Necesito reducir riesgos y cumplir", "I need to reduce risk and comply"),
    helper: lt("Obligaciones, control y evidencia", "Obligations, control and evidence"),
    pillar: "consultoria",
    capabilities: ["e-CF", "Expedientes", "Aprobaciones", "Reportes"],
  },
  {
    id: "crecer",
    label: lt("Quiero atraer y convertir más", "I want to attract and convert more"),
    helper: lt("Marca, captación y seguimiento", "Brand, demand and follow-up"),
    pillar: "publicidad",
    capabilities: ["Web", "CRM", "SEO/AEO", "Campañas", "Analítica"],
  },
];

const item = (
  id: string,
  pillar: PillarId,
  category: string,
  title: LocalText,
  result: LocalText,
  includes: LocalText[],
  tags: string[],
  options: Partial<Pick<CatalogItem, "kind" | "secondaryPillars" | "capabilityIds" | "quoteOnly" | "commercialState" | "technicalMaturity" | "regulated" | "requiresProfessionalReview" | "selectable">> = {},
): CatalogItem => ({
  id,
  kind: options.kind ?? "service",
  pillar,
  category,
  title,
  result,
  includes,
  tags,
  secondaryPillars: options.secondaryPillars,
  capabilityIds: options.capabilityIds,
  quoteOnly: options.quoteOnly ?? true,
  commercialState: options.commercialState ?? "public",
  technicalMaturity: options.technicalMaturity ?? "proven",
  regulated: options.regulated ?? false,
  requiresProfessionalReview: options.requiresProfessionalReview ?? false,
  selectable: options.selectable ?? true,
});

export const catalogInternal: CatalogItem[] = [
  item(
    "diagnostico-rcp-360",
    "renovacion",
    "entrada",
    lt("Evaluación Inicial RCP 360°", "RCP 360° Initial Assessment"),
    lt("Una conversación de 45 minutos, sin costo y sujeta a confirmación, para entender la necesidad y definir el próximo paso.", "A free 45-minute conversation, subject to confirmation, to understand the need and define the next step."),
    [lt("Conversación inicial", "Initial conversation"), lt("Necesidad y prioridad", "Need and priority"), lt("Próximo paso recomendado", "Recommended next step")],
    ["evaluacion", "diagnostico", "estrategia", "prioridades", "assessment", "diagnosis", "strategy"],
    { kind: "entry", secondaryPillars: ["consultoria", "publicidad"] },
  ),
  item(
    "expediente-necesidad",
    "renovacion",
    "entrada",
    lt("Expediente de necesidad", "Needs dossier"),
    lt("Un problema formalizado con resultado esperado, límites, datos, riesgos y dueño de decisión.", "A formalized problem with expected outcome, boundaries, data, risks and decision owner."),
    [lt("Situación actual", "Current state"), lt("Indicadores y restricciones", "Indicators and constraints"), lt("Criterios de decisión", "Decision criteria")],
    ["expediente", "alcance", "necesidad", "scope", "requirements"],
    { kind: "entry", secondaryPillars: ["consultoria", "publicidad"] },
  ),
  item(
    "blueprint-intervencion",
    "renovacion",
    "entrada",
    lt("Blueprint de intervención", "Intervention blueprint"),
    lt("Una propuesta ejecutable con responsables, entregables, aceptación, propiedad y salida.", "An executable proposal with owners, deliverables, acceptance, ownership and exit."),
    [lt("Alcance y calendario", "Scope and schedule"), lt("Responsables y especialistas", "Owners and specialists"), lt("Soporte y continuidad", "Support and continuity")],
    ["blueprint", "sow", "propuesta", "implementation"],
    { kind: "entry", secondaryPillars: ["consultoria", "publicidad"] },
  ),

  item("procesos-operativos", "renovacion", "procesos", lt("Diagnóstico y rediseño de procesos", "Process diagnosis and redesign"), lt("Procesos actuales y futuros definidos alrededor del resultado que necesita la empresa.", "Current and future processes shaped around the business outcome."), [lt("Mapa actual y futuro", "Current and future maps"), lt("Riesgos y dependencias", "Risks and dependencies"), lt("Plan de mejora", "Improvement plan")], ["procesos", "operacion", "flujo", "workflow"], { capabilityIds: ["erp", "bpa", "bi"] }),
  item("sop-documentacion", "renovacion", "procesos", lt("SOP, manuales y normalización documental", "SOPs, manuals and document standardization"), lt("Una forma clara y repetible de ejecutar el trabajo y conservar evidencia.", "A clear, repeatable way to execute work and retain evidence."), [lt("SOP y manual operativo", "SOPs and operating manual"), lt("Formatos y controles", "Templates and controls"), lt("Gobierno de versiones", "Version governance")], ["sop", "manual", "documentacion", "quality"], { capabilityIds: ["cms", "bpa"] }),
  item("modelo-operativo-raci", "renovacion", "organizacion", lt("Modelo operativo, roles y RACI", "Operating model, roles and RACI"), lt("Responsabilidades y decisiones visibles, sin depender de una sola persona.", "Visible responsibilities and decisions without dependence on one person."), [lt("Mapa de roles", "Role map"), lt("Matriz RACI", "RACI matrix"), lt("Cadencia de gestión", "Management cadence")], ["roles", "raci", "modelo operativo", "gobierno"], { capabilityIds: ["mis", "hrms"] }),
  item("experiencia-cliente", "renovacion", "experiencia", lt("Experiencia de cliente y servicio", "Customer and service experience"), lt("Un recorrido de atención coherente desde la necesidad hasta la continuidad.", "A consistent service journey from need to continuity."), [lt("Mapa de experiencia", "Experience map"), lt("Estándares de servicio", "Service standards"), lt("Puntos de control", "Control points")], ["cx", "cliente", "servicio", "experiencia"], { secondaryPillars: ["publicidad"], capabilityIds: ["crm", "cms"] }),
  item("identidad-empresarial", "renovacion", "identidad", lt("Identidad empresarial y coherencia interna", "Business identity and internal alignment"), lt("Propuesta de valor, comportamiento y operación alineados con la marca.", "Value proposition, behavior and operations aligned with the brand."), [lt("Propuesta de valor", "Value proposition"), lt("Principios y mensajes", "Principles and messaging"), lt("Aplicación interna", "Internal adoption")], ["identidad", "propuesta de valor", "cultura", "marca"], { secondaryPillars: ["publicidad"] }),
  item("cambio-adopcion", "renovacion", "adopcion", lt("Gestión del cambio y adopción", "Change management and adoption"), lt("El equipo entiende, practica y sostiene la nueva forma de operar.", "The team understands, practices and sustains the new way of working."), [lt("Mapa de impacto", "Impact map"), lt("Plan de adopción", "Adoption plan"), lt("Seguimiento de uso", "Usage follow-up")], ["cambio", "adopcion", "equipo", "change"], { capabilityIds: ["lms", "hrms"] }),
  item("formacion-intervencion", "renovacion", "adopcion", lt("Capacitación ligada a la intervención", "Intervention-linked training"), lt("Formación práctica sobre los procesos, controles o sistemas realmente implantados.", "Practical training for the processes, controls or systems actually implemented."), [lt("Talleres por rol", "Role-based workshops"), lt("Materiales de apoyo", "Support materials"), lt("Verificación de comprensión", "Understanding checks")], ["capacitacion", "formacion", "taller", "training"], { capabilityIds: ["lms"] }),
  item("tableros-operacion", "renovacion", "control", lt("Tableros, indicadores y rituales de operación", "Dashboards, indicators and operating rhythms"), lt("Información útil para revisar el desempeño y decidir la próxima acción.", "Useful information to review performance and decide the next action."), [lt("Indicadores acordados", "Agreed indicators"), lt("Tablero de seguimiento", "Tracking dashboard"), lt("Rituales de revisión", "Review rhythms")], ["kpi", "tablero", "indicadores", "dashboard"], { capabilityIds: ["mis", "bi"] }),

  item("consultoria-impositiva", "consultoria", "impositiva", lt("Consultoría impositiva y preparación documental", "Tax consulting and document readiness"), lt("Obligaciones, evidencias y próximos pasos organizados con revisión profesional.", "Obligations, evidence and next steps organized with professional review."), [lt("Matriz de obligaciones", "Obligation matrix"), lt("Calendario y expediente", "Calendar and dossier"), lt("Revisión profesional", "Professional review")], ["impuestos", "dgii", "fiscal", "tributaria", "tax"], { regulated: true, requiresProfessionalReview: true }),
  item("iguala-contable", "consultoria", "contabilidad", lt("Iguala contable y control periódico", "Accounting retainer and recurring control"), lt("Contabilidad y seguimiento recurrente con alcance, calendario y responsable definidos.", "Recurring accounting and follow-up with defined scope, calendar and owner."), [lt("Registro y conciliación según alcance", "Records and reconciliation per scope"), lt("Cierre y reportes acordados", "Agreed closing and reports"), lt("Calendario de entregables", "Deliverable calendar")], ["iguala", "contabilidad", "mensual", "conciliacion", "accounting"], { regulated: true, requiresProfessionalReview: true }),
  item("control-financiero", "consultoria", "finanzas", lt("Presupuesto, costos, márgenes y control", "Budgeting, costs, margins and control"), lt("Decisiones financieras basadas en supuestos visibles y datos revisables.", "Financial decisions based on visible assumptions and reviewable data."), [lt("Modelo financiero", "Financial model"), lt("Estructura de costos", "Cost structure"), lt("Escenarios y controles", "Scenarios and controls")], ["presupuesto", "costos", "margen", "finanzas", "budget"], { capabilityIds: ["erp", "mis", "bi"] }),
  item("legal-corporativa", "consultoria", "legal", lt("Asuntos legales corporativos", "Corporate legal matters"), lt("Decisiones y documentos corporativos preparados con asesoría autorizada.", "Corporate decisions and documents prepared with authorized legal advice."), [lt("Gobierno y actas", "Governance and resolutions"), lt("Estructura societaria", "Corporate structure"), lt("Revisión profesional", "Professional review")], ["legal", "corporativa", "societaria", "abogado"], { commercialState: "under_review", regulated: true, requiresProfessionalReview: true, selectable: false }),
  item("formalizacion-empresarial", "consultoria", "legal", lt("Formalización y gobierno empresarial", "Business formalization and governance"), lt("Ruta organizada para constituir, registrar y gobernar la empresa según su caso.", "An organized route to form, register and govern the company for its case."), [lt("Levantamiento de requisitos", "Requirements review"), lt("Expediente de formalización", "Formalization dossier"), lt("Calendario y responsables", "Calendar and owners")], ["formalizacion", "onapi", "dgii", "registro", "company formation"], { commercialState: "under_review", regulated: true, requiresProfessionalReview: true, selectable: false }),
  item("documentacion-empresarial", "consultoria", "documentos", lt("Organización de documentación empresarial", "Business document organization"), lt("Formularios, expedientes y controles administrativos organizados sin sustituir asesoría legal, fiscal o contable.", "Administrative forms, records and controls organized without replacing legal, tax or accounting advice."), [lt("Inventario documental", "Document inventory"), lt("Plantillas administrativas", "Administrative templates"), lt("Control de versión y aprobación", "Version and approval control")], ["documentos", "formularios", "expedientes", "documents"], { capabilityIds: ["cms", "bpa"] }),
  item("contratos-politicas", "consultoria", "legal", lt("Contratos, anexos y políticas", "Contracts, annexes and policies"), lt("Documentos alineados al alcance real y revisados por el profesional responsable.", "Documents aligned to the actual scope and reviewed by the responsible professional."), [lt("Levantamiento del acuerdo", "Agreement discovery"), lt("Borrador y revisión", "Draft and review"), lt("Control de versiones", "Version control")], ["contratos", "nda", "msa", "politicas", "contracts"], { commercialState: "under_review", regulated: true, requiresProfessionalReview: true, selectable: false }),
  item("laboral-tss", "consultoria", "laboral", lt("Cumplimiento laboral y TSS", "Labor and social security compliance"), lt("Obligaciones laborales organizadas con límites y revisión profesional.", "Labor obligations organized with boundaries and professional review."), [lt("Matriz de obligaciones", "Obligation matrix"), lt("Expediente y calendario", "Dossier and calendar"), lt("Plan de corrección", "Correction plan")], ["laboral", "tss", "rrhh", "compliance"], { commercialState: "under_review", regulated: true, requiresProfessionalReview: true, selectable: false }),
  item("riesgo-cumplimiento", "consultoria", "riesgo", lt("Riesgos, controles y cumplimiento", "Risk, controls and compliance"), lt("Riesgos priorizados y controles verificables alrededor del proceso.", "Prioritized risks and verifiable controls around the process."), [lt("Matriz de riesgos", "Risk matrix"), lt("Controles y evidencias", "Controls and evidence"), lt("Plan de seguimiento", "Follow-up plan")], ["riesgo", "control", "cumplimiento", "risk"], { capabilityIds: ["mis", "bpa", "bi"] }),
  item("facturacion-electronica", "consultoria", "fiscal", lt("Guía de preparación para facturación electrónica", "Electronic invoicing readiness guide"), lt("Contenido educativo para entender requisitos y preparar el proceso; la integración de e-CF está en desarrollo y no está disponible para contratación.", "Educational guidance to understand requirements and prepare the process; e-invoicing integration is in development and unavailable for contracting."), [lt("Conceptos y requisitos", "Concepts and requirements"), lt("Preparación de datos y proceso", "Data and process readiness"), lt("Límites y próximos pasos", "Boundaries and next steps")], ["ecf", "e-cf", "facturacion", "dgii", "electronic invoicing"], { secondaryPillars: ["renovacion"], capabilityIds: ["ecf"], quoteOnly: true, commercialState: "in_development", technicalMaturity: "design", regulated: true, requiresProfessionalReview: true, selectable: false }),

  item("estrategia-marca", "publicidad", "marca", lt("Estrategia, posicionamiento y mensajes", "Strategy, positioning and messaging"), lt("Una marca que explica su valor de forma coherente a las personas correctas.", "A brand that explains its value consistently to the right people."), [lt("Posicionamiento", "Positioning"), lt("Audiencias y mensajes", "Audiences and messaging"), lt("Guía de aplicación", "Application guide")], ["estrategia", "posicionamiento", "mensajes", "brand"]),
  item("branding-identidad", "publicidad", "marca", lt("Branding, identidad visual e imagen corporativa", "Branding, visual identity and corporate image"), lt("Un sistema visual reconocible, consistente y listo para aplicarse.", "A recognizable, consistent visual system ready for use."), [lt("Dirección creativa", "Creative direction"), lt("Identidad y activos editables", "Identity and editable assets"), lt("Manual de uso", "Usage guide")], ["branding", "logo", "identidad", "imagen corporativa"], { secondaryPillars: ["renovacion"] }),
  item("sitios-web", "publicidad", "digital", lt("Sitios web y páginas de captación", "Websites and landing pages"), lt("Una experiencia web rápida, clara y conectada con el siguiente paso comercial.", "A fast, clear web experience connected to the next commercial step."), [lt("Arquitectura y contenido", "Architecture and content"), lt("Diseño y desarrollo", "Design and development"), lt("SEO técnico y medición", "Technical SEO and measurement")], ["web", "pagina", "landing", "ecommerce", "website"], { secondaryPillars: ["renovacion"], capabilityIds: ["cms", "crm"] }),
  item("redes-community", "publicidad", "digital", lt("Redes sociales y community management", "Social media and community management"), lt("Publicación, conversación y seguimiento alineados con la estrategia de marca.", "Publishing, conversation and follow-up aligned with brand strategy."), [lt("Plan editorial", "Editorial plan"), lt("Contenido y publicación", "Content and publishing"), lt("Gestión de comunidad", "Community management")], ["redes", "community manager", "instagram", "social media"]),
  item("contenido-multimedia", "publicidad", "contenido", lt("Contenido, fotografía y video", "Content, photography and video"), lt("Activos comerciales útiles para explicar, demostrar y convertir.", "Commercial assets that explain, demonstrate and convert."), [lt("Dirección y guion", "Direction and script"), lt("Producción o coordinación", "Production or coordination"), lt("Entregables por canal", "Channel-ready deliverables")], ["contenido", "fotografia", "video", "reels", "content"]),
  item("seo-aeo", "publicidad", "digital", lt("SEO y AEO", "SEO and AEO"), lt("Contenido y estructura preparados para buscadores y motores de respuesta sin garantías ficticias.", "Content and structure prepared for search and answer engines without fabricated guarantees."), [lt("Investigación e intención", "Research and intent"), lt("Contenido y datos estructurados", "Content and structured data"), lt("Medición y revisión", "Measurement and review")], ["seo", "aeo", "google", "busqueda", "answer engine"]),
  item("campanas-digitales", "publicidad", "campanas", lt("Pauta, medios y campañas digitales", "Paid media and digital campaigns"), lt("Campañas con objetivo, presupuesto separado, medición y aprendizaje.", "Campaigns with an objective, separate media budget, measurement and learning."), [lt("Plan de campaña", "Campaign plan"), lt("Configuración y creatividades", "Setup and creative"), lt("Optimización y reporte", "Optimization and reporting")], ["meta ads", "google ads", "pauta", "campanas", "paid media"], { capabilityIds: ["crm", "bi"] }),
  item("crm-marketing", "publicidad", "automatizacion", lt("Seguimiento comercial y automatización", "Commercial follow-up and automation"), lt("Esta ficha histórica no representa un CRM listo para vender; las necesidades de seguimiento se evalúan como software a la medida.", "This historical entry is not a ready-to-sell CRM; follow-up needs are assessed as custom software."), [lt("Flujo de captación", "Lead flow"), lt("Seguimiento según proceso", "Process-based follow-up"), lt("Automatizaciones controladas", "Controlled automations")], ["crm", "leads", "email", "automatizacion", "nurturing"], { secondaryPillars: ["renovacion"], capabilityIds: ["crm", "bpa"], commercialState: "historical", selectable: false }),
  item("analitica-marketing", "publicidad", "medicion", lt("Analítica, experimentación y optimización", "Analytics, experimentation and optimization"), lt("Decisiones de marketing basadas en eventos útiles y datos sin PII innecesaria.", "Marketing decisions based on useful events without unnecessary PII."), [lt("Plan de medición", "Measurement plan"), lt("Tablero y eventos", "Dashboard and events"), lt("Ciclo de aprendizaje", "Learning cycle")], ["analitica", "conversion", "kpi", "analytics"], { capabilityIds: ["bi"] }),

  item("papeleria-corporativa", "publicidad", "impresos", lt("Papelería e impresos corporativos", "Corporate stationery and print"), lt("Materiales consistentes con la identidad, cotizados por especificación y cantidad.", "Materials consistent with the identity, quoted by specification and quantity."), [lt("Tarjetas, hojas y sobres", "Cards, letterhead and envelopes"), lt("Carpetas y formularios", "Folders and forms"), lt("Artes y producción coordinada", "Artwork and coordinated production")], ["tarjetas", "hojas timbradas", "sobres", "carpetas", "formularios", "print"], { kind: "physical" }),
  item("promocionales-impresos", "publicidad", "impresos", lt("Volantes, brochures y catálogos", "Flyers, brochures and catalogs"), lt("Piezas promocionales diseñadas y producidas para una necesidad comercial concreta.", "Promotional pieces designed and produced for a specific commercial need."), [lt("Diseño y preprensa", "Design and prepress"), lt("Selección de material", "Material selection"), lt("Producción y control", "Production and control")], ["flyer", "volante", "brochure", "catalogo", "impresos"], { kind: "physical" }),
  item("etiquetas-empaques", "publicidad", "impresos", lt("Etiquetas y empaques personalizados", "Custom labels and packaging"), lt("Presentación de producto coherente con marca, uso, material y producción.", "Product presentation aligned with brand, use, material and production."), [lt("Etiquetas y stickers", "Labels and stickers"), lt("Empaques y cajas", "Packaging and boxes"), lt("Prueba y producción", "Proof and production")], ["etiquetas", "stickers", "empaque", "packaging"], { kind: "physical", capabilityIds: ["pim"] }),
  item("gran-formato", "publicidad", "exterior", lt("Banners, roll-ups y gran formato", "Banners, roll-ups and large format"), lt("Visibilidad física dimensionada para el lugar, duración y objetivo de comunicación.", "Physical visibility sized for location, duration and communication objective."), [lt("Banners y roll-ups", "Banners and roll-ups"), lt("Bajantes y vallas", "Drop banners and billboards"), lt("Instalación coordinada", "Coordinated installation")], ["banner", "rollup", "valla", "gran formato", "exterior"], { kind: "physical" }),
  item("letreros-rotulacion", "publicidad", "exterior", lt("Letreros, fachadas y rotulación", "Signs, facades and branding"), lt("Una presencia física reconocible, fabricada e instalada bajo especificación aprobada.", "A recognizable physical presence fabricated and installed under an approved specification."), [lt("Letrero acrílico o luminoso", "Acrylic or illuminated sign"), lt("Vinil y fachada", "Vinyl and facade"), lt("Rotulación de vehículos o flota", "Vehicle or fleet branding")], ["letrero", "luminoso", "acrilico", "rotulacion", "fachada", "vehiculo", "signage"], { kind: "physical" }),
  item("uniformes-textiles", "publicidad", "merchandising", lt("Uniformes y textiles personalizados", "Custom uniforms and textiles"), lt("Vestimenta de marca coordinada por pieza, técnica, talla y cantidad.", "Branded apparel coordinated by item, technique, size and quantity."), [lt("Polos y camisas", "Polos and shirts"), lt("Gorras y delantales", "Caps and aprons"), lt("Bordado, vinil o sublimación", "Embroidery, vinyl or sublimation")], ["uniforme", "polo", "camisa", "gorra", "delantal", "bordado"], { kind: "physical" }),
  item("merchandising-corporativo", "publicidad", "merchandising", lt("Merchandising y artículos corporativos", "Merchandise and corporate items"), lt("Artículos seleccionados según audiencia, uso, presupuesto y consistencia de marca.", "Items selected by audience, use, budget and brand consistency."), [lt("Tazas, termos y bolígrafos", "Mugs, tumblers and pens"), lt("Agendas, lanyards y bolsas", "Planners, lanyards and bags"), lt("Kits de bienvenida y regalos", "Welcome kits and gifts")], ["merchandising", "taza", "termo", "boligrafo", "agenda", "lanyard", "kit"], { kind: "physical" }),
];

const publicCommercialStates = new Set(["public", "contextual"]);

export const catalog = catalogInternal.filter((entry) => publicCommercialStates.has(entry.commercialState));
export const selectableCatalog = catalog.filter((entry) => entry.selectable);

const capability = (
  id: string,
  acronym: string,
  name: LocalText,
  problem: LocalText,
  result: LocalText,
  pillarsList: PillarId[],
  technicalMaturity: Capability["technicalMaturity"],
  models: string[],
  searchTerms: string[],
  options: Partial<Pick<Capability, "commercialState" | "regulated" | "requiresProfessionalReview" | "selectable">> = {},
): Capability => ({
  id,
  acronym,
  name,
  problem,
  result,
  pillars: pillarsList,
  commercialState: options.commercialState ?? "contextual",
  technicalMaturity,
  regulated: options.regulated ?? false,
  requiresProfessionalReview: options.requiresProfessionalReview ?? false,
  selectable: options.selectable ?? true,
  models,
  searchTerms,
});

export const capabilities: Capability[] = [
  capability("mis", "MIS", lt("Sistema de Información Gerencial", "Management Information System"), lt("La dirección recibe datos tardíos o fragmentados.", "Management receives late or fragmented data."), lt("Información ejecutiva organizada alrededor de decisiones y responsables.", "Executive information organized around decisions and owners."), ["renovacion", "consultoria"], "pattern", ["shared", "dedicated", "client"], ["gestion", "operaciones", "direccion", "management"]),
  capability("erp", "ERP", lt("Planificación de Recursos Empresariales", "Enterprise Resource Planning"), lt("Ventas, compras, inventario y finanzas no comparten una fuente confiable.", "Sales, purchases, inventory and finance lack a reliable shared source."), lt("Procesos centrales conectados con permisos, trazabilidad y reportes.", "Core processes connected with permissions, traceability and reports."), ["renovacion", "consultoria"], "accelerator", ["dedicated", "client", "hybrid", "transfer"], ["erp", "inventario", "finanzas", "compras"]),
  capability("eam", "EAM", lt("Gestión de Activos Empresariales", "Enterprise Asset Management"), lt("Equipos y activos se mantienen de forma reactiva y sin historial.", "Equipment and assets are maintained reactively without history."), lt("Ciclo de vida, mantenimiento, costos y evidencia por activo.", "Lifecycle, maintenance, costs and evidence by asset."), ["renovacion", "consultoria"], "design", ["dedicated", "client", "hybrid"], ["activos", "mantenimiento", "equipos", "assets"]),
  capability("pos", "POS", lt("Punto de Venta", "Point of Sale"), lt("Caja, ventas, inventario y cierres no coinciden.", "Cash, sales, inventory and closings do not reconcile."), lt("Venta y control operativo adaptados al flujo real del comercio.", "Sales and operating control adapted to the retailer's actual flow."), ["renovacion", "consultoria"], "accelerator", ["dedicated", "client", "managed", "transfer"], ["pos", "caja", "ventas", "tienda"]),
  capability("crm", "CRM", lt("Gestión de Relaciones con Clientes", "Customer Relationship Management"), lt("Los contactos se pierden entre chats y nadie conoce la próxima acción.", "Contacts are lost across chats and no one knows the next action."), lt("Una herramienta a la medida puede organizar contactos, oportunidades, responsables y seguimiento alrededor del proceso real.", "A custom tool can organize contacts, opportunities, owners and follow-up around the actual process."), ["renovacion", "publicidad"], "proven", ["dedicated", "client", "hybrid", "transfer"], ["crm", "clientes", "ventas", "leads", "seguimiento"]),
  capability("cms", "CMS", lt("Gestión de Contenido", "Content Management System"), lt("Actualizar contenido depende de cambios técnicos o copias dispersas.", "Content updates depend on technical changes or scattered copies."), lt("Contenido gobernado, versionado y publicable según rol.", "Governed, versioned content publishable by role."), ["publicidad", "renovacion"], "pattern", ["shared", "dedicated", "client"], ["cms", "contenido", "web", "blog"]),
  capability("pim", "PIM", lt("Gestión de Información de Producto", "Product Information Management"), lt("Descripciones, imágenes y especificaciones cambian entre canales.", "Descriptions, images and specifications differ across channels."), lt("Información de producto consistente y preparada para cada canal.", "Consistent product information prepared for each channel."), ["publicidad", "renovacion"], "pattern", ["dedicated", "client", "hybrid"], ["pim", "producto", "catalogo", "sku"]),
  capability("wms", "WMS", lt("Gestión de Almacenes", "Warehouse Management System"), lt("Ubicación, conteo y movimiento de inventario no son confiables.", "Inventory location, counts and movements are unreliable."), lt("Recepción, ubicación, picking y despacho trazables.", "Traceable receiving, location, picking and dispatch."), ["renovacion", "consultoria"], "pattern", ["dedicated", "client", "hybrid"], ["wms", "almacen", "inventario", "warehouse"]),
  capability("scm", "SCM", lt("Gestión de Cadena de Suministro", "Supply Chain Management"), lt("Compras, proveedores y demanda se coordinan tarde.", "Purchasing, suppliers and demand are coordinated too late."), lt("Planificación y visibilidad entre abastecimiento, operación y entrega.", "Planning and visibility across sourcing, operations and delivery."), ["renovacion", "consultoria"], "design", ["client", "hybrid"], ["scm", "suministro", "proveedores", "compras"]),
  capability("mrp", "MRP", lt("Planificación de Requerimientos de Materiales", "Material Requirements Planning"), lt("Producción se detiene por materiales faltantes o compras tardías.", "Production stops due to missing materials or late purchasing."), lt("Necesidades de materiales vinculadas con órdenes, existencias y fechas.", "Material needs connected to orders, stock and dates."), ["renovacion", "consultoria"], "accelerator", ["dedicated", "client", "hybrid"], ["mrp", "materiales", "produccion", "manufacturing"]),
  capability("hrms", "HRMS / HCM", lt("Gestión de Recursos y Capital Humano", "Human Resources and Human Capital Management"), lt("Datos, roles, documentos y ciclos del personal están dispersos.", "People data, roles, documents and cycles are scattered."), lt("Expediente, roles, procesos y desarrollo organizados por acceso.", "Records, roles, processes and development organized by access."), ["renovacion", "consultoria"], "design", ["dedicated", "client"], ["hrms", "hcm", "rrhh", "personal", "recursos humanos"]),
  capability("lms", "LMS", lt("Gestión del Aprendizaje", "Learning Management System"), lt("La capacitación no deja evidencia de avance o comprensión.", "Training leaves no evidence of progress or understanding."), lt("Formación por rol con contenidos, avance y validación.", "Role-based training with content, progress and validation."), ["renovacion"], "design", ["shared", "dedicated", "client"], ["lms", "capacitacion", "aprendizaje", "training"]),
  capability("bpa", "BPA", lt("Automatización de Procesos de Negocio", "Business Process Automation"), lt("Aprobaciones y tareas repetitivas dependen de recordatorios manuales.", "Approvals and repetitive tasks depend on manual reminders."), lt("Flujos controlados con responsables, reglas y evidencia.", "Controlled workflows with owners, rules and evidence."), ["renovacion", "consultoria", "publicidad"], "pattern", ["shared", "dedicated", "client", "hybrid"], ["bpa", "automatizacion", "flujo", "workflow"]),
  capability("rpa", "RPA", lt("Automatización Robótica de Procesos", "Robotic Process Automation"), lt("Sistemas sin integración obligan a copiar datos de forma repetitiva.", "Systems without integrations require repetitive data copying."), lt("Automatización acotada de tareas estables, monitoreadas y reversibles.", "Bounded automation of stable, monitored and reversible tasks."), ["renovacion", "consultoria"], "pattern", ["dedicated", "client", "hybrid"], ["rpa", "robot", "automatizacion", "datos"]),
  capability("bi", "BI", lt("Inteligencia de Negocios", "Business Intelligence"), lt("Hay datos, pero no una lectura común del desempeño.", "There is data, but no shared view of performance."), lt("Indicadores, definiciones y visualizaciones conectadas con decisiones.", "Indicators, definitions and visualizations connected to decisions."), ["renovacion", "consultoria", "publicidad"], "accelerator", ["shared", "dedicated", "client", "hybrid"], ["bi", "analitica", "dashboard", "kpi", "reportes"]),
  capability("ecf", "e-CF", lt("Facturación electrónica", "Electronic invoicing"), lt("El proceso fiscal y los sistemas deben prepararse antes de una integración autorizada.", "Fiscal processes and systems must be prepared before an authorized integration."), lt("RCP publica orientación educativa; la integración está en desarrollo y no está disponible para contratación.", "RCP publishes educational guidance; integration is in development and unavailable for contracting."), ["consultoria", "renovacion"], "design", ["hybrid", "client"], ["ecf", "e-cf", "facturacion electronica", "dgii"], { commercialState: "in_development", regulated: true, requiresProfessionalReview: true, selectable: false }),
];

export const publicCapabilities = capabilities.filter((entry) => publicCommercialStates.has(entry.commercialState));
export const selectableCapabilities = publicCapabilities.filter((entry) => entry.selectable);
export const glossaryCapabilities = capabilities.filter((entry) => ["public", "contextual", "in_development"].includes(entry.commercialState));

export const technologySolutions: TechnologySolution[] = [
  {
    id: "organiza-operacion",
    title: lt("Organiza tu operación y tus clientes", "Organize your operations and customers"),
    description: lt("Conecta ventas, tareas, responsables y datos para que el negocio no dependa de memoria, chats o papeles sueltos.", "Connect sales, tasks, owners and data so the business does not depend on memory, chats or loose papers."),
    outcome: lt("Más orden, seguimiento y control diario.", "More order, follow-up and daily control."),
    capabilityIds: ["mis", "erp", "crm", "cms", "hrms"],
    pillarIds: ["renovacion", "consultoria"],
    href: lt("/software-a-la-medida?solucion=organiza-operacion", "/en/custom-software?solution=organize-operations"),
  },
  {
    id: "ventas-inventario",
    title: lt("Vende y controla tu inventario", "Sell and control your inventory"),
    description: lt("Adapta caja, ventas, existencias, almacén y producción a la forma real en que trabaja tu negocio.", "Adapt checkout, sales, stock, warehouse and production to how your business actually works."),
    outcome: lt("Ventas y existencias que cuadran mejor.", "Sales and stock that reconcile more reliably."),
    capabilityIds: ["pos", "pim", "wms", "scm", "mrp"],
    pillarIds: ["renovacion", "consultoria"],
    href: lt("/software-a-la-medida?solucion=ventas-inventario", "/en/custom-software?solution=sales-inventory"),
  },
  {
    id: "web-catalogo-tienda",
    title: lt("Crea tu página, catálogo o tienda", "Create your website, catalog or store"),
    description: lt("Presenta tu negocio con claridad y conecta cada visita con una consulta, pedido o próximo paso medible.", "Present your business clearly and connect each visit with an inquiry, order or measurable next step."),
    outcome: lt("Una presencia digital útil, rápida y fácil de mantener.", "A useful, fast and maintainable digital presence."),
    capabilityIds: ["cms", "pim", "crm"],
    pillarIds: ["publicidad", "renovacion"],
    href: lt("/catalogo?servicio=sitios-web", "/en/catalog?service=sitios-web"),
  },
  {
    id: "software-medida",
    title: lt("Construye la herramienta que tu proceso necesita", "Build the tool your process needs"),
    description: lt("Creamos software a la medida cuando una aplicación genérica no encaja con la operación, los permisos o la propiedad que necesitas.", "We build custom software when a generic app does not fit the operations, permissions or ownership you need."),
    outcome: lt("Software alineado al proceso, no el proceso forzado al software.", "Software aligned to the process, not a process forced into software."),
    capabilityIds: ["erp", "crm", "pos", "eam", "wms", "scm", "mrp", "hrms", "lms"],
    pillarIds: ["renovacion", "consultoria", "publicidad"],
    href: lt("/software-a-la-medida", "/en/custom-software"),
  },
  {
    id: "automatizacion-datos",
    title: lt("Reduce tareas repetitivas y entiende tus números", "Reduce repetitive work and understand your numbers"),
    description: lt("Automatiza pasos estables y convierte datos dispersos en indicadores que ayudan a decidir.", "Automate stable steps and turn scattered data into indicators that support decisions."),
    outcome: lt("Menos trabajo manual y decisiones con mejor información.", "Less manual work and better-informed decisions."),
    capabilityIds: ["bpa", "rpa", "bi", "mis"],
    pillarIds: ["renovacion", "consultoria", "publicidad"],
    href: lt("/software-a-la-medida?solucion=automatizacion-datos", "/en/custom-software?solution=automation-data"),
  },
  {
    id: "operacion-administrada",
    title: lt("Mantén tu solución funcionando", "Keep your solution running"),
    description: lt("Acordamos alojamiento, mantenimiento, soporte, respaldo y salida según la realidad y la propiedad de cada proyecto.", "We define hosting, maintenance, support, backup and exit according to each project's reality and ownership."),
    outcome: lt("Continuidad clara, sin quedar atrapado en una plataforma.", "Clear continuity without being locked into a platform."),
    capabilityIds: ["mis", "erp", "pos", "cms", "bpa", "bi"],
    pillarIds: ["renovacion", "consultoria", "publicidad"],
    href: lt("/software-a-la-medida?solucion=operacion-administrada", "/en/custom-software?solution=managed-operations"),
  },
];

export const capabilityFamilies: CapabilityFamily[] = [
  { id: "operaciones", title: lt("Gestión general y operaciones", "Management and operations"), description: lt("Dirección, recursos y activos bajo control.", "Management, resources and assets under control."), capabilityIds: ["mis", "erp", "eam"] },
  { id: "ventas", title: lt("Ventas, clientes y marketing", "Sales, customers and marketing"), description: lt("La relación comercial y la información de oferta conectadas.", "Commercial relationships and offer information connected."), capabilityIds: ["pos", "crm", "cms", "pim"] },
  { id: "logistica", title: lt("Logística, inventario y producción", "Logistics, inventory and production"), description: lt("Materiales, existencias y entregas con trazabilidad.", "Materials, stock and delivery with traceability."), capabilityIds: ["wms", "scm", "mrp"] },
  { id: "personas", title: lt("Recursos humanos y capacitación", "People and training"), description: lt("Roles, expedientes y aprendizaje alrededor del trabajo.", "Roles, records and learning around work."), capabilityIds: ["hrms", "lms"] },
  { id: "automatizacion", title: lt("Automatización, datos y análisis", "Automation, data and analytics"), description: lt("Flujos repetibles, decisiones visibles y automatización controlada.", "Repeatable flows, visible decisions and controlled automation."), capabilityIds: ["bpa", "rpa", "bi"] },
];

export const methodSteps: MethodStep[] = [
  { id: "escuchar", number: "01", title: lt("Escuchar", "Listen"), action: lt("Nos cuentas qué está pasando, qué te preocupa y qué quieres lograr.", "You tell us what is happening, what concerns you and what you want to achieve."), outcome: lt("Una necesidad clara y una persona que puede decidir.", "A clear need and a person who can make decisions.") },
  { id: "diagnosticar", number: "02", title: lt("Diagnosticar", "Diagnose"), action: lt("Revisamos dónde se pierde tiempo, dinero, control o clientes.", "We review where time, money, control or customers are being lost."), outcome: lt("Hallazgos y prioridades puestos en orden.", "Findings and priorities put in order.") },
  { id: "disenar", number: "03", title: lt("Diseñar", "Design"), action: lt("Armamos una solución realista para tu negocio, con pasos y alcance claros.", "We shape a realistic solution for your business, with clear steps and scope."), outcome: lt("Plan de trabajo, responsables y criterios de aprobación.", "A work plan, owners and approval criteria.") },
  { id: "asignar", number: "04", title: lt("Asignar", "Assign"), action: lt("Conectamos el proyecto con los especialistas que hacen falta y te explicamos quién hará qué.", "We connect the project with the specialists it needs and explain who will do what."), outcome: lt("Equipo asignado, funciones y accesos definidos.", "An assigned team with clear roles and access.") },
  { id: "ejecutar", number: "05", title: lt("Ejecutar", "Execute"), action: lt("Ponemos el plan en marcha y te mantenemos al tanto de cada avance.", "We put the plan into action and keep you informed of every step."), outcome: lt("Entregas, avances y cambios registrados.", "Recorded deliveries, progress and changes.") },
  { id: "verificar", number: "06", title: lt("Verificar", "Verify"), action: lt("Revisamos contigo que lo acordado funcione y esté bien hecho.", "We review with you that the agreed work functions and is done properly."), outcome: lt("Pruebas, correcciones y aprobación.", "Tests, corrections and approval.") },
  { id: "evolucionar", number: "07", title: lt("Evolucionar", "Evolve"), action: lt("Te acompañamos a mejorar, dar soporte o dejar la solución en tus manos.", "We help you improve, support or transfer the solution into your hands."), outcome: lt("Próximos pasos, soporte y salida clara.", "Clear next steps, support and exit.") },
];

const pillarMap = Object.fromEntries(pillars.map((pillar) => [pillar.id, pillar])) as Record<PillarId, Pillar>;

export const searchRecords: SearchRecord[] = [
  ...pillars.map((pillar) => ({
    id: `pillar-${pillar.id}`,
    type: "pillar" as const,
    title: pillar.title,
    description: pillar.summary,
    href: lt(`/servicios/${pillar.id}`, `/en/services/${pillar.id === "renovacion" ? "renewal" : pillar.id === "consultoria" ? "consulting" : "advertising"}`),
    keywords: [pillar.id, ...pillar.technologies],
  })),
  ...catalog.map((catalogItem) => ({
    id: `service-${catalogItem.id}`,
    type: "service" as const,
    title: catalogItem.title,
    description: catalogItem.result,
    href: lt(`/catalogo?servicio=${catalogItem.id}`, `/en/catalog?service=${catalogItem.id}`),
    keywords: [catalogItem.category, catalogItem.pillar, ...catalogItem.tags, ...catalogItem.includes.flatMap((entry) => [entry.es, entry.en])],
  })),
  ...technologySolutions.map((solution) => ({
    id: `solution-${solution.id}`,
    type: "solution" as const,
    title: solution.title,
    description: solution.description,
    href: solution.href,
    keywords: [solution.id, ...solution.capabilityIds],
  })),
  ...publicCapabilities.map((entry) => ({
    id: `capability-${entry.id}`,
    type: "capability" as const,
    title: lt(`${entry.acronym} · ${entry.name.es}`, `${entry.acronym} · ${entry.name.en}`),
    description: entry.result,
    href: lt(`/soluciones-tecnologicas?capacidad=${entry.id}`, `/en/technology-solutions?capability=${entry.id}`),
    keywords: [entry.acronym, ...entry.searchTerms, ...entry.pillars.map((pillar) => pillarMap[pillar].title.es)],
  })),
  {
    id: "route-method",
    type: "route",
    title: lt("Cómo trabajamos", "How we work"),
    description: lt("La ruta RCP desde escuchar la necesidad hasta comprobar y dar continuidad.", "The RCP route from understanding the need to verification and continuity."),
    href: lt("/como-trabajamos", "/en/how-we-work"),
    keywords: ["metodo", "proceso", "ruta", "method", "process", "delivery"],
  },
  {
    id: "route-custom-software",
    type: "route",
    title: lt("Software a la medida", "Custom software"),
    description: lt("CRM, ERP, POS, inventario, portales y automatización alrededor del proceso real.", "CRM, ERP, POS, inventory, portals and automation built around the real process."),
    href: lt("/software-a-la-medida", "/en/custom-software"),
    keywords: ["software", "desarrollo", "aplicacion", "saas", "custom", "development"],
  },
  {
    id: "route-electronic-invoicing",
    type: "route",
    title: lt("Facturación electrónica e-CF", "Electronic invoicing"),
    description: lt("Preparación fiscal, documental y técnica para evaluar una solución de facturación electrónica.", "Tax, document and technical readiness for assessing an electronic invoicing solution."),
    href: lt("/facturacion-electronica", "/en/electronic-invoicing"),
    keywords: ["ecf", "dgii", "facturacion", "comprobantes", "electronic invoicing"],
  },
  {
    id: "route-sectors",
    type: "route",
    title: lt("Soluciones por sector", "Solutions by sector"),
    description: lt("Rutas comunes para comercios, servicios, imprentas y otros pequeños negocios.", "Common routes for retail, services, print shops and other small businesses."),
    href: lt("/sectores", "/en/sectors"),
    keywords: ["sectores", "industrias", "comercio", "servicios", "sectors", "industries"],
  },
  {
    id: "route-contact",
    type: "route",
    title: lt("Contacto", "Contact"),
    description: lt("Canales para explicar tu necesidad y confirmar el próximo paso con RCP Services.", "Channels to explain your need and confirm the next step with RCP Services."),
    href: lt("/contacto", "/en/contact"),
    keywords: ["contacto", "whatsapp", "correo", "contact", "email"],
  },
  {
    id: "route-resources",
    type: "route",
    title: lt("Recursos para dueños de negocio", "Resources for business owners"),
    description: lt("Servicios, método, tecnología y contenido explicados con lenguaje claro.", "Services, method, technology and content explained in plain language."),
    href: lt("/recursos", "/en/resources"),
    keywords: ["recursos", "guias", "videos", "resources", "guides"],
  },
  {
    id: "resource-services",
    type: "resource",
    title: lt("Directorio de servicios", "Services directory"),
    description: lt("Renovación, Consultoría y Publicidad organizadas por resultado.", "Renewal, Consulting and Advertising organized by outcome."),
    href: lt("/servicios", "/en/services"),
    keywords: ["servicios", "soluciones", "pilares", "services", "solutions", "pillars"],
  },
  {
    id: "resource-diagnosis",
    type: "resource",
    title: lt("Solicitar Evaluación Inicial RCP 360°", "Request an RCP 360° Initial Assessment"),
    description: lt("Una conversación de 45 minutos, sin costo y sujeta a confirmación, para entender la necesidad y definir el siguiente paso.", "A free 45-minute conversation, subject to confirmation, to understand the need and define the next step."),
    href: lt("/diagnostico", "/en/diagnosis"),
    keywords: ["diagnostico", "contacto", "cotizacion", "ayuda", "diagnosis", "contact", "quote"],
  },
  {
    id: "resource-about",
    type: "resource",
    title: lt("Nosotros", "About RCP Services"),
    description: lt("Modelo de intervención, límites y arquitectura 3P+T.", "Intervention model, boundaries and 3P+T architecture."),
    href: lt("/nosotros", "/en/about"),
    keywords: ["nosotros", "empresa", "modelo", "about", "company", "model"],
  },
  {
    id: "resource-media",
    type: "resource",
    title: lt("Biblioteca multimedia", "Media library"),
    description: lt("Videos y conversaciones de contexto empresarial.", "Videos and conversations with business context."),
    href: lt("/media", "/en/media"),
    keywords: ["videos", "podcast", "recursos", "media", "library"],
  },
  {
    id: "resource-specialists",
    type: "resource",
    title: lt("Red de Especialistas RCP", "RCP Specialist Network"),
    description: lt("Categorías, estándares y proceso de revisión de especialistas.", "Specialist categories, standards and review process."),
    href: lt("/especialistas", "/en/specialists"),
    keywords: ["especialistas", "carreras", "colaboradores", "specialists", "careers", "network"],
  },
];

export const technicalMaturityLabels: Record<Capability["technicalMaturity"], LocalText> = {
  proven: lt("Base comprobada", "Proven foundation"),
  accelerator: lt("Acelerador comprobable", "Verified accelerator"),
  pattern: lt("Patrón reutilizable", "Reusable pattern"),
  design: lt("Capacidad por diseñar", "Capability to be designed"),
};

export const commercialStateLabels: Record<Capability["commercialState"], LocalText> = {
  public: lt("Disponible para evaluar", "Available for assessment"),
  contextual: lt("Se diseña según la necesidad", "Designed for the need"),
  under_review: lt("Bajo revisión", "Under review"),
  in_development: lt("En desarrollo", "In development"),
  historical: lt("Histórico", "Historical"),
};

export const distributionModelLabels: Record<string, LocalText> = {
  shared: lt("Plataforma compartida RCP", "Shared RCP platform"),
  dedicated: lt("Instancia dedicada administrada", "Managed dedicated instance"),
  managed: lt("Servicio administrado", "Managed service"),
  client: lt("Infraestructura del cliente", "Client infrastructure"),
  hybrid: lt("Integración híbrida", "Hybrid integration"),
  transfer: lt("Construcción con transferencia", "Build with transfer"),
};
