// ─── WEBHOOK ENDPOINTS ───
// Endpoint propietario del chatbot (siempre activo)
const RCP_CHATBOT_WEBHOOK_URL = 'https://us-central1-chatbot-rcp.cloudfunctions.net/rcpChat';
// Endpoint propietario de captura de leads (GCP Cloud Function — stable, no tunnel-dependent)
const RCP_LEAD_WEBHOOK_URL = 'https://us-central1-rcp-services-cloud.cloudfunctions.net/rcpLead';

// ─── SECURITY: CONFIDENTIAL KEYWORD GUARDRAIL ───
// Blocks queries about internal infrastructure before they reach the network
const CONFIDENTIAL_KEYWORDS = [
  'docker', 'n8n', 'ollama', 'odoo', 'comfyui', 'litellm', 'openclaw', 'moodle',
  'supabase', 'postgres', 'pgvector', 'localhost', 'puerto', 'port', 'contenedor',
  'container', 'tunnel', 'tunel', 'ssh', 'webhook', 'api key', 'apikey', 'credencial',
  'credential', 'password', 'contraseña', 'secret', 'token', 'ip address', 'dirección ip',
  'servidor', 'server', 'backend', 'infraestructura', 'infrastructure', 'open webui',
  'openwebui', 'gemini', 'claude', 'openai', 'deepseek', 'llama', 'qwen', 'modelo de ia',
  'ai model', 'self-hosted', 'autoalojado', 'raspberry', 'wsl', 'linux', 'ubuntu',
  'docker compose', 'yaml', 'env', '.env', 'stack', 'microservicio', 'microservice'
];

const GUARDRAIL_RESPONSE_ES = '🛡️ <strong>Tecnología Propietaria:</strong> Nuestro ecosistema opera bajo una arquitectura cifrada de microservicios propietarios en servidores dedicados exclusivos. Por razones de seguridad corporativa, los detalles técnicos de implementación son confidenciales. ¿Te gustaría conocer los <strong>beneficios</strong> que esto te brinda como cliente? <a href="#ecosistema" style="color:var(--accent)">Ver Ecosistema Soberano →</a>';
const GUARDRAIL_RESPONSE_EN = '🛡️ <strong>Proprietary Technology:</strong> Our ecosystem operates under a proprietary encrypted microservices architecture on dedicated private servers. For corporate security reasons, technical implementation details are confidential. Would you like to learn about the <strong>benefits</strong> this provides for your business? <a href="#ecosistema" style="color:var(--accent)">See Sovereign Ecosystem →</a>';

function isConfidentialQuery(text) {
  const normalized = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return CONFIDENTIAL_KEYWORDS.some(kw => normalized.includes(kw));
}

// ─── HMAC SHA-256 PAYLOAD SIGNING ───
// Generates signature for webhook payload validation (server validates with shared secret)
async function signPayload(payloadString, timestamp) {
    const encoder = new TextEncoder();
    // Derive signing key from domain + timestamp (server knows the derivation scheme)
    const derivationBase = `${window.location.hostname}:rcp:2026`;
    const keyData = encoder.encode(derivationBase);
    const message = `${timestamp}:${payloadString}`;
    const messageData = encoder.encode(message);
    const key = await window.crypto.subtle.importKey(
        "raw", keyData, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
    );
    const signature = await window.crypto.subtle.sign("HMAC", key, messageData);
    return Array.from(new Uint8Array(signature)).map(b => b.toString(16).padStart(2, "0")).join("");
}


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

  const savedPlaying = localStorage.getItem('rcp-music-playing') === 'true';
  const savedTime = parseFloat(localStorage.getItem('rcp-music-time') || '0');

  function setupTimeUpdateListener() {
    if (!audio) return;
    audio.addEventListener('timeupdate', () => {
      localStorage.setItem('rcp-music-time', audio.currentTime.toString());
    });
  }

  function startMusic(time = 0) {
    const playAndSetup = () => {
      if (!audio) {
        audio = new Audio();
        audio.preload = 'none';
        audio.loop = true;
        audio.volume = 0.15;
        audio.src = 'Fondo Tech Emotivo.mp3';
      }
      audio.currentTime = time;
      return audio.play().then(() => {
        isPlaying = true;
        localStorage.setItem('rcp-music-playing', 'true');
        btn.classList.add('playing');
        iconOff.style.display = 'none';
        iconOn.style.display = '';
        setupTimeUpdateListener();
      });
    };

    playAndSetup().catch(() => {
      // Autoplay blocked. We wait for user interaction to resume
      localStorage.setItem('rcp-music-playing', 'true');
      
      // Clean up audio object to prevent background downloading
      if (audio) {
        audio.removeAttribute('src');
        audio.load();
        audio = null;
      }

      const resumeOnInteraction = () => {
        playAndSetup()
          .catch(err => console.warn('Interaction play failed:', err))
          .finally(() => {
            window.removeEventListener('click', resumeOnInteraction);
            window.removeEventListener('touchstart', resumeOnInteraction);
            window.removeEventListener('scroll', resumeOnInteraction);
          });
      };
      
      window.addEventListener('click', resumeOnInteraction);
      window.addEventListener('touchstart', resumeOnInteraction);
      window.addEventListener('scroll', resumeOnInteraction);
    });
  }

  function stopMusic() {
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audio = null;
    }
    isPlaying = false;
    localStorage.setItem('rcp-music-playing', 'false');
    localStorage.setItem('rcp-music-time', '0');
    btn.classList.remove('playing');
    iconOff.style.display = '';
    iconOn.style.display = 'none';
  }

  btn.addEventListener('click', () => {
    if (isPlaying) { stopMusic(); } else { startMusic(0); }
  });

  // Restore music state on load
  if (savedPlaying) {
    startMusic(savedTime);
  }
})();

// ═══════════════════════════════════════════════
// ─── THEME TOGGLE (LIGHT / DARK) WITH LOGO ────
// ═══════════════════════════════════════════════
const themeBtn = document.getElementById('themeBtn');
const sunIcon = document.getElementById('sunIcon');
const moonIcon = document.getElementById('moonIcon');

function applyTheme(theme) {
  const isLight = theme === 'light';
  if (isLight) {
    document.documentElement.setAttribute('data-theme', 'light');
    if (sunIcon) sunIcon.style.display = '';
    if (moonIcon) moonIcon.style.display = 'none';
    document.querySelectorAll('.nav-logo, .theme-logo').forEach(img => {
      img.src = 'Logo RCP Services.png';
    });
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (sunIcon) sunIcon.style.display = 'none';
    if (moonIcon) moonIcon.style.display = '';
    document.querySelectorAll('.nav-logo, .theme-logo').forEach(img => {
      img.src = 'Logo RCP  fondo negro.png';
    });
  }
}

// Restore saved theme on load
const savedTheme = localStorage.getItem('rcp-theme') || 'dark';
applyTheme(savedTheme);

if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    const nextTheme = isLight ? 'dark' : 'light';
    localStorage.setItem('rcp-theme', nextTheme);
    applyTheme(nextTheme);
  });
}

