-- ═══════════════════════════════════════════════════════════════════════
-- RCP Services — Fase 3: Métricas reales (reemplaza simulaciones)
-- Ejecutar en: Supabase Dashboard > SQL Editor
--   (después de 01_security_hardening.sql y 02_rbac_schema.sql)
--
-- Este script:
--   1. Crea tabla `marketing_metrics` (ad spend, impresiones, leads, etc.)
--   2. Crea tabla `client_tramites` (progreso ONAPI/Cámara/DGII dinámico)
--   3. Crea RPC `dashboard_overview(p_email, p_global)` que agrega en una
--      sola llamada todo lo que el dashboard necesita (KPIs, chart_data
--      derivado de ordenes paid, pagos reales, trámites, marketing).
--
-- Reemplaza los valores simulados en dashboard.html por datos reales.
-- Las columnas legacy `clientes.tramite_*` se conservan por compatibilidad;
-- el dashboard prioriza `client_tramites`.
-- ═══════════════════════════════════════════════════════════════════════

BEGIN;

-- ───────────────────────────────────────────────────────────────────────
-- 1. ENUMs
-- ───────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.tramite_tipo AS ENUM ('onapi', 'camara', 'dgii');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ───────────────────────────────────────────────────────────────────────
-- 2. TABLA: marketing_metrics
--    Granularidad: (cliente_id, period) donde period = 1ro del mes.
--    CPL/ROAS/Conversión se CALCULAN (no se almacenan):
--      CPL         = ad_spend / NULLIF(leads, 0)
--      ROAS        = revenue_attributed / NULLIF(ad_spend, 0)
--      Conversion  = conversions / NULLIF(leads, 0)
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.marketing_metrics (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id         UUID REFERENCES public.clientes(id) ON DELETE CASCADE,
  period             DATE NOT NULL,                    -- 1ro del mes (YYYY-MM-01)
  ad_spend           INTEGER NOT NULL DEFAULT 0,        -- inversión publicitaria (minor units DOP)
  impressions        BIGINT  NOT NULL DEFAULT 0,
  leads              INTEGER NOT NULL DEFAULT 0,
  conversions        INTEGER NOT NULL DEFAULT 0,
  revenue_attributed INTEGER NOT NULL DEFAULT 0,        -- ingresos atribuidos (minor units)
  currency           TEXT    NOT NULL DEFAULT 'DOP',
  source             TEXT,                              -- 'meta' | 'google' | 'manual' | 'n8n'
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, period)
);

CREATE INDEX IF NOT EXISTS idx_marketing_cliente_period
  ON public.marketing_metrics (cliente_id, period DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_marketing_updated ON public.marketing_metrics;
CREATE TRIGGER trg_marketing_updated
  BEFORE UPDATE ON public.marketing_metrics
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

-- ───────────────────────────────────────────────────────────────────────
-- 3. TABLA: client_tramites
--    Reemplaza los % fijos de ONAPI/Cámara/DGII. Una fila por tipo.
-- ───────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.client_tramites (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id      UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo            public.tramite_tipo NOT NULL,
  progress_percent INTEGER NOT NULL DEFAULT 0
                  CHECK (progress_percent >= 0 AND progress_percent <= 100),
  status          TEXT NOT NULL DEFAULT 'pending',
  description     TEXT,                                -- texto dinámico (reemplaza <p> hardcoded)
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (cliente_id, tipo)
);

CREATE INDEX IF NOT EXISTS idx_tramites_cliente ON public.client_tramites (cliente_id);

DROP TRIGGER IF EXISTS trg_tramites_updated ON public.client_tramites;
CREATE TRIGGER trg_tramites_updated
  BEFORE UPDATE ON public.client_tramites
  FOR EACH ROW EXECUTE FUNCTION public.fn_set_updated_at();

-- Seed inicial: si un cliente ya tenía % en columnas legacy, migrarlos.
-- Idempotente: solo inserta si no existe la fila para ese (cliente, tipo).
INSERT INTO public.client_tramites (cliente_id, tipo, progress_percent, description)
SELECT c.id, 'onapi', COALESCE(c.tramite_onapi, 0),
       'Documentación ONAPI en revisión.' -- placeholder, editable por admin
FROM public.clientes c
WHERE c.tramite_onapi IS NOT NULL
ON CONFLICT (cliente_id, tipo) DO NOTHING;

INSERT INTO public.client_tramites (cliente_id, tipo, progress_percent, description)
SELECT c.id, 'camara', COALESCE(c.tramite_camara, 0),
       'Registro en Cámara de Comercio.'
FROM public.clientes c
WHERE c.tramite_camara IS NOT NULL
ON CONFLICT (cliente_id, tipo) DO NOTHING;

INSERT INTO public.client_tramites (cliente_id, tipo, progress_percent, description)
SELECT c.id, 'dgii', COALESCE(c.tramite_dgii, 0),
       'Inscripción y cumplimiento DGII.'
FROM public.clientes c
WHERE c.tramite_dgii IS NOT NULL
ON CONFLICT (cliente_id, tipo) DO NOTHING;

-- ───────────────────────────────────────────────────────────────────────
-- 4. RLS
-- ───────────────────────────────────────────────────────────────────────
ALTER TABLE public.marketing_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_tramites   ENABLE ROW LEVEL SECURITY;

-- marketing_metrics: lectura = propio cliente o quien tenga facturacion.read / dashboard.admin_view / rbac.manage
DROP POLICY IF EXISTS "Marketing: lectura autorizada" ON public.marketing_metrics;
CREATE POLICY "Marketing: lectura autorizada" ON public.marketing_metrics
  FOR SELECT USING (
    cliente_id IS NULL  -- filas globales/agregadas (si las hubiera)
    OR EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = marketing_metrics.cliente_id AND c.email = auth.email())
    OR public.has_permission(auth.email(), 'facturacion.read')
    OR public.has_permission(auth.email(), 'dashboard.admin_view')
    OR public.has_permission(auth.email(), 'rbac.manage')
  );

