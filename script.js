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
    'media-cta-btn': 'Solicitar Diagnóstico Gratis →'
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
    'media-cta-btn': 'Request Free Diagnosis →'
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
    const emailField = contactForm.querySelector('[name="email"]');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      btn.textContent = '❌ Email inválido';
      btn.style.background = '#ef4444';
      setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 2500);
      return;
    }

    if (typeof emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
      // Real EmailJS integration
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
      // Fallback: simulate success (EmailJS not configured yet)
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
  const faq = [
    {
      k: ['servicio', 'hacen', 'ofrec', 'qué hacen', 'que hacen', 'service', 'what do', 'do you do'],
      a: '¡Buena pregunta! 😊 Somos una <strong>Agencia 360°</strong> con tres pilares:<br><br>🔄 <strong>Renovación</strong> — Rebranding, IA, procesos<br>⚖️ <strong>Consultoría</strong> — Legal, financiera, formalización<br>📣 <strong>Publicidad</strong> — Marketing digital, campañas, CRM<br><br>Todo integrado en un solo ecosistema. ¿Quieres saber más sobre alguno?'
    },

    {
      k: ['precio', 'costo', 'cuánto', 'cuanto cuesta', 'tarifa', 'cost', 'price', 'how much', 'pago', 'inversión'],
      a: '💰 Tenemos 3 planes adaptados a cada etapa:<br><br>📦 <strong>Básico</strong> — Pago único (formalización + branding + web)<br>📊 <strong>Avanzado</strong> — Setup + iguala mensual (auditoría + campañas)<br>⭐ <strong>Premium</strong> — Retainer mensual (CRM con IA, Martech, 24/7)<br><br>Cada cotización es personalizada según tu negocio. ¿Te agendo un <a href="#contacto" style="color:var(--accent)">diagnóstico gratuito</a>? 🎯'
    },

    {
      k: ['diagnóstico', 'diagnostico', 'gratis', 'gratuito', 'free', 'diagnosis'],
      a: '🎁 ¡Por supuesto! Ofrecemos un <strong>Diagnóstico 360° totalmente gratuito</strong>. Analizamos tu negocio en las tres áreas (Renovación, Consultoría y Publicidad) y te entregamos un plan de acción personalizado.<br><br>Es sin compromiso y te da claridad total sobre dónde estás y hacia dónde puedes ir. <a href="#contacto" style="color:var(--accent)">Solicítalo aquí →</a>'
    },

    {
      k: ['contact', 'teléfono', 'telefono', 'llamar', 'whatsapp', 'correo', 'email', 'phone', 'call'],
      a: '📱 ¡Estamos a un mensaje de distancia!<br><br>📍 <strong>Oficinas</strong>: Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo<br>💬 <strong>WhatsApp</strong>: <a href="https://wa.me/18298068092" style="color:var(--accent)">829-806-8092</a><br>📧 <strong>Email</strong>: <a href="mailto:rcpservicessrl@gmail.com" style="color:var(--accent)">rcpservicessrl@gmail.com</a><br>📸 <strong>Instagram</strong>: <a href="https://www.instagram.com/rcpservices/" style="color:var(--accent)">@rcpservices</a><br><br>¿Prefieres que te llamemos? Déjanos tu número en el <a href="#contacto" style="color:var(--accent)">formulario</a> 😉'
    },

    {
      k: ['renovación', 'renovacion', 'rebranding', 'marca', 'revitalization', 'identidad', 'proceso'],
      a: '🔄 <strong>Renovación Estratégica</strong> es nuestro primer pilar. Incluye:<br><br>✅ Rebranding corporativo con identidad sólida<br>✅ Implementación de IA en procesos internos<br>✅ Automatización de flujos operativos<br>✅ Diseño de cultura organizacional orientada a resultados<br><br>Es como darle un <em>desfibrilador</em> a tu empresa 💪'
    },

    {
      k: ['consultoría', 'consultoria', 'legal', 'financ', 'formalización', 'formalizacion', 'auditoría', 'auditoria'],
      a: '⚖️ <strong>Consultoría Integral</strong> te cubre en dos frentes:<br><br>📑 <strong>Legal</strong>: Formalización expedita (Ventanilla Única, ONAPI, DGII), preparación para licitaciones del Estado<br>📊 <strong>Financiera</strong>: Auditoría, reestructuración, planificación fiscal, saneamiento<br><br>¿Sabías que con la <strong>Ley 488-08</strong> puedes acceder al 20% de las compras del Estado? 🏛️'
    },

    {
      k: ['publicidad', 'marketing', 'digital', 'campaña', 'campana', 'ads', 'seo', 'promotion', 'meta ads', 'google ads'],
      a: '📣 <strong>Publicidad Digital</strong> con tecnología de punta:<br><br>🌐 Ecosistemas web de alta conversión<br>📱 Campañas Meta Ads y Google Ads optimizadas por IA<br>🤖 Automatización Martech completa<br>📈 Gestión de CRM y posicionamiento SEO<br><br>No vendemos publicidad genérica — creamos máquinas de captación de clientes 🎯'
    },

    {
      k: ['mipyme', 'pyme', 'pequeña', 'empresa', 'negocio', 'emprendimiento'],
      a: '🏢 Estamos enfocados 100% en <strong>MIPYMEs en República Dominicana</strong>. El 98.5% de las empresas dominicanas son MIPYMEs, y la mayoría padece:<br><br>📉 Baja productividad<br>⚠️ Informalidad<br>🌐 Ceguera digital<br><br>Nosotros atacamos esos tres dolores simultáneamente. ¡Es como una reanimación empresarial! 🫀'
    },

    {
      k: ['ley', '488', 'estado', 'gobierno', 'licitación', 'licitacion', 'promipyme', 'micm'],
      a: '🏛️ ¡Esta es una joya que pocos conocen! Con la <strong>Ley 488-08</strong>, las MIPYMEs formalizadas acceden a:<br><br>🏆 El <strong>20% de las compras del Estado</strong><br>💰 Financiamientos blandos a través de Promipyme<br>🤝 Vinculación con MICM y Centros MIPYMES<br><br>Nosotros te preparamos completo para que puedas licitar. ¿Te interesa?'
    },

    {
      k: ['oceano', 'océano', 'azul', 'erac', 'competencia', 'estrategia'],
      a: '🌊 Aplicamos la <strong>Estrategia de Océano Azul (ERAC)</strong>:<br><br>✂️ <strong>Eliminamos</strong> la fricción de múltiples proveedores<br>⏱️ <strong>Reducimos</strong> la microgestión administrativa<br>📈 <strong>Aumentamos</strong> el enfoque en ROI e IA<br>🚀 <strong>Creamos</strong> una Junta Directiva Externa 360°<br><br>No competimos con las agencias tradicionales — <em>las hacemos irrelevantes</em> 😏'
    },

    {
      k: ['equipo', 'team', 'quién', 'quien', 'fundador', 'balmis'],
      a: '👥 ¡Un equipo multidisciplinario a tu servicio!<br><br>🎯 <strong>Balmis Reynoso</strong> — Gerente de Ventas<br>⚖️ Unidad de Consultoría Legal y Financiera<br>🔄 Unidad de Renovación y Procesos<br>📣 Unidad de Publicidad y Tecnología (Martech)<br><br>Somos tu <strong>Junta Directiva Externa</strong> completa 💼'
    },

    {
      k: ['junta', 'directiva', 'externa', 'board'],
      a: '💼 Operamos como tu <strong>Junta Directiva Externa</strong>. Imagina tener:<br><br>👔 Un CFO (Director Financiero)<br>⚖️ Un Director Legal<br>📣 Un CMO (Director de Marketing)<br><br>...todo en un solo canal, sin los costos de una nómina ejecutiva. <em>Es como tener un equipo directivo premium accesible para tu MIPYME.</em>'
    },

    {
      k: ['ia', 'inteligencia artificial', 'ai', 'chatbot', 'automatiz', 'tecnología', 'tecnologia', 'crm'],
      a: '🤖 <strong>La IA es nuestro motor secreto</strong>:<br><br>📝 Acelera redacción legal y financiera<br>🎯 Segmenta publicidad con precisión predictiva<br>💬 Opera chatbots 24/7 para calificar prospectos<br>📊 CRM inteligente con automatización completa<br><br>La tecnología no reemplaza al humano — lo <em>potencia</em> ⚡'
    },

    {
      k: ['hola', 'hello', 'hey', 'buenas', 'buenos', 'hi', 'saludos'],
      a: '¡Hola! 👋 ¡Qué bueno verte por aquí! Soy el asistente virtual de <strong>RCP Services</strong>.<br><br>Puedo ayudarte con información sobre nuestros servicios, planes, cómo trabajamos, o agendarte un diagnóstico gratuito. ¿Qué te gustaría saber? 😊'
    },

    {
      k: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente', 'thank', 'ok', 'vale', 'bien'],
      a: '¡Con muchísimo gusto! 🙌 Ha sido un placer ayudarte. Recuerda que puedes:<br><br>📋 <a href="#contacto" style="color:var(--accent)">Solicitar un diagnóstico gratuito</a><br>💬 <a href="https://wa.me/18298068092" style="color:var(--accent)">Escribirnos por WhatsApp</a><br><br>¡Estamos aquí para ti cuando lo necesites! 🤝'
    },

    {
      k: ['podcast', 'video', 'media', 'contenido'],
      a: '🎬 ¡Tenemos contenido increíble para ti!<br><br>🎥 <strong>Video</strong>: <em>"Crecimiento Imparable"</em> — Nuestra visión empresarial<br>🎙️ <strong>Podcast</strong>: <em>"Pretotipado y el costo real de crecer"</em> — Estrategias de validación<br><br>Visita nuestra <a href="media.html" style="color:var(--accent)">página de Media →</a>'
    },

    {
      k: ['nosotros', 'about', 'historia', 'empresa', 'quienes son'],
      a: '🏢 ¡Conoce nuestra historia! Somos una agencia nacida en Santo Domingo con una misión clara: <strong>reanimar MIPYMEs dominicanas</strong>.<br><br>Visita nuestra <a href="nosotros.html" style="color:var(--accent)">página Nosotros →</a> para conocer nuestra estrategia de Océano Azul, modelo de negocio y equipo.'
    },

    {
      k: ['horario', 'hora', 'tiempo', 'cuanto tarda', 'plazo', 'demora', 'timeline', 'how long'],
      a: '⏱️ Nuestros tiempos de ejecución:<br><br>📦 <strong>Básico</strong>: 1-3 semanas<br>📊 <strong>Avanzado</strong>: 3-4 semanas<br>⭐ <strong>Premium</strong>: 4-6 semanas + acompañamiento continuo<br><br>¡Somos ágiles y orientados a resultados! La velocidad es parte de nuestro ADN 🧬'
    },

    {
      k: ['santo domingo', 'dominicana', 'ubicación', 'ubicacion', 'donde', 'dirección', 'direccion', 'oficina'],
      a: '📍 ¡Te esperamos!<br><br><strong>Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, R.D.</strong><br><br>También podemos agendar reuniones virtuales si no estás en la capital. <a href="#contacto" style="color:var(--accent)">Contáctanos →</a>'
    },

    // -- New from operatividad doc --
    {
      k: ['funnel', 'embudo', 'captación', 'captacion', 'cómo captan', 'como captan', 'clientes'],
      a: '📊 Nuestro proceso de captación sigue un embudo estratégico:<br><br>1️⃣ <strong>Atracción</strong>: Campañas educativas en Meta y Google<br>2️⃣ <strong>Consideración</strong>: Landing Page + Diagnóstico 360° gratuito<br>3️⃣ <strong>Conversión</strong>: Consulta personalizada con un experto RCP<br>4️⃣ <strong>Fidelización</strong>: Resultados tangibles → upgrades a paquetes superiores<br><br>No vendemos en frío — <em>educamos, demostramos y conquistamos</em> 🎯'
    },

    {
      k: ['colmado', 'ferretería', 'ferreteria', 'salón', 'salon', 'belleza', 'odontol', 'colegio', 'caso', 'ejemplo', 'case'],
      a: '🏪 Hemos trabajado con todo tipo de MIPYMEs:<br><br>🏪 <strong>Colmados/Ferreterías</strong>: Formalización rápida para acceder a préstamos Promipyme al 12% anual<br>💇 <strong>Salones/Consultorios</strong>: Captación con Meta Ads para citas pre-calificadas<br>🏫 <strong>Colegios/Empresas de servicios</strong>: Preparación para licitaciones del Estado + CRM + chatbots 24/7<br><br>¿Cuál se parece a tu negocio? 😊'
    },

    {
      k: ['trabaj', 'carrera', 'career', 'empleo', 'vacante', 'job', 'colabor', 'contratar', 'reclutar'],
      a: '🚀 ¡Estamos buscando talento! Trabajamos con profesionales independientes en:<br><br>⚖️ Consultoría Legal<br>📊 Consultoría Financiera<br>📱 Marketing Digital<br>🤖 Tecnología e IA<br><br>Modelo flexible: tú decides horarios y lugar. Visita <a href="carreras.html" style="color:var(--accent)">nuestra página de Carreras →</a>'
    },

    {
      k: ['sop', 'proceso', 'calidad', 'estándar', 'estandar', 'quality', 'standard'],
      a: '✅ Operamos bajo estándares industriales:<br><br>📖 <strong>SOPs documentados</strong> para cada proceso<br>✔️ <strong>Auditorías de calidad</strong> con política de cero errores críticos<br>🔒 <strong>NDAs obligatorios</strong> para proteger tu información<br><br>Es como McDonald\'s pero para servicios empresariales — <em>consistencia garantizada</em> 🎯'
    },

    {
      k: ['kpi', 'métrica', 'metrica', 'roi', 'roas', 'retorno', 'resultados', 'medir'],
      a: '📈 Medimos todo con KPIs claros:<br><br>📊 <strong>CAC</strong>: Costo de adquisición por cliente<br>💰 <strong>LTV</strong>: Valor de vida del cliente (meta: LTV ≥ 3× CAC)<br>🎯 <strong>ROAS</strong>: Retorno de inversión publicitaria<br>📉 <strong>Margen Neto</strong>: Ahorro operativo demostrable<br><br>No prometemos resultados — <em>los demostramos con datos</em> 📊'
    },
  ];

  const defaultReplies = [
    '🤔 Hmm, esa es una pregunta interesante que merece una respuesta personalizada. ¿Te gustaría que un humano del equipo te responda? Escríbenos por <a href="https://wa.me/18298068092" style="color:var(--accent)">WhatsApp (829-806-8092)</a> 💬',
    '😊 No estoy 100% seguro de tener la respuesta perfecta para eso. Pero nuestro equipo sí la tiene — <a href="#contacto" style="color:var(--accent)">déjanos tus datos</a> y te contactamos rápido.',
    '🤓 ¡Buena pregunta! Para darte la mejor respuesta, te recomiendo agendar un <a href="#contacto" style="color:var(--accent)">diagnóstico 360° gratuito</a>. Es sin compromiso y en menos de 30 min tendrás claridad total.',
  ];

  const quickButtons = ['¿Qué servicios ofrecen?', '¿Cuánto cuesta?', 'Diagnóstico gratis', 'Contacto'];

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
    quickButtons.forEach(label => {
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

  function getReply(input) {
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
        bestAnswer = item.a;
      }
    }

    if (bestAnswer) return bestAnswer;
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
  }

  function handleUserInput(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot chat-typing';
    typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    setTimeout(() => {
      typingDiv.remove();
      addMessage(getReply(text));
    }, 600 + Math.random() * 500);
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