// ═══════════════════════════════════════════════
// ─── i18n loaded externally via /scripts/i18n.js ───
// ═══════════════════════════════════════════════

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  if (navLinks.classList.contains('open')) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
});
navLinks.addEventListener('click', (e) => {
  const link = e.target.closest('a');
  if (link && !link.classList.contains('dropdown-trigger')) {
    navLinks.classList.remove('open');
    document.body.classList.remove('menu-open');
    return;
  }
  
  if (e.target === navLinks) {
    const rect = navLinks.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const isCloseBtnClick = (clickY < 80 && clickX > (rect.width - 80));
    if (isCloseBtnClick) {
      navLinks.classList.remove('open');
      document.body.classList.remove('menu-open');
    }
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

// ─── CONTACT FORM (Cloud Function lead capture — EmailJS removed) ───
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = '⏳ Enviando...';
    btn.disabled = true;

    const emailField = contactForm.querySelector('[name="user_email"]');
    if (emailField && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      btn.textContent = '❌ Email inválido';
      btn.style.background = '#ef4444';
      setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; btn.disabled = false; }, 2500);
      return;
    }

    const formData = {
      user_name: contactForm.querySelector('[name="user_name"]')?.value || '',
      user_company: contactForm.querySelector('[name="user_company"]')?.value || '',
      user_email: contactForm.querySelector('[name="user_email"]')?.value || '',
      user_phone: contactForm.querySelector('[name="user_phone"]')?.value || '',
      user_service: contactForm.querySelector('[name="user_service"]')?.value || '',
      user_message: contactForm.querySelector('[name="user_message"]')?.value || ''
    };

    const timestamp = Date.now().toString();
    const payloadString = JSON.stringify(formData);
    const signature = await signPayload(payloadString, timestamp);

    try {
      const resp = await fetch(RCP_LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RCP-Timestamp': timestamp,
          'X-RCP-Signature': signature
        },
        body: payloadString
      });

      if (resp.ok) {
        btn.textContent = '✅ ¡Solicitud enviada! Te contactaremos pronto.';
        btn.style.background = '#22c55e';
        contactForm.reset();
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.warn('Lead capture error:', err);
      btn.textContent = '❌ Error al enviar. Intenta de nuevo.';
      btn.style.background = '#ef4444';
    }

    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 4000);
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
// ─── CHATBOT ENGINE (Persistent & Session-Aware) 
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
  let history = [];

  const GREETING_ES = `¡Hola! Soy Pulso, el leopardo y asistente de RCP Services. ¿En qué te puedo ayudar hoy?`;
  const GREETING_EN = `Hello! I'm Pulso, the leopard and assistant of RCP Services.<br>Would you like to start with your <strong>Free 360° Diagnosis</strong> to eradicate business arrhythmia? 🐆`;

  const faq = [
    {
      k: ['seguridad', 'cifrado', 'encriptacion', 'servidor', 'servidores', 'seguro', 'confidencial', 'base de datos', 'database', 'puerto', 'port', 'server', 'security', 'encryption', 'private'],
      a: '🔒 <strong>Seguridad y Confidencialidad:</strong> Toda nuestra infraestructura digital opera bajo estrictos protocolos de cifrado privado. Si requieres detalles técnicos, agenda una sesión de consultoría técnica privada.',
      a_en: '🔒 <strong>Security & Confidentiality:</strong> All our digital infrastructure operates under strict end-to-end private encryption. For technical details, please schedule a private consulting session.'
    },
    {
      k: ['servicio', 'hacen', 'ofrec', 'qué hacen', 'que hacen', 'service', 'what do', 'do you do', 'pilar'],
      a: 'Somos una <strong>Agencia 360°</strong> que integra 🔄 <strong>Renovación</strong> (procesos e IA), ⚖️ <strong>Consultoría</strong> (legal/fiscal) y 📣 <strong>Publicidad 360°</strong>. ¿Cuál de estos te interesa?',
      a_en: 'We are a <strong>360° Agency</strong> built on three pillars: 🔄 <strong>Revitalization</strong> (processes/AI), ⚖️ <strong>Consulting</strong> (legal/tax), and 📣 <strong>360° Advertising & Print</strong>. Which one interests you?'
    },
    {
      k: ['precio', 'costo', 'cuánto', 'cuanto cuesta', 'tarifa', 'cost', 'price', 'how much', 'pago', 'inversión', 'inversion', 'planes', 'plan', 'paquete'],
      a: 'Tenemos 3 paquetes principales adaptados a ti: 📦 <strong>Básico</strong>, 📊 <strong>Avanzado</strong> y ⭐ <strong>Premium</strong>. ¿Quieres que te coticemos alguno o prefieres agendar tu <a href="#contacto" style="color:var(--accent)">diagnóstico gratuito</a>? 🎯',
      a_en: 'We offer 3 main packages: 📦 <strong>Basic</strong>, 📊 <strong>Advanced</strong>, and ⭐ <strong>Premium</strong>. Would you like details on a specific plan or shall we book your <a href="#contacto" style="color:var(--accent)">free diagnosis</a>? 🎯'
    },
    {
      k: ['basico', 'reanimacion temprana', 'basic', 'early revival'],
      a: '📦 <strong>Paquete Básico: Reanimación Temprana</strong> (Pago único): Ideal para formalizar tu negocio. Incluye diagnóstico, ONAPI, Registro Mercantil, RNC, logotipo base y landing page. ¿Te interesa?',
      a_en: '📦 <strong>Basic Plan: Early Revival</strong> (One-time payment): Best for business formalization. Includes diagnosis, ONAPI, Mercantile Registry, Tax ID (RNC), logo, and landing page. Interested?'
    },
    {
      k: ['avanzado', 'estabilizacion y crecimiento', 'advanced', 'stabilization'],
      a: '📊 <strong>Paquete Avanzado: Estabilización y Crecimiento</strong> (Setup + Iguala): Para optimizar y vender más. Incluye auditoría fiscal/financiera, ERP/CRM Corporativo, automatización y campañas Meta/Google Ads. ¿Hablamos de este plan?',
      a_en: '📊 <strong>Advanced Plan: Stabilization & Growth</strong> (Setup + Retainer): For scaling sales. Includes tax audit, ERP/CRM Corporate setup, automations, and Meta/Google Ads. Shall we discuss it?'
    },
    {
      k: ['premium', 'vitalidad y liderazgo', 'vitality and leadership'],
      a: '⭐ <strong>Paquete Premium: Vitalidad y Liderazgo</strong> (Retainer mensual): Solución de soberanía absoluta. Todo el Plan Avanzado más IA Corporativa Privada, Estudio Creativo con IA, WhatsApp automatizado y Dashboard directivo en tiempo real. ¿Te gustaría agendar una reunión?',
      a_en: '⭐ <strong>Premium Plan: Vitality & Leadership</strong> (Monthly retainer): Absolute digital sovereignty. Everything in Advanced plus local private AI, Creative AI studio, WhatsApp automation, and real-time dashboard. Schedule a call?'
    },
    {
      k: ['diagnóstico', 'diagnostico', 'gratis', 'gratuito', 'free', 'diagnosis'],
      a: '🎁 ¡Claro! Ofrecemos un <strong>Diagnóstico 360° 100% gratuito</strong>. Auditamos tu negocio en marca/procesos, legal/fiscal y marketing, y te entregamos tu score de arritmia empresarial sin compromisos. <a href="#contacto" style="color:var(--accent)">¡Solicítalo aquí! →</a>',
      a_en: '🎁 Absolutely! We offer a **fully free 360° Business Diagnosis**. We audit your company across branding, legal/tax health, and digital marketing, showing your arrhythmia score risk-free. <a href="#contacto" style="color:var(--accent)">Request it here →</a>'
    },
    {
      k: ['contact', 'teléfono', 'telefono', 'llamar', 'whatsapp', 'correo', 'email', 'phone', 'call', 'oficina', 'donde estan', 'bella vista'],
      a: '📱 ¡Conéctate al instante!<br>📍 <strong>Ubicación</strong>: Santo Domingo, R.D.<br>💬 <strong>WhatsApp</strong>: <a href="https://wa.me/18298068092" style="color:var(--accent)">829-806-8092</a>.<br>📧 <strong>Email</strong>: <a href="mailto:info@rcp.services" style="color:var(--accent)">info@rcp.services</a>.',
      a_en: '📱 Get in touch!<br>📍 **Location**: Santo Domingo, R.D.<br>💬 **WhatsApp**: <a href="https://wa.me/18298068092" style="color:var(--accent)">829-806-8092</a>.<br>📧 **Email**: <a href="mailto:info@rcp.services" style="color:var(--accent)">info@rcp.services</a>.'
    },
    {
      k: ['renovación', 'renovacion', 'rebranding', 'marca', 'revitalization', 'identidad', 'proceso', 'automatiz'],
      a: '🔄 <strong>Renovación Estratégica:</strong> Rediseñamos tu identidad visual (Rebranding), automatizamos flujos operativos e implementamos manuales de procesos estándar (SOPs) para inyectar nueva velocidad a tu negocio.',
      a_en: '🔄 <strong>Strategic Revitalization:</strong> We redesign your visual identity (Rebranding), automate operational workflows, and map standard operating procedures (SOPs) to boost efficiency.'
    },
    {
      k: ['consultoría', 'consultoria', 'legal', 'financ', 'formalización', 'formalizacion', 'auditoría', 'auditoria', 'contab', 'rnc', 'dgii', 'onapi', 'impuestos', 'fiscal'],
      a: '⚖️ <strong>Consultoría Integral:</strong> Nos encargamos de tu formalización (ONAPI, Cámara de Comercio, RNC), planificación fiscal/DGII y auditoría financiera profunda para hacerte elegible para créditos y grandes clientes.',
      a_en: '⚖️ <strong>Comprehensive Consulting:</strong> We handle legal formalization (ONAPI, Mercantile Registry, Tax ID/RNC), tax planning/DGII compliance, and accounting audits to secure your business growth.'
    },
    {
      k: ['publicidad', 'marketing', 'digital', 'campaña', 'campana', 'ads', 'seo', 'promotion', 'meta ads', 'google ads', 'web', 'landing', 'crm', 'impresión', 'impresion', 'letrero', 'volante', 'tarjeta'],
      a: '📣 <strong>Publicidad 360°:</strong> Creamos embudos web y landing pages de alta conversión, campañas Meta/Google Ads, posicionamiento SEO Local, y producimos impresos físicos de alta gama (papelería, uniformes, letreros y flota rotulada) en nuestros propios talleres.',
      a_en: '📣 <strong>360° Advertising & Print:</strong> We build high-converting web funnels, Meta/Google Ads campaigns, Local SEO, and produce premium physical prints (stationery, uniforms, signage, and fleet branding) in our own custom workshops.'
    },
    {
      k: ['mipyme', 'pyme', 'pequeña', 'empresa', 'negocio', 'emprendimiento', 'dominicana'],
      a: '🏢 Nos enfocamos 100% en **MIPYMEs dominicanas**. Creamos tarifas realistas y metodologías ágiles adaptadas a la realidad impositiva y comercial de nuestro mercado local.',
      a_en: '🏢 We focus 100% on **Dominican MSMEs**. We tailor accessible rates and practical, agile methodologies adapted to the tax and commercial reality of our local market.'
    },
    {
      k: ['ley', '488', 'estado', 'gobierno', 'licitación', 'licitacion', 'promipyme', 'micm', 'rpe'],
      a: '🏛️ Con la **Ley 488-08**, las MIPYMEs formales tienen acceso a la **reserva del 20% de compras del Estado**, financiamiento blando en Promipyme (hasta 12% anual) y apoyo del MICM. ¡Te gestionamos tu RPE y certificación paso a paso!',
      a_en: '🏛️ Under **Law 488-08**, formalized MSMEs access a **20% government purchase reserve**, soft loans at Promipyme (around 12% interest), and MICM support. We manage your RPE and MSME certification!'
    },
    {
      k: ['oceano', 'océano', 'azul', 'erac', 'competencia', 'estrategia', 'diferencia'],
      a: '🌊 Con la **Estrategia Océano Azul**, eliminamos proveedores fragmentados y licencias costosas, reduciendo tu microgestión y potenciando tu rentabilidad real con un Ecosistema Soberano y una Junta Directiva Externa unificada.',
      a_en: '🌊 With **Blue Ocean Strategy**, we eliminate fragmented providers and high SaaS bills, reducing your micromanagement and boosting ROI with a Sovereign Digital Ecosystem and a unified Board.'
    },
    {
      k: ['equipo', 'team', 'quién', 'quien', 'fundador', 'balmis', 'lider'],
      a: '👥 Somos un equipo multidisciplinario liderado por **Balmis Reynoso** (Ventas y Estrategia), uniendo expertos en derecho corporativo, finanzas corporativas, marketing digital y tecnología (Martech).',
      a_en: '👥 We are a multidisciplinary team led by **Balmis Reynoso** (Sales & Strategy), integrating corporate lawyers, financial auditors, digital marketers, and Martech engineers.'
    },
    {
      k: ['junta', 'directiva', 'externa', 'board'],
      a: '💼 Tu **Junta Directiva Externa** unifica CFO (Finanzas), Director Legal y CMO (Marketing) bajo una sola tarifa plana integrada, dándote el cerebro estratégico ejecutivo de una gran corporación sin sus costos tradicionales.',
      a_en: '💼 As your **External Board of Directors**, we provide integrated CFO, CMO, and Legal expertise under a single monthly retainer, giving your MSME elite-level strategic guidance without executive payroll.'
    },
    {
      k: ['ia', 'inteligencia artificial', 'ai', 'chatbot', 'tecnología', 'tecnologia', 'app', 'plataforma', 'rcp 360', 'pwa'],
      a: '🤖 **IA y Tecnología:** Contamos con un **Estudio Creativo con IA** propia para contratos y diagnósticos ágiles, y desarrollamos la app **RCP 360 (PWA)** sobre nuestra plataforma propietaria para que gestiones tus aprobaciones y ventas en tiempo real.',
      a_en: '🤖 **AI & Tech:** We run our own **in-house Creative AI Studio** for rapid legal drafts and audits, and we are building the **RCP 360 (PWA)** app on our proprietary platform so you can approve visual assets and track sales in real time.'
    },
    {
      k: ['hola', 'hello', 'hey', 'buenas', 'buenos', 'hi', 'saludos'],
      a: '¡Hola! 👋 ¡Qué bueno saludarte! Soy <strong>Pulso</strong>, el asistente virtual y leopardo de RCP Services. ¿De qué trata tu negocio? 😊',
      a_en: 'Hello! 👋 Nice to meet you! I\'m <strong>Pulso</strong>, your RCP Services virtual assistant. What is your business about? 😊'
    },
    {
      k: ['gracias', 'thanks', 'perfecto', 'genial', 'excelente', 'thank', 'ok', 'vale', 'bien'],
      a: '¡Con muchísimo gusto! 🙌 Recuerda que puedes solicitar tu <a href="#contacto" style="color:var(--accent)">diagnóstico 360° gratuito</a> o escribirnos directo por <a href="https://wa.me/18298068092" style="color:var(--accent)">WhatsApp</a>. ¡Éxito! 🤝',
      a_en: 'You are very welcome! 🙌 Remember you can apply for your <a href="#contacto" style="color:var(--accent)">free 360° diagnosis</a> or text us on <a href="https://wa.me/18298068092" style="color:var(--accent)">WhatsApp</a>. Great success! 🤝'
    },
    {
      k: ['podcast', 'video', 'media', 'contenido'],
      a: '🎬 ¡Contenido de alto valor listo! Mira nuestro video corporativo *"Crecimiento Imparable"* y el podcast *"Pretotipado"* en la <a href="media.html" style="color:var(--accent)">página de Media →</a>.',
      a_en: '🎬 High-value content ready! Watch our video *"Unstoppable Growth"* or listen to the *"Pretotyping"* podcast on our <a href="media.html" style="color:var(--accent)">Media Page →</a>.'
    },
    {
      k: ['nosotros', 'about', 'historia', 'quienes son', 'quienes somos'],
      a: '🏢 Nacimos en Santo Domingo para estructurar, blindar y acelerar MIPYMEs dominicanas. Conoce nuestro Canvas de negocio y tesis en la <a href="nosotros.html" style="color:var(--accent)">página de Nosotros →</a>.',
      a_en: '🏢 We were founded in Santo Domingo to structure, shield, and scale local MSMEs. Check out our Business Canvas on our <a href="nosotros.html" style="color:var(--accent)">About Us Page →</a>.'
    },
    {
      k: ['horario', 'hora', 'tiempo', 'cuanto tarda', 'plazo', 'demora', 'timeline', 'how long'],
      a: '⏱️ ¡Prometemos agilidad extrema! 📦 **Básico**: 1-3 semanas | 📊 **Avanzado**: 3-4 semanas | ⭐ **Premium**: 4-6 semanas de setup inicial.',
      a_en: '⏱️ Agile delivery: 📦 **Basic**: 1-3 weeks | 📊 **Advanced**: 3-4 weeks | ⭐ **Premium**: 4-6 weeks setup.'
    },
    {
      k: ['funnel', 'embudo', 'captación', 'captacion', 'cómo captan', 'como captan', 'clientes'],
      a: '📊 Nuestro embudo tiene 4 pasos: atracción con contenido de valor, consideración vía diagnóstico gratis, conversión con propuesta a medida y fidelización con resultados. ¡Estructuramos el mismo sistema en tu empresa!',
      a_en: '📊 Our funnel: attract via content, consider via free diagnosis, convert with custom proposal, retain through sales results. We build this exact system for your business!'
    },
    {
      k: ['colmado', 'ferretería', 'ferreteria', 'salón', 'salon', 'belleza', 'odontol', 'colegio', 'caso', 'ejemplo', 'case'],
      a: '🏪 Trabajamos en todos los sectores: desde colmados y ferreterías (formalización y créditos) hasta clínicas de estética, colegios y empresas de servicios B2B (automatización y licitaciones).',
      a_en: '🏪 We work across all sectors: minimarkets/hardware stores (legal & credit setups), salons/medical clinics, and B2B services (automations & government bids).'
    },
    {
      k: ['trabaj', 'carrera', 'career', 'empleo', 'vacante', 'job', 'colabor', 'contratar', 'reclutar'],
      a: '🚀 ¡Buscamos talentos dominicanos independientes! Si dominas derecho corporativo, finanzas, marketing o IA, postúlate en la <a href="carreras.html" style="color:var(--accent)">página de Carreras →</a>.',
      a_en: '🚀 We seek freelance Dominican talent! If you specialize in corporate law, finance, digital marketing, or IA, apply on our <a href="carreras.html" style="color:var(--accent)">Careers Page →</a>.'
    },
    {
      k: ['sop', 'proceso', 'calidad', 'estándar', 'estandar', 'quality', 'standard'],
      a: '✅ Calidad garantizada: cada entregable pasa por checklists de cero errores críticos y opera bajo estrictos acuerdos de confidencialidad (NDA).',
      a_en: '✅ Guaranteed quality: every deliverable goes through a zero-critical-error checklist and operates under strict NDA security.'
    }
  ];

  const defaultReplies_es = ['🤓 ¡Excelente pregunta! Para darte la respuesta exacta para tu caso, te recomiendo agendar un <a href="#contacto" style="color:var(--accent)">diagnóstico 360° gratuito</a> en menos de 30 minutos.'];
  const defaultReplies_en = ['🤓 Great question! For the most accurate answer tailored to your case, I highly recommend booking a <a href="#contacto" style="color:var(--accent)">free 360° diagnosis</a>.'];

  const quickButtons_es = ['¿Qué servicios ofrecen?', '¿Cuánto cuesta?', 'Diagnóstico gratis', 'Contacto'];
  const quickButtons_en = ['What services do you offer?', 'How much does it cost?', 'Free diagnosis', 'Contact'];

  function saveHistory() {
    localStorage.setItem('rcp-chat-history', JSON.stringify(history));
    localStorage.setItem('rcp-chat-last-active', Date.now().toString());
  }

  function checkSession() {
    const lastActive = parseInt(localStorage.getItem('rcp-chat-last-active') || '0');
    const elapsed = Date.now() - lastActive;
    if (elapsed > 15 * 60 * 1000) {
      localStorage.removeItem('rcp-chat-history');
      localStorage.removeItem('rcp-chat-last-active');
      localStorage.removeItem('rcp-chat-open');
      history = [];
    } else {
      history = JSON.parse(localStorage.getItem('rcp-chat-history') || '[]');
    }
  }

  function formatMarkdown(str) {
    if (!str) return '';
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>');
  }

  function addMessage(text, type = 'bot', save = true) {
    const div = document.createElement('div');
    div.className = 'chat-msg ' + type;
    const formatted = formatMarkdown(text);
    div.innerHTML = formatted;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (save) {
      history.push({ text: formatted, type });
      saveHistory();
    }
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
        bestAnswer = (isEN && item.a_en) ? item.a_en : item.a;
      }
    }

    if (bestAnswer) return bestAnswer;
    const defaults = isEN ? defaultReplies_en : defaultReplies_es;
    return defaults[Math.floor(Math.random() * defaults.length)];
  }

  function handleUserInput(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatInput.value = '';

    localStorage.setItem('rcp-chat-last-active', Date.now().toString());

    // ─── GUARDRAIL: Block confidential infrastructure queries ───
    if (isConfidentialQuery(text)) {
      const isEN = document.documentElement.lang === 'en';
      setTimeout(() => {
        addMessage(isEN ? GUARDRAIL_RESPONSE_EN : GUARDRAIL_RESPONSE_ES);
      }, 300);
      return; // No network call made
    }
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-msg bot chat-typing';
    typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Try the AI backend first, fall back to local FAQ
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch(RCP_CHATBOT_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, lang: document.documentElement.lang || 'es' }),
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
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
    .catch(() => {
      clearTimeout(timeoutId);
      setTimeout(() => {
        typingDiv.remove();
        addMessage(getReply(text));
      }, 400);
    });
  }

  function openChat(focus = true) {
    chatPanel.classList.add('open');
    isOpen = true;
    localStorage.setItem('rcp-chat-open', 'true');
    
    checkSession();

    if (history.length === 0) {
      const isEN = document.documentElement.lang === 'en';
      addMessage(isEN ? GREETING_EN : GREETING_ES, 'bot');
      addQuickButtons();
    } else {
      if (!chatMessages.hasChildNodes()) {
        history.forEach(msg => {
          const div = document.createElement('div');
          div.className = 'chat-msg ' + msg.type;
          div.innerHTML = formatMarkdown(msg.text);
          chatMessages.appendChild(div);
        });
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }

    if (focus) {
      setTimeout(() => chatInput.focus(), 400);
    }
  }

  function closeChat() {
    chatPanel.classList.remove('open');
    isOpen = false;
    localStorage.setItem('rcp-chat-open', 'false');
  }

  chatbotBtn.addEventListener('click', () => {
    if (isOpen) closeChat(); else openChat();
  });

  chatClose.addEventListener('click', closeChat);

  chatSend.addEventListener('click', () => handleUserInput(chatInput.value));
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleUserInput(chatInput.value);
  });

  const lastActive = parseInt(localStorage.getItem('rcp-chat-last-active') || '0');
  const elapsed = Date.now() - lastActive;
  const wasOpen = localStorage.getItem('rcp-chat-open') === 'true';

  if (wasOpen && elapsed < 15 * 60 * 1000) {
    openChat(false);
  }

  window.rcpChatbot = {
    openChat: openChat,
    handleSearch: function(query) {
      if (!isOpen) openChat(true);
      setTimeout(() => {
        chatInput.value = query;
        handleUserInput(query);
      }, 500);
    }
  };
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

