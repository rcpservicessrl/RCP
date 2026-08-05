# Revisión de seguridad

Fecha: 2026-08-05

## Verificado

- Repositorio GitHub con permiso administrativo y Pages activo.
- `.env` local no está rastreado; no se registran valores de credenciales en este documento.
- Proyecto corporativo Supabase activo y enlazado; se generó respaldo de esquema y datos antes del hotfix.
- RLS activo en catálogo, clientes, órdenes e ítems. El hotfix `20260805023000` separó lectura `anon` y `authenticated`: usuario anónimo obtiene productos activos y cero inactivos.
- Checkout anterior aceptaba precios del cliente y simulaba IDs de pago. Fue desactivado y reemplazado por solicitud de cotización.
- Diagnóstico enviaba PII sin consentimiento y calculaba una pérdida aleatoria. Se eliminó ese envío y la estimación.

## Pendientes bloqueantes

- GitHub Pages no permite configurar todos los headers HTTP requeridos desde este repositorio. Migrar a un edge/CDN controlable o configurar DNS/proxy antes de declarar CSP/HSTS completos.
- Astro se actualizó de 5.18.2 a 7.1.6 con Node 22 en CI. `npm audit --omit=dev` reporta 0 vulnerabilidades y la regresión de build pasó con Node 24 local.
- No existe staging operativo ni sandbox de pagos.
- Falta revisión legal de políticas y trazabilidad de consentimiento.
- La propuesta de inversión sigue públicamente accesible aunque no indexable; requiere autenticación si es confidencial.

## Dictamen

El sitio puede operar como presencia corporativa y captación/cotización. No está autorizado para procesar pagos ni crear órdenes financieras hasta integrar proveedor real, servidor autoritativo, sandbox y conciliación.
