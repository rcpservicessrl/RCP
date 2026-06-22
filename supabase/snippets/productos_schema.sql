-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services - Catálogo de Productos y Órdenes
-- Schema para Supabase (ejecutar en SQL Editor)
-- IMPORTANTE: Ejecutar supabase_rls_hardening.sql ANTES de este archivo
-- NOTA: Este script es DESTRUCTIVO - borra y recrea las tablas de productos
-- ═══════════════════════════════════════════════════════════════════════

-- 1. Eliminar tablas dependientes primero (orden importa por FK)
DROP TABLE IF EXISTS public.producto_avances CASCADE;
DROP TABLE IF EXISTS public.orden_items CASCADE;
DROP TABLE IF EXISTS public.ordenes CASCADE;
DROP TABLE IF EXISTS public.productos CASCADE;

-- 2. Eliminar tipos
DROP TYPE IF EXISTS product_category CASCADE;
DROP TYPE IF EXISTS product_type CASCADE;
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;

-- 3. Crear tipos frescos
CREATE TYPE product_category AS ENUM (
  'servicio_renovacion', 'servicio_consultoria', 'servicio_publicidad',
  'software_preconfigurado', 'software_custom',
  'imprenta', 'articulos_corporativos', 'pop_merchandising'
);

CREATE TYPE product_type AS ENUM ('one_time', 'recurring', 'per_unit');
CREATE TYPE order_status AS ENUM (
  'quote_requested', 'quoted', 'payment_pending', 
  'paid', 'in_progress', 'delivered', 'cancelled'
);
CREATE TYPE payment_method AS ENUM (
  'stripe', 'paypal', 'transfer', 'cash', 'whatsapp_quote'
);