-- escritura: admin financiero o rbac.manage (n8n usa service_role que bypassa RLS)
DROP POLICY IF EXISTS "Marketing: escritura autorizada" ON public.marketing_metrics;
CREATE POLICY "Marketing: escritura autorizada" ON public.marketing_metrics
  FOR ALL USING (
    public.has_permission(auth.email(), 'facturacion.write')
    OR public.has_permission(auth.email(), 'rbac.manage')
  )
  WITH CHECK (
    public.has_permission(auth.email(), 'facturacion.write')
    OR public.has_permission(auth.email(), 'rbac.manage')
  );

-- client_tramites: mismo patrón que clientes (propio o admin con dashboard.read/admin_view)
DROP POLICY IF EXISTS "Tramites: lectura autorizada" ON public.client_tramites;
CREATE POLICY "Tramites: lectura autorizada" ON public.client_tramites
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.clientes c WHERE c.id = client_tramites.cliente_id AND c.email = auth.email())
    OR public.has_permission(auth.email(), 'dashboard.read')
    OR public.has_permission(auth.email(), 'dashboard.admin_view')
    OR public.has_permission(auth.email(), 'rbac.manage')
  );

DROP POLICY IF EXISTS "Tramites: escritura autorizada" ON public.client_tramites;
CREATE POLICY "Tramites: escritura autorizada" ON public.client_tramites
  FOR ALL USING (
    public.has_permission(auth.email(), 'dashboard.admin_view')
    OR public.has_permission(auth.email(), 'rbac.manage')
  )
  WITH CHECK (
    public.has_permission(auth.email(), 'dashboard.admin_view')
    OR public.has_permission(auth.email(), 'rbac.manage')
  );

-- ───────────────────────────────────────────────────────────────────────
-- 5. RPC: dashboard_overview(p_email, p_global DEFAULT false)
--    Devuelve JSON con todo lo que el dashboard necesita en 1 llamada:
--      company_name, owner_name, ventas, ventas_trend, cpl, cpl_trend,
--      roas, roas_trend, ltv, ltv_trend,
--      chart_data (7 puntos = ventas por mes, derivado de ordenes paid),
--      pagos (mapeo de ordenes paid → transacciones),
--      tramites (array de client_tramites),
--      marketing (último periodo de marketing_metrics),
--      erp_synced (bool = última orden tiene odoo_sale_order_id)
--
--    p_global=TRUE → agrega SUM/AVG sobre TODOS los clientes (vista admin).
-- ───────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.dashboard_overview(p_email TEXT, p_global BOOLEAN DEFAULT FALSE)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_client   RECORD;
  v_result   JSONB;
  v_chart    BIGINT[];
  v_pagos    JSONB;
  v_tramites JSONB;
  v_mkt      JSONB;
  v_erp      BOOLEAN;
