# Gobierno documental del sitio RCP Services

- [Auditoría visual del 8 de septiembre](VISUAL_AUDIT_2026-09-08.md): SVG, imágenes de negocios, corrección local y límites de validación.
- [Publicación web vigente](WEB_PUBLICATION_2026-09-07.md): fuente, destino y evidencia de producción.

El dominio público opera con Next.js en Vercel según la evidencia del 2026-09-07. Las referencias anteriores a Astro/GitHub Pages como sitio activo y a un corte todavía pendiente describen el estado previo. El registro de publicación prevalece para el estado operativo; la recepción real de formularios y la integración CRM requieren su propia evidencia.

## Orden de autoridad

1. `FUENTE_DE_VERDAD_6_RC2.md` y las decisiones explícitas posteriores de Dirección General.
2. Los complementos no contradictorios aceptados de 6.0-RC1 y las decisiones 5.0 todavía no sustituidas.
3. `README.md`, `ARCHITECTURE.md`, los ADR vigentes y los documentos indicados abajo para la implementación web, seguridad y operación técnica.
4. Código, pruebas y artefactos verificables de esta rama para el comportamiento ejecutable.

Una pieza histórica no puede ampliar servicios, prometer resultados, fijar precios ni cambiar la identidad aprobada.

Las decisiones D-01 a D-11 fueron aprobadas el 2026-08-12 y están consolidadas en RC2. Una contradicción futura no se resuelve por orden de archivo ni por inferencia: exige registro y aprobación explícita.

## Documentos vigentes para RC2

- `FUENTE_DE_VERDAD_6_RC2.md`: autoridad consolidada de negocio, marca, oferta y gates.
- `WEB_PUBLICATION_2026-09-07.md`: estado operativo publicado, aceptación, límites y procedimiento de reversión; sustituye el estado previo al corte de los documentos anteriores.
- `API_EVENT_CONTRACTS_RC2.md`: contratos servidor-servidor y eventos CRM/Hub/Matrix.
- `RC2_OPERATIONS_AND_GOVERNANCE.md`: fronteras de datos, RBAC/RLS, privacidad, retención, onboarding, backups, incidentes, despliegue y herramientas.

- `BLUEPRINT_5_IMPLEMENTATION.md`: archivo de transición; RC2 lo sustituye donde exista diferencia.
- `OPERATIONS_STACK.md`: herramientas por necesidad, estado y criterio de activación.
- `DEPLOYMENT_RUNBOOK.md`: construcción, preview, despliegue y corte.
- `STAGING_RUNBOOK.md`: UAT aislado.
- `ROLLBACK_PLAN.md`: plan histórico de reversión del corte; para el deployment anterior verificado y la reversión de la publicación vigente, consultar `WEB_PUBLICATION_2026-09-07.md`.
- `MIGRATION_PARITY_MATRIX.md`: paridad frente al sitio Astro.
- `VERIFICATION_REPORT_2026-08-11.md`: evidencia local reproducible.
- `FUENTE_DE_VERDAD_6_RC1_CONTRASTE_2026-08-12.md`: contraste integral, complementos aceptados y correcciones requeridas para RC2.
- `FUENTE_DE_VERDAD_6_RC1_DECISION_MATRIX.csv`: resolución y trazabilidad de D-01 a D-11.
- `LAUNCH_CHECKLIST.md`: lista de gates preparada antes del corte; sus casillas no representan el estado actual de producción. Consultar la evidencia y los pendientes separados en `WEB_PUBLICATION_2026-09-07.md`.
- `ROUTE_INVENTORY.csv` y `REDIRECT_MAP.csv`: contratos de navegación vigentes.
- `MEASUREMENT_PLAN.md` y `POST_LAUNCH_MONITORING.md`: medición y observabilidad.

## Archivo histórico

`CURRENT_STATE_AUDIT.md`, `TRANSFORMATION_PLAN.md`, los inventarios previos y `legacy/` describen el sitio Astro auditado antes de Blueprint 5. Son evidencia útil de riesgos ya detectados, pero no representan la oferta, las rutas ni la arquitectura objetivo actuales.

Los archivos estáticos antiguos de `sitemap.xml`, `robots.txt` y `llms.txt` están preservados en `legacy/astro-public/`; no deben volver a `public/` porque ocultarían las rutas generadas por Next.js.