// ═══════════════════════════════════════════════
// CATALOGO DE SERVICIOS INTERACTIVO & CALENDARIO
// ═══════════════════════════════════════════════
(function() {
  const stageButtons = document.querySelectorAll('.filter-pill');
  if (stageButtons.length > 0) {
    stageButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        stageButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const stage = btn.dataset.stage;
        
        document.querySelectorAll('.package-detail-card').forEach(card => {
          card.classList.remove('featured');
          const badge = card.querySelector('.featured-badge');
          if (badge) badge.remove();
        });
        
        let recommendedCardId = 'pkg-basico';
        if (stage === 'growth') recommendedCardId = 'pkg-avanzado';
        else if (stage === 'leader') recommendedCardId = 'pkg-premium';
        
        const recCard = document.getElementById(recommendedCardId);
        if (recCard) {
          recCard.classList.add('featured');
          
          const badge = document.createElement('div');
          badge.className = 'featured-badge';
          badge.textContent = document.documentElement.lang === 'en' ? '⭐ RECOMMENDED' : '⭐ RECOMENDADO';
          recCard.querySelector('.pkg-header').prepend(badge);
          
          recCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  const blockTabBtns = document.querySelectorAll('.block-tab-btn');
  const blockGrids = document.querySelectorAll('.blocks-grid');
  if (blockTabBtns.length > 0) {
    blockTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blockTabBtns.forEach(b => b.classList.remove('active'));
        blockGrids.forEach(g => g.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.cat;
        document.getElementById('cat-' + cat).classList.add('active');
      });
    });
  }

  let cart = [];
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSetupTotal = document.getElementById('cartSetupTotal');
  const cartMonthlyTotal = document.getElementById('cartMonthlyTotal');
  const btnCartCheckout = document.getElementById('btnCartCheckout');
  const addCartButtons = document.querySelectorAll('.btn-add-cart');

  function updateCartUI() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    
    if (cart.length === 0) {
      cartItemsList.innerHTML = `<div class="cart-empty-msg" data-i18n="cart-empty">${document.documentElement.lang === 'en' ? 'Select blocks on the left to build your quote.' : 'Selecciona bloques a la izquierda para armar tu cotización.'}</div>`;
      cartSetupTotal.textContent = 'RD$ 0';
      cartMonthlyTotal.textContent = 'RD$ 0 /mes';
      btnCartCheckout.classList.add('btn-disabled');
      btnCartCheckout.disabled = true;
      return;
    }

    let minSetup = 0, maxSetup = 0;
    let minMonthly = 0, maxMonthly = 0;

    cart.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'cart-item';
      
      const nameSpan = document.createElement('span');
      nameSpan.className = 'cart-item-name';
      nameSpan.textContent = item.name;
      
      const priceSpan = document.createElement('span');
      priceSpan.className = 'cart-item-price';
      
      if (item.recurring) {
        priceSpan.textContent = `RD$ ${item.min.toLocaleString()} - ${item.max.toLocaleString()}/m`;
        minMonthly += item.min;
        maxMonthly += item.max;
      } else {
        priceSpan.textContent = `RD$ ${item.min.toLocaleString()} - ${item.max.toLocaleString()}`;
        minSetup += item.min;
        maxSetup += item.max;
      }

      const removeBtn = document.createElement('button');
      removeBtn.className = 'btn-remove-cart';
      removeBtn.innerHTML = '&times;';
      removeBtn.addEventListener('click', () => {
        removeFromCart(item.id);
      });

      itemDiv.appendChild(nameSpan);
      itemDiv.appendChild(priceSpan);
      itemDiv.appendChild(removeBtn);
      cartItemsList.appendChild(itemDiv);
    });

    cartSetupTotal.textContent = `RD$ ${minSetup.toLocaleString()} - ${maxSetup.toLocaleString()}`;
    cartMonthlyTotal.textContent = `RD$ ${minMonthly.toLocaleString()} - ${maxMonthly.toLocaleString()} /mes`;
    btnCartCheckout.classList.remove('btn-disabled');
    btnCartCheckout.disabled = false;
  }

  function addToCart(id, name, min, max, recurring) {
    if (cart.some(item => item.id === id)) return;
    cart.push({ id, name, min, max, recurring });
    const btn = document.querySelector(`.btn-add-cart[data-id="${id}"]`);
    if (btn) {
      btn.classList.add('added');
    }
    updateCartUI();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    const btn = document.querySelector(`.btn-add-cart[data-id="${id}"]`);
    if (btn) {
      btn.classList.remove('added');
    }
    updateCartUI();
  }

  if (addCartButtons.length > 0) {
    addCartButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        const min = parseInt(btn.dataset.min, 10);
        const max = parseInt(btn.dataset.max, 10);
        const recurring = btn.dataset.recurring === 'true';

        if (btn.classList.contains('added')) {
          removeFromCart(id);
        } else {
          addToCart(id, name, min, max, recurring);
        }
      });
    });
  }

  if (btnCartCheckout) {
    btnCartCheckout.addEventListener('click', () => {
      window.location.href = 'onboarding.html';
    });
  }

  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');
  const calendarMonthYearLabel = document.getElementById('calendarMonthYearLabel');
  const calendarDaysGrid = document.getElementById('calendarDaysGrid');
  const slotsGrid = document.getElementById('slotsGrid');
  
  let currentBookingDate = new Date();
  let selectedDateString = null;
  let selectedTimeSlot = null;

  const monthsES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const monthsEN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function renderCalendar() {
    if (!calendarDaysGrid) return;
    calendarDaysGrid.innerHTML = '';
    
    const year = currentBookingDate.getFullYear();
    const month = currentBookingDate.getMonth();
    
    const isEN = document.documentElement.lang === 'en';
    calendarMonthYearLabel.textContent = `${isEN ? monthsEN[month] : monthsES[month]} ${year}`;
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDayDate = new Date(year, month + 1, 0).getDate();
    const prevLastDayDate = new Date(year, month, 0).getDate();
    
    for (let x = firstDayIndex; x > 0; x--) {
      const span = document.createElement('span');
      span.className = 'disabled prev-month';
      span.textContent = prevLastDayDate - x + 1;
      calendarDaysGrid.appendChild(span);
    }
    
    const today = new Date();
    for (let i = 1; i <= lastDayDate; i++) {
      const span = document.createElement('span');
      const checkDate = new Date(year, month, i);
      
      const dayOfWeek = checkDate.getDay();
      const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);
      
      const diffTime = checkDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isPastOrTooFar = (diffDays < 0 || diffDays > 30);
      
      span.textContent = i;
      
      if (checkDate.toDateString() === today.toDateString()) {
        span.classList.add('today');
      }
      
      if (isWeekend || isPastOrTooFar) {
        span.classList.add('disabled');
      } else {
        const dateString = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;
        span.dataset.date = dateString;
        
        if (selectedDateString === dateString) {
          span.classList.add('active');
        }
        
        span.addEventListener('click', () => {
          document.querySelectorAll('#calendarDaysGrid span').forEach(s => s.classList.remove('active'));
          span.classList.add('active');
          selectedDateString = dateString;
          selectedTimeSlot = null;
          generateTimeSlots(checkDate);
        });
      }
      calendarDaysGrid.appendChild(span);
    }
  }

  function generateTimeSlots(date) {
    if (!slotsGrid) return;
    slotsGrid.innerHTML = '';
    
    const isEN = document.documentElement.lang === 'en';
    
    const slots = [
      "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
      "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
    ];
    
    slots.forEach(slot => {
      const span = document.createElement('span');
      span.textContent = slot;
      
      const isBusy = (Math.random() < 0.25);
      if (isBusy) {
        span.classList.add('disabled');
        span.textContent += isEN ? ' (Busy)' : ' (Ocupado)';
      } else {
        span.addEventListener('click', () => {
          document.querySelectorAll('#slotsGrid span').forEach(s => s.classList.remove('active'));
          span.classList.add('active');
          selectedTimeSlot = slot;
          proceedToBookingStep2();
        });
      }
      slotsGrid.appendChild(span);
    });
  }

  function proceedToBookingStep2() {
    const bookingStep1 = document.getElementById('bookingStep1');
    const bookingStep2 = document.getElementById('bookingStep2');
    const selectedSlotSummary = document.getElementById('selectedSlotSummary');
    
    if (!bookingStep1 || !bookingStep2) return;
    
    bookingStep1.style.display = 'none';
    bookingStep2.style.display = 'block';
    
    const isEN = document.documentElement.lang === 'en';
    const dateObj = new Date(selectedDateString + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString(isEN ? 'en-US' : 'es-DO', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    
    selectedSlotSummary.innerHTML = `
      <p>📅 <strong>${formattedDate}</strong></p>
      <p>⏱️ <strong>${selectedTimeSlot} - ${getEndTime(selectedTimeSlot)} (AST)</strong></p>
    `;
  }

  function getEndTime(timeStr) {
    if (timeStr.includes("09:00")) return "09:45 AM";
    if (timeStr.includes("10:00")) return "10:45 AM";
    if (timeStr.includes("11:00")) return "11:45 AM";
    if (timeStr.includes("12:00")) return "12:45 PM";
    if (timeStr.includes("02:00")) return "02:45 PM";
    if (timeStr.includes("03:00")) return "03:45 PM";
    if (timeStr.includes("04:00")) return "04:45 PM";
    if (timeStr.includes("05:00")) return "05:45 PM";
    return "45 Minutos";
  }

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener('click', () => {
      currentBookingDate.setMonth(currentBookingDate.getMonth() - 1);
      renderCalendar();
    });
  }
  if (nextMonthBtn) {
    nextMonthBtn.addEventListener('click', () => {
      currentBookingDate.setMonth(currentBookingDate.getMonth() + 1);
      renderCalendar();
    });
  }

  const btnBackToStep1 = document.getElementById('btnBackToStep1');
  if (btnBackToStep1) {
    btnBackToStep1.addEventListener('click', () => {
      document.getElementById('bookingStep2').style.display = 'none';
      document.getElementById('bookingStep1').style.display = 'block';
    });
  }

  if (calendarDaysGrid) {
    renderCalendar();
  }

  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btnConfirm = document.getElementById('btnConfirmBooking');
      btnConfirm.textContent = document.documentElement.lang === 'en' ? 'Scheduling...' : 'Agendando...';
      btnConfirm.disabled = true;

      const name = document.getElementById('schedName').value;
      const email = document.getElementById('schedEmail').value;
      const phone = document.getElementById('schedPhone').value;
      const company = document.getElementById('schedCompany').value;
      const message = document.getElementById('schedMessage').value;

      const isEN = document.documentElement.lang === 'en';
      const dateObj = new Date(selectedDateString + 'T00:00:00');
      const formattedDate = dateObj.toLocaleDateString(isEN ? 'en-US' : 'es-DO', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });

      const randomId = Math.random().toString(36).substring(2, 5) + '-' + Math.random().toString(36).substring(2, 6) + '-' + Math.random().toString(36).substring(2, 5);
      const meetLink = `https://meet.google.com/${randomId}`;

      const bookingPayload = {
        user_name: name,
        user_email: email,
        user_phone: phone,
        user_company: company,
        user_service: 'Diagnóstico 360°',
        user_message: `Cita agendada para: ${formattedDate} a las ${selectedTimeSlot}. Dolor principal: ${message}`,
        lead_source: 'Google Calendar Widget',
        appointment_date: selectedDateString,
        appointment_time: selectedTimeSlot,
        meet_link: meetLink
      };

      const bookingTimestamp = Date.now().toString();
      const bookingPayloadString = JSON.stringify(bookingPayload);
      const bookingSignature = await signPayload(bookingPayloadString, bookingTimestamp);

      const leadPipelineCall = fetch(RCP_LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-RCP-Timestamp': bookingTimestamp,
          'X-RCP-Signature': bookingSignature
        },
        body: bookingPayloadString
      });

      const randomCode = 'RCP-' + Math.floor(1000 + Math.random() * 9000);
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(randomCode));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const diagnosticoObj = {
        appointment_date: selectedDateString,
        appointment_time: selectedTimeSlot,
        meet_link: meetLink,
        challenges: message,
        created_at: new Date().toISOString()
      };

      const isLocal = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);
      const supabaseUrl = isLocal ? 'http://127.0.0.1:54321' : 'https://wpfovxgbennpgydbellw.supabase.co';
      const supabaseKey = isLocal ? 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' : 'sb_publishable_wQHzaXkyhbfuOdDkMAWAKQ_VOE14bfO';
      let supabase = null;
      try {
        if (window.supabase) {
          supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
        }
      } catch (e) {
        console.error("Error initializing Supabase client:", e);
      }

      let supabasePromise = Promise.resolve();
      if (supabase) {
        supabasePromise = (async () => {
          try {
            const { data: existingClient, error: selectError } = await supabase
              .rpc('verificar_existencia_cliente', { p_email: email })
              .maybeSingle();

            if (selectError) throw selectError;

            if (existingClient) {
              const updatePayload = {
                diagnostico_360: diagnosticoObj
              };
              if (existingClient.status === 'pending_activation') {
                updatePayload.access_code = randomCode;
                updatePayload.access_code_hash = hashHex;
                updatePayload.company_name = company;
                updatePayload.owner_name = name;
                updatePayload.phone = phone;
              }
              const { error: updateError } = await supabase
                .from('clientes')
                .update(updatePayload)
                .eq('id', existingClient.id);

              if (updateError) throw updateError;
            } else {
            const newClient = {
                email: email,
                owner_name: name,
                company_name: company,
                legal_id: 'RNC-Pendiente',
                address: 'Pendiente',
                status: 'pending_activation',
                access_code: randomCode,
                access_code_hash: hashHex,
                diagnostico_360: diagnosticoObj,
                ventas: 0,
                ventas_trend: '▲ +0%',
                cpl: 0,
                cpl_trend: '▼ -0%',
                roas: 0.0,
                roas_trend: '▲ +0x',
                ltv: 0,
                ltv_trend: '▲ +0%',
                tramite_onapi: 0,
                tramite_camara: 0,
                tramite_dgii: 0,
                chart_data: [0, 0, 0, 0, 0, 0, 0],
                pagos: []
            };
              const { error: insertError } = await supabase
                .from('clientes')
                .insert([newClient]);

              if (insertError) throw insertError;
            }
          } catch (dbErr) {
            console.error("Error saving client booking in Supabase:", dbErr);
          }
        })();
      }

      Promise.allSettled([leadPipelineCall, supabasePromise])
        .then(() => {
          document.getElementById('bookingStep2').style.display = 'none';
          const step3 = document.getElementById('bookingStep3');
          step3.style.display = 'block';
          
          document.getElementById('successDate').textContent = formattedDate;
          document.getElementById('successTime').textContent = `${selectedTimeSlot} - ${getEndTime(selectedTimeSlot)} (AST)`;
          
          document.getElementById('successMeetLink').href = meetLink;
          document.getElementById('successMeetLink').textContent = meetLink;

          btnConfirm.textContent = isEN ? 'Confirm 360° Diagnosis' : 'Confirmar Diagnóstico 360°';
          btnConfirm.disabled = false;
        });
    });
  }

  const btnBookingReset = document.getElementById('btnBookingReset');
  if (btnBookingReset) {
    btnBookingReset.addEventListener('click', () => {
      document.getElementById('bookingStep3').style.display = 'none';
      document.getElementById('bookingStep1').style.display = 'block';
      selectedDateString = null;
      selectedTimeSlot = null;
      if (bookingForm) bookingForm.reset();
      renderCalendar();
      if (slotsGrid) {
        slotsGrid.innerHTML = `<p class="slots-empty-msg" data-i18n="sched-select-day-first">${document.documentElement.lang === 'en' ? 'Select a working day on the calendar to see available slots.' : 'Selecciona un día laboral en el calendario para ver los horarios.'}</p>`;
      }
    });
  }
})();

