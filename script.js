// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('backTop').classList.toggle('visible', window.scrollY > 400);
});

// ─── POPULATE TRUST TOOLTIPS FROM data-tooltip ───
document.querySelectorAll('.trust-card[data-tooltip]').forEach(card => {
  const el = card.querySelector('.trust-tooltip');
  if (el) el.innerHTML = card.dataset.tooltip;
});

// ═══════════════════════════════════════════════
// ─── AMBIENT MUSIC (MP3 file playback) ────────
// ═══════════════════════════════════════════════
(function () {
  const btn = document.getElementById('musicBtn');
  const iconOff = document.getElementById('musicIconOff');
  const iconOn = document.getElementById('musicIconOn');
  if (!btn) return;

  let audio = null;
  let isPlaying = false;

  function startMusic() {
    audio = new Audio('Fondo Tech Emotivo.mp3');
    audio.loop = true;
    audio.volume = 0.15; // 15% volume
    audio.play().catch(() => { /* autoplay blocked, ignore */ });
    isPlaying = true;
    btn.classList.add('playing');
    iconOff.style.display = 'none';
    iconOn.style.display = '';
  }

  function stopMusic() {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio = null;
    }
    isPlaying = false;
    btn.classList.remove('playing');
    iconOff.style.display = '';
    iconOn.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    if (isPlaying) { stopMusic(); } else { startMusic(); }
  });
})();

// ═══════════════════════════════════════════════
// ─── THEME TOGGLE (LIGHT / DARK) WITH LOGO ────
// ═══════════════════════════════════════════════
const themeBtn = document.getElementById('themeBtn');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    if (isLight) {
      document.documentElement.removeAttribute('data-theme');
      sunIcon.style.display = 'none';
      moonIcon.style.display = '';
      // Restore dark logos (navbar only — footer stays dark)
      document.querySelectorAll('.nav-logo').forEach(img => {
        img.src = 'Logo RCP  fondo negro.png';
      });
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      sunIcon.style.display = '';
      moonIcon.style.display = 'none';
      // Swap navbar to light-friendly logo (footer keeps dark logo)
      document.querySelectorAll('.nav-logo').forEach(img => {
        img.src = 'Logo RCP Services.png';
      });
    }
  });
}

