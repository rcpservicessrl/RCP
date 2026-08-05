# Matriz de accesos

Fecha: 2026-08-05. Los valores de credenciales no se registran.

| Sistema | Recurso | Acceso verificado | Nivel disponible | Nivel mínimo requerido | Estado / bloqueo |
|---|---|---|---|---|---|
| Sistema local | `C:\RCP\RCP Services\Sitio-Web` | Sí | Lectura/escritura | Lectura/escritura | Disponible |
| GitHub | `rcpservicessrl/RCP` | Sí | Admin; scopes repo/workflow | Push de rama y PR | Disponible |
| GitHub Pages | entorno `github-pages` | Sí, metadatos | Admin de repositorio | Despliegue por workflow | Disponible; producción solo tras gates |
| Supabase | proyecto corporativo | Sí | CLI enlazada; migración controlada y respaldo | Staging + migraciones versionadas | Hotfix RLS verificado; staging no demostrado |
| Supabase Auth | usuarios/roles corporativos | Parcial | Código y esquema; no se inspeccionaron usuarios | Administración controlada | Requiere plan de pruebas sin usuarios reales |
| DNS | `rcp.services` | No verificado | Desconocido | Lectura; escritura solo si cambia dominio | No bloquea estabilización; bloquea cambios DNS |
| Procesador de pagos | no aplica | No requerido | Fuera de alcance: cotización por WhatsApp/correo | Ninguno | No bloquea lanzamiento |
| Correo | Zoho Mail para `info@rcp.services` | Declarado por empresa | Recepción por correo | Prueba controlada de recepción | Pendiente prueba operativa, no credenciales |
| Analítica | Google Analytics 4 | Parcial | Medición administrada por la empresa; consentimiento técnico configurado | Lectura de propiedad y revisión de eventos | Pendiente validación de métricas, no bloquea cotización |
| Odoo | no aplica | No requerido | Fuera de alcance actual | Ninguno | No bloquea lanzamiento |
| Cloud Function | no requerida para cotización | No requerido | Cotización no persiste en el sitio | Ninguno | No bloquea lanzamiento |
| Marca | vault corporativo | Sí | Lectura | Lectura | Disponible |
| Revisión legal | privacidad, términos, reembolsos | No | No identificada | Aprobación profesional | Bloquea publicación legal definitiva |

## Permisos mínimos pendientes

1. Un entorno Supabase de staging representativo con datos sintéticos. Motivo: probar migraciones, RLS y rollback sin tocar producción.
2. Prueba controlada de recepción en Zoho Mail. Motivo: confirmar que `info@rcp.services` recibe cotizaciones reales.
3. Lectura de la propiedad GA4. Motivo: confirmar consentimiento, eventos y ausencia de PII.
4. Revisión profesional de textos legales y afirmaciones reguladas. Motivo: confirmar plazos y condiciones antes de cambios comerciales de alto impacto.

Los permisos pueden ser temporales y de solo lectura salvo staging. Ningún valor debe entrar al repositorio.
