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
| Procesador de pagos | CardNet/PayPal/Stripe | No | Ninguna sesión/configuración demostrada | Sandbox y webhooks | Bloquea checkout real |
| Correo | proveedor transaccional | No | No identificado | Sandbox/envío de prueba | Bloquea recuperación/notificaciones |
| Analítica | GA4 | Parcial | ID público detectado; cuenta no verificada | Lectura de propiedad | Bloquea validación de eventos/KPI |
| Odoo | integración de leads | Parcial | Código disponible; acceso remoto no verificado | Sandbox/lectura de integración | Bloquea E2E de lead |
| Cloud Function | `rcpLead` | Parcial | endpoint público observado | Logs y despliegue controlado | Bloquea verificación completa |
| Marca | vault corporativo | Sí | Lectura | Lectura | Disponible |
| Revisión legal | privacidad, términos, reembolsos | No | No identificada | Aprobación profesional | Bloquea publicación legal definitiva |

## Permisos mínimos pendientes

1. Un entorno Supabase de staging representativo con datos sintéticos. Motivo: probar migraciones, RLS, RPC de checkout y rollback sin tocar producción.
2. Credenciales sandbox del proveedor de pago seleccionado. Motivo: validar intención, firma y webhook sin activar cobros.
3. Lectura de la propiedad GA4. Motivo: confirmar consentimiento, eventos y ausencia de PII.
4. Logs de Cloud Function/Odoo en entorno de prueba. Motivo: verificar rate limit, reintentos e idempotencia.
5. Revisión profesional de textos legales y afirmaciones reguladas. Motivo: publicar versiones definitivas.

Los permisos pueden ser temporales y de solo lectura salvo staging. Ningún valor debe entrar al repositorio.