// ═══════════════════════════════════════════════
// ─── LANGUAGE SELECTOR (ES / EN) ───────────────
// ═══════════════════════════════════════════════
const translations = {
  es: {
    // Nav
    'nav-problema': 'El Problema',
    'nav-solucion': 'Solución',
    'nav-paquetes': 'Paquetes',
    'nav-contacto': 'Contacto',
    'nav-cta': 'Diagnóstico 360°',
    // Hero
    'hero-badge': 'Agencia 360° · República Dominicana',
    'hero-title': 'Reanimando el <span class="accent">corazón</span> de tu empresa<br />para un crecimiento <span class="accent">indetenible</span>.',
    'hero-sub': 'Erradicamos la arritmia empresarial. Somos tu Junta Directiva Externa que centraliza tus finanzas, legalidad y marketing bajo un solo ecosistema <strong>360°</strong>.',
    'hero-cta': 'Solicita tu Diagnóstico 360° Hoy',
    'hero-ghost': 'Conoce el Ecosistema →',
    'stat-label-1': 'MIPYMEs afectadas',
    'stat-label-2': 'Pilares integrados',
    'stat-label-3': 'Visión total',
    // Problema
    'section-label-problema': 'El Problema',
    'section-title-problema': 'El <span class="accent">98.5%</span> de las MIPYMEs dominicanas<br />padecen la misma arritmia',
    'section-sub-problema': 'Síntomas críticos que frenan cada latido de tu negocio:',
    'card-1-title': 'Baja Productividad',
    'card-1-text': 'Procesos desarticulados, equipos sin dirección estratégica y recursos que se consumen sin retorno visible.',
    'card-2-title': 'Informalidad Empresarial',
    'card-2-text': 'Operaciones fuera del marco legal que bloquean el acceso a créditos, licitaciones y mercados formales.',
    'card-3-title': 'Ceguera Digital',
    'card-3-text': 'Ausencia de presencia online efectiva y herramientas digitales que en el mercado actual son oxígeno, no lujo.',
    // Solución
    'section-label-solucion': 'La Solución',
    'section-title-solucion': 'El Ecosistema <span class="accent">R·C·P</span>',
    'section-sub-solucion': 'Tres pilares. Una sola intervención. Resultados irreversibles.',
    // Tabs R-C-P
    'tab-r': '<span class="tab-letter">R</span> Renovación',
    'tab-c': '<span class="tab-letter">C</span> Consultoría',
    'tab-p': '<span class="tab-letter">P</span> Publicidad',
    'panel-r-title': 'Renovación <span class="accent">Estratégica</span>',
    'panel-r-desc': 'Inyectamos nueva identidad y tecnología de vanguardia en el núcleo de tu empresa:',
    'panel-c-title': 'Consultoría <span class="accent">Integral</span>',
    'panel-c-desc': 'Tu salud financiera y legalidad, blindadas para competir al más alto nivel:',
    'panel-p-title': 'Publicidad <span class="accent">Digital</span>',
    'panel-p-desc': 'Ecosistemas digitales que convierten clics en clientes recurrentes:',
    // Paquetes
    'section-label-paquetes': 'Paquetes de Crecimiento',
    'section-title-paquetes': 'Elige tu nivel de <span class="accent">transformación</span>',
    'section-sub-paquetes': 'Cada empresa tiene su propio ritmo cardíaco. Elegimos el tratamiento correcto.',
    'tier-basico': 'Básico',
    'name-basico': 'Reanimación Temprana',
    'label-basico': 'Pago único',
    'cta-basico': 'Comenzar ahora →',
    'tier-avanzado': 'Avanzado',
    'name-avanzado': 'Estabilización y Crecimiento',
    'label-avanzado': 'Setup + Iguala mensual',
    'cta-avanzado': 'Crecer ahora →',
    'badge-premium': '⭐ RECOMENDADO',
    'tier-premium': 'Premium',
    'name-premium': 'Vitalidad y Liderazgo',
    'label-premium': 'Retainer mensual',
    'cta-premium': 'Liderar el mercado →',
    // Trust
    'trust-title': 'Nuestra <span class="accent">garantía</span> de triple valor',
    'trust-rapidez': 'Rapidez',
    'trust-calidad': 'Calidad',
    'trust-precio': 'Precio Justo',
    // Junta
    'junta-title': 'CREAMOS: Tu Junta Directiva Externa',
    'junta-text': 'Con la <strong class="accent">Agencia 360°</strong>, reconfiguramos la industria para volver irrelevante a la competencia. Integramos <strong>dirección financiera (CFO), estrategia legal y marketing (CMO)</strong> en un solo canal unificado. Tienes a un equipo directivo completo impulsando tu rentabilidad mes a mes, sin los costos de una nómina ejecutiva tradicional.',
    // Contacto
    'section-label-contacto': 'Toma acción hoy',
    'section-title-contacto': '¿Listo para la <span class="accent">Reanimación</span>?',
    'section-sub-contacto': 'Un diagnóstico gratuito puede ser el primer latido de una empresa completamente diferente.',
    'contact-heading': 'Conéctate con nosotros',
    'submit-btn': '🚀 Solicitar mi Diagnóstico 360° Gratis',
    // Form placeholders & options
    'ph-name': 'Tu nombre completo',
    'ph-company': 'Empresa / Negocio',
    'ph-email': 'Correo electrónico',
    'ph-phone': 'WhatsApp / Teléfono',
    'ph-message': 'Cuéntanos brevemente sobre tu empresa y el reto que enfrentas...',
    'opt-default': '¿Qué servicio necesitas?',
    'opt-diag': 'Diagnóstico 360° gratuito',
    'opt-basic': 'Plan Básico – Reanimación Temprana',
    'opt-advanced': 'Plan Avanzado – Estabilización y Crecimiento',
    'opt-premium': 'Plan Premium – Vitalidad y Liderazgo',
    // Contact info
    'info-office': 'Oficinas Centrales',
    'info-phone': 'Líneas Directas',
    'info-email': 'Email Corporativo',
    // Chatbot
    'chatbot-tooltip': '¿Necesitas ayuda? <strong>Chatea con nosotros</strong>',
    // Nav links for new pages
    'nav-nosotros': 'Nosotros',
    'nav-media': 'Media',
    // QR
    'qr-label': 'Escanéanos y conecta',
    'qr-sub': '<strong>al instante</strong>',
    'qr-hint': 'Con tu cámara o app de QR',
    // Footer
    'footer-desc': 'Agencia 360° de Transformación Empresarial y Digital<br>para MIPYMEs en la República Dominicana.',
    'footer-nav-title': 'Navegación',
    'footer-services-title': 'Servicios',
    'footer-contact-title': 'Contacto',
    'footer-link-problema': 'El Problema',
    'footer-link-solucion': 'La Solución',
    'footer-link-paquetes': 'Paquetes',
    'footer-link-contacto': 'Contacto',
    'footer-link-renovacion': 'Renovación',
    'footer-link-consultoria': 'Consultoría',
    'footer-link-publicidad': 'Publicidad',
    'footer-copy': '© 2026 RCP Services. Todos los derechos reservados. Hecho con ❤️ en Santo Domingo, R.D.',
    'erac-hub-label': 'E · R · A · C',
    'erac-a-letter': 'A',
    'chat-header-title': 'Asistente RCP',
    'chat-header-status': 'En línea · Respuesta inmediata',
    'nav-carreras': 'Carreras',
    // ──── Carreras page ────
    'careers-badge': 'Oportunidades Profesionales',
    'careers-title': 'Colabora con el <span class="accent">futuro</span><br />de las MIPYMEs',
    'careers-sub': 'Buscamos profesionales independientes apasionados por la transformación empresarial. Trabaja por proyecto, con autonomía total y desde cualquier lugar.',
    'careers-why-label': '¿Por qué RCP?',
    'careers-why-title': 'Un modelo de trabajo <span class="accent">diferente</span>',
    'careers-why-text': 'Operamos bajo un modelo de economía colaborativa: no contratamos empleados fijos, ensamblamos equipos de especialistas por proyecto. Tú decides cuándo, dónde y cómo trabajar.',
    'careers-val1-title': 'Autonomía Total',
    'careers-val1-text': 'Elige tus horarios y lugar de trabajo. Sin registro de jornada, sin exclusividad. Tú eres tu propio jefe.',
    'careers-val2-title': 'Contratos por Proyecto',
    'careers-val2-text': 'Cada colaboración se define por entregables concretos. Sabes exactamente qué entregar y cuándo cobrar.',
    'careers-val3-title': 'Impacto Real',
    'careers-val3-text': 'Transforma negocios reales. Cada proyecto impacta directamente la vida de emprendedores dominicanos.',
    'careers-roles-label': 'Perfiles que Buscamos',
    'careers-roles-title': 'Áreas de <span class="accent">colaboración</span>',
    'careers-role1-title': 'Consultoría Legal',
    'careers-role1-text': 'Abogados con experiencia en formalización empresarial, ONAPI, DGII, Ventanilla Única y licitaciones del Estado.',
    'careers-role2-title': 'Consultoría Financiera',
    'careers-role2-text': 'Contadores y analistas financieros expertos en auditorías, reestructuración y planificación fiscal para MIPYMEs.',
    'careers-role3-title': 'Marketing Digital',
    'careers-role3-text': 'Especialistas en Meta Ads, Google Ads, SEO, CRM, automatización Martech y estrategia de contenidos.',
    'careers-role4-title': 'Tecnología e IA',
    'careers-role4-text': 'Desarrolladores web, ingenieros de IA, diseñadores UX/UI y especialistas en automatización con inteligencia artificial.',
    'careers-process-label': 'El Proceso',
    'careers-process-title': '¿Cómo <span class="accent">colaboramos</span>?',
    'careers-step1-title': 'Postulación',
    'careers-step1-text': 'Envíanos tu CV y portafolio a través del formulario. Cuéntanos tu especialidad y experiencia.',
    'careers-step2-title': 'Evaluación',
    'careers-step2-text': 'Revisamos tu perfil y, si hay match, te invitamos a una conversación breve para conocerte.',
    'careers-step3-title': 'Colaboración',
    'careers-step3-text': 'Te asignamos proyectos según tu especialidad. Firmas un acuerdo de colaboración y empiezas.',
    'careers-standards-label': 'Excelencia Operativa',
    'careers-standards-title': 'Nuestros <span class="accent">estándares</span>',
    'careers-standards-text': 'Garantizamos calidad a través de procesos estandarizados, documentación exhaustiva y auditorías de entregables con cero errores críticos.',
    'careers-std1-title': 'SOPs Documentados',
    'careers-std1-text': 'Cada proceso tiene un procedimiento operativo estándar con instrucciones claras y replicables.',
    'careers-std2-title': 'Auditorías de Calidad',
    'careers-std2-text': 'Sistema de checklists con política de cero errores críticos antes de cada entrega al cliente.',
    'careers-std3-title': 'Confidencialidad',
    'careers-std3-text': 'Todos los colaboradores firman acuerdos de confidencialidad (NDA) para proteger la información de nuestros clientes.',
    'careers-cta-title': '¿Listo para <span class="accent">colaborar</span>?',
    'careers-cta-sub': 'Envíanos tu perfil y nos pondremos en contacto cuando haya un proyecto para ti.',
    'careers-cta-btn': 'Enviar mi CV →',
    'careers-cta-hint': 'Envía tu CV y portafolio a <strong>rcpservicessrl@gmail.com</strong> indicando tu área de especialidad.',
    // ──── Nosotros page ────
    'about-badge': 'Quiénes somos',
    'about-title': 'Somos el <span class="accent">oxígeno estratégico</span><br />de tu empresa',
    'about-sub': 'Una Agencia 360° que centraliza renovación, consultoría y publicidad bajo un ecosistema de inteligencia artificial para MIPYMEs dominicanas.',
    'about-mision-label': 'Nuestra misión',
    'about-mision-title': 'Erradicar la <span class="accent">arritmia empresarial</span>',
    'about-mision-text': 'La arritmia empresarial es el conjunto de síntomas que impiden a una MIPYME crecer: baja productividad, informalidad y ceguera digital. RCP Services nació para erradicarla. Operamos como una <strong>Junta Directiva Externa</strong> que integra dirección financiera (CFO), estrategia legal y marketing (CMO) en un solo canal unificado, sin los costos de una nómina ejecutiva tradicional.',
    'about-val1-title': 'Job-To-Be-Done',
    'about-val1-text': 'El cliente busca delegar el estrés del crecimiento y la burocracia para recuperar el control de su tiempo y negocio.',
    'about-val2-title': 'Aliviadores',
    'about-val2-text': 'Centralización de trámites, gestión de crecimiento "llave en mano" y saneamiento financiero completo.',
    'about-val3-title': 'Creadores de Valor',
    'about-val3-text': 'Coherencia de marca, habilitación para licitaciones estatales y tranquilidad operativa total.',
    'about-ocean-label': 'Estrategia',
    'about-ocean-title': 'Nuestro <span class="accent">Océano Azul</span>',
    'about-ocean-text': 'Mediante la matriz ERAC, redefinimos la frontera de valor alejándonos de las agencias tradicionales.',
    'erac-e': 'Eliminamos',
    'erac-e-text': 'La fricción de contratar múltiples proveedores aislados.',
    'erac-r': 'Reducimos',
    'erac-r-text': 'El tiempo en microgestión administrativa y burocracia legal.',
    'erac-a': 'Aumentamos',
    'erac-a-text': 'El enfoque en rentabilidad real (ROI) e integración tecnológica con IA.',
    'erac-c': 'Creamos',
    'erac-c-text': 'Una Junta Directiva Externa integral en un solo canal unificado (Agencia 360°).',
    'erac-hub-sub': 'Matriz Estratégica',
    'about-model-label': 'Cómo Operamos',
    'about-model-title': 'Arquitectura del <span class="accent">Modelo de Negocio</span>',
    'about-model-text': 'Nuestro Business Model Canvas muestra cómo cada pieza del ecosistema funciona en sincronía.',
    'bmc-seg': 'Segmentos',
    'bmc-seg-text': 'MIPYMEs dominicanas que requieren formalización, rentabilidad y digitalización agresiva.',
    'bmc-channels': 'Canales',
    'bmc-channels-text': 'Entorno omnicanal: Web, redes sociales, CRM, reuniones presenciales.',
    'bmc-rel': 'Relación con Clientes',
    'bmc-rel-text': 'Alianza colaborativa de largo plazo (LTV) como socios estratégicos.',
    'bmc-rev': 'Ingresos',
    'bmc-rev-text': 'Pagos únicos (Setup), modelos híbridos e igualas recurrentes (Retainers).',
    'bmc-resources': 'Recursos Clave',
    'bmc-resources-text': 'Talento experto multidisciplinario e infraestructura de Inteligencia Artificial.',
    'bmc-partners': 'Socios Clave',
    'bmc-partners-text': 'MICM, Centros MIPYMES, Ventanilla Única, ONAPI, DGII, Cámara de Comercio, Promipyme.',
    'about-team-label': 'Nuestro Equipo',
    'about-team-title': 'Liderazgo y <span class="accent">Estructura</span>',
    'team-sales': 'Gerente de Ventas',
    'team-legal': 'Consultoría Legal y Financiera',
    'team-legal-desc': 'Especialistas en cumplimiento y finanzas',
    'team-reno': 'Renovación y Procesos',
    'team-reno-desc': 'Expertos en optimización e imagen',
    'team-martech': 'Publicidad y Martech',
    'team-martech-desc': 'Estrategas digitales y técnicos de IA',
    'about-law-label': 'Ventaja Competitiva',
    'about-law-title': 'Alineación con la <span class="accent">Ley 488-08</span>',
    'about-law-text': 'RCP Services actúa como el puente técnico hacia la formalización, alineando a las MIPYMEs con el Estado para desbloquear beneficios de alto impacto.',
    'law-1-title': '20% Compras del Estado',
    'law-1-text': 'Acceso a la reserva obligatoria de compras del gobierno según la Ley 488-08.',
    'law-2-title': 'Financiamiento Blando',
    'law-2-text': 'Acceso a créditos preferenciales a través de Promipyme y la banca formal.',
    'law-3-title': 'Vinculación Estatal',
    'law-3-text': 'Conexión directa con el MICM y Centros MIPYMES para captar fondos y programas de apoyo.',
    'about-cta': 'Agendar una reunión estratégica →',
    // ──── Media page ────
    'media-badge': 'Contenido Multimedia',
    'media-title': 'Aprende, crece y <span class="accent">transforma</span>',
    'media-sub': 'Video corporativo, podcast estratégico y recursos que inspiran la reanimación de tu negocio.',
    'media-video-label': 'Video Corporativo',
    'media-video-title': 'RCP: <span class="accent">Crecimiento Imparable</span>',
    'media-video-desc': 'Descubre cómo transformamos MIPYMEs dominicanas con nuestro ecosistema integral de renovación, consultoría y publicidad.',
    'media-video-notes-title': '📋 Sobre este video',
    'media-video-note1': 'Presentación del ecosistema R·C·P y cómo impacta a las MIPYMEs',
    'media-video-note2': 'Casos de uso de la Agencia 360° en República Dominicana',
    'media-video-note3': 'Nuestra propuesta de valor y diferenciación en el mercado',
    'media-podcast-label': 'Podcast',
    'media-podcast-title': 'Pretotipado y el <span class="accent">costo real</span> de crecer',
    'media-podcast-desc': 'Una conversación profunda sobre estrategia empresarial, validación de ideas y cómo reducir riesgos antes de invertir en el crecimiento de tu negocio.',
    'media-podcast-ep': 'Episodio 1',
    'media-podcast-name': 'Pretotipado y el costo real de crecer',
    'media-podcast-notes-title': '📋 Temas del episodio',
    'media-podcast-note1': 'Técnicas de pretotipado para validar ideas antes de invertir',
    'media-podcast-note2': 'Experimento "Puerta Falsa": Landing Page para medir el Nivel Inicial de Interés (NII)',
    'media-podcast-note3': 'MVP "Mago de Oz": Ejecución hiperpersonalizada para validar el Product-Market Fit',
    'media-podcast-note4': 'Cómo RCP Services aplica la validación estratégica en cada proyecto',
    'media-cta-title': '¿Listo para <span class="accent">dar el paso</span>?',
    'media-cta-sub': 'Agenda tu diagnóstico 360° gratuito y comienza tu transformación.',
    'media-cta-btn': 'Solicitar Diagnóstico Gratis →',
    // ──── Ecosistema Soberano ────
    'nav-ecosistema': 'Ecosistema',
    'section-label-ecosistema': 'El Núcleo Digital',
    'section-title-ecosistema': 'Un Ecosistema Operativo <span class="accent">Soberano</span> para tu Empresa',
    'section-sub-ecosistema': 'Dejamos atrás la era del software fragmentado. Instalamos un núcleo digital unificado y privado.',
    'eco-card-1-title': 'Soberanía Digital',
    'eco-card-1-desc': 'Infraestructura digital privada. Eres dueño absoluto de tus bases de datos, contraseñas y operaciones, libre de tarifas recurrentes abusivas.',
    'eco-card-2-title': 'Automatización Total',
    'eco-card-2-desc': 'Unimos tus ventas, inventario, facturación y CRM en un solo canal automático. Tu empresa trabaja sola mientras duermes.',
    'eco-card-3-title': 'IA Corporativa Privada',
    'eco-card-3-desc': 'Asistentes de IA entrenados en tu local exclusivamente con tus manuales y políticas corporativas. Información 100% segura y confidencial.',
    'eco-card-4-title': 'Estudio Creativo',
    'eco-card-4-desc': 'Generación automática de piezas publicitarias, logos y banners con inteligencia artificial privada. Sin depender de diseñadores externos para cada pieza.',
    'eco-card-5-title': 'Mensajería Inteligente',
    'eco-card-5-desc': 'Bot de WhatsApp y Telegram conectado a tu CRM que responde a clientes 24/7 con la voz y conocimiento de tu empresa.',
    'eco-card-6-title': 'Dashboard Directivo',
    'eco-card-6-desc': 'Panel de control en tiempo real con métricas clave: CAC, LTV, ROI, ROAS. Tu junta directiva digital con datos accionables.',
    'eco-comparativa-title': 'La Diferencia del Modelo Soberano',
    'eco-comp-tradicional-title': 'Modelo Tradicional (Fragmentado)',
    'eco-comp-rcp-title': 'Modelo RCP 360 Core (Soberano)',
    'comp-item-1-trad': '❌ Múltiples suscripciones mensuales de software',
    'comp-item-1-rcp': '✅ Costo de software de terceros reducido a $0',
    'comp-item-2-trad': '❌ Proveedores sueltos sin comunicación entre sí',
    'comp-item-2-rcp': '✅ Un solo equipo multidisciplinario unificado',
    'comp-item-3-trad': '❌ Datos en servidores de terceros (poca privacidad)',
    'comp-item-3-rcp': '✅ Base de datos vectorial y cifrada 100% privada',
    'comp-item-4-trad': '❌ IA genérica compartida con millones de usuarios',
    'comp-item-4-rcp': '✅ IA privada entrenada exclusivamente con tus datos',
    'comp-item-5-trad': '❌ Sin automatización: todo depende de intervención humana',
    'comp-item-5-rcp': '✅ Motor de automatización que conecta todas las capas 24/7',
    'eco-layers-title': '11 Capas Integradas',
    'eco-layers-sub': 'Cada capa de nuestro ecosistema trabaja en sincronía perfecta para tu empresa:',
    'eco-layer-1': '🗄️ Base de Datos Blindada',
    'eco-layer-2': '🧠 Motor de IA Local',
    'eco-layer-3': '🔀 Enrutador Multi-IA',
    'eco-layer-4': '💬 Chat Interno RAG',
    'eco-layer-5': '⚡ Motor de Automatización',
    'eco-layer-6': '📡 Gateway de Mensajería',
    'eco-layer-7': '🔐 Túnel Cifrado',
    'eco-layer-8': '🏢 Base de Datos ERP',
    'eco-layer-9': '📊 ERP Central',
    'eco-layer-10': '🎨 Estudio Creativo IA',
    'eco-layer-11': '🎓 Plataforma de Capacitación'
  },
  en: {
    'nav-problema': 'The Problem',
    'nav-solucion': 'Solution',
    'nav-paquetes': 'Plans',
    'nav-contacto': 'Contact',
    'nav-cta': '360° Diagnosis',
    'hero-badge': '360° Agency · Dominican Republic',
    'hero-title': 'Reviving the <span class="accent">heart</span> of your business<br />for <span class="accent">unstoppable</span> growth.',
    'hero-sub': 'We eradicate business arrhythmia. We are your External Board of Directors that centralizes your finances, legal affairs, and marketing under a single <strong>360°</strong> ecosystem.',
    'hero-cta': 'Request Your 360° Diagnosis Today',
    'hero-ghost': 'Discover the Ecosystem →',
    'stat-label-1': 'MSMEs affected',
    'stat-label-2': 'Integrated pillars',
    'stat-label-3': 'Total vision',
    'section-label-problema': 'The Problem',
    'section-title-problema': '<span class="accent">98.5%</span> of Dominican MSMEs<br />suffer the same arrhythmia',
    'section-sub-problema': 'Critical symptoms that slow down every heartbeat of your business:',
    'card-1-title': 'Low Productivity',
    'card-1-text': 'Disconnected processes, teams without strategic direction, and resources consumed without visible return.',
    'card-2-title': 'Business Informality',
    'card-2-text': 'Operations outside the legal framework that block access to credit, bids, and formal markets.',
    'card-3-title': 'Digital Blindness',
    'card-3-text': 'Absence of effective online presence and digital tools that in today\'s market are oxygen, not luxury.',
    'section-label-solucion': 'The Solution',
    'section-title-solucion': 'The <span class="accent">R·C·P</span> Ecosystem',
    'section-sub-solucion': 'Three pillars. One intervention. Irreversible results.',
    // Tabs R·C·P — English analogs keeping R, C, P initials
    'tab-r': '<span class="tab-letter">R</span> Revitalization',
    'tab-c': '<span class="tab-letter">C</span> Consulting',
    'tab-p': '<span class="tab-letter">P</span> Promotion',
    'panel-r-title': 'Strategic <span class="accent">Revitalization</span>',
    'panel-r-desc': 'We inject new identity and cutting-edge technology into the core of your business:',
    'panel-c-title': 'Comprehensive <span class="accent">Consulting</span>',
    'panel-c-desc': 'Your financial health and legality, armored to compete at the highest level:',
    'panel-p-title': 'Digital <span class="accent">Promotion</span>',
    'panel-p-desc': 'Digital ecosystems that convert clicks into recurring clients:',
    // Paquetes
    'section-label-paquetes': 'Growth Plans',
    'section-title-paquetes': 'Choose your <span class="accent">transformation</span> level',
    'section-sub-paquetes': 'Every business has its own heartbeat. We choose the right treatment.',
    'tier-basico': 'Basic',
    'name-basico': 'Early Revival',
    'label-basico': 'One-time payment',
    'cta-basico': 'Start now →',
    'tier-avanzado': 'Advanced',
    'name-avanzado': 'Stabilization & Growth',
    'label-avanzado': 'Setup + Monthly retainer',
    'cta-avanzado': 'Grow now →',
    'badge-premium': '⭐ RECOMMENDED',
    'tier-premium': 'Premium',
    'name-premium': 'Vitality & Leadership',
    'label-premium': 'Monthly retainer',
    'cta-premium': 'Lead the market →',
    'trust-title': 'Our <span class="accent">triple value</span> guarantee',
    'trust-rapidez': 'Speed',
    'trust-calidad': 'Quality',
    'trust-precio': 'Fair Price',
    'junta-title': 'WE CREATE: Your External Board of Directors',
    'junta-text': 'With the <strong class="accent">360° Agency</strong>, we reconfigure the industry to make the competition irrelevant. We integrate <strong>financial direction (CFO), legal strategy, and marketing (CMO)</strong> into a single unified channel. You get a complete executive team driving your profitability month after month, without the costs of a traditional executive payroll.',
    'section-label-contacto': 'Take action today',
    'section-title-contacto': 'Ready for the <span class="accent">Revival</span>?',
    'section-sub-contacto': 'A free diagnosis can be the first heartbeat of a completely different business.',
    'contact-heading': 'Connect with us',
    'submit-btn': '🚀 Request My Free 360° Diagnosis',
    // Form placeholders & options
    'ph-name': 'Your full name',
    'ph-company': 'Company / Business',
    'ph-email': 'Email address',
    'ph-phone': 'WhatsApp / Phone',
    'ph-message': 'Tell us briefly about your company and the challenge you face...',
    'opt-default': 'What service do you need?',
    'opt-diag': 'Free 360° Diagnosis',
    'opt-basic': 'Basic Plan – Early Revival',
    'opt-advanced': 'Advanced Plan – Stabilization & Growth',
    'opt-premium': 'Premium Plan – Vitality & Leadership',
    // Contact info
    'info-office': 'Head Office',
    'info-phone': 'Direct Lines',
    'info-email': 'Corporate Email',
    // Chatbot
    'chatbot-tooltip': 'Need help? <strong>Chat with us</strong>',
    // Nav links for new pages
    'nav-nosotros': 'About Us',
    'nav-media': 'Media',
    'qr-label': 'Scan us and connect',
    'qr-sub': '<strong>instantly</strong>',
    'qr-hint': 'With your camera or QR app',
    'footer-desc': '360° Agency for Business and Digital Transformation<br>for MSMEs in the Dominican Republic.',
    'footer-nav-title': 'Navigation',
    'footer-services-title': 'Services',
    'footer-contact-title': 'Contact',
    'footer-link-problema': 'The Problem',
    'footer-link-solucion': 'The Solution',
    'footer-link-paquetes': 'Plans',
    'footer-link-contacto': 'Contact',
    'footer-link-renovacion': 'Revitalization',
    'footer-link-consultoria': 'Consulting',
    'footer-link-publicidad': 'Promotion',
    'footer-copy': '© 2026 RCP Services. All rights reserved. Made with ❤️ in Santo Domingo, D.R.',
    'erac-hub-label': 'E · R · R · C',
    'erac-a-letter': 'R',
    'chat-header-title': 'RCP Assistant',
    'chat-header-status': 'Online · Instant reply',
    'nav-carreras': 'Careers',
    // ──── Careers page (EN) ────
    'careers-badge': 'Professional Opportunities',
    'careers-title': 'Collaborate with the <span class="accent">future</span><br />of MSMEs',
    'careers-sub': 'We\'re looking for independent professionals passionate about business transformation. Work per project, with full autonomy, from anywhere.',
    'careers-why-label': 'Why RCP?',
    'careers-why-title': 'A <span class="accent">different</span> work model',
    'careers-why-text': 'We operate under a collaborative economy model: no fixed employees, we assemble teams of specialists per project. You decide when, where, and how to work.',
    'careers-val1-title': 'Full Autonomy',
    'careers-val1-text': 'Choose your own hours and workplace. No time tracking, no exclusivity. Be your own boss.',
    'careers-val2-title': 'Project-Based Contracts',
    'careers-val2-text': 'Each collaboration is defined by concrete deliverables. Know exactly what to deliver and when to get paid.',
    'careers-val3-title': 'Real Impact',
    'careers-val3-text': 'Transform real businesses. Every project directly impacts Dominican entrepreneurs\' lives.',
    'careers-roles-label': 'Profiles We Seek',
    'careers-roles-title': '<span class="accent">Collaboration</span> areas',
    'careers-role1-title': 'Legal Consulting',
    'careers-role1-text': 'Lawyers experienced in business formalization, ONAPI, DGII, One-Stop-Window, and government procurement.',
    'careers-role2-title': 'Financial Consulting',
    'careers-role2-text': 'Accountants and financial analysts expert in audits, restructuring, and tax planning for MSMEs.',
    'careers-role3-title': 'Digital Marketing',
    'careers-role3-text': 'Specialists in Meta Ads, Google Ads, SEO, CRM, Martech automation, and content strategy.',
    'careers-role4-title': 'Technology & AI',
    'careers-role4-text': 'Web developers, AI engineers, UX/UI designers, and automation specialists with AI tools.',
    'careers-process-label': 'The Process',
    'careers-process-title': 'How do we <span class="accent">collaborate</span>?',
    'careers-step1-title': 'Application',
    'careers-step1-text': 'Send us your resume and portfolio through the form. Tell us your specialty and experience.',
    'careers-step2-title': 'Evaluation',
    'careers-step2-text': 'We review your profile and, if there\'s a match, we invite you for a brief conversation.',
    'careers-step3-title': 'Collaboration',
    'careers-step3-text': 'We assign you projects based on your specialty. Sign a collaboration agreement and start.',
    'careers-standards-label': 'Operational Excellence',
    'careers-standards-title': 'Our <span class="accent">standards</span>',
    'careers-standards-text': 'We guarantee quality through standardized processes, thorough documentation, and zero-critical-error deliverable audits.',
    'careers-std1-title': 'Documented SOPs',
    'careers-std1-text': 'Every process has a standard operating procedure with clear, replicable instructions.',
    'careers-std2-title': 'Quality Audits',
    'careers-std2-text': 'Checklist system with zero critical errors policy before every client delivery.',
    'careers-std3-title': 'Confidentiality',
    'careers-std3-text': 'All collaborators sign NDAs to protect our clients\' information.',
    'careers-cta-title': 'Ready to <span class="accent">collaborate</span>?',
    'careers-cta-sub': 'Send us your profile and we\'ll contact you when there\'s a project for you.',
    'careers-cta-btn': 'Send my Resume →',
    'careers-cta-hint': 'Send your resume and portfolio to <strong>rcpservicessrl@gmail.com</strong> indicating your area of expertise.',
    // ──── Nosotros page (EN) ────
    'about-badge': 'Who we are',
    'about-title': 'We are the <span class="accent">strategic oxygen</span><br />for your business',
    'about-sub': 'A 360° Agency that centralizes revitalization, consulting, and promotion under an artificial intelligence ecosystem for Dominican MSMEs.',
    'about-mision-label': 'Our mission',
    'about-mision-title': 'Eradicating <span class="accent">business arrhythmia</span>',
    'about-mision-text': 'Business arrhythmia is the set of symptoms that prevent an MSME from growing: low productivity, informality, and digital blindness. RCP Services was born to eradicate it. We operate as an <strong>External Board of Directors</strong> that integrates financial direction (CFO), legal strategy, and marketing (CMO) into a single unified channel, without the costs of a traditional executive payroll.',
    'about-val1-title': 'Job-To-Be-Done',
    'about-val1-text': 'The client seeks to delegate the stress of growth and bureaucracy to regain control of their time and business.',
    'about-val2-title': 'Pain Relievers',
    'about-val2-text': 'Centralization of procedures, turnkey growth management, and complete financial restructuring.',
    'about-val3-title': 'Value Creators',
    'about-val3-text': 'Brand coherence, eligibility for government bids, and total operational peace of mind.',
    'about-ocean-label': 'Strategy',
    'about-ocean-title': 'Our <span class="accent">Blue Ocean</span>',
    'about-ocean-text': 'Through the ERAC framework, we redefine the value frontier, moving away from traditional agencies.',
    'erac-e': 'Eliminate',
    'erac-e-text': 'The friction of hiring multiple isolated providers.',
    'erac-r': 'Reduce',
    'erac-r-text': 'Time spent on administrative micromanagement and legal bureaucracy.',
    'erac-a': 'Raise',
    'erac-a-text': 'Focus on real profitability (ROI) and technological integration with AI.',
    'erac-c': 'Create',
    'erac-c-text': 'A comprehensive External Board of Directors in a single unified channel (360° Agency).',
    'erac-hub-sub': 'Strategic Framework',
    'about-model-label': 'How We Operate',
    'about-model-title': '<span class="accent">Business Model</span> Architecture',
    'about-model-text': 'Our Business Model Canvas shows how every piece of the ecosystem works in sync.',
    'bmc-seg': 'Segments',
    'bmc-seg-text': 'Dominican MSMEs requiring formalization, profitability, and aggressive digitalization.',
    'bmc-channels': 'Channels',
    'bmc-channels-text': 'Omnichannel environment: Web, social media, CRM, in-person meetings.',
    'bmc-rel': 'Customer Relations',
    'bmc-rel-text': 'Long-term collaborative partnership (LTV) as strategic allies.',
    'bmc-rev': 'Revenue',
    'bmc-rev-text': 'One-time payments (Setup), hybrid models, and recurring retainers.',
    'bmc-resources': 'Key Resources',
    'bmc-resources-text': 'Multidisciplinary expert talent and Artificial Intelligence infrastructure.',
    'bmc-partners': 'Key Partners',
    'bmc-partners-text': 'MICM, MSME Centers, Ventanilla Única, ONAPI, DGII, Chamber of Commerce, Promipyme.',
    'about-team-label': 'Our Team',
    'about-team-title': 'Leadership & <span class="accent">Structure</span>',
    'team-sales': 'Sales Manager',
    'team-legal': 'Legal & Financial Consulting',
    'team-legal-desc': 'Compliance and finance specialists',
    'team-reno': 'Revitalization & Processes',
    'team-reno-desc': 'Optimization and branding experts',
    'team-martech': 'Promotion & Martech',
    'team-martech-desc': 'Digital strategists and AI technicians',
    'about-law-label': 'Competitive Advantage',
    'about-law-title': 'Alignment with <span class="accent">Law 488-08</span>',
    'about-law-text': 'RCP Services acts as the technical bridge to formalization, aligning MSMEs with the State to unlock high-impact benefits.',
    'law-1-title': '20% Government Purchases',
    'law-1-text': 'Access to the mandatory government procurement reserve under Law 488-08.',
    'law-2-title': 'Soft Financing',
    'law-2-text': 'Access to preferential credit through Promipyme and formal banking.',
    'law-3-title': 'Government Linkage',
    'law-3-text': 'Direct connection with MICM and MSME Centers to access funds and support programs.',
    'about-cta': 'Schedule a strategic meeting →',
    // ──── Media page (EN) ────
    'media-badge': 'Multimedia Content',
    'media-title': 'Learn, grow, and <span class="accent">transform</span>',
    'media-sub': 'Corporate video, strategic podcast, and resources that inspire the revival of your business.',
    'media-video-label': 'Corporate Video',
    'media-video-title': 'RCP: <span class="accent">Unstoppable Growth</span>',
    'media-video-desc': 'Discover how we transform Dominican MSMEs with our comprehensive revitalization, consulting, and promotion ecosystem.',
    'media-video-notes-title': '📋 About this video',
    'media-video-note1': 'Presentation of the R·C·P ecosystem and its impact on MSMEs',
    'media-video-note2': 'Case studies of the 360° Agency in the Dominican Republic',
    'media-video-note3': 'Our value proposition and market differentiation',
    'media-podcast-label': 'Podcast',
    'media-podcast-title': 'Pretotyping and the <span class="accent">real cost</span> of growth',
    'media-podcast-desc': 'A deep conversation about business strategy, idea validation, and how to reduce risks before investing in your business growth.',
    'media-podcast-ep': 'Episode 1',
    'media-podcast-name': 'Pretotyping and the real cost of growth',
    'media-podcast-notes-title': '📋 Episode topics',
    'media-podcast-note1': 'Pretotyping techniques to validate ideas before investing',
    'media-podcast-note2': '"Fake Door" experiment: Landing Page to measure Initial Interest Level (IIL)',
    'media-podcast-note3': '"Wizard of Oz" MVP: Hyper-personalized execution to validate Product-Market Fit',
    'media-podcast-note4': 'How RCP Services applies strategic validation in every project',
    'media-cta-title': 'Ready to <span class="accent">take the leap</span>?',
    'media-cta-sub': 'Schedule your free 360° diagnosis and begin your transformation.',
    'media-cta-btn': 'Request Free Diagnosis →',
    // ──── Sovereign Ecosystem (EN) ────
    'nav-ecosistema': 'Ecosystem',
    'section-label-ecosistema': 'The Digital Core',
    'section-title-ecosistema': 'A <span class="accent">Sovereign</span> Business Operating System',
    'section-sub-ecosistema': 'Leave fragmented software behind. We install a private, unified digital core in your business.',
    'eco-card-1-title': 'Digital Sovereignty',
    'eco-card-1-desc': 'Private digital infrastructure. You own 100% of your databases, passwords, and operations, free from abusive monthly subscriptions.',
    'eco-card-2-title': 'Total Automation',
    'eco-card-2-desc': 'We sync your sales, inventory, invoicing, and CRM into one single automated engine. Your business operates 24/7.',
    'eco-card-3-title': 'Private Enterprise AI',
    'eco-card-3-desc': 'AI assistants trained locally with your proprietary manuals and corporate data. 100% confidential and secure.',
    'eco-card-4-title': 'Creative Studio',
    'eco-card-4-desc': 'Automatic generation of ads, logos, and banners with private AI. No need for external designers for every piece.',
    'eco-card-5-title': 'Smart Messaging',
    'eco-card-5-desc': 'WhatsApp and Telegram bots connected to your CRM that respond to clients 24/7 with your company\'s voice and knowledge.',
    'eco-card-6-title': 'Executive Dashboard',
    'eco-card-6-desc': 'Real-time control panel with key metrics: CAC, LTV, ROI, ROAS. Your digital board of directors with actionable data.',
    'eco-comparativa-title': 'The Sovereign Difference',
    'eco-comp-tradicional-title': 'Traditional Model (Fragmented)',
    'eco-comp-rcp-title': 'RCP 360 Core (Sovereign)',
    'comp-item-1-trad': '❌ Multiple monthly software subscriptions',
    'comp-item-1-rcp': '✅ Third-party software costs reduced to $0',
    'comp-item-2-trad': '❌ Disconnected agencies working separately',
    'comp-item-2-rcp': '✅ One single unified advisory board',
    'comp-item-3-trad': '❌ Data stored on third-party servers (low privacy)',
    'comp-item-3-rcp': '✅ 100% Private, encrypted, and vectorized database',
    'comp-item-4-trad': '❌ Generic AI shared with millions of users',
    'comp-item-4-rcp': '✅ Private AI trained exclusively with your data',
    'comp-item-5-trad': '❌ No automation: everything depends on human intervention',
    'comp-item-5-rcp': '✅ Automation engine connecting all layers 24/7',
    'eco-layers-title': '11 Integrated Layers',
    'eco-layers-sub': 'Each layer of our ecosystem works in perfect sync for your business:',
    'eco-layer-1': '🗄️ Shielded Database',
    'eco-layer-2': '🧠 Local AI Engine',
    'eco-layer-3': '🔀 Multi-AI Router',
    'eco-layer-4': '💬 Internal RAG Chat',
    'eco-layer-5': '⚡ Automation Engine',
    'eco-layer-6': '📡 Messaging Gateway',
    'eco-layer-7': '🔐 Encrypted Tunnel',
    'eco-layer-8': '🏢 ERP Database',
    'eco-layer-9': '📊 Central ERP',
    'eco-layer-10': '🎨 AI Creative Studio',
    'eco-layer-11': '🎓 Training Platform'
  }
};

