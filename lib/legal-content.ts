import type { Locale } from "@/lib/types";

type LegalLink = { label: string; href: string };
type LegalCode = { code: string };

export type LegalInline = string | LegalLink | LegalCode;

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: LegalInline[][];
};

export type LegalDocumentContent = {
  locale: Locale;
  badge: string;
  title: string;
  accent: string;
  summary: string;
  contentsLabel: string;
  languageLabel: string;
  alternate: { href: string; hrefLang: string; label: string };
  endLabel: string;
  sections: LegalSection[];
};

const link = (label: string, href: string): LegalLink => ({ label, href });
const code = (value: string): LegalCode => ({ code: value });

export const legalDocuments = {
  privacy: {
    es: {
      locale: "es",
      badge: "Vigente desde el 11 de agosto de 2026",
      title: "Política de",
      accent: "privacidad",
      summary: "Cómo RCP Services trata los datos personales recibidos a través de su sitio web y sus canales de atención.",
      contentsLabel: "En esta política",
      languageLabel: "Idioma del documento",
      alternate: { href: "/en/privacy", hrefLang: "en", label: "Read in English" },
      endLabel: "Política de privacidad · RCP Services SRL",
      sections: [
        {
          id: "responsable-y-alcance",
          title: "Responsable y alcance",
          paragraphs: [[
            "RCP Services SRL, RNC 132-147103, con domicilio en Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, República Dominicana, es responsable del tratamiento descrito en esta política. Puedes contactarnos en ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
        {
          id: "datos-y-finalidades",
          title: "Datos y finalidades",
          paragraphs: [[
            "Podemos recibir nombre, datos de contacto, empresa, sector, necesidad comercial, resultado esperado, canal preferido, servicios seleccionados, decisiones de consentimiento y datos técnicos básicos. Los usamos para responder solicitudes, calificar necesidades, preparar cotizaciones, prestar servicios contratados, proteger el sitio y, solo con consentimiento, medir su uso. No vendemos datos personales.",
          ]],
        },
        {
          id: "canales-y-proveedores",
          title: "Canales y proveedores",
          paragraphs: [[
            "Las cotizaciones se continúan por WhatsApp o correo. El correo ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " es gestionado mediante Zoho Mail. El sitio se entrega mediante Vercel y utiliza Supabase para funciones autorizadas de datos; las solicitudes pueden enviarse del lado del servidor a RCP CRM. Cuando se configura, Resend puede utilizarse del lado del servidor para notificaciones transaccionales y Cloudflare Turnstile para protección antiabuso. PostHog, Sentry u otras herramientas de medición o errores solo se utilizan si están configuradas, con consentimiento cuando corresponda, minimización y redacción de datos. Estos proveedores pueden tratar datos fuera de la República Dominicana conforme a sus propios términos y medidas de seguridad.",
          ]],
        },
        {
          id: "conservacion-y-seguridad",
          title: "Conservación y seguridad",
          paragraphs: [[
            "Las consultas y cotizaciones no contratadas se conservan hasta 24 meses desde la última interacción, salvo que exista una razón legítima para conservarlas por más tiempo. Los documentos contractuales, contables o fiscales se conservan durante el plazo aplicable. Aplicamos controles de acceso, mínimo privilegio y medidas técnicas razonables; ningún sistema es completamente infalible.",
          ]],
        },
        {
          id: "derechos-y-contacto",
          title: "Derechos y contacto",
          paragraphs: [[
            "Puedes solicitar acceso, corrección, actualización, eliminación u oposición escribiendo a ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " con el asunto “Datos personales”. Podemos pedir información razonable para verificar tu identidad y responderemos conforme a la normativa aplicable.",
          ]],
        },
        {
          id: "menores-y-cambios",
          title: "Menores y cambios",
          paragraphs: [[
            "El sitio está dirigido a empresas y personas adultas. No buscamos recopilar datos de menores de edad. Esta política se rige por la legislación aplicable de la República Dominicana, incluyendo la Ley 172-13 como marco de referencia, y puede actualizarse; la fecha visible identifica la versión vigente.",
          ]],
        },
      ],
    },
    en: {
      locale: "en",
      badge: "Effective August 11, 2026",
      title: "Privacy",
      accent: "policy",
      summary: "How RCP Services handles personal data received through its website and service channels.",
      contentsLabel: "In this policy",
      languageLabel: "Document language",
      alternate: { href: "/privacidad", hrefLang: "es-DO", label: "Leer en español" },
      endLabel: "Privacy policy · RCP Services SRL",
      sections: [
        {
          id: "controller-and-scope",
          title: "Controller and scope",
          paragraphs: [[
            "RCP Services SRL, Dominican Tax ID (RNC) 132-147103, with an address at Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, Dominican Republic, is responsible for the processing described in this policy. You may contact us at ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
        {
          id: "data-and-purposes",
          title: "Data and purposes",
          paragraphs: [[
            "We may receive your name, contact details, company, industry, business need, expected outcome, preferred channel, selected services, consent choices and basic technical data. We use this information to respond to requests, qualify needs, prepare quotations, deliver contracted services, protect the website and, only with consent, measure its use. We do not sell personal data.",
          ]],
        },
        {
          id: "channels-and-providers",
          title: "Channels and providers",
          paragraphs: [[
            "Quotations continue through WhatsApp or email. The ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " mailbox is managed through Zoho Mail. The website is delivered through Vercel and uses Supabase for authorized data functions; requests may be sent server-side to RCP CRM. When configured, Resend may be used server-side for transactional notifications and Cloudflare Turnstile for anti-abuse protection. PostHog, Sentry or other analytics or error tools are used only when configured, with consent where required, data minimization and redaction. These providers may process data outside the Dominican Republic under their own terms and security measures.",
          ]],
        },
        {
          id: "retention-and-security",
          title: "Retention and security",
          paragraphs: [[
            "Uncontracted inquiries and quotations are retained for up to 24 months after the last interaction, unless a legitimate reason requires longer retention. Contractual, accounting or tax documents are retained for the applicable period. We apply access controls, least privilege and reasonable technical measures; no system is completely infallible.",
          ]],
        },
        {
          id: "rights-and-contact",
          title: "Rights and contact",
          paragraphs: [[
            "You may request access, correction, updating, deletion or objection by writing to ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " with the subject line “Personal data.” We may request reasonable information to verify your identity and will respond under applicable law.",
          ]],
        },
        {
          id: "minors-and-changes",
          title: "Minors and changes",
          paragraphs: [[
            "The website is intended for businesses and adults. We do not seek to collect data from minors. This policy is governed by the applicable laws of the Dominican Republic, including Law 172-13 as a reference framework, and may be updated; the displayed date identifies the current version.",
          ]],
        },
      ],
    },
  },
  terms: {
    es: {
      locale: "es",
      badge: "Vigentes desde el 11 de agosto de 2026",
      title: "Términos de",
      accent: "uso",
      summary: "Condiciones aplicables al uso de rcp.services y a las solicitudes comerciales dirigidas a RCP Services.",
      contentsLabel: "En estos términos",
      languageLabel: "Idioma del documento",
      alternate: { href: "/en/terms", hrefLang: "en", label: "Read in English" },
      endLabel: "Términos de uso · RCP Services SRL",
      sections: [
        {
          id: "identidad-y-uso",
          title: "Identidad y uso del sitio",
          paragraphs: [[
            "RCP Services SRL, RNC 132-147103, tiene domicilio en Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, República Dominicana. El sitio ofrece información general sobre servicios empresariales. Debes usarlo de forma lícita, sin afectar su seguridad, disponibilidad ni derechos de terceros.",
          ]],
        },
        {
          id: "cotizaciones-y-contratacion",
          title: "Cotizaciones y contratación",
          paragraphs: [[
            "Las cotizaciones se solicitan por WhatsApp o por ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ", administrado mediante Zoho Mail. Cualquier precio o rango comunicado puede depender del alcance, cantidades, impuestos, disponibilidad y condiciones técnicas. Una selección en el sitio no constituye compra, reserva ni contrato. La contratación existe únicamente cuando las partes aceptan por escrito una propuesta u orden con alcance, precio y condiciones finales.",
          ]],
        },
        {
          id: "pagos-y-cancelaciones",
          title: "Pagos y cancelaciones",
          paragraphs: [[
            "Este sitio no procesa pagos en línea. RCP Services no solicitará datos completos de tarjeta mediante formularios de rcp.services, correo o WhatsApp. Los métodos de pago se comunicarán en una propuesta formal validada. Las cancelaciones y reembolsos se rigen por la política aplicable, el contrato correspondiente y los derechos obligatorios reconocidos por ley.",
          ]],
        },
        {
          id: "servicios-profesionales",
          title: "Servicios profesionales",
          paragraphs: [[
            "La autoevaluación y el contenido publicado son orientativos. No sustituyen asesoría legal, fiscal, contable, financiera o técnica adaptada a circunstancias específicas.",
          ]],
        },
        {
          id: "propiedad-intelectual",
          title: "Propiedad intelectual",
          paragraphs: [[
            "La marca, identidad visual, textos, software y materiales del sitio pertenecen a RCP Services o se utilizan con autorización. No se permite reproducirlos o presentarlos como propios sin permiso escrito.",
          ]],
        },
        {
          id: "responsabilidad-y-contacto",
          title: "Responsabilidad y contacto",
          paragraphs: [[
            "RCP Services procura mantener información correcta, pero no garantiza disponibilidad ininterrumpida ni resultados comerciales específicos. Estos términos toman como referencia las leyes dominicanas 126-02 y 358-05 y no limitan derechos obligatorios. Para preguntas escribe a ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
      ],
    },
    en: {
      locale: "en",
      badge: "Effective August 11, 2026",
      title: "Terms of",
      accent: "use",
      summary: "Conditions that apply to the use of rcp.services and to commercial requests submitted to RCP Services.",
      contentsLabel: "In these terms",
      languageLabel: "Document language",
      alternate: { href: "/terminos", hrefLang: "es-DO", label: "Leer en español" },
      endLabel: "Terms of use · RCP Services SRL",
      sections: [
        {
          id: "identity-and-use",
          title: "Identity and use of the website",
          paragraphs: [[
            "RCP Services SRL, Dominican Tax ID (RNC) 132-147103, has an address at Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, Dominican Republic. The website provides general information about business services. You must use it lawfully, without affecting its security, availability or third-party rights.",
          ]],
        },
        {
          id: "quotations-and-contracting",
          title: "Quotations and contracting",
          paragraphs: [[
            "Quotations are requested through WhatsApp or ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ", which is managed through Zoho Mail. Any communicated price or range may depend on scope, quantities, taxes, availability and technical conditions. A selection on the website is not a purchase, reservation or contract. A contract exists only when the parties accept in writing a proposal or order with final scope, price and conditions.",
          ]],
        },
        {
          id: "payments-and-cancellations",
          title: "Payments and cancellations",
          paragraphs: [[
            "This website does not process online payments. RCP Services will not request full card details through rcp.services forms, email or WhatsApp. Payment methods will be communicated in a validated formal proposal. Cancellations and refunds are governed by the applicable policy, the relevant contract and mandatory rights recognized by law.",
          ]],
        },
        {
          id: "professional-services",
          title: "Professional services",
          paragraphs: [[
            "Self-assessments and published content are for guidance only. They do not replace legal, tax, accounting, financial or technical advice tailored to specific circumstances.",
          ]],
        },
        {
          id: "intellectual-property",
          title: "Intellectual property",
          paragraphs: [[
            "The brand, visual identity, text, software and website materials belong to RCP Services or are used with authorization. They may not be reproduced or presented as your own without written permission.",
          ]],
        },
        {
          id: "liability-and-contact",
          title: "Liability and contact",
          paragraphs: [[
            "RCP Services seeks to keep information accurate but does not guarantee uninterrupted availability or specific business results. These terms reference Dominican Laws 126-02 and 358-05 and do not limit mandatory rights. For questions, write to ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
      ],
    },
  },
  cookies: {
    es: {
      locale: "es",
      badge: "Vigente desde el 11 de agosto de 2026",
      title: "Política de",
      accent: "cookies",
      summary: "Cookies y almacenamiento local utilizados por rcp.services para preferencias esenciales y analítica consentida.",
      contentsLabel: "En esta política",
      languageLabel: "Idioma del documento",
      alternate: { href: "/en/cookies", hrefLang: "en", label: "Read in English" },
      endLabel: "Política de cookies · RCP Services SRL",
      sections: [
        {
          id: "que-utilizamos",
          title: "Qué utilizamos",
          paragraphs: [[
            "El sitio usa almacenamiento local esencial para recordar el tema visual, el volumen de la música y la decisión de consentimiento. Estas funciones no requieren cookies publicitarias. La selección de idioma se representa mediante la ruta visitada.",
          ]],
        },
        {
          id: "preferencia-analitica",
          title: "Preferencia analítica",
          paragraphs: [[
            "La analítica permanece denegada de forma predeterminada. En esta versión se puede guardar tu preferencia, pero PostHog u otra herramienta de medición aprobada no se activa hasta que esté configurada y aceptes la categoría analítica. Si se configura Sentry u otra herramienta de errores, los eventos técnicos deben minimizarse y redactarse; no incluyen el texto libre de solicitudes. Las funciones publicitarias, la personalización de anuncios y los datos de usuario para publicidad permanecen desactivados.",
          ]],
        },
        {
          id: "datos-medidos",
          title: "Datos medidos",
          paragraphs: [[
            "Cuando exista una integración analítica activa y aceptes, podremos medir páginas visitadas, navegación y eventos técnicos como clics de contacto. No configuramos eventos para enviar nombre, correo, teléfono, empresa, mensajes ni otra información personal o texto libre a la herramienta analítica.",
          ]],
        },
        {
          id: "cambiar-preferencias",
          title: "Cambiar preferencias",
          paragraphs: [[
            "Puedes rechazar la analítica desde el aviso inicial. Para volver a elegir, elimina el dato local ",
            code("rcp-consent-v2"),
            " desde la configuración del navegador y recarga el sitio. El tema y el volumen se guardan por separado en ",
            code("rcp-theme"),
            " y ",
            code("rcp-music-volume"),
            ".",
          ]],
        },
        {
          id: "contacto",
          title: "Contacto",
          paragraphs: [[
            "Para preguntas sobre estas tecnologías escribe a ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
      ],
    },
    en: {
      locale: "en",
      badge: "Effective August 11, 2026",
      title: "Cookie",
      accent: "policy",
      summary: "Cookies and local storage used by rcp.services for essential preferences and consented analytics.",
      contentsLabel: "In this policy",
      languageLabel: "Document language",
      alternate: { href: "/cookies", hrefLang: "es-DO", label: "Leer en español" },
      endLabel: "Cookie policy · RCP Services SRL",
      sections: [
        {
          id: "what-we-use",
          title: "What we use",
          paragraphs: [[
            "The website uses essential local storage to remember the visual theme, music volume and consent choice. These functions do not require advertising cookies. The selected language is represented by the route you visit.",
          ]],
        },
        {
          id: "analytics-preference",
          title: "Analytics preference",
          paragraphs: [[
            "Analytics is denied by default. This version can store your preference, but PostHog or another approved measurement tool is not enabled until it is configured and you accept the analytics category. If Sentry or another error tool is configured, technical events must be minimized and redacted; they do not include free text from requests. Advertising features, ad personalization and user data for advertising remain disabled.",
          ]],
        },
        {
          id: "data-measured",
          title: "Data measured",
          paragraphs: [[
            "When an analytics integration is active and you accept it, we may measure visited pages, navigation and technical events such as contact clicks. We do not configure events to send names, email addresses, phone numbers, company names, messages or other personal information or free text to the analytics tool.",
          ]],
        },
        {
          id: "change-preferences",
          title: "Change your preferences",
          paragraphs: [[
            "You can reject analytics from the initial notice. To choose again, remove the local value ",
            code("rcp-consent-v2"),
            " from your browser's site data and reload the website. Theme and volume are stored separately under ",
            code("rcp-theme"),
            " and ",
            code("rcp-music-volume"),
            ".",
          ]],
        },
        {
          id: "contact",
          title: "Contact",
          paragraphs: [[
            "For questions about these technologies, write to ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            ".",
          ]],
        },
      ],
    },
  },
  accessibility: {
    es: {
      locale: "es",
      badge: "Última revisión: 11 de agosto de 2026",
      title: "Declaración de",
      accent: "accesibilidad",
      summary: "Compromiso, alcance y canal de asistencia de accesibilidad de rcp.services.",
      contentsLabel: "En esta declaración",
      languageLabel: "Idioma del documento",
      alternate: { href: "/en/accessibility", hrefLang: "en", label: "Read in English" },
      endLabel: "Declaración de accesibilidad · RCP Services SRL",
      sections: [
        {
          id: "compromiso",
          title: "Compromiso",
          paragraphs: [[
            "RCP Services trabaja para que rcp.services sea perceptible, operable, comprensible y robusto, tomando WCAG 2.2 nivel AA como objetivo técnico.",
          ]],
        },
        {
          id: "medidas-actuales",
          title: "Medidas actuales",
          paragraphs: [[
            "Usamos estructura semántica, etiquetas visibles en formularios, estados de foco, controles táctiles, texto alternativo y pruebas responsive. Las rutas de catálogo y solicitudes incluyen estados de error explícitos y no dependen solo del color.",
          ]],
        },
        {
          id: "limitaciones-conocidas",
          title: "Limitaciones conocidas",
          paragraphs: [[
            "Algunos recursos heredados, componentes futuros del portal y contenido multimedia todavía requieren auditoría completa de teclado, lector de pantalla, contraste, subtítulos y movimiento reducido. No declaramos conformidad total mientras esos controles estén pendientes.",
          ]],
        },
        {
          id: "solicitar-ayuda",
          title: "Solicitar ayuda",
          paragraphs: [[
            "Si una barrera impide acceder a información o completar una gestión, escribe a ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " o llama al ",
            link("+1 829-806-8092", "tel:+18298068092"),
            ". Incluye la URL, el dispositivo y una descripción de la dificultad; ofreceremos un canal alternativo razonable.",
          ]],
        },
      ],
    },
    en: {
      locale: "en",
      badge: "Last reviewed August 11, 2026",
      title: "Accessibility",
      accent: "statement",
      summary: "The accessibility commitment, scope and assistance channel for rcp.services.",
      contentsLabel: "In this statement",
      languageLabel: "Document language",
      alternate: { href: "/accesibilidad", hrefLang: "es-DO", label: "Leer en español" },
      endLabel: "Accessibility statement · RCP Services SRL",
      sections: [
        {
          id: "commitment",
          title: "Commitment",
          paragraphs: [[
            "RCP Services works to make rcp.services perceivable, operable, understandable and robust, using WCAG 2.2 Level AA as its technical target.",
          ]],
        },
        {
          id: "current-measures",
          title: "Current measures",
          paragraphs: [[
            "We use semantic structure, visible form labels, focus states, touch-friendly controls, alternative text and responsive testing. Catalog and request routes include explicit error states and do not rely on color alone.",
          ]],
        },
        {
          id: "known-limitations",
          title: "Known limitations",
          paragraphs: [[
            "Some inherited resources, future portal components and multimedia content still require complete audits for keyboard access, screen readers, contrast, captions and reduced motion. We do not claim full conformance while those checks remain pending.",
          ]],
        },
        {
          id: "request-assistance",
          title: "Request assistance",
          paragraphs: [[
            "If a barrier prevents you from accessing information or completing a task, write to ",
            link("info@rcp.services", "mailto:info@rcp.services"),
            " or call ",
            link("+1 829-806-8092", "tel:+18298068092"),
            ". Include the URL, device and a description of the difficulty; we will offer a reasonable alternative channel.",
          ]],
        },
      ],
    },
  },
} satisfies Record<string, Record<Locale, LegalDocumentContent>>;
