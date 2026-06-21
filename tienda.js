"use strict";
(function(){
var CATALOG = [];
var icons = {sw:'SW',crm:'CRM',erp:'ERP',imp:'IMP',pop:'POP',srv:'SRV'};
function a(sku,name,desc,cat,type,min,max,days,tags,quote){
  CATALOG.push({sku:sku,name:name,desc:desc,cat:cat,type:type,min:min,max:max,days:days,tags:tags||[],quote:quote||false});
}
// SOFTWARE PRE-CONFIGURADO
a('SW-PRE01','Sistema POS (Punto de Venta)','Gestion de caja, inventario en tiempo real, reportes de ventas, multiples sucursales y control de empleados.','software_preconfigurado','one_time',35000,65000,'7-14',['pos','ventas']);
a('SW-PRE02','CRM Corporativo','Seguimiento de prospectos, embudo de ventas, automatizacion de seguimiento, integracion con WhatsApp y email.','software_preconfigurado','one_time',30000,55000,'7-14',['crm','leads']);
a('SW-PRE03','ERP Basico (Ventas + Inventario)','Control centralizado de compras, ventas, inventario y facturacion con reportes y alertas.','software_preconfigurado','one_time',45000,80000,'14-21',['erp','inventario']);
a('SW-PRE04','ERP Completo Multi-modulo','ERP empresarial con contabilidad, RRHH, proyectos, manufactura, e-commerce y BI.','software_preconfigurado','one_time',80000,150000,'21-45',['erp','enterprise']);
a('SW-PRE05','Facturacion Electronica NCF','Emision de comprobantes fiscales NCF, reportes 606/607 y envio por email.','software_preconfigurado','one_time',25000,45000,'7-14',['facturacion','ncf']);
a('SW-PRE06','Sistema de Reservas y Citas','Calendario online para salones y clinicas con WhatsApp y recordatorios.','software_preconfigurado','one_time',20000,40000,'5-10',['reservas','citas']);
a('SW-PRE07','Plataforma de Delivery','App de pedidos con tracking, repartidores y notificaciones al cliente.','software_preconfigurado','one_time',50000,90000,'14-28',['delivery','pedidos']);
a('SW-PRE08','Dashboard Directivo KPIs','Panel ejecutivo con metricas en tiempo real: CAC, LTV, ROI, ROAS.','software_preconfigurado','one_time',35000,60000,'7-14',['dashboard','kpi']);
a('SW-PRE09','Sistema Gestion Escolar','Matriculas, calificaciones, asistencia, pagos y portal estudiantil.','software_preconfigurado','one_time',60000,120000,'21-45',['escuela','educacion']);
a('SW-PRE10','Sistema Gestion de Clinica','Expedientes, citas, recetas, laboratorios y facturacion ARS.','software_preconfigurado','one_time',55000,100000,'14-30',['clinica','salud']);
// SOFTWARE CUSTOM
a('SW-CUS01','Aplicacion Web a Medida (PWA)','Desarrollo completo con UI/UX personalizado, backend robusto y deploy en la nube.','software_custom','one_time',80000,250000,'30-90',['webapp','pwa'],true);
a('SW-CUS02','App Movil (iOS + Android)','Desarrollo nativo o cross-platform con publicacion en tiendas.','software_custom','one_time',120000,400000,'45-120',['app','movil'],true);
a('SW-CUS03','Portal de Clientes','Plataforma donde tus clientes ven avances, aprueban artes y descargan facturas.','software_custom','one_time',60000,150000,'21-60',['portal','dashboard'],true);
a('SW-CUS04','Integracion de APIs','Conectamos ERP, CRM, tienda online, WhatsApp y pasarelas de pago.','software_custom','one_time',30000,100000,'10-30',['api','integracion'],true);
a('SW-CUS05','Marketplace Multi-vendor','Plataforma donde multiples vendedores ofrecen productos con comisiones.','software_custom','one_time',150000,500000,'60-120',['marketplace'],true);
a('SW-CUS06','IA Corporativa Privada','Modelos de lenguaje entrenados con tus datos. Chatbots y automatizacion.','software_custom','one_time',100000,300000,'30-60',['ia','privada'],true);
a('SW-CUS07','Sitio Web Corporativo','Sitio premium multi-pagina con SEO, animaciones y CMS.','software_custom','one_time',40000,100000,'14-30',['web','corporativo']);
a('SW-CUS08','Mantenimiento Mensual','Actualizaciones, backups, monitoreo 24/7 y soporte prioritario.','software_custom','recurring',8000,25000,'Continuo',['soporte']);
// IMPRENTA
a('IMP-01','Tarjetas de Presentacion (500)','Impresion premium 350g. Mate, brillante o soft-touch. Diseno incluido.','imprenta','per_unit',3500,8000,'3-5',['tarjetas']);
a('IMP-02','Hojas Timbradas y Sobres','Papeleria institucional con membrete y logo a todo color.','imprenta','per_unit',5000,12000,'5-7',['papeleria']);
a('IMP-03','Carpetas Institucionales','Carpetas con bolsillo interior para propuestas comerciales.','imprenta','per_unit',8000,18000,'5-10',['carpeta']);
a('IMP-04','Volantes / Flyers (1000)','Volantes a todo color en papel couche. Diseno incluido.','imprenta','per_unit',4000,10000,'3-5',['volantes']);
a('IMP-05','Brochures y Catalogos','Folletos plegables o catalogos con encuadernacion profesional.','imprenta','per_unit',15000,45000,'7-14',['brochure']);
a('IMP-06','Formularios Factura NCF','Blocks de facturas NCF en original y copia numerados.','imprenta','per_unit',3000,8000,'3-5',['factura','ncf']);
a('IMP-07','Formularios Pre-impresos','Recibos, ordenes de compra, conduces personalizados.','imprenta','per_unit',4000,12000,'5-7',['formulario']);
a('IMP-08','Banner / Roll-up','Banner retractil 85x200cm con estructura e impresion HD.','imprenta','per_unit',4500,9000,'3-5',['banner']);
a('IMP-09','Valla / Bajante','Impresion en lona o vinil para exteriores, alta durabilidad.','imprenta','per_unit',15000,45000,'5-10',['valla']);
a('IMP-10','Letrero Luminoso','Fabricacion e instalacion de letrero LED o acrilico.','imprenta','one_time',20000,60000,'7-14',['letrero']);
a('IMP-11','Rotulacion de Fachada','Vinil adhesivo de alta calidad para vidrios y paredes.','imprenta','one_time',15000,40000,'5-10',['rotulacion']);
a('IMP-12','Branding de Vehiculos','Rotulado parcial o total con vinil vehicular 3-5 anos.','imprenta','per_unit',15000,45000,'5-10',['vehiculo']);
a('IMP-13','Etiquetas de Producto','Etiquetas adhesivas personalizadas, troquel especial.','imprenta','per_unit',5000,15000,'5-10',['etiqueta']);
a('IMP-14','Empaque Personalizado','Cajas y bolsas con tu marca, desde pizza hasta lujo.','imprenta','per_unit',12000,40000,'10-21',['empaque']);
// POP Y MERCHANDISING
a('POP-01','Uniformes Bordados','Polos o camisas con logo bordado. Minimo 6 unidades.','pop_merchandising','per_unit',1200,3500,'7-14',['uniforme']);
a('POP-02','Gorras Corporativas','Gorras con logo bordado. Minimo 12 unidades.','pop_merchandising','per_unit',600,1500,'7-14',['gorra']);
a('POP-03','Tazas Sublimadas','Ceramica 11oz con impresion full-color. Minimo 12.','pop_merchandising','per_unit',400,900,'5-7',['taza']);
a('POP-04','Termos Corporativos','Acero inoxidable con grabado laser o UV de tu logo.','pop_merchandising','per_unit',800,2000,'7-14',['termo']);
a('POP-05','Boligrafos (100 uds)','Con logo impreso, desde economicos hasta premium.','pop_merchandising','per_unit',3000,8000,'5-10',['boligrafo']);
a('POP-06','Libretas y Agendas','Agendas ejecutivas grabadas y libretas con logo.','pop_merchandising','per_unit',1500,4000,'7-14',['libreta']);
a('POP-07','Lanyards y Porta-carnet','Cinta con logo + porta-carnet. Minimo 25.','pop_merchandising','per_unit',500,1200,'5-10',['lanyard']);
a('POP-08','USB y Power Banks','Memorias o cargadores con grabado laser de tu marca.','pop_merchandising','per_unit',1000,3500,'10-14',['usb','tech']);
a('POP-09','Bolsas Ecologicas','Tote bags con impresion serigrafica. Minimo 50.','pop_merchandising','per_unit',400,1000,'5-10',['bolsa']);
a('POP-10','Kit de Bienvenida','Taza + libreta + boligrafo + bolsa con tu marca.','pop_merchandising','per_unit',3000,8000,'7-14',['kit']);
a('POP-11','Sellos Corporativos','Sello humedo + sello seco con razon social y RNC.','pop_merchandising','per_unit',2500,5000,'5-7',['sello']);
a('POP-12','Delantales Personalizados','Para chef o barista con bordado de tu logo.','pop_merchandising','per_unit',800,2000,'7-10',['delantal']);
// SERVICIOS
a('SRV-R01','Identidad Visual Basica','Logo, paleta, tipografias y manual basico de marca.','servicio_renovacion','one_time',15000,30000,'5-10',['branding']);
a('SRV-R02','Rebranding Premium','Rediseno completo con manual extenso y activos digitales.','servicio_renovacion','one_time',40000,80000,'14-28',['rebranding']);
a('SRV-R04','Automatizacion con IA','Agentes de IA para emails, leads, reportes y tareas.','servicio_renovacion','one_time',25000,55000,'10-21',['ia']);
a('SRV-C01','Formalizacion Comercial','ONAPI + Camara de Comercio + RNC DGII completo.','servicio_consultoria','one_time',25000,45000,'14-30',['legal']);
a('SRV-C03','Auditoria Fiscal','Evaluacion impositiva con plan de optimizacion DGII.','servicio_consultoria','one_time',20000,40000,'7-14',['fiscal']);
a('SRV-C04','Licitaciones Ley 488-08','RPE, certificacion MIPYME y acompanamiento estatal.','servicio_consultoria','one_time',30000,60000,'21-45',['licitacion']);
a('SRV-P02','Campanas Meta y Google Ads','Diseno, segmentacion y optimizacion mensual de ads.','servicio_publicidad','recurring',15000,30000,'3-7',['ads']);
a('SRV-P04','SEO Local Dominicana','Google Maps y busqueda organica en tu zona.','servicio_publicidad','recurring',12000,25000,'14-30',['seo']);
a('SRV-P09','Chatbot WhatsApp con IA','Bot 24/7 que atiende, califica leads y agenda citas.','servicio_publicidad','one_time',30000,60000,'10-21',['chatbot']);

// ─── RENDER LOGIC ───
var WA='18298068092';
var grid=document.getElementById('storeGrid');
var modal=document.getElementById('productModal');
var catBtns=document.querySelectorAll('.store-cat-btn');
var activeFilter='all';
var selected=null;
var catL={'software_preconfigurado':'Software Empresarial','software_custom':'Desarrollo a Medida','imprenta':'Imprenta','pop_merchandising':'Articulos Corporativos','servicio_renovacion':'Renovacion','servicio_consultoria':'Consultoria','servicio_publicidad':'Marketing Digital'};
var typeL={'one_time':'Pago unico','recurring':'Mensual','per_unit':'Por unidad'};
// Icons per SKU prefix
var catIcons={'SW-PRE':'&#x1F4BB;','SW-CUS':'&#x2699;&#xFE0F;','IMP':'&#x1F5A8;&#xFE0F;','POP':'&#x1F381;','SRV-R':'&#x1F504;','SRV-C':'&#x2696;&#xFE0F;','SRV-P':'&#x1F4E2;'};
function getIcon(sku){
  if(sku.indexOf('SW-PRE')===0)return'&#128187;';
  if(sku.indexOf('SW-CUS')===0)return'&#9881;&#65039;';
  if(sku.indexOf('IMP')===0)return'&#128424;';
  if(sku.indexOf('POP')===0)return'&#127873;';
  if(sku.indexOf('SRV-R')===0)return'&#128260;';
  if(sku.indexOf('SRV-C')===0)return'&#9878;&#65039;';
  if(sku.indexOf('SRV-P')===0)return'&#128226;';
  return'&#128230;';
}

function fp(mn,mx){if(mn===0&&mx===0)return'GRATIS';var f=function(n){return'RD$ '+n.toLocaleString()};return mn===mx?f(mn):f(mn)+' - '+f(mx);}

function render(filter){
  if(!grid)return;
  var items=filter==='all'?CATALOG:CATALOG.filter(function(p){return p.cat===filter;});
  grid.innerHTML='';
  if(items.length===0){grid.innerHTML='<p style="text-align:center;color:#8e8f94;padding:60px 20px;grid-column:1/-1;">No hay productos en esta categoria.</p>';return;}
  items.forEach(function(p){
    var card=document.createElement('div');
    card.className='store-card';
    card.innerHTML='<div class="store-card-icon">'+getIcon(p.sku)+'</div><span class="store-card-cat">'+(catL[p.cat]||p.cat)+'</span><h3 class="store-card-title">'+p.name+'</h3><p class="store-card-desc">'+p.desc+'</p><div class="store-card-footer"><span class="store-card-price">'+fp(p.min,p.max)+'</span><button class="store-card-btn">'+(p.quote?'Cotizar':'Ver mas')+'</button></div>';
    card.onclick=function(){openM(p);};
    grid.appendChild(card);
  });
}

function openM(p){
  selected=p;
  document.getElementById('modalIcon').innerHTML=getIcon(p.sku);
  document.getElementById('modalCategory').textContent=catL[p.cat]||'';
  document.getElementById('modalTitle').textContent=p.name;
  document.getElementById('modalDesc').textContent=p.desc;
  document.getElementById('modalPrice').textContent=fp(p.min,p.max);
  document.getElementById('modalDelivery').textContent=p.days+' dias';
  document.getElementById('modalType').textContent=typeL[p.type]||p.type;
  var tEl=document.getElementById('modalTags');
  tEl.innerHTML=p.tags.map(function(t){return'<span class="modal-tag">'+t+'</span>';}).join('');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeM(){
  modal.classList.remove('open');
  document.body.style.overflow='';
  selected=null;
}

// Category filters
catBtns.forEach(function(btn){
  btn.addEventListener('click',function(){
    catBtns.forEach(function(b){b.classList.remove('active');});
    btn.classList.add('active');
    activeFilter=btn.getAttribute('data-filter');
    render(activeFilter);
  });
});

// Modal close
document.getElementById('modalClose').addEventListener('click',closeM);
document.getElementById('modalBackdrop').addEventListener('click',closeM);

// Payment buttons
document.getElementById('btnPayWhatsapp').addEventListener('click',function(){
  if(!selected)return;
  var msg=encodeURIComponent('Hola RCP! Me interesa cotizar:\n\n'+selected.name+'\nRango: '+fp(selected.min,selected.max)+'\nSKU: '+selected.sku+'\n\nMe pueden enviar propuesta?');
  window.open('https://wa.me/'+WA+'?text='+msg,'_blank');
});
document.getElementById('btnPayStripe').addEventListener('click',function(){
  if(!selected)return;
  alert('Pago con tarjeta: La pasarela Stripe se activara proximamente.\n\nMientras tanto, usa WhatsApp o transferencia.');
});
document.getElementById('btnPayPaypal').addEventListener('click',function(){
  if(!selected)return;
  alert('PayPal se activara proximamente.\n\nUsa WhatsApp o transferencia por ahora.');
});
document.getElementById('btnPayTransfer').addEventListener('click',function(){
  if(!selected)return;
  alert('DATOS PARA TRANSFERENCIA\n\nBanco: Banreservas\nCuenta: 9601234567\nTipo: Corriente\nNombre: RCP Services SRL\n\nConcepto: '+selected.sku+' - '+selected.name+'\n\nEnvia comprobante a info@rcp.services o WhatsApp 829-806-8092');
});

// URL param filter
var params=new URLSearchParams(window.location.search);
var catP=params.get('cat');
if(catP){activeFilter=catP;catBtns.forEach(function(b){if(b.getAttribute('data-filter')===catP)b.classList.add('active');else b.classList.remove('active');});}

// INITIAL RENDER
render(activeFilter);
})();
