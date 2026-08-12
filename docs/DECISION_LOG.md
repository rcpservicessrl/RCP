# Registro de decisiones

## ADR-001 - Checkout canónico y despliegue

Estado: vigente como descripción de la producción Astro anterior al corte; el destino objetivo queda supersedido por ADR-009 y ADR-014.

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

## ADR-009 - Arquitectura web Blueprint 5

Fecha: 2026-08-11. Decisión: construir la evolución web en Next.js App Router y TypeScript, con Cloudflare Workers/OpenNext como destino aprobado y portabilidad a Vercel. Astro permanece en producción hasta completar paridad, seguridad, UAT, aprobación visual y corte explícito. Detalle: `ADR-009_BLUEPRINT_5_NEXT_CLOUDFLARE.md`.

## ADR-010 - Pulso

Fecha: 2026-08-11; actualización aprobada el 2026-08-12. Decisión: Pulso es el nombre oficial de la Mascota Jaguar RCP y la identidad visual del guía público. Las cinco escenas semánticas usan tres posturas completas y transparentes aprobadas: `pulso-presenta-v1`, `pulso-orienta-v1` y `pulso-avanza-v1`. Sus hashes forman la lista blanca vigente. La IA solo puede producir nuevos candidatos offline con invariantes, QA, aprobación, versión y hash; el logo queda excluido. Detalle: `ADR-010_PULSO_IDENTITY_AND_RUNTIME.md`.

## ADR-011 - Catálogo y precio público

Fecha: 2026-08-11. Decisión: transformar tienda/checkout en un catálogo para explorar, comparar, seleccionar y solicitar propuesta. El lanzamiento no muestra precios rígidos ni procesa pagos. RCP permanece como contratista principal; los impresos, letreros y demás productos físicos pertenecen al pilar Publicidad, incluso cuando RCP coordina especialistas o producción de terceros.

## ADR-012 - Fuente de verdad y metadata heredada

Fecha: 2026-08-11. Decisión: Blueprint 5.0 y la Fuente de Verdad 5.0 gobiernan el contenido. Las páginas Astro y sus `sitemap.xml`, `robots.txt` y `llms.txt` quedan archivados fuera de las rutas activas porque publicaban términos y URL superados.

## ADR-013 - Herramientas mínimas

Fecha: 2026-08-11. Decisión: GitHub, Cloudflare, Supabase, RCP CRM, Zoho Mail y Resend cubren el núcleo. PostHog, Sentry y UptimeRobot son condicionados. Clerk, Pinecone y la reconstrucción de Asana/Notion/Slack no aplican mientras no exista una necesidad adicional demostrada.

## ADR-014 - Despliegue controlado

Fecha: 2026-08-11. Decisión: eliminar el despliegue automático de Astro/Pages del candidato. El despliegue Next a Cloudflare es manual, con ambiente GitHub protegido, secretos de mínimo alcance, frase explícita y rollback registrado.

## ADR-015 - Reconciliación de la Fuente de Verdad 6.0-RC1

Fecha: 2026-08-12. Estado: vigente durante la reconciliación. Decisión: aceptar la 6.0-RC1 como candidata de autoridad comercial, verbal, visual, de catálogo, contenido y claims únicamente donde no contradiga decisiones vigentes. Los ADR, el código y las pruebas conservan la autoridad sobre arquitectura, seguridad, datos, despliegue y operación técnica. Las contradicciones públicas quedan congeladas en `FUENTE_DE_VERDAD_6_RC1_DECISION_MATRIX.csv` hasta aprobación explícita de Dirección General. Los complementos aceptados y la evidencia se registran en `FUENTE_DE_VERDAD_6_RC1_CONTRASTE_2026-08-12.md`. La RC1 no se denomina release final ni revoca por sí sola Blueprint 5.0.

## ADR-016 - Promesa principal y narrativa RCP

Fecha: 2026-08-12. Estado: aprobado. Decisión: la promesa principal es **“Le damos nuevo impulso a tu negocio.”** La referencia al “corazón de tu negocio”, junto con las ideas de pulso, ritmo y reanimación, queda autorizada únicamente como narrativa secundaria contextual. No debe volver al encabezado principal, metadata, manifiesto o línea institucional, ni presentarse como un servicio, una garantía o una promesa de resultados. La línea “Estrategia que transforma. Tecnología que impulsa.” conserva su función institucional mientras no exista una decisión posterior que la sustituya. La versión inglesa aprobada para el hero es “We give your business new momentum.”

## ADR-017 - Resolución integral D-02 a D-11 y Fuente de Verdad 6.0-RC2

Fecha: 2026-08-12. Estado: aprobado. Dirección General adopta las recomendaciones D-02 a D-11: Publicidad sigue siendo el tercer pilar y “Publicidad 360” un descriptor; Evaluación Inicial RCP 360° y Diagnóstico RCP 360 son etapas diferentes; el CRM de RCP es interno; legales permanecen bajo revisión; e-CF es una guía educativa en desarrollo; seis soluciones humanas preceden a las 16 siglas; las canónicas actuales se conservan con alias 308; la Red mantiene postulación y asignación manual sin marketplace; Montserrat gobierna el cuerpo y Space Grotesk los títulos digitales; el lockup 3P es secundario y el logo compacto gobierna el encabezado. La autoridad consolidada es `FUENTE_DE_VERDAD_6_RC2.md`.

## ADR-018 - Estados comerciales y madurez técnica independientes

Fecha: 2026-08-12. Estado: aprobado. Toda entidad comercial usa `CommercialState = public | contextual | under_review | in_development | historical`. La capacidad técnica usa por separado `TechnicalMaturity = proven | accelerator | pattern | design`, además de `regulated`, `requiresProfessionalReview` y `selectable`. Catálogo, búsqueda, formularios, JSON-LD e índice descargable consumen solo proyecciones públicas filtradas; las selecciones se vuelven a validar en el servidor.

## ADR-019 - Captación de piloto con entrega confirmada

Fecha: 2026-08-12. Estado: aprobado. `RCP_INTAKE_DELIVERY_MODE=email` es la modalidad de piloto. Resend debe aceptar el correo y devolver un identificador antes de responder `recorded: true`; Zoho recibe las solicitudes y WhatsApp permanece como salida alternativa. El modo `crm` requiere credencial limitada, HMAC SHA-256, timestamp, `Idempotency-Key` y confirmación exacta de referencia. No existe escritura simultánea a dos fuentes de verdad.

## ADR-020 - Vercel Pro como destino web y Route 53 como DNS autoritativo

Fecha: 2026-08-12. Estado: aprobado. La web Next.js se construye y despliega en Vercel con Node 24. Route 53 conserva la autoridad DNS; el corte modifica únicamente apex y `www`. Cloudflare Workers/OpenNext permanece como destino alternativo probado, pero no forma parte del corte RC2. GitHub Pages/Astro permanece como rollback durante 30 días después del cambio.

## ADR-021 - Delivery Hub privado y gate de apertura

Fecha: 2026-08-12. Estado: aprobado. Delivery Hub es una aplicación y repositorio separados con `/ops`, `/cliente` y `/especialista`. El piloto gratuito usa Supabase local y datos sintéticos. No se habilita `hub.rcp.services`, usuarios externos ni datos reales hasta disponer de Supabase Pro separado, respaldo, revisión contractual, MFA privilegiado y prueba de aislamiento RLS entre dos organizaciones.