// ─── PWA SERVICE WORKER REGISTRATION ───
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then((reg) => console.log('[PWA] Service Worker registered successfully:', reg.scope))
      .catch((err) => console.warn('[PWA] Service Worker registration failed:', err));
  });
}


// ═══════════════════════════════════════════════
// GLOBAL SEARCH LINKED TO CHATBOT
// ═══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const searchContainers = document.querySelectorAll('.search-container');
  
  searchContainers.forEach(container => {
    const searchBtn = container.querySelector('.search-btn');
    const searchInput = container.querySelector('.search-input');
    
    if(!searchBtn || !searchInput) return;
    
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!container.classList.contains('active')) {
        container.classList.add('active');
        setTimeout(() => searchInput.focus(), 100);
      } else {
        const val = searchInput.value.trim();
        if (val) {
          if (window.rcpChatbot) {
            window.rcpChatbot.handleSearch(val);
          }
          searchInput.value = '';
          container.classList.remove('active');
        } else {
          container.classList.remove('active');
        }
      }
    });
    
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = searchInput.value.trim();
        if (val) {
          if (window.rcpChatbot) {
            window.rcpChatbot.handleSearch(val);
          }
          searchInput.value = '';
          container.classList.remove('active');
        }
      }
    });
    
    // close on click outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('active');
      }
    });
  });
});

