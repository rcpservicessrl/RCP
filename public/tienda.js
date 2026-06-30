"use strict";
(function(){
// ═══════════════════════════════════════════════
// TIENDA RCP — Dynamic Supabase + Search + Favorites + Cart
// ═══════════════════════════════════════════════

// // Product structure: sku, name, includes (what's included), price (fixed DOP), 
// days (delivery), cat, type, hasVariant (needs quote for customization)
var P = [];
function add(sku,name,includes,price,days,cat,type,hasVariant){
  P.push({sku:sku,name:name,includes:includes,price:price,days:days,cat:cat,type:type||'one_time',v:hasVariant||false});
}

// ─── SOFTWARE PRE-CONFIGURADO (precio fijo, listo para usar) ───
add('SW-PRE01','Sistema POS (Punto de Venta)','Incluye: Modulo de caja, inventario basico (hasta 500 productos), reportes de ventas diarios, 1 sucursal, 3 usuarios, capacitacion remota 2h, soporte 30 dias.',45000,'7-10 dias','software_preconfigurado','one_time',true);
add('SW-PRE02','CRM Corporativo','Incluye: Embudo de ventas, hasta 1000 contactos, automatizacion de seguimiento por email, integracion WhatsApp, dashboard de metricas, 3 usuarios, soporte 30 dias.',35000,'7-10 dias','software_preconfigurado','one_time',true);
add('SW-PRE03','ERP Basico (Ventas + Inventario)','Incluye: Modulos de compras, ventas, inventario y facturacion. Hasta 1000 productos, 5 usuarios, reportes automaticos, capacitacion 3h.',60000,'14-21 dias','software_preconfigurado','one_time',true);
add('SW-PRE05','Facturacion Electronica NCF','Incluye: Emision de NCF (B01, B02, B14, B15), secuencias automaticas, reportes 606/607 para DGII, envio por email, 2 usuarios.',30000,'5-7 dias','software_preconfigurado','one_time',false);
add('SW-PRE06','Sistema de Reservas Online','Incluye: Calendario web, confirmacion por WhatsApp, recordatorios automaticos, pagos adelantados, hasta 3 profesionales.',25000,'5-7 dias','software_preconfigurado','one_time',true);
add('SW-PRE08','Dashboard Directivo','Incluye: Panel con KPIs en tiempo real (ventas, gastos, CAC, LTV, ROI), conexion a 1 fuente de datos, acceso movil, 2 usuarios.',40000,'7-10 dias','software_preconfigurado','one_time',false);

// ─── SOFTWARE CUSTOM (requiere cotizacion por complejidad variable) ───
add('SW-CUS07','Sitio Web Corporativo (5 paginas)','Incluye: Diseno UI/UX, 5 paginas (inicio, servicios, nosotros, contacto, blog), responsive, SEO basico, formulario de contacto, dominio 1 ano.',55000,'14-21 dias','software_custom','one_time',false);
add('SW-CUS01','Aplicacion Web a Medida','Incluye: Analisis de requerimientos, diseno UI/UX, desarrollo frontend + backend, deploy en la nube. Precio base para app sencilla.',120000,'30-60 dias','software_custom','one_time',true);
add('SW-CUS02','App Movil (iOS + Android)','Incluye: Diseno UX, desarrollo cross-platform, publicacion en tiendas, 1 mes de soporte. Precio base para app de complejidad media.',180000,'45-90 dias','software_custom','one_time',true);
add('SW-CUS04','Integracion de APIs','Incluye: Conexion de 2 sistemas (ej: web+CRM, ERP+WhatsApp), documentacion tecnica, testing.',35000,'7-14 dias','software_custom','one_time',true);
add('SW-CUS06','IA Corporativa Privada','Incluye: Chatbot entrenado con tus documentos (hasta 50 PDFs), respuestas automaticas, panel de admin.',150000,'21-30 dias','software_custom','one_time',true);
add('SW-CUS08','Mantenimiento Mensual','Incluye: Actualizaciones de seguridad, backups semanales, monitoreo, hasta 4h de soporte tecnico/mes.',12000,'Mensual','software_custom','recurring',true);

// ─── IMPRENTA (precios fijos por lote estandar) ───
add('IMP-01','Tarjetas de Presentacion x500','Incluye: Diseno grafico, impresion full color ambos lados, cartulina 350g mate, entrega en Santo Domingo.',5500,'3-5 dias','imprenta','one_time',true);
add('IMP-02','Hojas Timbradas x500 + Sobres x200','Incluye: Diseno de membrete, impresion en papel bond 90g, sobres carta con logo.',7500,'5-7 dias','imprenta','one_time',false);
add('IMP-04','Volantes / Flyers x1000','Incluye: Diseno publicitario, impresion full color, papel couche 150g, tamano carta o media carta.',6000,'3-5 dias','imprenta','one_time',true);
add('IMP-05','Brochure Triptico x500','Incluye: Diseno editorial 6 paneles, impresion full color, couche 200g, plegado.',12000,'7-10 dias','imprenta','one_time',true);
add('IMP-06','Formularios Factura NCF x5 blocks','Incluye: Diseno con datos fiscales, original + copia, numeracion secuencial, 50 hojas/block.',4500,'3-5 dias','imprenta','one_time',false);
add('IMP-08','Banner Roll-up 85x200cm','Incluye: Diseno grafico, impresion HD, estructura metalica retractil, bolso de transporte.',6500,'3-5 dias','imprenta','one_time',false);
add('IMP-10','Letrero Acrilico Luminoso LED','Incluye: Diseno, fabricacion en acrilico 5mm, iluminacion LED, instalacion en Santo Domingo. Hasta 1m x 50cm.',35000,'10-14 dias','imprenta','one_time',true);
add('IMP-11','Rotulacion de Fachada (hasta 3m2)','Incluye: Diseno adaptado, vinil adhesivo de alta calidad, instalacion profesional.',18000,'5-7 dias','imprenta','one_time',true);
add('IMP-12','Branding Vehicular (parcial)','Incluye: Diseno adaptado al vehiculo, vinil vehicular 3 anos, aplicacion profesional. Puertas + capo.',22000,'5-7 dias','imprenta','one_time',true);
add('IMP-13','Etiquetas de Producto x1000','Incluye: Diseno, troquel personalizado, impresion full color, acabado mate o brillante.',8000,'5-7 dias','imprenta','one_time',true);
add('IMP-14','Empaque / Caja Personalizada x100','Incluye: Diseno estructural + grafico, carton corrugado o couche, armado. Tamano estandar.',15000,'10-14 dias','imprenta','one_time',true);

// ─── ARTICULOS CORPORATIVOS / POP (precio por unidad, minimos indicados) ───
add('POP-01','Polo Bordado Corporativo','Incluye: Polo algodón/poliester, bordado de logo en pecho (hasta 10cm), 1 color de tela. Precio por unidad, minimo 6.',1800,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-02','Gorra Bordada','Incluye: Gorra tipo baseball, bordado frontal de logo, cierre metalico. Precio por unidad, minimo 12.',950,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-03','Taza Sublimada 11oz','Incluye: Taza ceramica blanca, impresion full color por sublimacion, caja individual. Precio por unidad, minimo 12.',550,'5-7 dias','pop_merchandising','per_unit',true);
add('POP-04','Termo Acero con Grabado Laser','Incluye: Botella termica 500ml acero inoxidable, grabado laser de logo. Precio por unidad, minimo 6.',1500,'7-10 dias','pop_merchandising','per_unit',true);
add('POP-05','Boligrafos con Logo x100','Incluye: 100 boligrafos plasticos con impresion de logo a 1 color. Tinta azul o negra.',4500,'5-7 dias','pop_merchandising','one_time',false);
add('POP-06','Agenda Ejecutiva Grabada','Incluye: Agenda A5 tapa dura cuero sintetico, grabado laser de logo en portada, separadores. Por unidad, minimo 6.',2500,'7-14 dias','pop_merchandising','per_unit',true);
add('POP-07','Lanyard + Porta-carnet x25','Incluye: 25 cintas sublimadas full color + porta-carnet PVC transparente.',8500,'5-7 dias','pop_merchandising','one_time',true);
add('POP-10','Kit Bienvenida Corporativo','Incluye: Taza + libreta + boligrafo + bolsa tote, todo con logo. Precio por kit, minimo 6.',5500,'10-14 dias','pop_merchandising','per_unit',true);
add('POP-11','Sellos Corporativos (Humedo + Seco)','Incluye: 1 sello automatico humedo + 1 sello seco de escritorio con razon social y RNC.',3500,'5-7 dias','pop_merchandising','one_time',false);
add('POP-12','Delantal Bordado','Incluye: Delantal largo chef/barista, bordado de logo, bolsillos frontales. Por unidad, minimo 6.',1400,'7-10 dias','pop_merchandising','per_unit',true);

// ─── SERVICIOS PROFESIONALES (precio fijo por alcance definido) ───
add('SRV-R01','Identidad Visual Basica','Incluye: 3 propuestas de logotipo, paleta de 5 colores, 2 tipografias, manual basico de uso (PDF), archivos editables.',20000,'7-10 dias','servicio_renovacion','one_time',false);
add('SRV-R02','Rebranding Corporativo','Incluye: Rediseno completo de logo, manual de marca 20+ paginas, papeleria digital, kit redes sociales (10 templates), favicon.',50000,'14-21 dias','servicio_renovacion','one_time',false);
add('SRV-C01','Formalizacion Comercial ONAPI+DGII','Incluye: Busqueda de disponibilidad, solicitud ONAPI, Registro Mercantil Camara de Comercio, inscripcion RNC en DGII. Tasas gubernamentales incluidas.',32000,'21-30 dias','servicio_consultoria','one_time',false);
add('SRV-C03','Auditoria Fiscal + Plan Tributario','Incluye: Revision de ultimos 12 meses, identificacion de riesgos DGII, plan de optimizacion fiscal, informe ejecutivo.',25000,'7-14 dias','servicio_consultoria','one_time',false);
add('SRV-P02','Campana Meta Ads (1 mes)','Incluye: Estrategia, 4 creativos (imagenes), segmentacion, configuracion de pixel, optimizacion semanal, reporte final. No incluye presupuesto publicitario.',18000,'Mensual','servicio_publicidad','recurring',false);
add('SRV-P04','SEO Local (1 mes)','Incluye: Ficha Google Business optimizada, 4 publicaciones, keywords research, link building local, reporte de posiciones.',15000,'Mensual','servicio_publicidad','recurring',false);
add('SRV-P09','Chatbot WhatsApp con IA','Incluye: Bot que responde 24/7 con conocimiento de tu negocio (hasta 20 preguntas frecuentes), califica leads, envia a CRM.',40000,'10-14 dias','servicio_publicidad','one_time',true);
add('SRV-P05','Community Manager (1 mes)','Incluye: 12 posts para Instagram/Facebook, 8 stories, calendario editorial, respuesta a comentarios, reporte mensual.',20000,'Mensual','servicio_publicidad','recurring',false);

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

// ─── SUPABASE DYNAMIC LOADING ───
function loadFromSupabase(){
  if(typeof fetch==='undefined')return;
  fetch(SUPABASE_URL+'/rest/v1/productos?is_active=eq.true&order=sort_order.asc&select=sku,name_es,name_en,description_es,description_en,price_min,delivery_days_min,delivery_days_max,category,price_type,requires_quote',{
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY}
  }).then(function(r){return r.json();}).then(function(data){
    if(!data||!Array.isArray(data)||data.length===0)return;
    var mapped=data.map(function(item){
      var days=item.delivery_days_min+'–'+item.delivery_days_max+' dias';
      if(item.price_type==='recurring')days=isEN()?'Monthly':'Mensual';
      return{sku:item.sku,name:item.name_es,name_en:item.name_en||item.name_es,includes:item.description_es||'',includes_en:item.description_en||item.description_es||'',price:item.price_min,days:days,cat:item.category,type:item.price_type,v:item.requires_quote||false};
    });
    P=mapped;
    supabaseLoaded=true;
    render(activeFilter);
  }).catch(function(e){console.log('[Tienda] Supabase offline, using static data.');});
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
      +'<img src="assets/products/'+p.sku+'.svg" class="product-thumbnail" onload="this.style.display=\'block\'; this.nextElementSibling.style.display=\'none\';" onerror="this.src=\'assets/products/'+p.sku+'.png\'; this.onerror=function(){this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';};" style="display:none; width:100%; height:100%; object-fit:contain; border-radius:8px; padding:8px;">'
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
  document.getElementById('modalIcon').innerHTML='<img src="assets/products/'+p.sku+'.svg" class="product-thumbnail" onload="this.style.display=\'block\'; this.nextElementSibling.style.display=\'none\';" onerror="this.src=\'assets/products/'+p.sku+'.png\'; this.onerror=function(){this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';};" style="display:none; width:100%; height:100%; object-fit:contain; border-radius:8px; padding:12px;">'
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
  alert('Pago con tarjeta (CardNet) se activara proximamente.\n\nPor ahora puedes agregar al carrito y enviar por WhatsApp, o pagar por transferencia.');
});