const langSelect = document.querySelector('.lang-select');

// Restore saved language preference
const savedLang = localStorage.getItem('rcp-lang');
if (savedLang && langSelect) {
  langSelect.value = savedLang;
  applyTranslations(savedLang);
}

function applyTranslations(lang) {
  document.documentElement.lang = lang;
  const t = translations[lang];
  if (!t) return;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.innerHTML = t[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.placeholder = t[key];
  });
}

if (langSelect) {
  langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    localStorage.setItem('rcp-lang', lang);
    applyTranslations(lang);
  });
}

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' || navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
  }
});

// ─── TABS (R-C-P) ───
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(target).classList.add('active');
  });
});

// ─── SCROLL ANIMATIONS ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// ─── CONTACT FORM (EmailJS) ───
// ┌──────────────────────────────────────────────────────────┐
// │  TO ACTIVATE: Create a free account at emailjs.com        │
// │  1. Add your email service (Gmail, Outlook, etc.)         │
// │  2. Create an email template                              │
// │  3. Replace the 3 placeholder values below                │
// └──────────────────────────────────────────────────────────┘
const EMAILJS_PUBLIC_KEY = 'pYaPyXxVIzbydrMpZ';
const EMAILJS_SERVICE_ID = 'service_st6k7sm';
const EMAILJS_TEMPLATE_ID = 'template_ep1h8r4';

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  // Initialize EmailJS if key is set
  if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Enviando...';
    btn.disabled = true;

    // Client-side validation
    const emailField = contactForm.querySelector('[name="user_email"]');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      btn.textContent = '❌ Email inválido';
      btn.style.background = '#ef4444';
      setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 2500);
      return;
    }

    // ─── DUAL PIPELINE: EmailJS (notification) + n8n Webhook (CRM/Odoo/AI Diagnostic) ───
    const formData = {
      user_name: contactForm.querySelector('[name="user_name"]')?.value || '',
      user_company: contactForm.querySelector('[name="user_company"]')?.value || '',
      user_email: contactForm.querySelector('[name="user_email"]')?.value || '',
      user_phone: contactForm.querySelector('[name="user_phone"]')?.value || '',
      user_service: contactForm.querySelector('[name="user_service"]')?.value || '',
      user_message: contactForm.querySelector('[name="user_message"]')?.value || ''
    };

    // Pipeline 1: Send to n8n backend (creates Odoo CRM lead + WhatsApp notification + AI diagnostic)
    const RCP_LEAD_URL = 'https://d8789ac870b0b8.lhr.life/webhook/rcp-lead';
    fetch(RCP_LEAD_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }).catch(err => console.warn('Lead webhook fallback (backend offline):', err));

    // Pipeline 2: EmailJS email notification
    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
        .then(() => {
          btn.textContent = '✅ ¡Solicitud enviada! Te contactaremos pronto.';
          btn.style.background = '#22c55e';
          contactForm.reset();
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 5000);
        })
        .catch(() => {
          btn.textContent = '❌ Error al enviar. Intenta de nuevo.';
          btn.style.background = '#ef4444';
          setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            btn.disabled = false;
          }, 3000);
        });
    } else {
      // Fallback: show success even if EmailJS not configured (n8n pipeline still runs)
      setTimeout(() => {
        btn.textContent = '✅ ¡Solicitud enviada! Te contactaremos pronto.';
        btn.style.background = '#22c55e';
        contactForm.reset();
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      }, 800);
    }
  });
}