// ═══════════════════════════════════════════════
// GUIDED TOUR — SMART & NON-INTRUSIVE
// ═══════════════════════════════════════════════
(function () {
  const tourButton = document.getElementById('tourButton');
  const tourOverlay = document.getElementById('tourOverlay');
  const tourHighlight = document.getElementById('tourHighlight');
  const tourTooltip = document.getElementById('tourTooltip');
  const tourTitle = document.getElementById('tourTitle');
  const tourContent = document.getElementById('tourContent');
  const tourProgress = document.getElementById('tourProgress');
  const tourNext = document.getElementById('tourNext');
  const tourPrev = document.getElementById('tourPrev');
  const tourClose = document.getElementById('tourClose');

  if (!tourButton || !tourOverlay) return;

  const isEN = () => document.documentElement.lang === 'en';

  // Tour steps — targeting SPECIFIC compact elements, not whole sections
  const tourSteps = {
    es: [
      {
        target: '.hero-title',
        title: '¡Bienvenido a RCP Services! 🐆',
        content: 'Somos tu Junta Directiva Externa. Centralizamos finanzas, legalidad y marketing en un solo ecosistema 360°.'
      },
      {
        target: '.problema .cards-grid',
        title: 'El problema que resolvemos',
        content: 'El 98.5% de las MIPYMEs dominicanas sufren arritmia empresarial. Aquí identificamos los 3 síntomas principales.'
      },
      {
        target: '.tabs .tab-buttons',
        title: 'Nuestra solución: R·C·P',
        content: 'Renovación, Consultoría y Publicidad 360°. Explora cada pilar haciendo clic en las pestañas.'
      },
      {
        target: '.eco-compare',
        title: 'El Ecosistema Soberano',
        content: 'Tu empresa tendrá un núcleo digital privado con $0 en software de terceros. Compara el modelo tradicional vs. el nuestro.'
      },
      {
        target: '.pricing-grid',
        title: 'Elige tu plan',
        content: 'Básico para empezar, Avanzado para crecer, Premium para liderar. Cada plan es una etapa de transformación.'
      },
      {
        target: '#contactForm',
        title: '¡Diagnóstico 360° Gratis!',
        content: 'Completa el formulario y te contactamos en menos de 24 horas con un análisis personalizado de tu empresa.',
        isLast: true
      }
    ],
    en: [
      {
        target: '.hero-title',
        title: 'Welcome to RCP Services! 🐆',
        content: 'We are your External Board of Directors. We centralize finance, legal, and marketing into one 360° ecosystem.'
      },
      {
        target: '.problema .cards-grid',
        title: 'The problem we solve',
        content: '98.5% of Dominican MSMEs suffer from business arrhythmia. Here we identify the 3 main symptoms.'
      },
      {
        target: '.tabs .tab-buttons',
        title: 'Our solution: R·C·P',
        content: 'Revitalization, Consulting, and 360° Promotion. Explore each pillar by clicking the tabs.'
      },
      {
        target: '.eco-compare',
        title: 'The Sovereign Ecosystem',
        content: 'Your business will have a private digital core with $0 in third-party software. Compare traditional vs. our model.'
      },
      {
        target: '.pricing-grid',
        title: 'Choose your plan',
        content: 'Basic to start, Advanced to grow, Premium to lead. Each plan is a transformation stage.'
      },
      {
        target: '#contactForm',
        title: 'Free 360° Diagnosis!',
        content: 'Fill out the form and we\'ll contact you within 24 hours with a personalized analysis of your business.',
        isLast: true
      }
    ]
  };

  let currentStep = 0;
  let isTourActive = false;

  function getSteps() {
    return isEN() ? tourSteps.en : tourSteps.es;
  }

  function renderProgress() {
    const steps = getSteps();
    tourProgress.innerHTML = steps.map((_, index) => 
      `<div class="tour-progress-dot ${index === currentStep ? 'active' : ''}"></div>`
    ).join('');
  }

  function positionTooltip(targetRect) {
    // Reset position to measure accurately
    tourTooltip.style.top = '0';
    tourTooltip.style.left = '0';
    
    requestAnimationFrame(() => {
      const tooltipRect = tourTooltip.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      
      // Prefer below the element
      let top = targetRect.bottom + 16;
      let left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);

      // If below goes off-screen, place above
      if (top + tooltipRect.height > viewportH - 20) {
        top = targetRect.top - tooltipRect.height - 16;
      }
      // If still off-screen (element too tall), place at center
      if (top < 20) {
        top = Math.max(20, (viewportH - tooltipRect.height) / 2);
      }

      // Horizontal bounds
      left = Math.max(16, Math.min(left, viewportW - tooltipRect.width - 16));

      tourTooltip.style.top = `${top}px`;
      tourTooltip.style.left = `${left}px`;
    });
  }

  function showStep() {
    const steps = getSteps();
    const step = steps[currentStep];
    const target = document.querySelector(step.target);

    if (!target) {
      if (currentStep < steps.length - 1) { currentStep++; showStep(); }
      else endTour();
      return;
    }

    // Scroll element into view with padding
    const targetRect = target.getBoundingClientRect();
    const scrollTop = window.scrollY + targetRect.top - (window.innerHeight * 0.3);
    window.scrollTo({ top: Math.max(0, scrollTop), behavior: 'smooth' });

    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      
      // Highlight — constrain to element, not the entire section
      tourHighlight.style.top = `${rect.top + window.scrollY - 8}px`;
      tourHighlight.style.left = `${rect.left - 8}px`;
      tourHighlight.style.width = `${rect.width + 16}px`;
      tourHighlight.style.height = `${Math.min(rect.height + 16, window.innerHeight * 0.6)}px`;

      // Tooltip content
      tourTitle.textContent = step.title;
      tourContent.textContent = step.content;
      tourNext.textContent = step.isLast 
        ? (isEN() ? 'Finish' : 'Finalizar') 
        : (isEN() ? 'Next' : 'Siguiente');
      tourPrev.textContent = isEN() ? 'Previous' : 'Anterior';
      tourPrev.style.display = currentStep === 0 ? 'none' : '';

      renderProgress();
      setTimeout(() => positionTooltip(rect), 150);
    }, 600);
  }

  function startTour() {
    currentStep = 0;
    isTourActive = true;
    tourOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    showStep();
  }

  function endTour() {
    isTourActive = false;
    tourOverlay.classList.remove('active');
    document.body.style.overflow = '';
    localStorage.setItem('rcp-tour-completed', 'true');
  }

  // Event listeners
  tourButton.addEventListener('click', startTour);
  tourClose.addEventListener('click', endTour);

  tourNext.addEventListener('click', () => {
    const steps = getSteps();
    if (currentStep < steps.length - 1) {
      currentStep++;
      document.body.style.overflow = '';
      showStep();
      setTimeout(() => { document.body.style.overflow = 'hidden'; }, 700);
    } else {
      endTour();
      // Scroll to contact after tour ends
      const contactSection = document.getElementById('contacto');
      if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  tourPrev.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      document.body.style.overflow = '';
      showStep();
      setTimeout(() => { document.body.style.overflow = 'hidden'; }, 700);
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!isTourActive) return;
    if (e.key === 'Escape') endTour();
    if (e.key === 'ArrowRight') tourNext.click();
    if (e.key === 'ArrowLeft') tourPrev.click();
  });

  // Click overlay to close
  tourOverlay.addEventListener('click', (e) => {
    if (e.target === tourOverlay) endTour();
  });

  // Update tour button text based on language and completion
  function updateTourButton() {
    const completed = localStorage.getItem('rcp-tour-completed') === 'true';
    if (completed) {
      tourButton.innerHTML = isEN() 
        ? '<span>🔄</span><span>Tour again</span>' 
        : '<span>🔄</span><span>Recorrer de nuevo</span>';
    } else {
      tourButton.innerHTML = isEN() 
        ? '<span>🚀</span><span>Quick Tour</span>' 
        : '<span>🚀</span><span>Tour Rápido</span>';
    }
  }
  updateTourButton();

  // Listen for language changes
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', updateTourButton);
  }
})();

