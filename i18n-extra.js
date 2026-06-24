/**
 * RCP Services — Extended i18n (self-contained)
 * Applies translations for pages not covered by the main script.js translations.
 * Load AFTER script.min.js. Listens to lang attribute changes.
 */
(function(){
var t={
es:{
'hero-oneliner':'Formalizamos tu empresa, ordenamos tus finanzas y te conseguimos clientes. Todo en uno.',
'careers-form-name':'Nombre Completo','careers-form-email':'Correo Electrónico','careers-form-phone':'Teléfono / WhatsApp','careers-form-specialty':'Área de Especialidad',
'careers-spec-fin':'Consultoría Financiera & Fiscal','careers-spec-design':'Diseño Creativo & Rebranding','careers-spec-marketing':'Marketing Digital & Ads','careers-spec-web':'Desarrollo Web & Ecosistemas','careers-spec-legal':'Asesoría Legal & Corporativa',
'careers-form-portfolio':'LinkedIn o Portafolio (Opcional)','choose-file':'Selecciona CV','careers-form-btn':'Enviar Postulación & CV →',
'careers-success-title':'¡Postulación Recibida!','careers-success-desc':'Hemos registrado tu perfil. Te contactaremos para proyectos futuros.',
'media-video2-label':'Video Tutorial','media-video2-title':'Tutorial: <span class="accent">Ecosistema Digital</span>','media-video2-desc':'Cómo funciona el Ecosistema Operativo Soberano.','media-podcast-ep2':'Episodio 2','media-podcast-name2':'Cómo vender sin hacer fuerza',
'chk-badge':'Pago Seguro SSL','chk-title':'Finalizar tu <span class="accent">adquisición</span>','chk-sub':'Completa tu facturación y método de pago.',
'chk-billing-title':'1. Datos de Facturación','chk-rnc-label':'RNC / Cédula','chk-address-label':'Dirección de Facturación',
'chk-paymethod-title':'2. Método de Pago','chk-method-cardnet':'Tarjeta (CardNet)','chk-method-paypal':'PayPal',
'chk-card-title':'Datos de Tarjeta','chk-card-holder':'Nombre en la Tarjeta','chk-card-element':'Tarjeta de Crédito o Débito',
'chk-paypal-redirect-title':'Redirección a PayPal','chk-paypal-redirect-desc':'Serás redirigido a PayPal para completar tu pago.',
'chk-disclaimer':'Al hacer clic aceptas nuestros Términos de Servicio.','chk-summary-title':'Resumen del Pedido','chk-total-today':'Total a Pagar Hoy:','chk-btn-process':'Procesar Pago Seguro',
'proc-verifying':'Verificando Transacción...','proc-secure':'Conectando con pasarela segura...',
'port-login-title':'Acceso Directivo','port-login-sub':'Monitorea tus KPIs y trámites.','port-pass':'Contraseña','port-remember':'Recordarme','port-forgot':'¿Olvidaste tu contraseña?',
'port-btn-login':'Iniciar Sesión','port-or':'O CONTINÚA CON','port-btn-google':'Iniciar con Google','port-btn-register':'Registrarme',
'port-register-title':'Crear Cuenta Directiva','port-register-sub':'Registra tus credenciales.','port-btn-create':'Crear mi Cuenta','port-btn-login-back':'Iniciar Sesión',
'port-forgot-title':'Restablecer Contraseña','port-forgot-sub':'Te enviaremos instrucciones.','port-btn-send':'Enviar Enlace',
'dash-nav-overview':'Resumen','dash-nav-tramites':'Trámites en Curso','dash-nav-marketing':'Métricas de Ads','dash-nav-pagos':'Historial de Pagos','dash-nav-clients':'Gestión de Clientes','dash-nav-logout':'Cerrar Sesión',
'dash-title':'Junta Directiva Digital','dash-subtitle':'Monitoreando los latidos comerciales y financieros.',
'dash-review-title':'Diagnóstico 360° en Proceso','dash-review-desc':'Tu cuenta está en fase de Análisis Inicial.',
'dash-step1-title':'Datos Enviados','dash-step1-desc':'Perfil registrado en el CRM.','dash-step2-title':'Sesión Meet','dash-step2-desc':'Evaluaremos tu negocio.','dash-step3-title':'Desbloqueo','dash-step3-desc':'Recibirás tu Código de Acceso.',
'dash-btn-contact':'💬 Contactar Asesor','dash-btn-logout-overlay':'🚪 Cerrar Sesión',
'dash-kpi-sales':'Ventas del Mes','dash-kpi-trend':'vs mes ant.','dash-kpi-cac':'Costo por Lead','dash-kpi-roas':'Retorno Ads (ROAS)','dash-kpi-ltv':'Valor de Cliente (LTV)',
'dash-sales-trend':'Proyección de Ventas (DOP)','dash-download':'Descargar PDF','dash-recent-tramites':'Trámites Legales','dash-view-all':'Ver todo',
'dash-title-legal':'Monitoreo de Trámites Legales','dash-refresh':'Actualizar','dash-completed':'Completado','dash-desc-onapi':'Certificado ONAPI expedido.','dash-process':'En Proceso','dash-desc-rm':'Documentación en Cámara de Comercio.','dash-review':'En Verificación','dash-desc-dgii':'RNC depositado en DGII.',
'dash-marketing-title':'Meta & Google Ads','dash-cpl-trend':'Tendencia CPL (DOP)',
'dash-title-billing':'Historial de Facturación','dash-billing-desc':'Transacciones del Ecosistema.',
'tbl-txn':'ID','tbl-date':'Fecha','tbl-items':'Servicios','tbl-amount':'Monto','tbl-method':'Método','tbl-status':'Estado',
'dash-clients-title':'Gestión de Clientes','dash-clients-filter-all':'Todos','dash-clients-filter-active':'Activos','dash-clients-filter-inactive':'Inactivos',
'dash-clients-badge-sync':'Sincronizado','dash-clients-btn-sync':'Sincronizar Odoo','dash-clients-desc':'Administra clientes del ecosistema.',
'dash-clients-th-company':'Empresa','dash-clients-th-rnc':'RNC','dash-clients-th-owner':'Titular','dash-clients-th-contact':'Contacto','dash-clients-th-code':'Código','dash-clients-th-status':'Estado','dash-clients-th-actions':'Acciones',
'dash-clients-loading':'Cargando...','dash-clients-form-title-add':'Nuevo Cliente','dash-clients-badge-edit':'Editando',
'dash-clients-label-company':'Empresa','dash-clients-label-rnc':'RNC / Cédula','dash-clients-label-owner':'Titular','dash-clients-label-address':'Dirección','dash-clients-label-status':'Estado',
'dash-clients-status-active':'Activo','dash-clients-status-inactive':'Inactivo','dash-clients-btn-save':'Guardar','dash-clients-btn-cancel':'Cancelar',
'contact-form-title':'Formulario de Contacto','contact-form-subtitle':'Déjanos tus datos.','contact-form-name':'Nombre','contact-form-email':'Correo','contact-form-message':'Mensaje','contact-form-btn':'Enviar','contact-success-title':'¡Enviado!','contact-success-desc':'Te contactaremos pronto.'
},
en:{
'hero-oneliner':'We formalize your business, fix your finances, and get you clients. All in one.',
'careers-form-name':'Full Name','careers-form-email':'Email Address','careers-form-phone':'Phone / WhatsApp','careers-form-specialty':'Area of Expertise',
'careers-spec-fin':'Financial & Tax Consulting','careers-spec-design':'Creative Design & Rebranding','careers-spec-marketing':'Digital Marketing & Ads','careers-spec-web':'Web Development & Ecosystems','careers-spec-legal':'Legal & Corporate Advisory',
'careers-form-portfolio':'LinkedIn or Portfolio (Optional)','choose-file':'Select CV','careers-form-btn':'Submit Application & CV →',
'careers-success-title':'Application Received!','careers-success-desc':'Your profile has been registered. We will contact you for future projects.',
'media-video2-label':'Video Tutorial','media-video2-title':'Tutorial: <span class="accent">Digital Ecosystem</span>','media-video2-desc':'How the Sovereign Operating Ecosystem works.','media-podcast-ep2':'Episode 2','media-podcast-name2':'How to sell without force',
'chk-badge':'Secure SSL Payment','chk-title':'Complete your <span class="accent">purchase</span>','chk-sub':'Fill your billing details and payment method.',
'chk-billing-title':'1. Billing Information','chk-rnc-label':'Tax ID / ID Number','chk-address-label':'Billing Address',
'chk-paymethod-title':'2. Payment Method','chk-method-cardnet':'Card (CardNet)','chk-method-paypal':'PayPal',
'chk-card-title':'Card Details','chk-card-holder':'Name on Card','chk-card-element':'Credit or Debit Card',
'chk-paypal-redirect-title':'Redirect to PayPal','chk-paypal-redirect-desc':'You will be redirected to PayPal.',
'chk-disclaimer':'By clicking you accept our Terms of Service.','chk-summary-title':'Order Summary','chk-total-today':'Total Due Today:','chk-btn-process':'Process Secure Payment',
'proc-verifying':'Verifying Transaction...','proc-secure':'Connecting to secure gateway...',
'port-login-title':'Executive Access','port-login-sub':'Monitor your KPIs and processes.','port-pass':'Password','port-remember':'Remember me','port-forgot':'Forgot password?',
'port-btn-login':'Sign In','port-or':'OR CONTINUE WITH','port-btn-google':'Sign in with Google','port-btn-register':'Register',
'port-register-title':'Create Executive Account','port-register-sub':'Register your credentials.','port-btn-create':'Create Account','port-btn-login-back':'Sign In',
'port-forgot-title':'Reset Password','port-forgot-sub':'We will send reset instructions.','port-btn-send':'Send Link',
'dash-nav-overview':'Overview','dash-nav-tramites':'Legal Processes','dash-nav-marketing':'Ad Metrics','dash-nav-pagos':'Payment History','dash-nav-clients':'Client Management','dash-nav-logout':'Sign Out',
'dash-title':'Digital Board of Directors','dash-subtitle':'Monitoring your business heartbeats.',
'dash-review-title':'360° Diagnosis in Progress','dash-review-desc':'Your account is in the Initial Analysis phase.',
'dash-step1-title':'Data Submitted','dash-step1-desc':'Profile registered in CRM.','dash-step2-title':'Meet Session','dash-step2-desc':'We will evaluate your business.','dash-step3-title':'Activation','dash-step3-desc':'You will receive your Access Code.',
'dash-btn-contact':'💬 Contact Advisor','dash-btn-logout-overlay':'🚪 Sign Out',
'dash-kpi-sales':'Monthly Sales','dash-kpi-trend':'vs last mo.','dash-kpi-cac':'Cost per Lead','dash-kpi-roas':'Ad Return (ROAS)','dash-kpi-ltv':'Customer Value (LTV)',
'dash-sales-trend':'Sales Projection (DOP)','dash-download':'Download PDF','dash-recent-tramites':'Legal Processes','dash-view-all':'View all',
'dash-title-legal':'Business Registration Monitoring','dash-refresh':'Refresh','dash-completed':'Completed','dash-desc-onapi':'ONAPI certificate issued.','dash-process':'In Progress','dash-desc-rm':'Documentation at Chamber of Commerce.','dash-review':'Under Review','dash-desc-dgii':'RNC submitted to DGII.',
'dash-marketing-title':'Meta & Google Ads','dash-cpl-trend':'CPL Trend (DOP)',
'dash-title-billing':'Billing History','dash-billing-desc':'Ecosystem transactions.',
'tbl-txn':'ID','tbl-date':'Date','tbl-items':'Services','tbl-amount':'Amount','tbl-method':'Method','tbl-status':'Status',
'dash-clients-title':'Client Management','dash-clients-filter-all':'All','dash-clients-filter-active':'Active','dash-clients-filter-inactive':'Inactive',
'dash-clients-badge-sync':'Synced','dash-clients-btn-sync':'Sync with Odoo','dash-clients-desc':'Manage all ecosystem clients.',
'dash-clients-th-company':'Company','dash-clients-th-rnc':'Tax ID','dash-clients-th-owner':'Owner','dash-clients-th-contact':'Contact','dash-clients-th-code':'Code','dash-clients-th-status':'Status','dash-clients-th-actions':'Actions',
'dash-clients-loading':'Loading...','dash-clients-form-title-add':'New Client','dash-clients-badge-edit':'Editing',
'dash-clients-label-company':'Company','dash-clients-label-rnc':'Tax ID','dash-clients-label-owner':'Owner','dash-clients-label-address':'Address','dash-clients-label-status':'Status',
'dash-clients-status-active':'Active','dash-clients-status-inactive':'Inactive','dash-clients-btn-save':'Save','dash-clients-btn-cancel':'Cancel',
'contact-form-title':'Contact Form','contact-form-subtitle':'Leave your info.','contact-form-name':'Name','contact-form-email':'Email','contact-form-message':'Message','contact-form-btn':'Send','contact-success-title':'Sent!','contact-success-desc':'We will contact you soon.'
}
};

function apply(){
  var lang=document.documentElement.lang||'es';
  var dict=t[lang]||t.es;
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var k=el.getAttribute('data-i18n');
    if(dict[k])el.innerHTML=dict[k];
  });
}

// Apply on load
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',apply);}
else{setTimeout(apply,100);}

// Re-apply on language change
new MutationObserver(function(m){m.forEach(function(mut){if(mut.attributeName==='lang')apply();});}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