// Modal: PayPal
document.getElementById('btnPayPaypal').addEventListener('click',function(){
  if(!selected)return;
  alert('PayPal se activara proximamente.\n\nUsa el carrito + WhatsApp o transferencia bancaria.');
});

// Modal: Transfer
document.getElementById('btnPayTransferModal').addEventListener('click',function(){
  if(!selected)return;
  alert('DATOS PARA TRANSFERENCIA\n\nBanco: Banreservas\nCuenta Corriente: 9601234567\nNombre: RCP Services SRL\n\nConcepto: '+selected.sku+' - '+selected.name+'\nMonto: '+fp(selected.price)+'\n\nEnvia comprobante a:\nWhatsApp: 829-806-8092\nEmail: info@rcp.services');
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
if(cartCheckoutBtn)cartCheckoutBtn.addEventListener('click',checkoutWhatsApp);
var cartPayWA=document.getElementById('cartPayWhatsapp');
if(cartPayWA)cartPayWA.addEventListener('click',checkoutWhatsApp);
var cartPayCard=document.getElementById('cartPayCard');
if(cartPayCard)cartPayCard.addEventListener('click',function(){
  if(cart.length===0){alert('Tu carrito esta vacio.');return;}
  alert('Pago con tarjeta (CardNet) se activara proximamente.\n\nTotal: '+fp(cart.reduce(function(s,p){return s+p.price;},0))+'\n\nPor ahora envia tu pedido por WhatsApp o paga por transferencia.');
});
var cartPayPP=document.getElementById('cartPayPaypal');
if(cartPayPP)cartPayPP.addEventListener('click',function(){
  if(cart.length===0){alert('Tu carrito esta vacio.');return;}
  alert('PayPal se activara proximamente.\n\nUsa WhatsApp o transferencia bancaria.');
});
var btnTransfer=document.getElementById('btnPayTransfer');
if(btnTransfer)btnTransfer.addEventListener('click',function(){
  if(cart.length===0){alert('Tu carrito esta vacio.');return;}
  var total=cart.reduce(function(s,p){return s+p.price;},0);
  alert('DATOS PARA TRANSFERENCIA\n\nBanco: Banreservas\nCuenta Corriente: 9601234567\nNombre: RCP Services SRL\n\nMonto: '+fp(total)+'\n\nEnvia comprobante + captura del carrito a:\nWhatsApp: 829-806-8092\nEmail: info@rcp.services');
});

// URL param
var params=new URLSearchParams(window.location.search);
var catP=params.get('cat');
if(catP){activeFilter=catP;catBtns.forEach(function(b){if(b.getAttribute('data-filter')===catP)b.classList.add('active');else b.classList.remove('active');});}

// ═══════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════
setupSearch();
render(activeFilter);
// Attempt to load fresh products from Supabase (non-blocking, progressive enhancement)
loadFromSupabase();
// Re-render when language changes (observer on <html> lang attribute)
var langObserver=new MutationObserver(function(mutations){
  mutations.forEach(function(m){if(m.attributeName==='lang'){render(activeFilter);}});
});
langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
})();