-- ═══════════════════════════════════════════════════════════════════════
-- TABLA: productos (catálogo maestro)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE public.productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name_es TEXT NOT NULL,
  name_en TEXT,
  description_es TEXT,
  description_en TEXT,
  category product_category NOT NULL,
  subcategory TEXT,
  icon TEXT DEFAULT '📦',
  price_type product_type NOT NULL DEFAULT 'one_time',
  price_min INTEGER NOT NULL DEFAULT 0,
  price_max INTEGER NOT NULL DEFAULT 0,
  currency TEXT DEFAULT 'DOP',
  delivery_days_min INTEGER DEFAULT 7,
  delivery_days_max INTEGER DEFAULT 21,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  requires_quote BOOLEAN DEFAULT false,
  odoo_product_id INTEGER,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- TABLA: ordenes (pedidos/cotizaciones)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE public.ordenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.clientes(id),
  order_number TEXT UNIQUE NOT NULL,
  status order_status DEFAULT 'quote_requested',
  payment_method payment_method,
  payment_reference TEXT,
  stripe_session_id TEXT,
  paypal_order_id TEXT,
  subtotal INTEGER DEFAULT 0,
  tax INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  currency TEXT DEFAULT 'DOP',
  notes TEXT,
  odoo_sale_order_id INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- TABLA: orden_items (líneas de cada orden)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE public.orden_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_id UUID REFERENCES public.ordenes(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES public.productos(id),
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  subtotal INTEGER NOT NULL,
  customization JSONB DEFAULT '{}',
  progress INTEGER DEFAULT 0,
  progress_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- TABLA: producto_avances (tracking de progreso para dashboard cliente)
-- ═══════════════════════════════════════════════════════════════════════
CREATE TABLE public.producto_avances (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  orden_item_id UUID REFERENCES public.orden_items(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id),
  title TEXT NOT NULL,
  description TEXT,
  progress_percent INTEGER DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status TEXT DEFAULT 'pending',
  attachments JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_productos_category ON public.productos(category);
CREATE INDEX IF NOT EXISTS idx_productos_active ON public.productos(is_active);
CREATE INDEX IF NOT EXISTS idx_ordenes_cliente ON public.ordenes(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ordenes_status ON public.ordenes(status);
CREATE INDEX IF NOT EXISTS idx_orden_items_orden ON public.orden_items(orden_id);
CREATE INDEX IF NOT EXISTS idx_avances_cliente ON public.producto_avances(cliente_id);

-- ═══════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- ═══════════════════════════════════════════════════════════════════════
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ordenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orden_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.producto_avances ENABLE ROW LEVEL SECURITY;

-- Productos: lectura pública (catálogo)
CREATE POLICY "productos_public_read" ON public.productos
  FOR SELECT USING (is_active = true);

-- Órdenes: solo el cliente ve las suyas
CREATE POLICY "ordenes_own_read" ON public.ordenes
  FOR SELECT USING (auth.email() = (
    SELECT email FROM public.clientes WHERE id = cliente_id
  ));

-- Orden items: acceso vía orden del cliente
CREATE POLICY "orden_items_own_read" ON public.orden_items
  FOR SELECT USING (orden_id IN (
    SELECT id FROM public.ordenes WHERE cliente_id IN (
      SELECT id FROM public.clientes WHERE email = auth.email()
    )
  ));

-- Avances: el cliente ve sus avances
CREATE POLICY "avances_own_read" ON public.producto_avances
  FOR SELECT USING (cliente_id IN (
    SELECT id FROM public.clientes WHERE email = auth.email()
  ));

-- ═══════════════════════════════════════════════════════════════════════
-- SEED DATA: Catálogo Completo de RCP Services
-- ═══════════════════════════════════════════════════════════════════════

-- ─── RENOVACIÓN (Servicios) ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('SRV-R01', 'Identidad Visual Básica', 'Basic Visual Identity', 'servicio_renovacion', 'Branding', '🎨', 'one_time', 15000, 30000, 5, 10, '{branding,logo,startup}', 10),
('SRV-R02', 'Rebranding Corporativo Premium', 'Premium Corporate Rebranding', 'servicio_renovacion', 'Branding', '🏆', 'one_time', 40000, 80000, 14, 28, '{branding,premium,identidad}', 20),
('SRV-R03', 'Modelado de Procesos y SOPs', 'Process Modeling & SOPs', 'servicio_renovacion', 'Procesos', '📊', 'one_time', 30000, 60000, 14, 21, '{procesos,sop,eficiencia}', 30),
('SRV-R04', 'Automatización Operativa con IA', 'AI Operational Automation', 'servicio_renovacion', 'Automatización', '🤖', 'one_time', 25000, 55000, 10, 21, '{ia,automatizacion,procesos}', 40),
('SRV-R05', 'Cultura Organizacional', 'Organizational Culture', 'servicio_renovacion', 'RRHH', '🤝', 'one_time', 20000, 40000, 7, 14, '{cultura,rrhh,valores}', 50),
('SRV-R06', 'Auditoría CX (Experiencia del Cliente)', 'CX Audit (Customer Experience)', 'servicio_renovacion', 'CX', '🎯', 'one_time', 15000, 30000, 7, 14, '{cx,experiencia,cliente}', 60),
('SRV-R07', 'Consultoría de Transformación Digital', 'Digital Transformation Consulting', 'servicio_renovacion', 'Digital', '💡', 'one_time', 35000, 70000, 14, 28, '{digital,transformacion,estrategia}', 70),
('SRV-R08', 'Capacitación Empresarial (Talleres)', 'Business Training (Workshops)', 'servicio_renovacion', 'Capacitación', '🎓', 'one_time', 15000, 35000, 3, 7, '{capacitacion,talleres,equipo}', 80);

-- ─── CONSULTORÍA (Servicios) ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('SRV-C01', 'Formalización Comercial Completa', 'Complete Business Formalization', 'servicio_consultoria', 'Legal', '🏢', 'one_time', 25000, 45000, 14, 30, '{legal,onapi,dgii,formalizacion}', 10),
('SRV-C02', 'Registro de Marca en ONAPI', 'ONAPI Trademark Registration', 'servicio_consultoria', 'Legal', '🏷️', 'one_time', 15000, 25000, 30, 90, '{onapi,marca,propiedad}', 20),
('SRV-C03', 'Auditoría y Planificación Fiscal', 'Tax Audit & Planning', 'servicio_consultoria', 'Financiero', '⚖️', 'one_time', 20000, 40000, 7, 14, '{fiscal,dgii,impuestos,auditoria}', 30),
('SRV-C04', 'Licitaciones Públicas (Ley 488-08)', 'Government Procurement (Law 488-08)', 'servicio_consultoria', 'Legal', '🏦', 'one_time', 30000, 60000, 21, 45, '{licitacion,estado,rpe,488}', 40),
('SRV-C05', 'Contratos y NDAs Comerciales', 'Commercial Contracts & NDAs', 'servicio_consultoria', 'Legal', '📝', 'one_time', 15000, 30000, 5, 10, '{contratos,nda,legal}', 50),
('SRV-C06', 'Iguala Mensual Contable', 'Monthly Accounting Retainer', 'servicio_consultoria', 'Financiero', '📊', 'recurring', 12000, 25000, 1, 3, '{contabilidad,mensual,libros}', 60),
('SRV-C07', 'Cumplimiento Laboral y TSS', 'Labor Compliance & Social Security', 'servicio_consultoria', 'Legal', '👷', 'one_time', 20000, 45000, 7, 21, '{laboral,tss,ministerio}', 70),
('SRV-C08', 'Diagnóstico 360° Empresarial', 'Business 360° Diagnosis', 'servicio_consultoria', 'Estrategia', '🔬', 'one_time', 0, 0, 1, 3, '{diagnostico,gratis,estrategia}', 1),
('SRV-C09', 'Plan de Negocio y Proyecciones', 'Business Plan & Projections', 'servicio_consultoria', 'Estrategia', '📈', 'one_time', 25000, 50000, 10, 21, '{plan,proyecciones,financiamiento}', 80),
('SRV-C10', 'Due Diligence para Inversión', 'Investment Due Diligence', 'servicio_consultoria', 'Financiero', '🔍', 'one_time', 40000, 80000, 14, 30, '{inversion,due-diligence,auditoria}', 90);

-- ─── PUBLICIDAD Y MARKETING DIGITAL (Servicios) ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('SRV-P01', 'Landing Page de Conversión', 'Conversion Landing Page', 'servicio_publicidad', 'Web', '💻', 'one_time', 18000, 35000, 5, 10, '{web,landing,conversion}', 10),
('SRV-P02', 'Campañas Meta & Google Ads', 'Meta & Google Ads Campaigns', 'servicio_publicidad', 'Ads', '📢', 'recurring', 15000, 30000, 3, 7, '{ads,meta,google,campanas}', 20),
('SRV-P03', 'CRM Automatizado', 'Automated CRM', 'servicio_publicidad', 'CRM', '🔗', 'one_time', 25000, 50000, 7, 14, '{crm,automatizacion,leads}', 30),
('SRV-P04', 'Posicionamiento SEO Local', 'Local SEO Positioning', 'servicio_publicidad', 'SEO', '🔍', 'recurring', 12000, 25000, 14, 30, '{seo,google,maps,local}', 40),
('SRV-P05', 'Community Manager (Redes Sociales)', 'Social Media Management', 'servicio_publicidad', 'Redes', '📱', 'recurring', 15000, 35000, 3, 7, '{redes,instagram,contenido}', 50),
('SRV-P06', 'E-commerce Completo', 'Complete E-commerce', 'servicio_publicidad', 'Web', '🛍️', 'one_time', 45000, 120000, 21, 45, '{ecommerce,tienda,cardnet}', 60),
('SRV-P07', 'Edición Multimedia TikTok/Reels', 'TikTok/Reels Video Editing', 'servicio_publicidad', 'Contenido', '🎬', 'recurring', 15000, 35000, 5, 10, '{video,tiktok,reels,edicion}', 70),
('SRV-P08', 'Email Marketing Automatizado', 'Automated Email Marketing', 'servicio_publicidad', 'CRM', '✉️', 'recurring', 8000, 20000, 5, 10, '{email,nurturing,automatizacion}', 80),
('SRV-P09', 'Chatbot WhatsApp con IA', 'AI WhatsApp Chatbot', 'servicio_publicidad', 'Automatización', '🤖', 'one_time', 30000, 60000, 10, 21, '{whatsapp,chatbot,ia,atencion}', 90),
('SRV-P10', 'Fotografía de Producto Profesional', 'Professional Product Photography', 'servicio_publicidad', 'Contenido', '📸', 'one_time', 10000, 25000, 3, 7, '{fotografia,producto,catalogo}', 100);

-- ─── SOFTWARE PRE-CONFIGURADO ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('SW-PRE01', 'Sistema POS (Punto de Venta)', 'POS System (Point of Sale)', 'software_preconfigurado', 'POS', '🖥️', 'one_time', 35000, 65000, 7, 14, '{pos,ventas,caja,inventario}', 10),
('SW-PRE02', 'CRM Corporativo Pre-configurado', 'Pre-configured Corporate CRM', 'software_preconfigurado', 'CRM', '📇', 'one_time', 30000, 55000, 7, 14, '{crm,clientes,seguimiento,ventas}', 20),
('SW-PRE03', 'ERP Básico (Ventas + Inventario)', 'Basic ERP (Sales + Inventory)', 'software_preconfigurado', 'ERP', '📦', 'one_time', 45000, 80000, 14, 21, '{erp,inventario,ventas,facturacion}', 30),
('SW-PRE04', 'ERP Completo (Multi-módulo)', 'Complete ERP (Multi-module)', 'software_preconfigurado', 'ERP', '🏗️', 'one_time', 80000, 150000, 21, 45, '{erp,completo,contabilidad,rrhh}', 40),
('SW-PRE05', 'Sistema de Facturación Electrónica', 'Electronic Invoicing System', 'software_preconfigurado', 'Facturación', '🧾', 'one_time', 25000, 45000, 7, 14, '{facturacion,ncf,dgii,comprobante}', 50),
('SW-PRE06', 'Sistema de Reservas/Citas Online', 'Online Booking/Appointment System', 'software_preconfigurado', 'Reservas', '📅', 'one_time', 20000, 40000, 5, 10, '{reservas,citas,calendario,salon}', 60),
('SW-PRE07', 'Plataforma de Delivery/Pedidos', 'Delivery/Orders Platform', 'software_preconfigurado', 'Delivery', '🛵', 'one_time', 50000, 90000, 14, 28, '{delivery,pedidos,restaurante,app}', 70),
('SW-PRE08', 'Dashboard Directivo (KPIs)', 'Executive Dashboard (KPIs)', 'software_preconfigurado', 'BI', '📊', 'one_time', 35000, 60000, 7, 14, '{dashboard,kpi,reportes,metricas}', 80),
('SW-PRE09', 'Sistema de Gestión Escolar', 'School Management System', 'software_preconfigurado', 'Educación', '🏫', 'one_time', 60000, 120000, 21, 45, '{escuela,colegio,notas,matricula}', 90),
('SW-PRE10', 'Sistema de Gestión de Clínica', 'Clinic Management System', 'software_preconfigurado', 'Salud', '🏥', 'one_time', 55000, 100000, 14, 30, '{clinica,pacientes,citas,expediente}', 100);

-- ─── SOFTWARE CUSTOM (Desarrollo a Medida) ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, requires_quote, tags, sort_order) VALUES
('SW-CUS01', 'Aplicación Web a Medida (PWA)', 'Custom Web Application (PWA)', 'software_custom', 'Web App', '🌐', 'one_time', 80000, 250000, 30, 90, true, '{webapp,pwa,custom,desarrollo}', 10),
('SW-CUS02', 'Aplicación Móvil (iOS + Android)', 'Mobile App (iOS + Android)', 'software_custom', 'Mobile', '📱', 'one_time', 120000, 400000, 45, 120, true, '{app,movil,ios,android}', 20),
('SW-CUS03', 'Portal de Clientes Personalizado', 'Custom Client Portal', 'software_custom', 'Portal', '🔐', 'one_time', 60000, 150000, 21, 60, true, '{portal,dashboard,clientes}', 30),
('SW-CUS04', 'Integración de APIs y Sistemas', 'API & Systems Integration', 'software_custom', 'Integración', '🔌', 'one_time', 30000, 100000, 10, 30, true, '{api,integracion,sistemas}', 40),
('SW-CUS05', 'Marketplace / Plataforma Multi-vendor', 'Marketplace / Multi-vendor Platform', 'software_custom', 'Marketplace', '🏪', 'one_time', 150000, 500000, 60, 120, true, '{marketplace,multivendor,plataforma}', 50),
('SW-CUS06', 'Sistema de IA Corporativa Privada', 'Private Corporate AI System', 'software_custom', 'IA', '🧠', 'one_time', 100000, 300000, 30, 60, true, '{ia,privada,llm,corporativa}', 60),
('SW-CUS07', 'Sitio Web Corporativo Multi-página', 'Multi-page Corporate Website', 'software_custom', 'Web', '🖥️', 'one_time', 40000, 100000, 14, 30, false, '{web,corporativo,paginas,seo}', 70),
('SW-CUS08', 'Mantenimiento y Soporte Mensual', 'Monthly Maintenance & Support', 'software_custom', 'Soporte', '🛠️', 'recurring', 8000, 25000, 1, 3, false, '{mantenimiento,soporte,actualizaciones}', 80);

-- ─── IMPRENTA Y PRODUCCIÓN GRÁFICA ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('IMP-01', 'Tarjetas de Presentación (500 uds)', 'Business Cards (500 pcs)', 'imprenta', 'Papelería', '💳', 'per_unit', 3500, 8000, 3, 5, '{tarjetas,presentacion,lujo}', 10),
('IMP-02', 'Hojas Timbradas y Sobres Corporativos', 'Letterhead & Corporate Envelopes', 'imprenta', 'Papelería', '✉️', 'per_unit', 5000, 12000, 5, 7, '{timbrado,sobre,corporativo}', 20),
('IMP-03', 'Carpetas Institucionales', 'Institutional Folders', 'imprenta', 'Papelería', '📁', 'per_unit', 8000, 18000, 5, 10, '{carpeta,institucional,presentacion}', 30),
('IMP-04', 'Volantes / Flyers (1000 uds)', 'Flyers (1000 pcs)', 'imprenta', 'Promocional', '📄', 'per_unit', 4000, 10000, 3, 5, '{volantes,flyer,promocion}', 40),
('IMP-05', 'Brochures / Catálogos Impresos', 'Printed Brochures / Catalogs', 'imprenta', 'Promocional', '📖', 'per_unit', 15000, 45000, 7, 14, '{brochure,catalogo,impreso}', 50),
('IMP-06', 'Formularios de Factura NCF (Blocks)', 'NCF Invoice Forms (Blocks)', 'imprenta', 'Formularios', '🧾', 'per_unit', 3000, 8000, 3, 5, '{factura,ncf,formulario,block}', 60),
('IMP-07', 'Formularios Pre-impresos Personalizados', 'Custom Pre-printed Forms', 'imprenta', 'Formularios', '📋', 'per_unit', 4000, 12000, 5, 7, '{formulario,recibo,orden,conduce}', 70),
('IMP-08', 'Banner / Roll-up (85×200cm)', 'Banner / Roll-up (85×200cm)', 'imprenta', 'Gran Formato', '🎪', 'per_unit', 4500, 9000, 3, 5, '{banner,rollup,exhibicion}', 80),
('IMP-09', 'Valla Publicitaria / Bajante', 'Billboard / Drop Banner', 'imprenta', 'Gran Formato', '📢', 'per_unit', 15000, 45000, 5, 10, '{valla,bajante,exterior}', 90),
('IMP-10', 'Letrero Luminoso / Acrílico', 'Light Box / Acrylic Sign', 'imprenta', 'Rotulación', '💡', 'one_time', 20000, 60000, 7, 14, '{letrero,luminoso,acrilico,fachada}', 100),
('IMP-11', 'Rotulación de Fachada (Vinil)', 'Facade Vinyl Signage', 'imprenta', 'Rotulación', '🏪', 'one_time', 15000, 40000, 5, 10, '{rotulacion,vinil,fachada,local}', 110),
('IMP-12', 'Branding de Vehículos / Flota', 'Vehicle / Fleet Branding', 'imprenta', 'Rotulación', '🚚', 'per_unit', 15000, 45000, 5, 10, '{vehiculo,flota,rotulado,vinil}', 120),
('IMP-13', 'Etiquetas de Producto Personalizadas', 'Custom Product Labels', 'imprenta', 'Etiquetas', '🏷️', 'per_unit', 5000, 15000, 5, 10, '{etiqueta,producto,empaque,sticker}', 130),
('IMP-14', 'Empaque / Packaging Personalizado', 'Custom Packaging', 'imprenta', 'Empaques', '📦', 'per_unit', 12000, 40000, 10, 21, '{empaque,caja,packaging,marca}', 140);

-- ─── ARTÍCULOS CORPORATIVOS Y POP / MERCHANDISING ───
INSERT INTO public.productos (sku, name_es, name_en, category, subcategory, icon, price_type, price_min, price_max, delivery_days_min, delivery_days_max, tags, sort_order) VALUES
('POP-01', 'Uniformes Bordados (Polo/Camisa)', 'Embroidered Uniforms (Polo/Shirt)', 'pop_merchandising', 'Uniformes', '👔', 'per_unit', 1200, 3500, 7, 14, '{uniforme,polo,bordado,camisa}', 10),
('POP-02', 'Gorras Corporativas Bordadas', 'Embroidered Corporate Caps', 'pop_merchandising', 'Uniformes', '🧢', 'per_unit', 600, 1500, 7, 14, '{gorra,bordado,corporativo}', 20),
('POP-03', 'Tazas Personalizadas (Sublimación)', 'Custom Mugs (Sublimation)', 'pop_merchandising', 'Merchandising', '☕', 'per_unit', 400, 900, 5, 7, '{taza,sublimacion,regalo}', 30),
('POP-04', 'Termos / Botellas Corporativas', 'Corporate Bottles / Tumblers', 'pop_merchandising', 'Merchandising', '🍶', 'per_unit', 800, 2000, 7, 14, '{termo,botella,corporativo}', 40),
('POP-05', 'Bolígrafos Corporativos (100 uds)', 'Corporate Pens (100 pcs)', 'pop_merchandising', 'Merchandising', '🖊️', 'per_unit', 3000, 8000, 5, 10, '{boligrafo,pen,promocional}', 50),
('POP-06', 'Libretas / Agendas Personalizadas', 'Custom Notebooks / Planners', 'pop_merchandising', 'Merchandising', '📓', 'per_unit', 1500, 4000, 7, 14, '{libreta,agenda,personalizada}', 60),
('POP-07', 'Lanyards / Porta-carnet Corporativo', 'Corporate Lanyards / ID Holders', 'pop_merchandising', 'Accesorios', '🪪', 'per_unit', 500, 1200, 5, 10, '{lanyard,carnet,identificacion}', 70),
('POP-08', 'USB / Power Banks Personalizados', 'Custom USB / Power Banks', 'pop_merchandising', 'Tech', '🔋', 'per_unit', 1000, 3500, 10, 14, '{usb,powerbank,tech,regalo}', 80),
('POP-09', 'Bolsas Ecológicas con Logo', 'Eco-bags with Logo', 'pop_merchandising', 'Accesorios', '🛍️', 'per_unit', 400, 1000, 5, 10, '{bolsa,ecologica,tote,logo}', 90),
('POP-10', 'Kit de Bienvenida Corporativo', 'Corporate Welcome Kit', 'pop_merchandising', 'Kits', '🎁', 'per_unit', 3000, 8000, 7, 14, '{kit,bienvenida,onboarding,cliente}', 100),
('POP-11', 'Sellos Corporativos (Húmedo + Seco)', 'Corporate Stamps (Wet + Dry)', 'pop_merchandising', 'Papelería', '🔏', 'per_unit', 2500, 5000, 5, 7, '{sello,humedo,seco,legal}', 110),
('POP-12', 'Delantales Personalizados', 'Custom Aprons', 'pop_merchandising', 'Uniformes', '👨‍🍳', 'per_unit', 800, 2000, 7, 10, '{delantal,restaurante,cocina}', 120);

-- ═══════════════════════════════════════════════════════════════════════
-- FUNCIÓN: generar número de orden secuencial
-- ═══════════════════════════════════════════════════════════════════════
DROP TRIGGER IF EXISTS set_order_number ON public.ordenes;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'RCP-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || 
    LPAD(CAST(COALESCE(
      (SELECT COUNT(*) + 1 FROM public.ordenes 
       WHERE created_at >= DATE_TRUNC('month', NOW())), 1
    ) AS TEXT), 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number
  BEFORE INSERT ON public.ordenes
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL)
  EXECUTE FUNCTION public.generate_order_number();