// ═══════════════════════════════════════════════
// SMART SCROLL INDICATOR (replaces broken next-section buttons)
// Single floating arrow that shows contextually and hides at bottom
// ═══════════════════════════════════════════════
(function () {
  // Define the page flow
  const sectionFlow = ['inicio', 'problema', 'solucion', 'ecosistema', 'paquetes', 'trust', 'contacto'];
  
  // Create a single scroll indicator
  const indicator = document.createElement('a');
  indicator.className = 'scroll-indicator';
  indicator.setAttribute('aria-label', 'Siguiente sección');
  indicator.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  `;
  document.body.appendChild(indicator);

  let currentSectionIndex = 0;
  let isVisible = false;
  let hideTimeout = null;

  function updateIndicator() {
    const scrollY = window.scrollY;
    const viewportH = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    
    // Hide if near bottom (within 200px of the end)
    if (scrollY + viewportH >= docH - 200) {
      hideIndicator();
      return;
    }
    
    // Hide if user hasn't scrolled at all (let them explore hero first)
    if (scrollY < 100) {
      showIndicator();
    }

    // Find current section
    let foundIndex = 0;
    for (let i = sectionFlow.length - 1; i >= 0; i--) {
      const el = document.getElementById(sectionFlow[i]);
      if (el && el.getBoundingClientRect().top <= viewportH * 0.5) {
        foundIndex = i;
        break;
      }
    }
    currentSectionIndex = foundIndex;

    // Point to next section
    const nextIndex = Math.min(currentSectionIndex + 1, sectionFlow.length - 1);
    if (nextIndex === currentSectionIndex) {
      hideIndicator();
      return;
    }

    indicator.href = `#${sectionFlow[nextIndex]}`;
    showIndicator();
  }

  function showIndicator() {
    if (isVisible) return;
    isVisible = true;
    indicator.classList.add('visible');
    // Auto-hide after 4 seconds of inactivity
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hideIndicator, 4000);
  }

  function hideIndicator() {
    if (!isVisible) return;
    isVisible = false;
    indicator.classList.remove('visible');
  }

  // Throttled scroll handler
  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        updateIndicator();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
    // Reset auto-hide timer on scroll
    if (isVisible) {
      clearTimeout(hideTimeout);
      hideTimeout = setTimeout(hideIndicator, 4000);
    }
  });

  // Show on initial load
  setTimeout(updateIndicator, 2000);

  // Smooth scroll on click
  indicator.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(indicator.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
})();



