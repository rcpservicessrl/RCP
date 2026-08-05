# Checklist de lanzamiento

## Gate 1 — evidencia

- [ ] Claims públicos con fuente/propietario/aprobación.
- [x] Datos operativos incorporados: RNC, dirección, Zoho Mail, cotización sin pagos/Odoo y política de reembolsos.
- [ ] Revisión legal externa de plazos de retención y contratos futuros, si aplica.
- [ ] Precios y catálogo aprobados por negocio.

## Gate 2 — ingeniería

- [ ] `npm ci`, `npm test` y `npm run build` en Node 22.12 o superior.
- [ ] Auditoría de dependencias sin hallazgos críticos no aceptados.
- [ ] Pruebas teclado, contraste, móvil 390 px y escritorio.
- [ ] Enlaces, formularios, robots, canonical, sitemap y 404 validados.
- [ ] RLS por rol y fallos de red probados.

## Gate 3 — operación

- [ ] Staging separado y aprobado, o excepción de riesgo aprobada por el responsable antes de usar GitHub Pages como único entorno.
- [ ] Backup de commit, datos, configuración y DNS exportado.
- [ ] Propietarios de GitHub, DNS, Supabase, Google Analytics y Zoho Mail confirmados.
- [ ] Prueba controlada: una cotización llega a `info@rcp.services` y se responde desde Zoho Mail.
- [ ] Monitoreo y rollback ensayados.

## Gate 4 — producción

- [ ] Aprobación humana explícita del commit exacto.
- [ ] Despliegue, smoke test y observación de 60 minutos.
- [ ] Registro de versión, hora, operador y resultado.

Pagos en línea y Odoo están fuera de alcance. El lanzamiento usa exclusivamente cotización por WhatsApp o correo; cualquier cambio requiere una nueva evaluación de seguridad, legal y operación.
