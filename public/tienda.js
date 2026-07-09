"use strict";
(function(){
// ═══════════════════════════════════════════════
// TIENDA RCP — Dynamic Supabase + Search + Favorites + Cart
// ═══════════════════════════════════════════════

// ─── SUPABASE CONFIG ───
var isLocal = ['localhost', '127.0.0.1', ''].indexOf(window.location.hostname) >= 0;
var SUPABASE_URL = isLocal ? 'http://127.0.0.1:54321' : 'https://wpfovxgbennpgydbellw.supabase.co';
var SUPABASE_KEY = isLocal ? 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' : 'sb_publishable_wQHzaXkyhbfuOdDkMAWAKQ_VOE14bfO';

// Inject loading spinner CSS
(function(){var s=document.createElement('style');s.textContent='.store-loading-spinner{width:40px;height:40px;border:3px solid rgba(252,181,63,0.2);border-top-color:var(--accent,#fcb53f);border-radius:50%;animation:spin .8s linear infinite;margin:0 auto}@keyframes spin{to{transform:rotate(360deg)}}';document.head.appendChild(s);})();

// Product array (loaded from Supabase)
var P = [];
var supabaseLoaded = false;

// ═══════════════════════════════════════════════
// RENDERING + CART + SEARCH + FAVORITES LOGIC
// ═══════════════════════════════════════════════
var WA='18298068092';
var grid=document.getElementById('storeGrid');
var modal=document.getElementById('productModal');
var catBtns=document.querySelectorAll('.store-cat-btn:not(.store-price-btn)');
var activeFilter='all';
var priceFilter='all';
var searchQuery='';
var selected=null;
var cart=[];
var favorites=JSON.parse(localStorage.getItem('rcp_favorites')||'[]');

var catL={'software_preconfigurado':'Software Empresarial','software_custom':'Desarrollo a Medida','imprenta':'Imprenta y Rotulacion','pop_merchandising':'Articulos Corporativos','servicio_renovacion':'Renovacion','servicio_consultoria':'Consultoria','servicio_publicidad':'Marketing Digital'};
var catL_en={'software_preconfigurado':'Business Software','software_custom':'Custom Development','imprenta':'Print & Signage','pop_merchandising':'Corporate Merchandise','servicio_renovacion':'Renovation','servicio_consultoria':'Consulting','servicio_publicidad':'Digital Marketing'};
var typeL={'one_time':'Pago unico','recurring':'/mes','per_unit':'/unidad'};
var typeL_en={'one_time':'One-time','recurring':'/mo','per_unit':'/unit'};

function getLang(){return document.documentElement.lang||'es';}
function isEN(){return getLang()==='en';}
function getCatLabel(cat){return isEN()?(catL_en[cat]||cat):(catL[cat]||cat);}
function getTypeLabel(type){return isEN()?(typeL_en[type]||'One-time'):(typeL[type]||'Pago unico');}

// ─── STATIC CATALOG FALLBACK ───
var STATIC_PRODUCT_CATALOG = [
  { sku: 'SRV-R01', name_es: 'Identidad Visual Básica', name_en: 'Basic Visual Identity', category: 'servicio_renovacion', price_type: 'one_time', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SRV-R02', name_es: 'Rebranding Corporativo Premium', name_en: 'Premium Corporate Rebranding', category: 'servicio_renovacion', price_type: 'one_time', price_min: 40000, delivery_days_min: 14, delivery_days_max: 28, requires_quote: false },
  { sku: 'SRV-R03', name_es: 'Modelado de Procesos y SOPs', name_en: 'Process Modeling & SOPs', category: 'servicio_renovacion', price_type: 'one_time', price_min: 30000, delivery_days_min: 14, delivery_days_max: 21, requires_quote: false },
  { sku: 'SRV-R04', name_es: 'Automatización Operativa con IA', name_en: 'AI Operational Automation', category: 'servicio_renovacion', price_type: 'one_time', price_min: 25000, delivery_days_min: 10, delivery_days_max: 21, requires_quote: false },
  { sku: 'SRV-R05', name_es: 'Cultura Organizacional', name_en: 'Organizational Culture', category: 'servicio_renovacion', price_type: 'one_time', price_min: 20000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SRV-R06', name_es: 'Auditoría CX (Experiencia del Cliente)', name_en: 'CX Audit (Customer Experience)', category: 'servicio_renovacion', price_type: 'one_time', price_min: 15000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SRV-R07', name_es: 'Consultoría de Transformación Digital', name_en: 'Digital Transformation Consulting', category: 'servicio_renovacion', price_type: 'one_time', price_min: 35000, delivery_days_min: 14, delivery_days_max: 28, requires_quote: false },
  { sku: 'SRV-R08', name_es: 'Capacitación Empresarial (Talleres)', name_en: 'Business Training (Workshops)', category: 'servicio_renovacion', price_type: 'one_time', price_min: 15000, delivery_days_min: 3, delivery_days_max: 7, requires_quote: false },
  { sku: 'SRV-C01', name_es: 'Formalización Comercial Completa', name_en: 'Complete Business Formalization', category: 'servicio_consultoria', price_type: 'one_time', price_min: 25000, delivery_days_min: 14, delivery_days_max: 30, requires_quote: false },
  { sku: 'SRV-C02', name_es: 'Registro de Marca en ONAPI', name_en: 'ONAPI Trademark Registration', category: 'servicio_consultoria', price_type: 'one_time', price_min: 15000, delivery_days_min: 30, delivery_days_max: 90, requires_quote: false },
  { sku: 'SRV-C03', name_es: 'Auditoría y Planificación Fiscal', name_en: 'Tax Audit & Planning', category: 'servicio_consultoria', price_type: 'one_time', price_min: 20000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SRV-C04', name_es: 'Licitaciones Públicas (Ley 488-08)', name_en: 'Government Procurement (Law 488-08)', category: 'servicio_consultoria', price_type: 'one_time', price_min: 30000, delivery_days_min: 21, delivery_days_max: 45, requires_quote: false },
  { sku: 'SRV-C05', name_es: 'Contratos y NDAs Comerciales', name_en: 'Commercial Contracts & NDAs', category: 'servicio_consultoria', price_type: 'one_time', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SRV-C06', name_es: 'Iguala Mensual Contable', name_en: 'Monthly Accounting Retainer', category: 'servicio_consultoria', price_type: 'recurring', price_min: 12000, delivery_days_min: 1, delivery_days_max: 3, requires_quote: false },
  { sku: 'SRV-C07', name_es: 'Cumplimiento Laboral y TSS', name_en: 'Labor Compliance & Social Security', category: 'servicio_consultoria', price_type: 'one_time', price_min: 20000, delivery_days_min: 7, delivery_days_max: 21, requires_quote: false },
  { sku: 'SRV-C08', name_es: 'Diagnóstico 360° Empresarial', name_en: 'Business 360° Diagnosis', category: 'servicio_consultoria', price_type: 'one_time', price_min: 0, delivery_days_min: 1, delivery_days_max: 3, requires_quote: false },
  { sku: 'SRV-C09', name_es: 'Plan de Negocio y Proyecciones', name_en: 'Business Plan & Projections', category: 'servicio_consultoria', price_type: 'one_time', price_min: 25000, delivery_days_min: 10, delivery_days_max: 21, requires_quote: false },
  { sku: 'SRV-C10', name_es: 'Due Diligence para Inversión', name_en: 'Investment Due Diligence', category: 'servicio_consultoria', price_type: 'one_time', price_min: 40000, delivery_days_min: 14, delivery_days_max: 30, requires_quote: false },
  { sku: 'SRV-P01', name_es: 'Landing Page de Conversión', name_en: 'Conversion Landing Page', category: 'servicio_publicidad', price_type: 'one_time', price_min: 18000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SRV-P02', name_es: 'Campañas Meta & Google Ads', name_en: 'Meta & Google Ads Campaigns', category: 'servicio_publicidad', price_type: 'recurring', price_min: 15000, delivery_days_min: 3, delivery_days_max: 7, requires_quote: false },
  { sku: 'SRV-P03', name_es: 'CRM Automatizado', name_en: 'Automated CRM', category: 'servicio_publicidad', price_type: 'one_time', price_min: 25000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SRV-P04', name_es: 'Posicionamiento SEO Local', name_en: 'Local SEO Positioning', category: 'servicio_publicidad', price_type: 'recurring', price_min: 12000, delivery_days_min: 14, delivery_days_max: 30, requires_quote: false },
  { sku: 'SRV-P05', name_es: 'Community Manager (Redes Sociales)', name_en: 'Social Media Management', category: 'servicio_publicidad', price_type: 'recurring', price_min: 15000, delivery_days_min: 3, delivery_days_max: 7, requires_quote: false },
  { sku: 'SRV-P06', name_es: 'E-commerce Completo', name_en: 'Complete E-commerce', category: 'servicio_publicidad', price_type: 'one_time', price_min: 45000, delivery_days_min: 21, delivery_days_max: 45, requires_quote: false },
  { sku: 'SRV-P07', name_es: 'Edición Multimedia TikTok/Reels', name_en: 'TikTok/Reels Video Editing', category: 'servicio_publicidad', price_type: 'recurring', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SRV-P08', name_es: 'Email Marketing Automatizado', name_en: 'Automated Email Marketing', category: 'servicio_publicidad', price_type: 'recurring', price_min: 8000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SRV-P09', name_es: 'Chatbot WhatsApp con IA', name_en: 'AI WhatsApp Chatbot', category: 'servicio_publicidad', price_type: 'one_time', price_min: 30000, delivery_days_min: 10, delivery_days_max: 21, requires_quote: false },
  { sku: 'SRV-P10', name_es: 'Fotografía de Producto Profesional', name_en: 'Professional Product Photography', category: 'servicio_publicidad', price_type: 'one_time', price_min: 10000, delivery_days_min: 3, delivery_days_max: 7, requires_quote: false },
  { sku: 'SW-PRE01', name_es: 'Sistema POS (Punto de Venta)', name_en: 'POS System (Point of Sale)', category: 'software_preconfigurado', price_type: 'one_time', price_min: 35000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SW-PRE02', name_es: 'CRM Corporativo Pre-configurado', name_en: 'Pre-configured Corporate CRM', category: 'software_preconfigurado', price_type: 'one_time', price_min: 30000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SW-PRE03', name_es: 'ERP Básico (Ventas + Inventario)', name_en: 'Basic ERP (Sales + Inventory)', category: 'software_preconfigurado', price_type: 'one_time', price_min: 45000, delivery_days_min: 14, delivery_days_max: 21, requires_quote: false },
  { sku: 'SW-PRE04', name_es: 'ERP Completo (Multi-módulo)', name_en: 'Complete ERP (Multi-module)', category: 'software_preconfigurado', price_type: 'one_time', price_min: 80000, delivery_days_min: 21, delivery_days_max: 45, requires_quote: false },
  { sku: 'SW-PRE05', name_es: 'Sistema de Facturación Electrónica', name_en: 'Electronic Invoicing System', category: 'software_preconfigurado', price_type: 'one_time', price_min: 25000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SW-PRE06', name_es: 'Sistema de Reservas/Citas Online', name_en: 'Online Booking/Appointment System', category: 'software_preconfigurado', price_type: 'one_time', price_min: 20000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'SW-PRE07', name_es: 'Plataforma de Delivery/Pedidos', name_en: 'Delivery/Orders Platform', category: 'software_preconfigurado', price_type: 'one_time', price_min: 50000, delivery_days_min: 14, delivery_days_max: 28, requires_quote: false },
  { sku: 'SW-PRE08', name_es: 'Dashboard Directivo (KPIs)', name_en: 'Executive Dashboard (KPIs)', category: 'software_preconfigurado', price_type: 'one_time', price_min: 35000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'SW-PRE09', name_es: 'Sistema de Gestión Escolar', name_en: 'School Management System', category: 'software_preconfigurado', price_type: 'one_time', price_min: 60000, delivery_days_min: 21, delivery_days_max: 45, requires_quote: false },
  { sku: 'SW-PRE10', name_es: 'Sistema de Gestión de Clínica', name_en: 'Clinic Management System', category: 'software_preconfigurado', price_type: 'one_time', price_min: 55000, delivery_days_min: 14, delivery_days_max: 30, requires_quote: false },
  { sku: 'SW-CUS01', name_es: 'Aplicación Web a Medida (PWA)', name_en: 'Custom Web Application (PWA)', category: 'software_custom', price_type: 'one_time', price_min: 80000, delivery_days_min: 30, delivery_days_max: 90, requires_quote: true },
  { sku: 'SW-CUS02', name_es: 'Aplicación Móvil (iOS + Android)', name_en: 'Mobile App (iOS + Android)', category: 'software_custom', price_type: 'one_time', price_min: 120000, delivery_days_min: 45, delivery_days_max: 120, requires_quote: true },
  { sku: 'SW-CUS03', name_es: 'Portal de Clientes Personalizado', name_en: 'Custom Client Portal', category: 'software_custom', price_type: 'one_time', price_min: 60000, delivery_days_min: 21, delivery_days_max: 60, requires_quote: true },
  { sku: 'SW-CUS04', name_es: 'Integración de APIs y Sistemas', name_en: 'API & Systems Integration', category: 'software_custom', price_type: 'one_time', price_min: 30000, delivery_days_min: 10, delivery_days_max: 30, requires_quote: true },
  { sku: 'SW-CUS05', name_es: 'Marketplace / Plataforma Multi-vendor', name_en: 'Marketplace / Multi-vendor Platform', category: 'software_custom', price_type: 'one_time', price_min: 150000, delivery_days_min: 60, delivery_days_max: 120, requires_quote: true },
  { sku: 'SW-CUS06', name_es: 'Sistema de IA Corporativa Privada', name_en: 'Private Corporate AI System', category: 'software_custom', price_type: 'one_time', price_min: 100000, delivery_days_min: 30, delivery_days_max: 60, requires_quote: true },
  { sku: 'SW-CUS07', name_es: 'Sitio Web Corporativo Multi-página', name_en: 'Multi-page Corporate Website', category: 'software_custom', price_type: 'one_time', price_min: 40000, delivery_days_min: 14, delivery_days_max: 30, requires_quote: false },
  { sku: 'SW-CUS08', name_es: 'Mantenimiento y Soporte Mensual', name_en: 'Monthly Maintenance & Support', category: 'software_custom', price_type: 'recurring', price_min: 8000, delivery_days_min: 1, delivery_days_max: 3, requires_quote: false },
  { sku: 'IMP-01', name_es: 'Tarjetas de Presentación (500 uds)', name_en: 'Business Cards (500 pcs)', category: 'imprenta', price_type: 'per_unit', price_min: 3500, delivery_days_min: 3, delivery_days_max: 5, requires_quote: false },
  { sku: 'IMP-02', name_es: 'Hojas Timbradas y Sobres Corporativos', name_en: 'Letterhead & Corporate Envelopes', category: 'imprenta', price_type: 'per_unit', price_min: 5000, delivery_days_min: 5, delivery_days_max: 7, requires_quote: false },
  { sku: 'IMP-03', name_es: 'Carpetas Institucionales', name_en: 'Institutional Folders', category: 'imprenta', price_type: 'per_unit', price_min: 8000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'IMP-04', name_es: 'Volantes / Flyers (1000 uds)', name_en: 'Flyers (1000 pcs)', category: 'imprenta', price_type: 'per_unit', price_min: 4000, delivery_days_min: 3, delivery_days_max: 5, requires_quote: false },
  { sku: 'IMP-05', name_es: 'Brochures / Catálogos Impresos', name_en: 'Printed Brochures / Catalogs', category: 'imprenta', price_type: 'per_unit', price_min: 15000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'IMP-06', name_es: 'Formularios de Factura NCF (Blocks)', name_en: 'NCF Invoice Forms (Blocks)', category: 'imprenta', price_type: 'per_unit', price_min: 3000, delivery_days_min: 3, delivery_days_max: 5, requires_quote: false },
  { sku: 'IMP-07', name_es: 'Formularios Pre-impresos Personalizados', name_en: 'Custom Pre-printed Forms', category: 'imprenta', price_type: 'per_unit', price_min: 4000, delivery_days_min: 5, delivery_days_max: 7, requires_quote: false },
  { sku: 'IMP-08', name_es: 'Banner / Roll-up (85×200cm)', name_en: 'Banner / Roll-up (85×200cm)', category: 'imprenta', price_type: 'per_unit', price_min: 4500, delivery_days_min: 3, delivery_days_max: 5, requires_quote: false },
  { sku: 'IMP-09', name_es: 'Valla Publicitaria / Bajante', name_en: 'Billboard / Drop Banner', category: 'imprenta', price_type: 'per_unit', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'IMP-10', name_es: 'Letrero Luminoso / Acrílico', name_en: 'Light Box / Acrylic Sign', category: 'imprenta', price_type: 'one_time', price_min: 20000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'IMP-11', name_es: 'Rotulación de Fachada (Vinil)', name_en: 'Facade Vinyl Signage', category: 'imprenta', price_type: 'one_time', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'IMP-12', name_es: 'Branding de Vehículos / Flota', name_en: 'Vehicle / Fleet Branding', category: 'imprenta', price_type: 'per_unit', price_min: 15000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'IMP-13', name_es: 'Etiquetas de Producto Personalizadas', name_en: 'Custom Product Labels', category: 'imprenta', price_type: 'per_unit', price_min: 5000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'IMP-14', name_es: 'Empaque / Packaging Personalizado', name_en: 'Custom Packaging', category: 'imprenta', price_type: 'per_unit', price_min: 12000, delivery_days_min: 10, delivery_days_max: 21, requires_quote: false },
  { sku: 'POP-01', name_es: 'Uniformes Bordados (Polo/Camisa)', name_en: 'Embroidered Uniforms (Polo/Shirt)', category: 'pop_merchandising', price_type: 'per_unit', price_min: 1200, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-02', name_es: 'Gorras Corporativas Bordadas', name_en: 'Embroidered Corporate Caps', category: 'pop_merchandising', price_type: 'per_unit', price_min: 600, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-03', name_es: 'Tazas Personalizadas (Sublimación)', name_en: 'Custom Mugs (Sublimation)', category: 'pop_merchandising', price_type: 'per_unit', price_min: 400, delivery_days_min: 5, delivery_days_max: 7, requires_quote: false },
  { sku: 'POP-04', name_es: 'Termos / Botellas Corporativas', name_en: 'Corporate Bottles / Tumblers', category: 'pop_merchandising', price_type: 'per_unit', price_min: 800, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-05', name_es: 'Bolígrafos Corporativos (100 uds)', name_en: 'Corporate Pens (100 pcs)', category: 'pop_merchandising', price_type: 'per_unit', price_min: 3000, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'POP-06', name_es: 'Libretas / Agendas Personalizadas', name_en: 'Custom Notebooks / Planners', category: 'pop_merchandising', price_type: 'per_unit', price_min: 1500, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-07', name_es: 'Lanyards / Porta-carnet Corporativo', name_en: 'Corporate Lanyards / ID Holders', category: 'pop_merchandising', price_type: 'per_unit', price_min: 500, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'POP-08', name_es: 'USB / Power Banks Personalizados', name_en: 'Custom USB / Power Banks', category: 'pop_merchandising', price_type: 'per_unit', price_min: 1000, delivery_days_min: 10, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-09', name_es: 'Bolsas Ecológicas con Logo', name_en: 'Eco-bags with Logo', category: 'pop_merchandising', price_type: 'per_unit', price_min: 400, delivery_days_min: 5, delivery_days_max: 10, requires_quote: false },
  { sku: 'POP-10', name_es: 'Kit de Bienvenida Corporativo', name_en: 'Corporate Welcome Kit', category: 'pop_merchandising', price_type: 'per_unit', price_min: 3000, delivery_days_min: 7, delivery_days_max: 14, requires_quote: false },
  { sku: 'POP-11', name_es: 'Sellos Corporativos (Húmedo + Seco)', name_en: 'Corporate Stamps (Wet + Dry)', category: 'pop_merchandising', price_type: 'per_unit', price_min: 2500, delivery_days_min: 5, delivery_days_max: 7, requires_quote: false },
  { sku: 'POP-12', name_es: 'Delantales Personalizados', name_en: 'Custom Aprons', category: 'pop_merchandising', price_type: 'per_unit', price_min: 800, delivery_days_min: 7, delivery_days_max: 10, requires_quote: false }
];

// Helper to map and process product data
function processProductData(data){
  P=data.map(function(item){
    var minVal = item.delivery_days_min !== undefined && item.delivery_days_min !== null ? item.delivery_days_min : 7;
    var maxVal = item.delivery_days_max !== undefined && item.delivery_days_max !== null ? item.delivery_days_max : 21;
    var days=minVal+'–'+maxVal+' dias';
    if(item.price_type==='recurring')days=isEN()?'Monthly':'Mensual';
    return{
      sku:item.sku,
      name:item.name_es,
      name_en:item.name_en||item.name_es,
      includes:item.description_es||'',
      includes_en:item.description_en||item.description_es||'',
      price:item.price_min,
      days:days,
      cat:item.category,
      type:item.price_type,
      v:item.requires_quote||false
    };
  });
  supabaseLoaded=true;
  render(activeFilter);
}

// ─── SUPABASE DYNAMIC LOADING (primary source) ───
function loadFromSupabase(){
  if(typeof fetch==='undefined')return;
  // Show loading state
  if(grid) grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;"><div class="store-loading-spinner"></div><p style="color:#8e8f94;margin-top:16px;">'+(isEN()?'Loading products...':'Cargando productos...')+'</p></div>';

  fetch(SUPABASE_URL+'/rest/v1/productos?is_active=eq.true&order=sort_order.asc&select=sku,name_es,name_en,description_es,description_en,price_min,delivery_days_min,delivery_days_max,category,price_type,requires_quote',{
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}
  }).then(function(r){
    if(!r.ok) throw new Error('HTTP '+r.status);
    return r.json();
  }).then(function(data){
    if(!data||!Array.isArray(data)||data.length===0){
      throw new Error('Empty product data');
    }
    // Cache successfully fetched products
    localStorage.setItem('rcp_cached_products', JSON.stringify(data));
    processProductData(data);
  }).catch(function(e){
    console.warn('[Tienda] Error loading products from Supabase, attempting cache/static fallback:', e);
    var cached = localStorage.getItem('rcp_cached_products');
    if(cached){
      try {
        var cachedData = JSON.parse(cached);
        if(cachedData && Array.isArray(cachedData) && cachedData.length > 0){
          console.log('[Tienda] Loaded from localStorage cache.');
          processProductData(cachedData);
          return;
        }
      } catch(err) {
        console.error('[Tienda] Error parsing cached products:', err);
      }
    }
    console.log('[Tienda] Loading from static catalog fallback...');
    processProductData(STATIC_PRODUCT_CATALOG);
  });
}

// ─── SEARCH FUNCTIONALITY ───
function setupSearch(){
  var searchContainer=document.createElement('div');
  searchContainer.className='store-search-container';
  searchContainer.innerHTML='<div class="store-search-wrapper">'
    +'<svg class="store-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>'
    +'<input type="text" class="store-search-input" id="storeSearch" placeholder="'+(isEN()?'Search products or services...':'Buscar productos o servicios...')+'" autocomplete="off">'
    +'<button class="store-search-clear" id="searchClear" style="display:none">&times;</button>'
    +'</div>';
  // Insert before the grid
  var storeSection=grid?grid.parentElement:null;
  if(storeSection){
    var filterBar=storeSection.querySelector('.store-filters');
    if(filterBar)filterBar.parentNode.insertBefore(searchContainer,filterBar.nextSibling);
    else storeSection.insertBefore(searchContainer,grid);
  }
  var input=document.getElementById('storeSearch');
  var clearBtn=document.getElementById('searchClear');
  if(input){
    var debounceTimer;
    input.addEventListener('input',function(){
      clearTimeout(debounceTimer);
      debounceTimer=setTimeout(function(){
        searchQuery=input.value.trim().toLowerCase();
        if(clearBtn)clearBtn.style.display=searchQuery?'block':'none';
        render(activeFilter);
      },250);
    });
  }
  if(clearBtn){
    clearBtn.addEventListener('click',function(){
      if(input)input.value='';
      searchQuery='';
      clearBtn.style.display='none';
      render(activeFilter);
    });
  }
}

// ─── FAVORITES SYSTEM ───
function isFav(sku){return favorites.indexOf(sku)>=0;}
function toggleFav(sku){
  var idx=favorites.indexOf(sku);
  if(idx>=0)favorites.splice(idx,1);
  else favorites.push(sku);
  localStorage.setItem('rcp_favorites',JSON.stringify(favorites));
  render(activeFilter);
}

function getIcon(sku){
  if(sku.indexOf('SW-')===0)return'&#128187;';
  if(sku.indexOf('IMP')===0)return'&#128424;';
  if(sku.indexOf('POP')===0)return'&#127873;';
  if(sku.indexOf('SRV')===0)return'&#9881;&#65039;';
  return'&#128230;';
}

function fp(price){return'RD$ '+price.toLocaleString();}

function render(filter){
  if(!grid)return;
  var items=filter==='all'?P:P.filter(function(p){return p.cat===filter;});
  // Apply price filter
  if(priceFilter!=='all'){
    var maxP=parseInt(priceFilter);
    if(maxP===10000)items=items.filter(function(p){return p.price<=10000;});
    else if(maxP===50000)items=items.filter(function(p){return p.price>10000&&p.price<=50000;});
    else items=items.filter(function(p){return p.price>50000;});
  }
  // Apply search filter
  if(searchQuery){
    items=items.filter(function(p){
      return p.name.toLowerCase().indexOf(searchQuery)>=0
        ||p.includes.toLowerCase().indexOf(searchQuery)>=0
        ||p.sku.toLowerCase().indexOf(searchQuery)>=0
        ||(catL[p.cat]||'').toLowerCase().indexOf(searchQuery)>=0;
    });
  }
  grid.innerHTML='';
  if(items.length===0){grid.innerHTML='<p style="text-align:center;color:#8e8f94;padding:60px;grid-column:1/-1">'+(searchQuery?(isEN()?'No results found for "'+searchQuery+'"':'No se encontraron resultados para "'+searchQuery+'"'):(isEN()?'No products in this category.':'No hay productos en esta categoria.'))+'</p>';return;}
  // Sort: favorites first
  items.sort(function(a,b){var fa=isFav(a.sku)?1:0;var fb=isFav(b.sku)?1:0;return fb-fa;});
  items.forEach(function(p){
    var inCart=cart.some(function(c){return c.sku===p.sku;});
    var fav=isFav(p.sku);
    var pName=isEN()?(p.name_en||p.name):p.name;
    var pDesc=isEN()?(p.includes_en||p.includes):p.includes;
    var priceLabel=p.type==='recurring'?fp(p.price)+(isEN()?'/mo':'/mes'):p.type==='per_unit'?fp(p.price)+(isEN()?'/unit':'/ud'):fp(p.price);
    var btnText=inCart?(isEN()?'In cart':'En el carrito'):(isEN()?'Add':'Agregar');
    var btnClass='store-card-btn cart-btn'+(inCart?' added':'');
    var card=document.createElement('div');
    card.className='store-card'+(inCart?' in-cart':'')+(fav?' is-fav':'');
    card.innerHTML='<div class="store-card-icon">'
      +'<img src="/assets/products/'+p.sku+'.svg" class="product-thumbnail" onload="this.style.display=\'block\'; this.nextElementSibling.style.display=\'none\';" onerror="this.src=\'/assets/products/'+p.sku+'.png\'; this.onerror=function(){this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';};" style="display:none; width:100%; height:100%; object-fit:contain; border-radius:8px; padding:8px;">'
      +'<div class="store-card-icon-fallback" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">'+getIcon(p.sku)+'</div>'
      +'<button class="store-fav-btn'+(fav?' active':'')+'" data-sku="'+p.sku+'" title="'+(fav?(isEN()?'Remove from favorites':'Quitar de favoritos'):(isEN()?'Add to favorites':'Agregar a favoritos'))+'">'+(fav?'&#9733;':'&#9734;')+'</button>'
      +'</div>'
      +'<span class="store-card-cat">'+getCatLabel(p.cat)+'</span>'
      +'<h3 class="store-card-title">'+pName+'</h3>'
      +'<p class="store-card-desc">'+pDesc.substring(0,90)+(pDesc.length>90?'...':'')+'</p>'
      +'<div class="store-card-footer">'
      +'<span class="store-card-price">'+priceLabel+'</span>'
      +'<button class="'+btnClass+'" data-sku="'+p.sku+'">'+btnText+'</button>'
      +'</div>';
    card.querySelector('.store-card-title').onclick=function(){openM(p);};
    card.querySelector('.store-card-icon').onclick=function(e){if(e.target.classList.contains('store-fav-btn'))return;openM(p);};
    card.querySelector('.store-fav-btn').onclick=function(e){e.stopPropagation();toggleFav(p.sku);};
    card.querySelector('.store-card-footer button').onclick=function(e){
      e.stopPropagation();
      toggleCart(p);
    };
    grid.appendChild(card);
  });
  updateCartUI();
}

function openM(p){
  selected=p;
  var pName=isEN()?(p.name_en||p.name):p.name;
  var pDesc=isEN()?(p.includes_en||p.includes):p.includes;
  document.getElementById('modalIcon').innerHTML='<img src="/assets/products/'+p.sku+'.svg" class="product-thumbnail" onload="this.style.display=\'block\'; this.nextElementSibling.style.display=\'none\';" onerror="this.src=\'/assets/products/'+p.sku+'.png\'; this.onerror=function(){this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';};" style="display:none; width:100%; height:100%; object-fit:contain; border-radius:8px; padding:12px;">'
    +'<div class="store-card-icon-fallback" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;">'+getIcon(p.sku)+'</div>';
  document.getElementById('modalCategory').textContent=getCatLabel(p.cat);
  document.getElementById('modalTitle').textContent=pName;
  document.getElementById('modalDesc').textContent=pDesc;
  var priceLabel=p.type==='recurring'?fp(p.price)+(isEN()?'/mo':'/mes'):p.type==='per_unit'?fp(p.price)+(isEN()?'/unit':'/unidad'):fp(p.price);
  document.getElementById('modalPrice').textContent=priceLabel;
  document.getElementById('modalDelivery').textContent=p.days;
  document.getElementById('modalType').textContent=getTypeLabel(p.type);
  var inC=cart.some(function(c){return c.sku===p.sku;});
  var cartTag=inC?'<span class="modal-tag" style="background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.3);color:#22c55e;">'+(isEN()?'In your cart':'En tu carrito')+'</span>':'';
  var fixedTag='<span class="modal-tag">'+(isEN()?'Fixed price':'Precio fijo')+'</span>';
  document.getElementById('modalTags').innerHTML=cartTag+fixedTag;
  document.getElementById('btnAddCart').innerHTML=(inC?(isEN()?'&#10003; In cart':'&#10003; En el carrito'):(isEN()?'&#128722; Add to Cart':'&#128722; Agregar al Carrito'));
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeM(){modal.classList.remove('open');document.body.style.overflow='';selected=null;}

// ═══════════════════════════════════════════════
// CART SYSTEM
// ═══════════════════════════════════════════════
function toggleCart(p){
  var idx=cart.findIndex(function(c){return c.sku===p.sku;});
  if(idx>=0){cart.splice(idx,1);}else{cart.push(p);}
  render(activeFilter);
}

function updateCartUI(){
  var fab=document.getElementById('cartFab');
  var badge=document.getElementById('cartBadge');
  if(!fab)return;
  if(cart.length>0){fab.classList.add('visible');badge.textContent=cart.length;}
  else{fab.classList.remove('visible');}
}

function openCartPanel(){
  var panel=document.getElementById('cartPanel');
  if(!panel)return;
  var list=document.getElementById('cartList');
  var total=document.getElementById('cartTotal');
  var sum=0;
  list.innerHTML='';
  if(cart.length===0){list.innerHTML='<p style="color:#8e8f94;text-align:center;padding:20px;">Tu carrito esta vacio</p>';total.textContent='RD$ 0';return;}
  cart.forEach(function(p){
    sum+=p.price;
    var item=document.createElement('div');
    item.className='cart-item';
    item.innerHTML='<div class="cart-item-info"><strong>'+p.name+'</strong><span>'+fp(p.price)+(p.type==='recurring'?'/mes':'')+'</span></div><button class="cart-item-remove" data-sku="'+p.sku+'">&times;</button>';
    item.querySelector('button').onclick=function(){toggleCart(p);openCartPanel();};
    list.appendChild(item);
  });
  total.textContent=fp(sum);
  panel.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeCartPanel(){
  var panel=document.getElementById('cartPanel');
  if(panel)panel.classList.remove('open');
  document.body.style.overflow='';
}

function redirectToCheckout(method) {
  if(cart.length===0)return;
  var items = cart.map(function(p){
    return {
      name: p.name,
      min: p.price,
      max: p.price,
      recurring: p.type==='recurring'
    };
  });
  var url='/checkout?custom_items='+encodeURIComponent(JSON.stringify(items));
  if(method) url+='&method='+method;
  window.location.href=url;
}

function quoteWhatsApp(p){
  var msg='Hola RCP! Me interesa cotizar una variacion de:\n\n'
    +'\u{1F4E6} *'+p.name+'*\n'
    +'\u{1F4B0} Precio base: '+fp(p.price)+'\n'
    +'\u{1F4CB} SKU: '+p.sku+'\n\n'
    +'Necesito una variacion en: [cantidad/tamano/funcionalidades]\n\n'
    +'Me pueden enviar propuesta personalizada?';
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank');
}

// ═══════════════════════════════════════════════
// EVENT BINDINGS
// ═══════════════════════════════════════════════
catBtns.forEach(function(btn){btn.addEventListener('click',function(){catBtns.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');activeFilter=btn.getAttribute('data-filter');render(activeFilter);});});

// Price filter buttons
var priceBtns=document.querySelectorAll('.store-price-btn');
priceBtns.forEach(function(btn){btn.addEventListener('click',function(){priceBtns.forEach(function(b){b.classList.remove('active');});btn.classList.add('active');priceFilter=btn.getAttribute('data-price');render(activeFilter);});});

document.getElementById('modalClose').addEventListener('click',closeM);
document.getElementById('modalBackdrop').addEventListener('click',closeM);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeM();closeCartPanel();}});

// Modal: Add to Cart
document.getElementById('btnAddCart').addEventListener('click',function(){
  if(!selected)return;
  toggleCart(selected);
  closeM();
});

// Modal: Pay with Card (CardNet placeholder)
document.getElementById('btnPayCard').addEventListener('click',function(){
  if(!selected)return;
  var items = [{ name: selected.name, min: selected.price, max: selected.price, recurring: selected.type==='recurring' }];
  window.location.href = '/checkout?custom_items=' + encodeURIComponent(JSON.stringify(items)) + '&method=cardnet';
});

// Modal: PayPal
document.getElementById('btnPayPaypal').addEventListener('click',function(){
  if(!selected)return;
  var items = [{ name: selected.name, min: selected.price, max: selected.price, recurring: selected.type==='recurring' }];
  window.location.href = '/checkout?custom_items=' + encodeURIComponent(JSON.stringify(items)) + '&method=paypal';
});

// Modal: Transfer
document.getElementById('btnPayTransferModal').addEventListener('click',function(){
  if(!selected)return;
  var items = [{ name: selected.name, min: selected.price, max: selected.price, recurring: selected.type==='recurring' }];
  window.location.href = '/checkout?custom_items=' + encodeURIComponent(JSON.stringify(items)) + '&method=transfer';
});

// Modal: Quote WhatsApp (for variations/customizations only)
document.getElementById('btnQuoteWhatsapp').addEventListener('click',function(){
  if(!selected)return;
  quoteWhatsApp(selected);
});

// Cart FAB
var cartFab=document.getElementById('cartFab');
if(cartFab)cartFab.addEventListener('click',openCartPanel);
var cartCloseBtn=document.getElementById('cartPanelClose');
if(cartCloseBtn)cartCloseBtn.addEventListener('click',closeCartPanel);

// Cart panel payment buttons
var cartCheckoutBtn=document.getElementById('cartCheckoutBtn');
if(cartCheckoutBtn)cartCheckoutBtn.addEventListener('click',function(){ redirectToCheckout(); });
var cartPayWA=document.getElementById('cartPayWhatsapp');
if(cartPayWA)cartPayWA.addEventListener('click',function(){ redirectToCheckout('whatsapp'); });
var cartPayCard=document.getElementById('cartPayCard');
if(cartPayCard)cartPayCard.addEventListener('click',function(){ redirectToCheckout('cardnet'); });
var cartPayPP=document.getElementById('cartPayPaypal');
if(cartPayPP)cartPayPP.addEventListener('click',function(){ redirectToCheckout('paypal'); });
var btnTransfer=document.getElementById('btnPayTransfer');
if(btnTransfer)btnTransfer.addEventListener('click',function(){ redirectToCheckout('transfer'); });

// URL param
var params=new URLSearchParams(window.location.search);
var catP=params.get('cat');
if(catP){activeFilter=catP;catBtns.forEach(function(b){if(b.getAttribute('data-filter')===catP)b.classList.add('active');else b.classList.remove('active');});}

// ═══════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════
setupSearch();
// Load products from Supabase (primary source — no static fallback)
loadFromSupabase();
// Re-render when language changes (observer on <html> lang attribute)
var langObserver=new MutationObserver(function(mutations){
  mutations.forEach(function(m){if(m.attributeName==='lang'){render(activeFilter);}});
});
langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