// ═══════════════════════════════════════════════
// COOKIE CONSENT MANAGEMENT + GA4 AUTO-TRACKING
// ═══════════════════════════════════════════════
(function() {
  const COOKIE_KEY = 'rcp-cookie-consent';
  const banner = document.getElementById('cookieBanner');
  const detailsPanel = document.getElementById('cookieDetails');
  const btnAccept = document.getElementById('cookieAccept');
  const btnReject = document.getElementById('cookieReject');
  const btnMoreInfo = document.getElementById('cookieMoreInfo');
  const btnDetailsClose = document.getElementById('cookieDetailsClose');
  const btnSavePrefs = document.getElementById('cookieSavePrefs');
  const chkAnalytics = document.getElementById('cookieAnalytics');
  const chkMarketing = document.getElementById('cookieMarketing');

  if (!banner) return;

  // ─── UTILITIES ───
  function getConsent() {
    try {
      const stored = localStorage.getItem(COOKIE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) { return null; }
  }

  function saveConsent(consent) {
    consent.timestamp = new Date().toISOString();
    consent.version = '1.0';
    localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
  }

  function showBanner() {
    banner.setAttribute('aria-hidden', 'false');
    banner.classList.add('visible');
  }

  function hideBanner() {
    banner.classList.remove('visible');
    banner.setAttribute('aria-hidden', 'true');
  }

  function showDetails() {
    detailsPanel.classList.add('visible');
    detailsPanel.setAttribute('aria-hidden', 'false');
  }

  function hideDetails() {
    detailsPanel.classList.remove('visible');
    detailsPanel.setAttribute('aria-hidden', 'true');
  }

  // ─── APPLY CONSENT TO GA4 ───
  function applyConsent(consent) {
    if (typeof gtag !== 'function') return;

    gtag('consent', 'update', {
      'analytics_storage': consent.analytics ? 'granted' : 'denied',
      'ad_storage': consent.marketing ? 'granted' : 'denied',
      'ad_user_data': consent.marketing ? 'granted' : 'denied',
      'ad_personalization': consent.marketing ? 'granted' : 'denied'
    });

    // Enviar page_view si analytics está habilitado
    if (consent.analytics) {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname
      });
    }
  }

  // ─── EVENT HANDLERS ───
  function handleAcceptAll() {
    const consent = { analytics: true, marketing: true, essential: true };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
    hideDetails();
    initAutoTracking();
  }

  function handleRejectAll() {
    const consent = { analytics: false, marketing: false, essential: true };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
    hideDetails();
  }

  function handleSavePreferences() {
    const consent = {
      analytics: chkAnalytics ? chkAnalytics.checked : false,
      marketing: chkMarketing ? chkMarketing.checked : false,
      essential: true
    };
    saveConsent(consent);
    applyConsent(consent);
    hideBanner();
    hideDetails();
    if (consent.analytics) initAutoTracking();
  }

  // Bind events
  if (btnAccept) btnAccept.addEventListener('click', handleAcceptAll);
  if (btnReject) btnReject.addEventListener('click', handleRejectAll);
  if (btnMoreInfo) btnMoreInfo.addEventListener('click', (e) => { e.preventDefault(); showDetails(); });
  if (btnDetailsClose) btnDetailsClose.addEventListener('click', hideDetails);
  if (btnSavePrefs) btnSavePrefs.addEventListener('click', handleSavePreferences);

  // Close details on backdrop click
  if (detailsPanel) {
    detailsPanel.addEventListener('click', (e) => {
      if (e.target === detailsPanel) hideDetails();
    });
  }

  // ─── INIT: Check existing consent ───
  const existingConsent = getConsent();
  if (existingConsent) {
    // Already consented — apply saved preferences
    applyConsent(existingConsent);
    if (existingConsent.analytics) initAutoTracking();
  } else {
    // No consent yet — show banner after 1.5s delay
    setTimeout(showBanner, 1500);
  }

  // ═══════════════════════════════════════════════
  // GA4 AUTOMATIC EVENT TRACKING
  // Tracks user interactions automatically for analytics
  // ═══════════════════════════════════════════════
  function initAutoTracking() {
    if (typeof gtag !== 'function') return;

    // ─── Track CTA Clicks ───
    document.querySelectorAll('.btn-cta, .btn-outline, .btn-ghost, [data-track]').forEach(el => {
      el.addEventListener('click', function() {
        gtag('event', 'cta_click', {
          'event_category': 'engagement',
          'event_label': this.textContent.trim().substring(0, 50),
          'link_url': this.href || '',
          'link_text': this.textContent.trim().substring(0, 30)
        });
      });
    });

    // ─── Track Form Submissions ───
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', () => {
        const service = contactForm.querySelector('[name="user_service"]');
        gtag('event', 'generate_lead', {
          'event_category': 'conversion',
          'event_label': service ? service.value : 'Diagnóstico 360',
          'value': 1,
          'currency': 'DOP'
        });
      });
    }

    // ─── Track Chatbot Interactions ───
    const chatSend = document.getElementById('chatSend');
    if (chatSend) {
      let chatMessageCount = 0;
      chatSend.addEventListener('click', () => {
        chatMessageCount++;
        gtag('event', 'chatbot_message', {
          'event_category': 'engagement',
          'event_label': 'Pulso Chat',
          'value': chatMessageCount
        });
      });
    }

    // ─── Track Package Interest (Pricing Cards) ───
    document.querySelectorAll('.pricing-card .btn-cta, .pricing-card .btn-outline').forEach(el => {
      el.addEventListener('click', function() {
        const card = this.closest('.pricing-card');
        const tierEl = card ? card.querySelector('.pricing-tier') : null;
        const tier = tierEl ? tierEl.textContent.trim() : 'unknown';
        gtag('event', 'view_item', {
          'event_category': 'ecommerce',
          'event_label': tier,
          'items': [{ 'item_name': tier, 'item_category': 'plan' }]
        });
      });
    });

    // ─── Track Section Visibility (Scroll Depth) ───
    const sections = ['problema', 'solucion', 'ecosistema', 'paquetes', 'contacto'];
    const trackedSections = new Set();
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !trackedSections.has(entry.target.id)) {
          trackedSections.add(entry.target.id);
          gtag('event', 'section_view', {
            'event_category': 'scroll_depth',
            'event_label': entry.target.id
          });
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });

    // ─── Track Language Switch ───
    const langSelect = document.getElementById('langSelect');
    if (langSelect) {
      langSelect.addEventListener('change', function() {
        gtag('event', 'language_switch', {
          'event_category': 'engagement',
          'event_label': this.value
        });
      });
    }

    // ─── Track Theme Toggle ───
    const themeToggle = document.getElementById('themeBtn');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
        gtag('event', 'theme_toggle', {
          'event_category': 'engagement',
          'event_label': currentTheme
        });
      });
    }

    // ─── Track WhatsApp Clicks ───
    document.querySelectorAll('a[href*="wa.me"]').forEach(el => {
      el.addEventListener('click', () => {
        gtag('event', 'contact_whatsapp', {
          'event_category': 'conversion',
          'event_label': 'WhatsApp Click',
          'value': 1
        });
      });
    });

    // ─── Track Phone Calls ───
    document.querySelectorAll('a[href^="tel:"]').forEach(el => {
      el.addEventListener('click', () => {
        gtag('event', 'contact_phone', {
          'event_category': 'conversion',
          'event_label': 'Phone Call Click'
        });
      });
    });

    // ─── Track Time on Page (engagement) ───
    let engagementTime = 0;
    const engagementInterval = setInterval(() => {
      engagementTime += 30;
      if (engagementTime === 60) {
        gtag('event', 'engaged_1min', { 'event_category': 'engagement' });
      } else if (engagementTime === 180) {
        gtag('event', 'engaged_3min', { 'event_category': 'engagement' });
        clearInterval(engagementInterval);
      }
    }, 30000);

    // ─── Track Outbound Links ───
    document.querySelectorAll('a[target="_blank"]').forEach(el => {
      el.addEventListener('click', function() {
        gtag('event', 'outbound_link', {
          'event_category': 'engagement',
          'event_label': this.href
        });
      });
    });
  }
})();
