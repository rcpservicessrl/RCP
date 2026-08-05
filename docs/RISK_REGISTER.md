# Registro de riesgos

| ID | Riesgo | Prob. | Impacto | Prioridad | Mitigación | Estado |
|---|---|---:|---:|---|---|---|
| R-001 | Precio y artículos manipulables desde URL | Alta | Crítico | P0 | Resolver SKU/precio/cupón en servidor | Abierto |
| R-002 | Checkout vacío permite iniciar flujo | Alta | Alto | P0 | Bloqueo UI y validación de dominio | Abierto |
| R-003 | Métodos de pago simulados se anuncian como reales | Alta | Crítico | P0 | Desactivar copy/CTA; sandbox antes de activar | Abierto |
| R-004 | Inserción anónima de clientes susceptible a spam | Alta | Alto | P0 | Endpoint con rate limit/CAPTCHA/validación | Abierto |
| R-005 | Claims/testimonios sin evidencia | Alta | Alto | P0 | Retirar, registrar y aprobar | Abierto |
| R-006 | Propuesta de inversión pública/indexable | Media | Crítico | P0 | Clasificar, noindex y control de acceso | Requiere decisión |
| R-007 | GitHub Pages sin cabeceras declaradas | Alta | Alto | P0 | CSP/meta compatible o hosting con headers | Abierto |
| R-008 | Dependencias con vulnerabilidades altas | Alta | Alto | P0 | Upgrade controlado Astro 7 + regresión | Abierto |
| R-009 | Sin tests/lint/typecheck | Alta | Alto | P0 | Gates en CI antes de despliegue | Abierto |
| R-010 | Catálogo estático duplica 72 productos remotos | Alta | Alto | P0 | Eliminar fallback de precios | Abierto |
| R-011 | Widgets cubren CTA en móvil | Alta | Medio | P1 | Reglas de safe area responsive | Abierto |
| R-012 | Páginas legales ausentes | Alta | Alto | P0 | Borradores técnicos + revisión legal | Abierto |
| R-013 | Diagnóstico sin metodología aprobada | Alta | Alto | P1 | Propuesta para aprobación; no inventar | Requiere decisión |
| R-014 | Migraciones en snippets, no flujo reproducible | Media | Alto | P1 | Migraciones versionadas y staging | Abierto |
| R-015 | Supabase corporativo contiene esquemas de clientes | Media | Alto | P1 | Reconciliar con RCP Matrix; no migrar ahora | Security hold |
| R-016 | Configuración Vercel contradice GitHub Pages | Alta | Medio | P1 | Retirar o documentar como no autoritativa | Abierto |
| R-017 | Activos de marca heredados contradicen norma | Media | Medio | P1 | Manifest de activos y autoridad | Abierto |
| R-018 | DOCX no tuvo QA visual por falta de LibreOffice | Media | Bajo | P2 | Revisar en entorno con render | Abierto |

## Criterios de reversión inmediatos

- Error en autenticación, RLS o portal.
- Creación de orden con precio no autorizado o total no positivo.
- Cambio de URL/canonical no previsto.
- Caída de formulario crítico, build o navegación móvil.
- Exposición de datos/secretos o incremento de vulnerabilidades críticas.
