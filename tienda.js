"use strict";
(function(){
// ═══════════════════════════════════════════════
// TIENDA RCP — Fixed Prices + Cart + WhatsApp Quote
// ═══════════════════════════════════════════════

// Product structure: sku, name, includes (what's included), price (fixed DOP), 
// days (delivery), cat, type, hasVariant (needs quote for customization)
var P = [];
function add(sku,name,includes,price,days,cat,type,hasVariant){
  P.push({sku:sku,name:name,includes:includes,price:price,days:days,cat:cat,type:type||'one_time',v:hasVariant||false});
}

// ─── SOFTWARE PRE-CONFIGURADO (precio fijo, listo para usar) ───
add('SW-01','Sistema POS (Punto de Venta)','Incluye: Modulo de caja, inventario basico (hasta 500 productos), reportes de ventas diarios, 1 sucursal, 3 usuarios, capacitacion remota 2h, soporte 30 dias.',45000,'7-10 dias','software_preconfigurado','one_time',true);
add('SW-02','CRM Corporativo','Incluye: Embudo de ventas, hasta 1000 contactos, automatizacion de seguimiento por email, integracion WhatsApp, dashboard de metricas, 3 usuarios, soporte 30 dias.',35000,'7-10 dias','software_preconfigurado','one_time',true);
add('SW-03','ERP Basico (Ventas + Inventario)','Incluye: Modulos de compras, ventas, inventario y facturacion. Hasta 1000 productos, 5 usuarios, reportes automaticos, capacitacion 3h.',60000,'14-21 dias','software_preconfigurado','one_time',true);
add('SW-04','Facturacion Electronica NCF','Incluye: Emision de NCF (B01, B02, B14, B15), secuencias automaticas, reportes 606/607 para DGII, envio por email, 2 usuarios.',30000,'5-7 dias','software_preconfigurado','one_time',false);
add('SW-05','Sistema de Reservas Online','Incluye: Calendario web, confirmacion por WhatsApp, recordatorios automaticos, pagos adelantados, hasta 3 profesionales.',25000,'5-7 dias','software_preconfigurado','one_time',true);
add('SW-06','Dashboard Directivo','Incluye: Panel con KPIs en tiempo real (ventas, gastos, CAC, LTV, ROI), conexion a 1 fuente de datos, acceso movil, 2 usuarios.',40000,'7-10 dias','software_preconfigurado','one_time',false);

// ─── SOFTWARE CUSTOM (requiere cotizacion por complejidad variable) ───
add('SW-07','Sitio Web Corporativo (5 paginas)','Incluye: Diseno UI/UX, 5 paginas (inicio, servicios, nosotros, contacto, blog), responsive, SEO basico, formulario de contacto, dominio 1 ano.',55000,'14-21 dias','software_custom','one_time',false);
add('SW-08','Aplicacion Web a Medida','Incluye: Analisis de requerimientos, diseno UI/UX, desarrollo frontend + backend, deploy en la nube. Precio base para app sencilla.',120000,'30-60 dias','software_custom','one_time',true);
add('SW-09','App Movil (iOS + Android)','Incluye: Diseno UX, desarrollo cross-platform, publicacion en tiendas, 1 mes de soporte. Precio base para app de complejidad media.',180000,'45-90 dias','software_custom','one_time',true);
add('SW-10','Integracion de APIs','Incluye: Conexion de 2 sistemas (ej: web+CRM, ERP+WhatsApp), documentacion tecnica, testing.',35000,'7-14 dias','software_custom','one_time',true);
add('SW-11','IA Corporativa Privada','Incluye: Chatbot entrenado con tus documentos (hasta 50 PDFs), respuestas automaticas, panel de admin.',150000,'21-30 dias','software_custom','one_time',true);
add('SW-12','Mantenimiento Mensual','Incluye: Actualizaciones de seguridad, backups semanales, monitoreo, hasta 4h de soporte tecnico/mes.',12000,'Mensual','software_custom','recurring',true);

// ─── IMPRENTA (precios fijos por lote estandar) ───
add('IMP-01','Tarjetas de Presentacion x500','Incluye: Diseno grafico, impresion full color ambos lados, cartulina 350g mate, entrega en Santo Domingo.',5500,'3-5 dias','imprenta','one_time',true);
add('IMP-02','Hojas Timbradas x500 + Sobres x200','Incluye: Diseno de membrete, impresion en papel bond 90g, sobres carta con logo.',7500,'5-7 dias','imprenta','one_time',false);
add('IMP-03','Volantes / Flyers x1000','Incluye: Diseno publicitario, impresion full color, papel couche 150g, tamano carta o media carta.',6000,'3-5 dias','imprenta','one_time',true);
add('IMP-04','Brochure Triptico x500','Incluye: Diseno editorial 6 paneles, impresion full color, couche 200g, plegado.',12000,'7-10 dias','imprenta','one_time',true);
add('IMP-05','Formularios Factura NCF x5 blocks','Incluye: Diseno con datos fiscales, original + copia, numeracion secuencial, 50 hojas/block.',4500,'3-5 dias','imprenta','one_time',false);
add('IMP-06','Banner Roll-up 85x200cm','Incluye: Diseno grafico, impresion HD, estructura metalica retractil, bolso de transporte.',6500,'3-5 dias','imprenta','one_time',false);
add('IMP-07','Letrero Acrilico Luminoso LED','Incluye: Diseno, fabricacion en acrilico 5mm, iluminacion LED, instalacion en Santo Domingo. Hasta 1m x 50cm.',35000,'10-14 dias','imprenta','one_time',true);
add('IMP-08','Rotulacion de Fachada (hasta 3m2)','Incluye: Diseno adaptado, vinil adhesivo de alta calidad, instalacion profesional.',18000,'5-7 dias','imprenta','one_time',true);
add('IMP-09','Branding Vehicular (parcial)','Incluye: Diseno adaptado al vehiculo, vinil vehicular 3 anos, aplicacion profesional. Puertas + capo.',22000,'5-7 dias','imprenta','one_time',true);
add('IMP-10','Etiquetas de Producto x1000','Incluye: Diseno, troquel personalizado, impresion full color, acabado mate o brillante.',8000,'5-7 dias','imprenta','one_time',true);
add('IMP-11','Empaque / Caja Personalizada x100','Incluye: Diseno estructural + grafico, carton corrugado o couche, armado. Tamano estandar.',15000,'10-14 dias','imprenta','one_time',true);

// ─── ARTICULOS CORPORATIVOS / POP (precio por unidad, minimos indicados) ───
add('POP-01','Polo Bordado Corporativo','Incluye: Polo algodón/poliester, bordado de logo en pecho (hasta 10cm), 1 color de tela. Precio por unidad, minimo 6.',1800,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-02','Gorra Bordada','Incluye: Gorra tipo baseball, bordado frontal de logo, cierre metalico. Precio por unidad, minimo 12.',950,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-03','Taza Sublimada 11oz','Incluye: Taza ceramica blanca, impresion full color por sublimacion, caja individual. Precio por unidad, minimo 12.',550,'5-7 dias','pop_merchandising','per_unit',true);
add('POP-04','Termo Acero con Grabado Laser','Incluye: Botella termica 500ml acero inoxidable, grabado laser de logo. Precio por unidad, minimo 6.',1500,'7-10 dias','pop_merchandising','per_unit',true);
add('POP-05','Boligrafos con Logo x100','Incluye: 100 boligrafos plasticos con impresion de logo a 1 color. Tinta azul o negra.',4500,'5-7 dias','pop_merchandising','one_time',false);
add('POP-06','Agenda Ejecutiva Grabada','Incluye: Agenda A5 tapa dura cuero sintetico, grabado laser de logo en portada, separadores. Por unidad, minimo 6.',2500,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-07','Lanyard + Porta-carnet x25','Incluye: 25 cintas sublimadas full color + porta-carnet PVC transparente.',8500,'5-7 dias','pop_merchandising','one_time',true);
add('POP-08','Kit Bienvenida Corporativo','Incluye: Taza + libreta + boligrafo + bolsa tote, todo con logo. Precio por kit, minimo 6.',5500,'10-14 dias','pop_merchandising','per_unit',true);
add('POP-09','Sellos Corporativos (Humedo + Seco)','Incluye: 1 sello automatico humedo + 1 sello seco de escritorio con razon social y RNC.',3500,'5-7 dias','pop_merchandising','one_time',false);
add('POP-10','Delantal Bordado','Incluye: Delantal largo chef/barista, bordado de logo, bolsillos frontales. Por unidad, minimo 6.',1400,'7-10 dias','pop_merchandising','per_unit',true);

// ─── SERVICIOS PROFESIONALES (precio fijo por alcance definido) ───
add('SRV-01','Identidad Visual Basica','Incluye: 3 propuestas de logotipo, paleta de 5 colores, 2 tipografias, manual basico de uso (PDF), archivos editables.',20000,'7-10 dias','servicio_renovacion','one_time',false);
add('SRV-02','Rebranding Corporativo','Incluye: Rediseno completo de logo, manual de marca 20+ paginas, papeleria digital, kit redes sociales (10 templates), favicon.',50000,'14-21 dias','servicio_renovacion','one_time',false);
add('SRV-03','Formalizacion Comercial ONAPI+DGII','Incluye: Busqueda de disponibilidad, solicitud ONAPI, Registro Mercantil Camara de Comercio, inscripcion RNC en DGII. Tasas gubernamentales incluidas.',32000,'21-30 dias','servicio_consultoria','one_time',false);
add('SRV-04','Auditoria Fiscal + Plan Tributario','Incluye: Revision de ultimos 12 meses, identificacion de riesgos DGII, plan de optimizacion fiscal, informe ejecutivo.',25000,'7-14 dias','servicio_consultoria','one_time',false);
add('SRV-05','Campana Meta Ads (1 mes)','Incluye: Estrategia, 4 creativos (imagenes), segmentacion, configuracion de pixel, optimizacion semanal, reporte final. No incluye presupuesto publicitario.',18000,'Mensual','servicio_publicidad','recurring',false);
add('SRV-06','SEO Local (1 mes)','Incluye: Ficha Google Business optimizada, 4 publicaciones, keywords research, link building local, reporte de posiciones.',15000,'Mensual','servicio_publicidad','recurring',false);
add('SRV-07','Chatbot WhatsApp con IA','Incluye: Bot que responde 24/7 con conocimiento de tu negocio (hasta 20 preguntas frecuentes), califica leads, envia a CRM.',40000,'10-14 dias','servicio_publicidad','one_time',true);
add('SRV-08','Community Manager (1 mes)','Incluye: 12 posts para Instagram/Facebook, 8 stories, calendario editorial, respuesta a comentarios, reporte mensual.',20000,'Mensual','servicio_publicidad','recurring',false);

// ═══════════════════════════════════════════════
// RENDERING + CART LOGIC
// ═══════════════════════════════════════════════
var WA='18298068092';
var grid=document.getElementById('storeGrid');
var modal=document.getElementById('productModal');
var catBtns=document.querySelectorAll('.store-cat-btn');
var activeFilter='all';
var selected=null;
var cart=[];

var catL={'software_preconfigurado':'Software Empresarial','software_custom':'Desarrollo a Medida','imprenta':'Imprenta y Rotulacion','pop_merchandising':'Articulos Corporativos','servicio_renovacion':'Renovacion','servicio_consultoria':'Consultoria','servicio_publicidad':'Marketing Digital'};
var typeL={'one_time':'Pago unico','recurring':'/mes','per_unit':'/unidad'};

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
  grid.innerHTML='';
  if(items.length===0){grid.innerHTML='<p style="text-align:center;color:#8e8f94;padding:60px;grid-column:1/-1">No hay productos en esta categoria.</p>';return;}
  items.forEach(function(p){
    var inCart=cart.some(function(c){return c.sku===p.sku;});
    var priceLabel=p.type==='recurring'?fp(p.price)+'/mes':p.type==='per_unit'?fp(p.price)+'/ud':fp(p.price);
    var btnText=p.v?'Solicitar Cotizacion':'Agregar al Carrito';
    var btnClass=p.v?'store-card-btn quote-btn':'store-card-btn cart-btn'+(inCart?' added':'');
    var card=document.createElement('div');
    card.className='store-card'+(inCart?' in-cart':'');
    card.innerHTML='<div class="store-card-icon">'+getIcon(p.sku)+'</div>'
      +'<span class="store-card-cat">'+(catL[p.cat]||'')+'</span>'
      +'<h3 class="store-card-title">'+p.name+'</h3>'
      +'<p class="store-card-desc">'+p.includes.substring(0,90)+(p.includes.length>90?'...':'')+'</p>'
      +'<div class="store-card-footer">'
      +'<span class="store-card-price">'+priceLabel+'</span>'
      +'<button class="'+btnClass+'" data-sku="'+p.sku+'">'+btnText+'</button>'
      +'</div>';
    // Click on card opens detail
    card.querySelector('.store-card-title').onclick=function(){openM(p);};
    card.querySelector('.store-card-icon').onclick=function(){openM(p);};
    // Button action
    card.querySelector('button').onclick=function(e){
      e.stopPropagation();
      if(p.v){quoteWhatsApp(p);}
      else{toggleCart(p);}
    };
    grid.appendChild(card);
  });
  updateCartUI();
}

function openM(p){
  selected=p;
  document.getElementById('modalIcon').innerHTML=getIcon(p.sku);
  document.getElementById('modalCategory').textContent=catL[p.cat]||'';
  document.getElementById('modalTitle').textContent=p.name;
  document.getElementById('modalDesc').textContent=p.includes;
  var priceLabel=p.type==='recurring'?fp(p.price)+'/mes':p.type==='per_unit'?fp(p.price)+'/unidad':fp(p.price);
  document.getElementById('modalPrice').textContent=priceLabel;
  document.getElementById('modalDelivery').textContent=p.days;
  document.getElementById('modalType').textContent=p.v?'Requiere cotizacion':'Precio fijo';
  document.getElementById('modalTags').innerHTML=p.v?'<span class="modal-tag">Personalizable</span><span class="modal-tag">Cotizar variaciones</span>':'<span class="modal-tag">Precio fijo</span><span class="modal-tag">Agregar al carrito</span>';
  // Update modal buttons
  var addBtn=document.getElementById('btnPayStripe');
  var waBtn=document.getElementById('btnPayWhatsapp');
  if(p.v){addBtn.textContent='Solicitar Cotizacion';addBtn.onclick=function(){quoteWhatsApp(p);};}
  else{var inC=cart.some(function(c){return c.sku===p.sku;});addBtn.textContent=inC?'Quitar del carrito':'Agregar al carrito';addBtn.onclick=function(){toggleCart(p);closeM();};}
  waBtn.onclick=function(){quoteWhatsApp(p);};
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

function checkoutWhatsApp(){
  if(cart.length===0)return;
  var msg='Hola RCP! Quiero adquirir los siguientes productos/servicios:\n\n';
  var sum=0;
  cart.forEach(function(p){
    msg+='\u2022 '+p.name+' - '+fp(p.price)+(p.type==='recurring'?'/mes':'')+'\n';
    sum+=p.price;
  });
  msg+='\nTotal estimado: '+fp(sum)+'\n\nPor favor confirmar disponibilidad y metodo de pago.';
  window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(msg),'_blank');
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

document.getElementById('modalClose').addEventListener('click',closeM);
document.getElementById('modalBackdrop').addEventListener('click',closeM);
document.addEventListener('keydown',function(e){if(e.key==='Escape'){closeM();closeCartPanel();}});

// Cart FAB
var cartFab=document.getElementById('cartFab');
if(cartFab)cartFab.addEventListener('click',openCartPanel);
var cartCloseBtn=document.getElementById('cartPanelClose');
if(cartCloseBtn)cartCloseBtn.addEventListener('click',closeCartPanel);
var cartCheckoutBtn=document.getElementById('cartCheckoutBtn');
if(cartCheckoutBtn)cartCheckoutBtn.addEventListener('click',checkoutWhatsApp);

// Transfer button in modal
var btnTransfer=document.getElementById('btnPayTransfer');
if(btnTransfer)btnTransfer.addEventListener('click',function(){
  alert('DATOS PARA TRANSFERENCIA\n\nBanco: Banreservas\nCuenta Corriente: 9601234567\nNombre: RCP Services SRL\nRNC: En proceso\n\nEnvia comprobante a:\nWhatsApp: 829-806-8092\nEmail: info@rcp.services');
});
var btnPaypal=document.getElementById('btnPayPaypal');
if(btnPaypal)btnPaypal.addEventListener('click',function(){alert('PayPal se activara proximamente. Usa WhatsApp o transferencia.');});

// URL param
var params=new URLSearchParams(window.location.search);
var catP=params.get('cat');
if(catP){activeFilter=catP;catBtns.forEach(function(b){if(b.getAttribute('data-filter')===catP)b.classList.add('active');else b.classList.remove('active');});}

render(activeFilter);
})();
