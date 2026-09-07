# Continuidad de publicación web — 2026-09-07

**Actualización posterior:** publicación y aceptación completadas; consultar `WEB_PUBLICATION_2026-09-07.md` para el SHA desplegado, pruebas y reversión. El resto de este archivo conserva el estado histórico de la entrega inicial.

Registrado por el agente principal al detener el trabajo por solicitud del usuario. Este cierre actualiza el estado de despliegue que figura como pendiente en `WEB_RELEASE_CANDIDATE_2026-09-07.md`; conserva aquel documento como evidencia del build original.

## Fuente y cambios pendientes

- Carpeta: `C:\RCP\.worktrees\rcp-visual-3-2`.
- Rama: `codex/rcp-human-customer-journey`.
- HEAD: `3d5fc9942cef9258aa6fd99b8329797c28e41388`; no push realizado.
- Cambios sin commit, confirmados al cerrar: `components/business-route-map.tsx` y `app/customer-journey.css`, 10 inserciones y 8 eliminaciones. No descartarlos.
- El fix sustituye nodos `<g>` interactivos por botones HTML nativos sobre un SVG decorativo; conserva aria-pressed, aria-controls, resultado aria-live y URL de solicitud. Necesita typecheck, build y UAT de clic/teclado/móvil. No se acredita ninguna prueba posterior al fix.
- Este documento es un archivo nuevo adicional de entrega; no confundirlo con un cambio de implementación.

## Despliegues

- Proyecto Vercel `prj_ic8foNHimMF3FVAHz4yLx2ZgcaDr`, equipo `team_FrUB7sn8QI4Gl3EEN8Io7TfF`.
- Preview base READY: `https://rcp-services-cd75l71d8-rcp-services.vercel.app`, ID `dpl_EUmBN7XXNAWy4kw5N2cKDDXThE6P`, SHA 3d5fc99. Protegido; obtener un enlace temporal oficial si se necesita acceso.
- Build production enviado con `--prod --skip-domain` antes del hallazgo: `https://rcp-services-mkw5og5n9-rcp-services.vercel.app`, ID `dpl_3ZLbxwMZXr5twn9CXeMs43ANC1a9`, mismo SHA base. No se acredita aquí su estado final. **No promover: no contiene el fix SVG.**
- Producción anterior/rollback: `dpl_2PX45Wg8uPyXtA65oo3G77Aap5uB`, SHA `31963b673fb43ccd3f18480824f7cf385acbfd26`. `rcp.services`, `www` y el alias `rcp-services-staging.vercel.app` seguían en este deployment; no se cambió el dominio.

## Aceptación de la versión base

- 31 servicios, 31 rutas y hashes de imagen diferentes; 18 ilustraciones nuevas 2.5D y fotografías naturales para acompañamiento. Cabeza oficial del leopardo legible.
- Typecheck, 59 pruebas, build de 65 rutas y auditoría de dependencias aprobados antes del fix SVG.
- 34 comprobaciones HTTP de preview aprobadas: rutas ES/EN, redirect/404, 18 WebP con hash exacto, hero y mascota. Health ok, versión 6rc2, deliveryMode=email, noindex de preview correcto.
- UAT manual: portada escritorio, búsqueda vacía y recuperación a 31 opciones, agregar servicio y conservarlo hasta el paso 3 de evaluación; no se envió formulario. Catálogo móvil 390, menú y tema claro; tableta 768 inglés, sin imágenes rotas ni desbordamiento horizontal.
- Hallazgo SVG: Enter cambia selección y URL sugerida; los clics probados no cambiaban selección. La nueva versión con botones aún no se probó.

## Próximos pasos exactos

1. Revisar el diff de los dos archivos, validar typecheck y comportamiento; hacer sólo un build a la vez con Node heap 768.
2. Confirmar fuente final y actualizar manifiesto/evidencia; crear preview del nuevo SHA y probar clic, teclado y móvil.
3. Crear build del mismo SHA con `RCP_DEPLOYMENT_ENV=production` y `--prod --skip-domain`, sin asignar dominio todavía. Verificar READY, versión, rutas, imágenes, robots y ausencia de noindex de preview.
4. Publicar/asignar el deployment de producción ya verificado conforme a la autorización existente del usuario; confirmar el dominio real y conservar rollback anterior.
5. **No promover un artefacto construido como preview**: conservaría robots Disallow/noindex.
6. CRM web sigue pendiente: deliveryMode=email no demuestra alta operativa CRM. No activar proveedores ni mandar pruebas a contactos reales.

Guía completa de plataforma, pruebas e integraciones restantes: `C:\RCP\RCP-SUPERAPP-CONTINUIDAD-2026-09-07.md`.
