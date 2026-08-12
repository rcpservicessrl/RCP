"use strict";
(function(){
// ═══════════════════════════════════════════════
// TIENDA RCP — Dynamic Supabase + Search + Favorites + Cart
// ═══════════════════════════════════════════════

// ─── SUPABASE CONFIG ───
var isLocal = new URLSearchParams(window.location.search).get('local_db') === '1';
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

function escapeHTML(str) {
  if (str === null || str === undefined) return '';
  return str.toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCompoundPriceLabel(p) {
  if (p.v || Number(p.price) <= 0) return isEN() ? 'Request quote' : 'Cotizar';
  var setup = p.precio_inicial || 0;
  var rec = p.precio_recurrente || 0;
  var freq = p.frecuencia_recurrente || '';
  
  var freqLabel = '';
  if (freq === 'mensual' || freq === 'monthly') {
    freqLabel = isEN() ? '/mo' : '/mes';
  } else if (freq === 'anual' || freq === 'yearly') {
    freqLabel = isEN() ? '/yr' : '/año';
  } else if (freq) {
    freqLabel = '/' + freq;
  }

  if (setup > 0 && rec > 0) {
    var setupText = isEN() ? ' setup' : ' inicial';
    return fp(setup) + setupText + ' + ' + fp(rec) + freqLabel;
  } else if (rec > 0) {
    return fp(rec) + freqLabel;
  } else if (setup > 0) {
    return fp(setup);
  } else {
    return p.type==='recurring'?fp(p.price)+(isEN()?'/mo':'/mes'):p.type==='per_unit'?fp(p.price)+(isEN()?'/unit':'/ud'):fp(p.price);
  }
}

// Product data is loaded exclusively from the active Supabase catalog.

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
      precio_inicial:item.precio_inicial || 0,
      precio_recurrente:item.precio_recurrente || 0,
      frecuencia_recurrente:item.frecuencia_recurrente || '',
      imagenes:item.imagenes || [],
      especificaciones:item.especificaciones || {},
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

  fetch(SUPABASE_URL+'/rest/v1/productos?is_active=eq.true&order=sort_order.asc&select=sku,name_es,name_en,description_es,description_en,price_min,delivery_days_min,delivery_days_max,category,price_type,requires_quote,precio_inicial,precio_recurrente,frecuencia_recurrente,imagenes,especificaciones',{
    headers:{'apikey':SUPABASE_KEY,'Authorization':'Bearer '+SUPABASE_KEY,'Accept-Profile':'rcp_services'}
  }).then(function(r){
    if(!r.ok) throw new Error('HTTP '+r.status);
    return r.json();
  }).then(function(data){
    if(!data||!Array.isArray(data)||data.length===0){
      throw new Error('Empty product data');
    }
    processProductData(data);
  }).catch(function(e){
    console.error('[Tienda] Catalog unavailable:', e);
    P=[];
    supabaseLoaded=false;
    if(grid) grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;">'
      +'<h3 style="margin-bottom:10px;">'+(isEN()?'Catalog temporarily unavailable':'Catálogo temporalmente no disponible')+'</h3>'
      +'<p style="color:#8e8f94;margin-bottom:20px;">'+(isEN()?'We disabled stale prices to protect your quote.':'Deshabilitamos precios desactualizados para proteger tu cotización.')+'</p>'
      +'<a class="btn-cta" href="https://wa.me/'+WA+'" target="_blank" rel="noopener noreferrer">'+(isEN()?'Contact RCP Services':'Contactar a RCP Services')+'</a></div>';
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
    var priceLabel=getCompoundPriceLabel(p);
    var btnText=inCart?(isEN()?'Selected':'Seleccionado'):(isEN()?'Select':'Seleccionar');
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

  var carousel = document.getElementById('modalCarousel');
  var indicators = document.getElementById('carouselIndicators');
  var prevBtn = document.getElementById('carouselPrevBtn');
  var nextBtn = document.getElementById('carouselNextBtn');
  
  var imgs = p.imagenes && p.imagenes.length > 0 ? p.imagenes : [];
  if (imgs.length === 0) {
    imgs.push('/assets/products/' + p.sku + '.svg');
  }

  if (carousel && indicators && prevBtn && nextBtn) {
    carousel.innerHTML = '';
    indicators.innerHTML = '';

    var currentSlideIdx = 0;
    var totalSlides = imgs.length;

    imgs.forEach(function(url, idx) {
      var slide = document.createElement('div');
      slide.className = 'carousel-slide' + (idx === 0 ? ' active' : '');
      
      var img = document.createElement('img');
      img.src = url;
      img.style = 'max-width:100%; max-height:100%; object-fit:contain; border-radius:8px;';
      img.onerror = function() {
        if (url.endsWith('.svg')) {
          img.src = url.substring(0, url.length - 4) + '.png';
        } else {
          slide.innerHTML = '<div class="store-card-icon-fallback" style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:5rem;">' + getIcon(p.sku) + '</div>';
        }
      };
      slide.appendChild(img);
      carousel.appendChild(slide);

      var dot = document.createElement('button');
      dot.className = 'carousel-indicator-dot' + (idx === 0 ? ' active' : '');
      dot.addEventListener('click', function() { goToSlide(idx); });
      indicators.appendChild(dot);
    });

    if (totalSlides > 1) {
      prevBtn.style.display = 'block';
      nextBtn.style.display = 'block';
      indicators.style.display = 'flex';
    } else {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
      indicators.style.display = 'none';
    }

    function goToSlide(idx) {
      currentSlideIdx = (idx + totalSlides) % totalSlides;
      var slides = carousel.querySelectorAll('.carousel-slide');
      var dots = indicators.querySelectorAll('.carousel-indicator-dot');
      slides.forEach(function(s, i) { s.classList.toggle('active', i === currentSlideIdx); });
      dots.forEach(function(d, i) { d.classList.toggle('active', i === currentSlideIdx); });
    }

    prevBtn.onclick = function() { goToSlide(currentSlideIdx - 1); };
    nextBtn.onclick = function() { goToSlide(currentSlideIdx + 1); };
  }

  document.getElementById('modalCategory').textContent=getCatLabel(p.cat);
  document.getElementById('modalTitle').textContent=pName;
  document.getElementById('modalDesc').textContent=pDesc;
  
  var priceLabel=getCompoundPriceLabel(p);
  document.getElementById('modalPrice').textContent=priceLabel;
  document.getElementById('modalDelivery').textContent=p.days;
  document.getElementById('modalType').textContent=getTypeLabel(p.type);
  
  var inC=cart.some(function(c){return c.sku===p.sku;});
  var cartTag=inC?'<span class="modal-tag" style="background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.3);color:#22c55e;">'+(isEN()?'In your cart':'En tu carrito')+'</span>':'';
  var fixedTag='<span class="modal-tag">'+(p.v || Number(p.price)<=0 ? (isEN()?'Quote required':'Requiere cotización') : (isEN()?'Reference price':'Precio de referencia'))+'</span>';
  document.getElementById('modalTags').innerHTML=cartTag+fixedTag;

  // Render Specifications
  var specsContainer = document.getElementById('modalSpecs');
  if (specsContainer) {
    specsContainer.innerHTML = '';
    var specs = p.especificaciones || {};
    var specsKeys = Object.keys(specs);
    if (specsKeys.length > 0) {
      var html = '<h4 style="margin-bottom:8px;">' + (isEN() ? 'Technical Specifications' : 'Especificaciones Técnicas') + '</h4><ul style="padding-left: 20px; margin-bottom: 15px; line-height: 1.5; color: var(--text-muted);">';
      specsKeys.forEach(function(k) {
        html += '<li><strong>' + escapeHTML(k) + ':</strong> ' + escapeHTML(specs[k]) + '</li>';
      });
      html += '</ul>';
      specsContainer.innerHTML = html;
    }
  }

  document.getElementById('btnAddCart').innerHTML=(inC?(isEN()?'&#10003; Selected':'&#10003; Seleccionado'):(isEN()?'&#128203; Add to request':'&#128203; Agregar a la solicitud'));
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
  if(cart.length===0){list.innerHTML='<p style="color:#8e8f94;text-align:center;padding:20px;">Tu solicitud está vacía</p>';total.textContent='Pendiente';return;}
  cart.forEach(function(p){
    sum+=p.price;
    var item=document.createElement('div');
    item.className='cart-item';
    item.innerHTML='<div class="cart-item-info"><strong>'+escapeHTML(p.name)+'</strong><span>'+escapeHTML(getCompoundPriceLabel(p))+'</span></div><button class="cart-item-remove" data-sku="'+escapeHTML(p.sku)+'">&times;</button>';
    item.querySelector('button').onclick=function(){toggleCart(p);openCartPanel();};
    list.appendChild(item);
  });
  total.textContent=sum>0?'Desde '+fp(sum):'A cotizar';
  panel.classList.add('open');
  document.body.style.overflow='hidden';
}

function closeCartPanel(){
  var panel=document.getElementById('cartPanel');
  if(panel)panel.classList.remove('open');
  document.body.style.overflow='';
}

function redirectToCheckout() {
  if(cart.length===0)return;
  var skus=cart.map(function(p){return p.sku;}).filter(function(sku){return /^[A-Z0-9-]{2,40}$/.test(sku);});
  window.location.href='/checkout?items='+encodeURIComponent(skus.join(','));
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

// Cart panel quote action
var cartCheckoutBtn=document.getElementById('cartCheckoutBtn');
if(cartCheckoutBtn)cartCheckoutBtn.addEventListener('click',function(){ redirectToCheckout(); });

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
