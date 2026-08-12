# Rollback web RCP Services 6.0-RC2

## Preparación obligatoria

- Registrar SHA y deployment estable de Vercel.
- Exportar la zona Route 53 completa y guardar valores/TTL de apex y `www`.
- Registrar la URL y SHA de Astro/GitHub Pages.
- Conservar GitHub Pages operativo durante 30 días.
- No combinar el corte web con migraciones de CRM o Hub.

## Disparadores

5xx sostenidos, formulario sin entrega, exposición de datos, contenido comercial incorrecto, rutas críticas rotas, headers ausentes o regresión severa de accesibilidad/rendimiento.

## Reversión rápida

1. Detener despliegues nuevos y capturar evidencia.
2. Si el problema está limitado al código, promover en Vercel el último deployment estable.
3. Si afecta el origen o el corte, restaurar únicamente apex y `www` hacia Astro usando la exportación de Route 53.
4. No modificar MX, TXT, Zoho ni otros subdominios.
5. Confirmar `/`, `/en`, `/catalogo`, `/diagnostico`, políticas, formulario y `/api/health` del destino restaurado.
6. Registrar incidente, impacto, tiempos, referencia de rollback y corrección posterior.

Vercel no revierte datos de Supabase, correo o proveedores. Cada sistema mantiene su propio backup y procedimiento de recuperación.