// ═══════════════════════════════════════════════
// ─── PHONE VALIDATION ──────────────────────────
// ═══════════════════════════════════════════════
const phoneField = document.querySelector('[name="user_phone"]');
if (phoneField) {
  phoneField.addEventListener('blur', () => {
    const v = phoneField.value.replace(/[\s\-\(\)\+]/g, '');
    if (v && (v.length < 7 || v.length > 15 || !/^\d+$/.test(v))) {
      phoneField.style.borderColor = '#ef4444';
      phoneField.style.boxShadow = '0 0 0 2px rgba(239,68,68,0.25)';
    } else {
      phoneField.style.borderColor = '';
      phoneField.style.boxShadow = '';
    }
  });
}

// ═══════════════════════════════════════════════
// ─── CHATBOT ENGINE (Smart FAQ + Scoring) ──────
// ═══════════════════════════════════════════════
(function () {
  const chatbotBtn = document.getElementById('chatbotBtn');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  if (!chatbotBtn || !chatPanel) return;

  let isOpen = false;

  // FAQ knowledge base — scored by keyword hit count for smarter matching
  // Supports Spanish (a) and English (a_en) answers based on selected language
  const faq = [
    {
      k: ['docker', 'n8n', 'litellm', 'ollama', 'comfyui', 'odoo', 'localhost', 'webhook', 'ip', 'token', 'clave', 'servidor', 'api key', 'credenciales', 'base de datos', 'database', 'port', 'puerto', 'server'],
      a: '🔒 <strong>Seguridad y Confidencialidad:</strong> Para garantizar la protección de datos, toda nuestra infraestructura digital opera bajo estrictos protocolos de cifrado privado de punta a punta. Las especificaciones técnicas de servidores, bases de datos y herramientas internas son confidenciales y se manejan en entornos aislados. Si requieres detalles de integración para tu empresa, te invitamos a agendar una sesión de consultoría técnica privada.',
      a_en: '🔒 <strong>Security & Confidentiality:</strong> To guarantee data protection, all our digital infrastructure operates under strict end-to-end private encryption protocols. Technical specifications of servers, databases, and internal tools are confidential and managed in isolated environments. If you require integration details for your business, we invite you to schedule a private technical consulting session.'
    },
    {
      k: ['servicio', 'hacen', 'ofrec', 'qué hacen', 'que hacen', 'service', 'what do', 'do you do', 'pilar'],
      a: '¡Buena pregunta! 😊 Somos una <strong>Agencia 360°</strong> con tres pilares:<br><br>🔄 <strong>Renovación</strong> — Rebranding, IA y mejora de procesos.<br>⚖️ <strong>Consultoría</strong> — Formalización legal, fiscal y auditoría financiera.<br>📣 <strong>Publicidad</strong> — Marketing digital, embudos de conversión y CRM.<br><br>¿Quieres saber más sobre alguno de estos pilares?',
      a_en: 'Great question! 😊 We are a <strong>360° Agency</strong> built on three pillars:<br><br>🔄 <strong>Revitalization</strong> — Rebranding, AI implementation, and process optimization.<br>⚖️ <strong>Consulting</strong> — Legal/tax formalization and financial auditing.<br>📣 <strong>Promotion</strong> — Digital marketing, conversion funnels, and CRM.<br><br>Would you like to know more about any of these?'
    },
    {
      k: ['precio', 'costo', 'cuánto', 'cuanto cuesta', 'tarifa', 'cost', 'price', 'how much', 'pago', 'inversión', 'inversion', 'planes', 'plan', 'paquete'],
      a: '💰 Tenemos 3 paquetes principales adaptados a la etapa de tu negocio:<br><br>📦 <strong>Básico (Reanimación Temprana)</strong> — Pago único. Para formalización, marca y web base.<br>📊 <strong>Avanzado (Estabilización y Crecimiento)</strong> — Setup + iguala mensual. Para auditoría, procesos y campañas activas.<br>⭐ <strong>Premium (Vitalidad y Liderazgo)</strong> — Retainer mensual. CRM con IA, Martech 360 y acompañamiento directivo.<br><br>¿Te gustaría que te coticemos alguno en específico o agendamos tu <a href="#contacto" style="color:var(--accent)">diagnóstico gratuito</a>? 🎯',
      a_en: '💰 We offer 3 main packages tailored to your business stage:<br><br>📦 <strong>Basic (Early Revival)</strong> — One-time payment. Best for formalization, brand, and basic web presence.<br>📊 <strong>Advanced (Stabilization & Growth)</strong> — Setup + monthly retainer. Includes financial audit, processes, and active campaigns.<br>⭐ <strong>Premium (Vitality & Leadership)</strong> — Monthly retainer. Advanced CRM with AI, 360 Martech, and direct board-level advice.<br><br>Would you like details on a specific plan or shall we schedule your <a href="#contacto" style="color:var(--accent)">free diagnosis</a>? 🎯'
    },
    {
      k: ['basico', 'reanimacion temprana', 'basic', 'early revival'],
      a: '📦 <strong>Paquete Básico: Reanimación Temprana</strong> (Pago único):<br><br>Diseñado para emprendedores y pequeños negocios informales. Incluye:<br>✅ Diagnóstico empresarial básico.<br>✅ Formalización legal (ONAPI, Registro Mercantil, RNC).<br>✅ Diseño de logotipo e identidad visual base.<br>✅ Landing page con perfiles de redes sociales.<br><br>Es ideal para sentar las bases de tu negocio. ¿Te interesa?',
      a_en: '📦 <strong>Basic Plan: Early Revival</strong> (One-time payment):<br><br>Designed for startup entrepreneurs and informal small businesses. Includes:<br>✅ Basic business diagnosis.<br>✅ Legal formalization (ONAPI, Mercantile Registry, Tax ID/RNC).<br>✅ Logo design and basic visual identity.<br>✅ Landing page and social media profiles setup.<br><br>It is ideal for building your business foundations. Interested?'
    },
    {
      k: ['avanzado', 'estabilizacion y crecimiento', 'advanced', 'stabilization'],
      a: '📊 <strong>Paquete Avanzado: Estabilización y Crecimiento</strong> (Setup + Iguala mensual):<br><br>Para empresas en marcha que buscan ordenar sus operaciones y vender más. Incluye:<br>✅ Todo lo del Plan Básico.<br>✅ Auditoría financiera profunda y planificación fiscal.<br>✅ Optimización y manuales de procesos internos (SOPs).<br>✅ Campañas activas en Meta Ads y Google Ads.<br>✅ Posicionamiento SEO local y reportes mensuales.<br><br>Ideal para acelerar tus ventas ordenadamente. ¿Hablamos de este plan?',
      a_en: '📊 <strong>Advanced Plan: Stabilization & Growth</strong> (Setup + Monthly retainer):<br><br>For active businesses looking to organize operations and scale sales. Includes:<br>✅ Everything in the Basic Plan.<br>✅ Deep financial audit and tax planning.<br>✅ Internal process optimization and SOP manuals.<br>✅ Active advertising campaigns on Meta Ads & Google Ads.<br>✅ Local SEO optimization and monthly reports.<br><br>Ideal for scaling your sales structure. Shall we discuss this plan?'
    },
    {
      k: ['premium', 'vitalidad y liderazgo', 'vitality and leadership'],
      a: '⭐ <strong>Paquete Premium: Vitalidad y Liderazgo</strong> (Retainer mensual):<br><br>Nuestra solución más robusta para empresas que buscan dominar su nicho y automatizar. Incluye:<br>✅ Todo lo del Plan Avanzado.<br>✅ CRM inteligente configurado con Inteligencia Actorial.<br>✅ Automatizaciones operativas avanzadas.<br>✅ Campañas de marketing multicanal integrales.<br>✅ Tablero digital (dashboard) de métricas en tiempo real.<br>✅ Acompañamiento como tu Junta Directiva Externa y asesoría para licitaciones.<br><br>¿Te gustaría agendar una reunión para este plan?',
      a_en: '⭐ <strong>Premium Plan: Vitality & Leadership</strong> (Monthly retainer):<br><br>Our most robust solution for companies seeking to dominate their niche and automate. Includes:<br>✅ Everything in the Advanced Plan.<br>✅ Smart CRM configured with Artificial Intelligence.<br>✅ Advanced operational and marketing automations.<br>✅ Comprehensive multi-channel marketing campaigns.<br>✅ Real-time KPI dashboard (CAC, LTV, ROI).<br>✅ Ongoing advisory as your External Board of Directors and bidding preparation.<br><br>Would you like to schedule a call for this plan?'
    },
    {
      k: ['diagnóstico', 'diagnostico', 'gratis', 'gratuito', 'free', 'diagnosis'],
      a: '🎁 ¡Por supuesto! Ofrecemos un <strong>Diagnóstico 360° totalmente gratuito</strong>.<br><br>Analizamos tu negocio en tres dimensiones: marca/procesos, situación legal/fiscal y marketing digital. Te entregamos un reporte con tu score de arritmia y los puntos de fuga de dinero.<br><br>Es 100% sin compromiso. <a href="#contacto" style="color:var(--accent)">Solicítalo haciendo clic aquí →</a>',
      a_en: '🎁 Absolutely! We offer a **fully free 360° Business Diagnosis**.<br><br>We audit your business across three dimensions: branding/processes, legal/tax health, and digital marketing. We deliver a report showing your business arrhythmia score and where you are losing money.<br><br>It is 100% risk-free. <a href="#contacto" style="color:var(--accent)">Request it here →</a>'
    },
    {
      k: ['contact', 'teléfono', 'telefono', 'llamar', 'whatsapp', 'correo', 'email', 'phone', 'call', 'oficina', 'donde estan', 'bella vista'],
      a: '📱 ¡Estamos a un mensaje de distancia!<br><br>📍 <strong>Oficinas</strong>: Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, R.D.<br>💬 <strong>WhatsApp</strong>: <a href="https://wa.me/18298068092" style="color:var(--accent)">829-806-8092</a><br>📧 <strong>Email</strong>: <a href="mailto:rcpservicessrl@gmail.com" style="color:var(--accent)">rcpservicessrl@gmail.com</a><br>📸 <strong>Instagram</strong>: <a href="https://www.instagram.com/rcpservices/" style="color:var(--accent)">@rcpservices</a><br><br>¿Prefieres que te contactemos nosotros? Déjanos tus datos en el <a href="#contacto" style="color:var(--accent)">formulario</a>.',
      a_en: '📱 We are just a message away!<br><br>📍 **Headquarters**: Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, D.R.<br>💬 **WhatsApp**: <a href="https://wa.me/18298068092" style="color:var(--accent)">829-806-8092</a><br>📧 **Email**: <a href="mailto:rcpservicessrl@gmail.com" style="color:var(--accent)">rcpservicessrl@gmail.com</a><br>📸 **Instagram**: <a href="https://www.instagram.com/rcpservices/" style="color:var(--accent)">@rcpservices</a><br><br>Or let us contact you: fill out the <a href="#contacto" style="color:var(--accent)">contact form</a>.'
    },
    {
      k: ['renovación', 'renovacion', 'rebranding', 'marca', 'revitalization', 'identidad', 'proceso', 'automatiz'],
      a: '🔄 <strong>Renovación Estratégica</strong> es el primer pilar. Consiste en:<br><br>✅ Rediseñar la identidad visual y marca corporativa (Rebranding).<br>✅ Analizar la salud de tu marca en el mercado.<br>✅ Automatizar flujos de trabajo e introducir herramientas de IA para ahorrar tiempo y dinero.<br>✅ Rediseñar y documentar procesos internos (SOPs).<br><br>¡Inyectamos nueva energía operativa en tu negocio!',
      a_en: '🔄 <strong>Strategic Revitalization</strong> is our first pillar. It includes:<br><br>✅ Redesigning corporate identity and brand image (Rebranding).<br>✅ Market brand health analysis.<br>✅ Workflow automation and AI tools integration to save time and money.<br>✅ Standard operating procedures (SOPs) mapping and documentation.<br><br>We inject new operational energy into your business!'
    },
    {
      k: ['consultoría', 'consultoria', 'legal', 'financ', 'formalización', 'formalizacion', 'auditoría', 'auditoria', 'contab', 'rnc', 'dgii', 'onapi', 'impuestos', 'fiscal'],
      a: '⚖️ <strong>Consultoría Integral</strong> blindará legal y financieramente tu empresa:<br><br>📑 <strong>Legal y Fiscal</strong>: Registro en ONAPI, Cámara de Comercio, obtención de RNC, planificación fiscal, contratos y regularización ante la DGII.<br>📊 <strong>Financiero</strong>: Auditoría contable, balances, reducción de costos y saneamiento de cuentas.<br><br>Te convertimos en un negocio formal elegible para créditos y grandes clientes. ¿Tienes alguna duda fiscal?',
      a_en: '⚖️ <strong>Comprehensive Consulting</strong> secures your business legally and financially:<br><br>📑 **Legal & Tax**: Trademark registration with ONAPI, Mercantile Registry, Tax ID (RNC) setup, tax planning, and DGII compliance.<br>📊 **Financial**: Accounting audits, financial statements, cost reductions, and debt restructuring.<br><br>We transform your informal business into a corporate entity eligible for bank credit and major clients.'
    },
    {
      k: ['publicidad', 'marketing', 'digital', 'campaña', 'campana', 'ads', 'seo', 'promotion', 'meta ads', 'google ads', 'web', 'landing', 'crm'],
      a: '📣 <strong>Publicidad Digital</strong> orientada al retorno de inversión (ROI):<br><br>🌐 Desarrollo de sitios web y landing pages rápidas y optimizadas para móviles.<br>🎯 Campañas en Meta Ads (Facebook/Instagram) y Google Ads.<br>📈 Posicionamiento SEO local para aparecer en Google Maps.<br>🤖 Configuración de CRM y automatizaciones de Martech (marketing tecnológico).<br><br>No buscamos likes de vanidad, buscamos conversiones y clientes reales.',
      a_en: '📣 <strong>Digital Promotion</strong> focused on return on investment (ROI):<br><br>🌐 Web development and conversion-focused landing pages.<br>🎯 Target ads campaigns on Meta Ads (Facebook/Instagram) and Google Ads.<br>📈 Local SEO positioning to get you found on Google Maps.<br>🤖 CRM setup and Martech (marketing technology) automations.<br><br>We do not sell vanity likes; we build client-acquisition machines.'
    },
    {
      k: ['mipyme', 'pyme', 'pequeña', 'empresa', 'negocio', 'emprendimiento', 'dominicana'],
      a: '🏢 Nos especializamos exclusivamente en <strong>MIPYMEs de la República Dominicana</strong>.<br><br>El 98.5% del tejido empresarial dominicano son MIPYMEs, y la gran mayoría enfrenta informalidad, procesos ineficientes y baja presencia online. Diseñamos tarifas accesibles y metodologías prácticas para nuestro mercado.',
      a_en: '🏢 We specialize exclusively in **Dominican MSMEs** (Micro, Small, and Medium Enterprises).<br><br>98.5% of Dominican companies are MSMEs. Most face challenges with legal informality, inefficient manual processes, and lack of digital presence. We tailor accessible rates and practical methods for our local market.'
    },
    {
      k: ['ley', '488', 'estado', 'gobierno', 'licitación', 'licitacion', 'promipyme', 'micm', 'rpe'],
      a: '🏛️ ¡Esta es una gran oportunidad! Con la **Ley 488-08**, las MIPYMEs formalizadas en R.D. tienen acceso a:<br><br>🏆 La **reserva del 20% de las compras del Estado** (licitaciones exclusivas para MIPYMEs).<br>💰 Préstamos blandos en Promipyme (tasas de hasta 12% anual).<br>🤝 Programas especiales de fondos y apoyo con el MICM.<br><br>En RCP te ayudamos a obtener tu certificación MIPYME y tu Registro de Proveedor del Estado (RPE) paso a paso.',
      a_en: '🏛️ This is a huge opportunity! Under **Law 488-08**, formalized MSMEs in the D.R. gain access to:<br><br>🏆 A **20% mandatory reserve in government procurement** (bids exclusive for MSMEs).<br>💰 Soft loans via Promipyme (interest rates around 12% annually).<br>🤝 Specialized funding programs through the MICM.<br><br>At RCP, we handle your MSME certification and Government Provider Registry (RPE) setup step by step.'
    },
    {
      k: ['oceano', 'océano', 'azul', 'erac', 'competencia', 'estrategia', 'diferencia'],
      a: '🌊 Aplicamos la **Estrategia de Océano Azul (Matriz ERAC)** para hacer irrelevante a la competencia:<br><br>✂️ **Eliminamos**: La fragmentación de tener múltiples proveedores descoordinados.<br>⏱️ **Reducimos**: La microgestión del dueño de negocio y la burocracia legal.<br>📈 **Aumentamos**: El enfoque en rentabilidad real (ROI) y automatización con IA.<br>🚀 **Creamos**: Una Junta Directiva Externa 360° unificada en un solo canal.',
      a_en: '🌊 We apply the **Blue Ocean Strategy (ERRC Framework)** to make the competition irrelevant:<br><br>✂️ **Eliminate**: The friction and cost of managing multiple isolated providers.<br>⏱️ **Reduce**: Administrative micromanagement for the owner and legal bureaucracy.<br>📈 **Raise**: Clear focus on actual profitability (ROI) and AI process automation.<br>🚀 **Create**: A unified External Board of Directors (CFO, CMO, Legal) in a single channel.'
    },
    {
      k: ['equipo', 'team', 'quién', 'quien', 'fundador', 'balmis', 'lider'],
      a: '👥 ¡Un equipo multidisciplinario dominicano a tu servicio!<br><br>🎯 <strong>Balmis Reynoso</strong> — Gerente de Ventas y Estrategia.<br>⚖️ Unidad de Consultoría Legal y Financiera.<br>🔄 Unidad de Renovación y Procesos.<br>📣 Unidad de Publicidad y Tecnología (Martech).<br><br>Operamos bajo un modelo colaborativo, integrando a los mejores profesionales independientes para tu proyecto.',
      a_en: '👥 A Dominican multidisciplinary team at your service!<br><br>🎯 <strong>Balmis Reynoso</strong> — Sales & Strategy Manager.<br>⚖️ Legal & Financial Consulting Unit.<br>🔄 Revitalization & Process Optimization Unit.<br>📣 Promotion & Technology (Martech) Unit.<br><br>We operate under a collaborative model, bringing together specialized independent professionals for your project.'
    },
    {
      k: ['junta', 'directiva', 'externa', 'board'],
      a: '💼 Operamos como tu **Junta Directiva Externa**. Imagina contar con:<br><br>👔 Un CFO (Director Financiero) cuidando tu rentabilidad.<br>⚖️ Un Director Legal blindando tus contratos.<br>📣 Un CMO (Director de Marketing) atrayendo clientes diarios.<br><br>Todo coordinado en una sola tarifa mensual, sin los costos de una nómina ejecutiva tradicional. ¡Es el cerebro estratégico que tu MIPYME necesita!',
      a_en: '💼 We operate as your **External Board of Directors**. Imagine having:<br><br>👔 A CFO (Chief Financial Officer) watching your profit margins.<br>⚖️ A Legal Director shielding your business contracts.<br>📣 A CMO (Chief Marketing Officer) driving daily client acquisition.<br><br>All integrated for a single monthly fee, saving you the cost of executive payrolls. It is the strategic brain your business deserves!'
    },
    {
      k: ['ia', 'inteligencia artificial', 'ai', 'chatbot', 'tecnología', 'tecnologia', 'app', 'plataforma', 'rcp 360', 'pwa', 'supabase', 'flutterflow'],
      a: '🤖 **Tecnología e IA en RCP**:<br><br>Utilizamos herramientas de IA (como Gemini) para acelerar borradores legales, diagnosticar arritmias y automatizar el CRM. Además, estamos diseñando la plataforma **RCP 360 (PWA)** en FlutterFlow y Supabase para que puedas ver el avance legal, aprobar publicidad estilo Tinder (swipe) y monitorear tus ventas en tiempo real.',
      a_en: '🤖 **Technology & AI at RCP**:<br><br>We leverage AI models (like Gemini) to draft legal contracts, run diagnostics, and automate CRM workflows. We are also building the **RCP 360 App (PWA)** on FlutterFlow & Supabase, allowing clients to track legal steps, approve marketing assets via swipes, and view real-time ROI metrics.'
    },
    {
      k: ['hola', 'hello', 'hey', 'buenas', 'buenos', 'hi', 'saludos'],
      a: '¡Hola! 👋 ¡Qué bueno saludarte! Soy el asistente virtual de **RCP Services**.<br><br>Puedo responder tus dudas sobre formalización (ONAPI/DGII), la Ley 488-08, nuestros planes y precios, o agendarte un diagnóstico gratuito. ¿De qué trata tu negocio? 😊',
      a_en: 'Hello! 👋 Nice to meet you! I\'m the **RCP Services** virtual assistant.<br><br>I can answer questions about local business formalization, Law 488-08, our plans and rates, or book a free 360° diagnosis. What is your business about? 😊'
    },
    {
      k: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente', 'thank', 'ok', 'vale', 'bien'],
      a: '¡Con muchísimo gusto! 🙌 Ha sido un placer ayudarte. Recuerda que puedes:<br><br>📋 <a href="#contacto" style="color:var(--accent)">Solicitar tu diagnóstico 360° gratuito</a>.<br>💬 <a href="https://wa.me/18298068092" style="color:var(--accent)">Escribirnos directamente por WhatsApp</a>.<br><br>¡Éxito con tu negocio! 🤝',
      a_en: 'You are very welcome! 🙌 It has been a pleasure. Remember you can:<br><br>📋 <a href="#contacto" style="color:var(--accent)">Apply for your free 360° diagnosis</a>.<br>💬 <a href="https://wa.me/18298068092" style="color:var(--accent)">Chat directly on WhatsApp</a>.<br><br>Wishing your business great success! 🤝'
    },
    {
      k: ['podcast', 'video', 'media', 'contenido'],
      a: '🎬 ¡Tenemos contenido educativo de valor para ti!<br><br>🎥 **Video**: *"Crecimiento Imparable"* — La visión de RCP Services.<br>🎙️ **Podcast**: *"Pretotipado y el costo real de crecer"* — Estrategias para validar tus ideas antes de gastar dinero.<br><br>Puedes verlos en nuestra <a href="media.html" style="color:var(--accent)">página de Media →</a>.',
      a_en: '🎬 We have great educational content for you!<br><br>🎥 **Video**: *"Unstoppable Growth"* — The vision of RCP Services.<br>🎙️ **Podcast**: *"Pretotyping and the real cost of growth"* — How to validate business ideas before spending capital.<br><br>Check them out on our <a href="media.html" style="color:var(--accent)">Media Page →</a>.'
    },
    {
      k: ['nosotros', 'about', 'historia', 'quienes son', 'quienes somos'],
      a: '🏢 RCP Services nació en Santo Domingo para inyectar oxígeno estratégico, operativo y comercial a las MIPYMEs de la República Dominicana.<br><br>Para conocer nuestro Canvas de Negocio, el equipo y la tesis de Océano Azul, visita la <a href="nosotros.html" style="color:var(--accent)">página de Nosotros →</a>.',
      a_en: '🏢 RCP Services was founded in Santo Domingo to inject strategic, operational, and commercial oxygen into Dominican MSMEs.<br><br>To see our Business Model Canvas, team structure, and Blue Ocean thesis, visit our <a href="nosotros.html" style="color:var(--accent)">About Us Page →</a>.'
    },
    {
      k: ['horario', 'hora', 'tiempo', 'cuanto tarda', 'plazo', 'demora', 'timeline', 'how long'],
      a: '⏱️ Nuestros plazos promedio de ejecución son bastante ágiles:<br><br>📦 <strong>Básico (Reanimación)</strong>: 1 a 3 semanas.<br>📊 <strong>Avanzado (Estabilización)</strong>: 3 a 4 semanas.<br>⭐ <strong>Premium (Vitalidad)</strong>: 4 a 6 semanas + acompañamiento permanente mensual.<br><br>¡Hacemos honor a la "R" de Rapidez en nuestra promesa! ⚡',
      a_en: '⏱️ Our average execution timelines are highly agile:<br><br>📦 <strong>Basic (Revival)</strong>: 1 to 3 weeks.<br>📊 <strong>Advanced (Stabilization)</strong>: 3 to 4 weeks.<br>⭐ <strong>Premium (Vitality)</strong>: 4 to 6 weeks + ongoing advisory.<br><br>We live up to the "Speed" promise in our name! ⚡'
    },
    {
      k: ['funnel', 'embudo', 'captación', 'captacion', 'cómo captan', 'como captan', 'clientes'],
      a: '📊 Nuestro embudo de captación propio consta de 4 etapas:<br><br>1️⃣ **Atracción**: Contenido educativo sobre formalización e impuestos.<br>2️⃣ **Consideración**: Diagnóstico 360° gratuito para auditar arritmias.<br>3️⃣ **Conversión**: Presentación de propuesta y plan a medida.<br>4️⃣ **Fidelización**: Resultados comerciales tangibles y upgrades a planes superiores.<br><br>Hacemos lo mismo para tu negocio para que captes clientes de forma predecible.',
      a_en: '📊 Our proprietary client acquisition funnel has 4 stages:<br><br>1️⃣ **Attract**: Educational content on tax compliance, sales, and growth.<br>2️⃣ **Consider**: Free 360° Diagnosis to audit business weaknesses.<br>3️⃣ **Convert**: Pitching a tailored transformation plan.<br>4️⃣ **Retain**: Delivering tangible sales ROI to unlock tier upgrades.<br><br>We implement this same funnel for your company.'
    },
    {
      k: ['colmado', 'ferretería', 'ferreteria', 'salón', 'salon', 'belleza', 'odontol', 'colegio', 'caso', 'ejemplo', 'case'],
      a: '🏪 ¡Trabajamos con diversos sectores!<br><br>🏪 **Colmados y Ferreterías**: Formalización legal rápida para acceder a financiamientos blandos.<br>💇 **Salones de Belleza y Clínicas**: Campañas en redes para captar citas y automatización de agenda.<br>🏫 **Colegios y Servicios B2B**: Configuración de CRM, chatbots de atención y preparación para licitaciones gubernamentales.',
      a_en: '🏪 We work across diverse sectors!<br><br>🏪 **Minimarkets & Hardware stores**: Rapid legal formalization to access bank credit.<br>💇 **Salons & Dental clinics**: Targeted campaigns to drive appointment bookings and calendar automation.<br>🏫 **Schools & B2B Services**: CRM setups, support chatbots, and government bidding readiness.'
    },
    {
      k: ['trabaj', 'carrera', 'career', 'empleo', 'vacante', 'job', 'colabor', 'contratar', 'reclutar'],
      a: '🚀 ¡Buscamos talentos independientes dominicanos! Colaboramos por proyectos bajo un modelo flexible en las áreas de:<br><br>⚖️ Derecho Corporativo (DGII/ONAPI).<br>📊 Contabilidad y Finanzas.<br>📱 Marketing Digital y SEO.<br>🤖 Desarrollo Web e Inteligencia Artificial.<br><br>Visita nuestra <a href="carreras.html" style="color:var(--accent)">página de Carreras →</a> para postularte.',
      a_en: '🚀 We are seeking Dominican freelance talent! We collaborate on a project basis under a flexible model in:<br><br>⚖️ Corporate Law (DGII/ONAPI).<br>📊 Accounting & Corporate Finance.<br>📱 Digital Marketing & SEO.<br>🤖 Web Development & AI Engineering.<br><br>Visit our <a href="carreras.html" style="color:var(--accent)">Careers Page →</a> to apply.'
    },
    {
      k: ['sop', 'proceso', 'calidad', 'estándar', 'estandar', 'quality', 'standard'],
      a: '✅ Garantizamos calidad industrial en servicios intangibles:<br><br>📖 **Procedimientos Operativos Estándar (SOPs)** documentados para cada paso.<br>✔️ **Checklists de control de calidad** con política de cero errores críticos antes de entregar al cliente.<br>🔒 **Acuerdos de confidencialidad (NDA)** firmados por todos los consultores.<br><br>¡Hacemos honor a la "C" de Calidad! 🎯',
      a_en: '✅ We guarantee industrial-grade quality for professional services:<br><br>📖 Documented **Standard Operating Procedures (SOPs)** for every process.<br>✔️ Strict **quality control checklists** (zero-critical-error policy) before delivery.<br>🔒 Secure **non-disclosure agreements (NDAs)** signed by all collaborators.'
    }
  ];

  const defaultReplies_es = [
    '🤓 ¡Buena pregunta! Para darte la mejor respuesta, te recomiendo agendar un <a href="#contacto" style="color:var(--accent)">diagnóstico 360° gratuito</a>. Es sin compromiso y en menos de 30 min tendrás claridad total.',
  ];
  const defaultReplies_en = [
    '🤓 Great question! For the best answer, I recommend scheduling a <a href="#contacto" style="color:var(--accent)">free 360° diagnosis</a>. It\'s risk-free and in less than 30 min you\'ll have total clarity.',
  ];

  const quickButtons_es = ['¿Qué servicios ofrecen?', '¿Cuánto cuesta?', 'Diagnóstico gratis', 'Contacto'];
  const quickButtons_en = ['What services do you offer?', 'How much does it cost?', 'Free diagnosis', 'Contact'];

  function addMessage(text, type = 'bot') {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    div.innerHTML = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addQuickButtons() {
    const container = document.createElement('div');
    container.className = 'chat-quick-btns';
    const isEN = document.documentElement.lang === 'en';
    const buttons = isEN ? quickButtons_en : quickButtons_es;
    buttons.forEach(label => {
      const btn = document.createElement('button');
      btn.className = 'chat-quick-btn';
      btn.textContent = label;
      btn.addEventListener('click', () => {
        container.remove();
        handleUserInput(label);
      });
      container.appendChild(btn);
    });
    chatMessages.appendChild(container);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // ─── SECURITY GUARDRAIL: Confidential keyword list ───
  const CONFIDENTIAL_KEYWORDS = ['docker', 'n8n', 'litellm', 'ollama', 'comfyui', 'odoo', 'localhost', 'webhook', 'pgvector', 'moodle', 'inventree', 'openclaw', 'open webui', 'api key', 'apikey', 'credenciales', 'credentials', 'servidor interno', 'internal server', 'ip address', '192.168', '127.0.0', 'puerto 5678', 'port 5678', 'puerto 4000', 'port 4000', 'puerto 8069', 'port 8069', 'puerto 11434', 'port 11434', 'puerto 8188', 'port 8188', 'ssh tunnel', 'localhost.run', 'lhr.life'];
  const SECURITY_RESPONSE_ES = '🔒 <strong>Seguridad y Confidencialidad:</strong> Para garantizar la protección de datos, toda nuestra infraestructura digital opera bajo estrictos protocolos de cifrado privado de punta a punta. Las especificaciones técnicas de servidores, bases de datos y herramientas internas son confidenciales y se manejan en entornos aislados. Si requieres detalles de integración para tu empresa, te invitamos a <a href="#contacto" style="color:var(--accent)">agendar una sesión de consultoría técnica privada</a>.';
  const SECURITY_RESPONSE_EN = '🔒 <strong>Security & Confidentiality:</strong> To guarantee data protection, all our digital infrastructure operates under strict end-to-end private encryption protocols. Technical specifications of servers, databases, and internal tools are confidential and managed in isolated environments. If you require integration details for your business, we invite you to <a href="#contacto" style="color:var(--accent)">schedule a private technical consulting session</a>.';

  function isConfidentialQuery(text) {
    const lower = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return CONFIDENTIAL_KEYWORDS.some(kw => lower.includes(kw));
  }

  function getReply(input) {
    const isEN = document.documentElement.lang === 'en';
    const lower = input.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let bestScore = 0;
    let bestAnswer = null;

    for (const item of faq) {
      let score = 0;
      for (const keyword of item.k) {
        const normalizedKw = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (lower.includes(normalizedKw)) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        // Use English answer if available and site is in EN
        bestAnswer = (isEN && item.a_en) ? item.a_en : item.a;
      }
    }

    if (bestAnswer) return bestAnswer;
    const defaults = isEN ? defaultReplies_en : defaultReplies_es;
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  // Webhook endpoint configuration (can be updated to production URL when deployed)
  const RCP_CHATBOT_WEBHOOK_URL = 'https://d8789ac870b0b8.lhr.life/webhook/rcp-chat';
  // Lead capture webhook (sends form data to n8n -> Odoo CRM)
  const RCP_LEAD_WEBHOOK_URL = 'https://d8789ac870b0b8.lhr.life/webhook/rcp-lead';

  function handleUserInput(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';

    // ─── SECURITY GUARDRAIL: Intercept confidential queries BEFORE sending to webhook ───
    if (isConfidentialQuery(text)) {
      const isEN = document.documentElement.lang === 'en';
      setTimeout(() => {
        addMessage(isEN ? SECURITY_RESPONSE_EN : SECURITY_RESPONSE_ES);
      }, 300);
      return; // BLOCK: Never send confidential queries to the server
    }
    
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot chat-typing';
    typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Call the backend AI pipeline (n8n -> LiteLLM -> Gemini/Ollama) with fallback to local FAQ
    fetch(RCP_CHATBOT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: text, lang: document.documentElement.lang || 'es' })
    })
    .then(response => {
      if (!response.ok) throw new Error('Webhook error');
      return response.json();
    })
    .then(data => {
      typingDiv.remove();
      if (data && data.response) {
        addMessage(data.response);
      } else {
        addMessage(getReply(text));
      }
    })
    .catch(error => {
      console.warn('Backend AI pipeline unavailable, using local FAQ fallback:', error);
      // Fallback to client-side FAQ with slight artificial delay
      setTimeout(() => {
        typingDiv.remove();
        addMessage(getReply(text));
      }, 500);
    });
  }

  function openChat() {
    chatPanel.classList.add('open');
    isOpen = true;
    if (!chatMessages.hasChildNodes()) {
      const isEN = document.documentElement.lang === 'en';
      addMessage(isEN
        ? 'Hello! 👋 I\'m the <strong>RCP Services</strong> virtual assistant. How can I help you?'
        : '¡Hola! 👋 Soy el asistente virtual de <strong>RCP Services</strong>. ¿En qué puedo ayudarte?'
      );
      addQuickButtons();
    }
    setTimeout(() => chatInput.focus(), 400);
  }

  function closeChat() {
    chatPanel.classList.remove('open');
    isOpen = false;
  }

  chatbotBtn.addEventListener('click', () => {
    if (isOpen) closeChat(); else openChat();
  });

  chatClose.addEventListener('click', closeChat);

  chatSend.addEventListener('click', () => handleUserInput(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserInput(chatInput.value);
  });
})();

// ─── SMOOTH ANCHOR SCROLL ───
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

