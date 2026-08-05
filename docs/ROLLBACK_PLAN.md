# Plan de rollback

## Preparación

Registrar SHA de producción, artefacto de Pages, esquema remoto, exportación de configuración y evidencia de smoke test. No mezclar migraciones irreversibles con el despliegue web.

## Disparadores

Rollback inmediato ante exposición de datos, autenticación rota, catálogo incorrecto, ruta crítica inaccesible, degradación severa o contenido legal/comercial no aprobado.

## Procedimiento web

1. Detener nuevos despliegues.
2. Identificar el último workflow exitoso y SHA conocido.
3. Crear un `revert` auditable del cambio defectuoso; no usar `reset --hard`.
4. Ejecutar CI y desplegar desde `master` conforme a la protección vigente.
5. Validar `/`, `/servicios`, `/tienda`, `/diagnostico`, `/portal` y políticas.
6. Documentar incidente, impacto y seguimiento.

## Datos

No se aplican cambios remotos de esquema sin backup, migración inversa o estrategia forward-fix ensayada. En incidente de datos, bloquear escritura antes de restaurar y conservar evidencia.