BEGIN
  IF p_global THEN
    -- ─── VISTA GLOBAL ADMIN ───
    -- Agrega métricas sobre todos los clientes. Reemplaza defaultMetrics(0).
    SELECT
      COALESCE(SUM(c.ventas), 0)                          AS ventas,
      COALESCE(AVG(c.cpl), 0)                              AS cpl,
      COALESCE(AVG(c.roas), 0)                             AS roas,
      COALESCE(SUM(c.ltv), 0)                              AS ltv,
      COUNT(*)                                             AS clientes_count
    INTO v_client
    FROM public.clientes c;

    -- chart_data global: ventas mensuales de TODAS las ordenes paid (últimos 7 meses)
    SELECT COALESCE(array_agg(monthly ORDER BY period), ARRAY[0,0,0,0,0,0,0]::BIGINT[])
    INTO v_chart
    FROM (
      SELECT date_trunc('month', o.created_at)::DATE AS period,
             COALESCE(SUM(o.total), 0)              AS monthly
      FROM public.ordenes o
      WHERE o.status = 'paid'
        AND o.created_at >= date_trunc('month', now()) - INTERVAL '6 months'
      GROUP BY 1
    ) s;

    -- Pagos globales: últimas 10 ordenes paid
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'id', o.order_number,
      'date', to_char(o.created_at, 'YYYY-MM-DD'),
      'items', COALESCE((SELECT string_agg(p.name_es, ', ')
                         FROM public.orden_items oi
                         JOIN public.productos p ON p.id = oi.producto_id
                         WHERE oi.orden_id = o.id), '—'),
      'amount', 'RD$ ' || to_char(o.total, 'FM999,999,999'),
      'method', COALESCE(o.payment_method::TEXT, '—'),
      'sync', CASE WHEN o.odoo_sale_order_id IS NOT NULL THEN 'sync' ELSE 'pending' END,
      'sincronizado_odoo', o.odoo_sale_order_id IS NOT NULL
    ) ORDER BY o.created_at DESC), '[]'::jsonb)
    INTO v_pagos
    FROM public.ordenes o
    WHERE o.status = 'paid'
    ORDER BY o.created_at DESC
    LIMIT 10;

    v_tramites := '[]'::jsonb;   -- los trámites son por cliente, no globales
    v_mkt := NULL;
    v_erp := EXISTS (
      SELECT 1 FROM public.ordenes o
      WHERE o.status = 'paid' AND o.odoo_sale_order_id IS NOT NULL
    );

    v_result := jsonb_build_object(
      'company_name', 'Vista Global',
      'owner_name',   'Resumen',
      'ventas',       v_client.ventas,
      'ventas_trend', '▲',
      'cpl',          v_client.cpl,
      'cpl_trend',    '▼',
      'roas',         v_client.roas,
      'roas_trend',   '▲',
      'ltv',          v_client.ltv,
      'ltv_trend',    '▲',
      'chart_data',   COALESCE(v_chart, ARRAY[0,0,0,0,0,0,0]::BIGINT[]),
      'pagos',        v_pagos,
      'tramites',     v_tramites,
      'marketing',    v_mkt,
      'erp_synced',   v_erp,
      'is_global',    TRUE,
      'status',       'active'
    );
  ELSE
    -- ─── VISTA DE UN CLIENTE ───
    SELECT c.* INTO v_client
    FROM public.clientes c
    WHERE c.email = p_email
    LIMIT 1;

    IF NOT FOUND THEN
      -- Cliente sin fila aún: devolver estructura vacía (dashboard muestra "sin datos")
      RETURN jsonb_build_object(
        'company_name', NULL, 'owner_name', NULL,
        'ventas', 0, 'ventas_trend', '—', 'cpl', 0, 'cpl_trend', '—',
        'roas', 0, 'roas_trend', '—', 'ltv', 0, 'ltv_trend', '—',
        'chart_data', ARRAY[0,0,0,0,0,0,0]::BIGINT[],
        'pagos', '[]'::jsonb, 'tramites', '[]'::jsonb,
        'marketing', NULL, 'erp_synced', FALSE, 'is_global', FALSE,
        'found', FALSE
      );
    END IF;

    -- chart_data: ventas mensuales reales (ordenes paid) del cliente, 7 meses
    SELECT COALESCE(array_agg(monthly ORDER BY period), ARRAY[0,0,0,0,0,0,0]::BIGINT[])
    INTO v_chart
    FROM (
      SELECT date_trunc('month', o.created_at)::DATE AS period,
             COALESCE(SUM(o.total), 0)              AS monthly
      FROM public.ordenes o
      WHERE o.cliente_id = v_client.id
        AND o.status = 'paid'
        AND o.created_at >= date_trunc('month', now()) - INTERVAL '6 months'
      GROUP BY 1
    ) s;

    -- Pagos del cliente: ordenes paid
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'id', o.order_number,
      'date', to_char(o.created_at, 'YYYY-MM-DD'),
      'items', COALESCE((SELECT string_agg(p.name_es, ', ')
                         FROM public.orden_items oi
                         JOIN public.productos p ON p.id = oi.producto_id
                         WHERE oi.orden_id = o.id), '—'),
      'amount', 'RD$ ' || to_char(o.total, 'FM999,999,999'),
      'method', COALESCE(o.payment_method::TEXT, '—'),
      'sync', CASE WHEN o.odoo_sale_order_id IS NOT NULL THEN 'sync' ELSE 'pending' END,
      'sincronizado_odoo', o.odoo_sale_order_id IS NOT NULL
    ) ORDER BY o.created_at DESC), '[]'::jsonb)
    INTO v_pagos
    FROM public.ordenes o
    WHERE o.cliente_id = v_client.id AND o.status = 'paid'
    ORDER BY o.created_at DESC
    LIMIT 10;

    -- Trámites del cliente (client_tramites, con fallback a columnas legacy)
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'tipo', t.tipo::TEXT,
      'progress_percent', t.progress_percent,
      'status', t.status,
      'description', t.description
    ) ORDER BY t.tipo), '[]'::jsonb)
    INTO v_tramites
    FROM public.client_tramites t
    WHERE t.cliente_id = v_client.id;

    -- Si no hay filas en client_tramites, construir desde columnas legacy
    IF v_tramites = '[]'::jsonb THEN
      v_tramites := jsonb_build_array(
        jsonb_build_object('tipo','onapi',  'progress_percent', COALESCE(v_client.tramite_onapi,0),  'description', 'Documentación ONAPI.'),
        jsonb_build_object('tipo','camara', 'progress_percent', COALESCE(v_client.tramite_camara,0), 'description', 'Registro en Cámara.'),
        jsonb_build_object('tipo','dgii',   'progress_percent', COALESCE(v_client.tramite_dgii,0),   'description', 'Inscripción DGII.')
      );
    END IF;

    -- Marketing: último periodo
    SELECT to_jsonb(m) - 'id' - 'cliente_id'
    INTO v_mkt
    FROM public.marketing_metrics m
    WHERE m.cliente_id = v_client.id
    ORDER BY m.period DESC
    LIMIT 1;

    v_erp := EXISTS (
      SELECT 1 FROM public.ordenes o
      WHERE o.cliente_id = v_client.id
        AND o.status = 'paid' AND o.odoo_sale_order_id IS NOT NULL
    );

    v_result := jsonb_build_object(
      'company_name', v_client.company_name,
      'owner_name',   v_client.owner_name,
      'ventas',       COALESCE(v_client.ventas, 0),
      'ventas_trend', COALESCE(v_client.ventas_trend, '—'),
      'cpl',          COALESCE(v_client.cpl, 0),
      'cpl_trend',    COALESCE(v_client.cpl_trend, '—'),
      'roas',         COALESCE(v_client.roas, 0),
      'roas_trend',   COALESCE(v_client.roas_trend, '—'),
      'ltv',          COALESCE(v_client.ltv, 0),
      'ltv_trend',    COALESCE(v_client.ltv_trend, '—'),
      'chart_data',   COALESCE(v_chart, ARRAY[0,0,0,0,0,0,0]::BIGINT[]),
      'pagos',        v_pagos,
      'tramites',     v_tramites,
      'marketing',    v_mkt,
      'erp_synced',   v_erp,
      'is_global',    FALSE,
      'found',        TRUE,
      'status',       COALESCE(v_client.status, 'active')
    );
  END IF;

  RETURN v_result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.dashboard_overview(TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.dashboard_overview(TEXT, BOOLEAN) TO authenticated, anon;

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════
-- VERIFICACIÓN POST-EJECUCIÓN
--
--   -- Vista de un cliente (usar email real):
--   SELECT public.dashboard_overview('cliente@ejemplo.com', false);
--     -- debe traer chart_data, pagos, tramites como arrays JSON
--
--   -- Vista global admin:
--   SELECT public.dashboard_overview('admin@rcp.services', true);
--     -- is_global=true, ventas = SUM de todos los clientes
--
--   -- Tablas creadas:
--   SELECT count(*) FROM public.marketing_metrics;  -- 0 si nadie ha importado
--   SELECT count(*) FROM public.client_tramites;    -- filas migradas de legacy
--
--   -- Insertar una métrica de marketing de prueba (ej.):
--   INSERT INTO public.marketing_metrics (cliente_id, period, ad_spend, impressions, leads, conversions, revenue_attributed, source)
--   SELECT id, date_trunc('month', now())::DATE, 85000, 1400000, 340, 23, 320000, 'manual'
--   FROM public.clientes WHERE email = 'cliente@ejemplo.com';
-- ═══════════════════════════════════════════════════════════════════════
