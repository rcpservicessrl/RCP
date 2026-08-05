# Registro de decisiones

## ADR-001 - Checkout canónico y despliegue

Fecha: 2026-08-05.  
Decisión: usar `C:\RCP\RCP Services\Sitio-Web`, GitHub Pages y el repositorio `rcpservicessrl/RCP`.  
Razón: `AGENTS.md`, arquitectura compartida, remoto Git y Pages coinciden.  
Consecuencia: `vercel.json` no es autoridad de producción.

## ADR-002 - Estrategia de modernización

Alternativas evaluadas:

| Criterio (peso) | A: modernizar actual | B: migración incremental | C: reescritura |
|---|---:|---:|---:|
| Riesgo (20) | 4 | 5 | 1 |
| SEO/URL (15) | 5 | 5 | 2 |
| Reutilización (10) | 5 | 4 | 1 |
| Seguridad (15) | 3 | 5 | 4 |
| Mantenibilidad (15) | 3 | 5 | 5 |
| Administración (10) | 3 | 5 | 5 |
| Rendimiento (5) | 4 | 4 | 4 |
| Tiempo/coste (10) | 5 | 4 | 1 |
| **Total ponderado / 500** | **400** | **470** | **280** |

Decisión: **B, migración incremental**, conservando Astro y URL estables mientras se extraen contratos de catálogo, checkout, contenido y administración. No se autoriza una reescritura total.

## ADR-003 - Autoridad de marca

Decisión: `DECISION_IDENTIDAD_VIGENTE_2026-07-31.md` y `logo_rcp_master_vectorial.svg`. El símbolo es jaguar, inalterable y no generado por IA. Los materiales que lo llaman leopardo/mascota son históricos y no normativos.

## ADR-004 - Precio y cobro

Decisión: el navegador nunca será autoridad. El checkout enviará SKU, versión y cantidad; una función servidor/RPC resolverá producto activo, vigencia, moneda, precio y cupón. Hasta entonces, solo cotización/transferencia pendiente claramente etiquetada; ningún pago se marca como exitoso.

## ADR-005 - Producción

Decisión: no hacer push a `master` ni desplegar antes de build, pruebas críticas, revisión de seguridad, staging, respaldo y plan de reversión. Los cambios se entregarán por rama y PR.

## ADR-006 - Hotfix de lectura del catálogo

Fecha: 2026-08-05. La política `productos_public_read` ejecutaba `is_rcp_admin()` para `anon`, rol sin permiso sobre esa función, y causaba HTTP 401. Tras respaldar esquema y datos se dividió la política por roles mediante la migración `20260805023000`. Prueba posterior: productos activos visibles e inactivos no visibles para `anon`. La versión quedó registrada en el historial remoto.

## ADR-007 - Dependencias y runtime

Astro 5.18.2 acumulaba avisos de seguridad. Se actualizó a Astro 7.1.6, se fijó Node 22 en CI y se regeneró el lockfile con Node compatible. Resultado: auditoría de producción sin vulnerabilidades y build de 18 rutas aprobado.

## ADR-008 - Operación comercial y consentimiento

Fecha: 2026-08-05. Decisión: el lanzamiento comercial usa solo cotización por WhatsApp o correo `info@rcp.services` gestionado en Zoho Mail. Odoo y las pasarelas de pago quedan fuera de alcance. Google Analytics 4 se mantiene con analítica denegada hasta consentimiento explícito; publicidad, personalización y datos publicitarios permanecen denegados. La identidad pública aprobada es RCP Services SRL, RNC 132-147103, Av. Rómulo Betancourt 1302, Bella Vista, Santo Domingo, República Dominicana.
