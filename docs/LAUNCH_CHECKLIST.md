# Checklist de lanzamiento

## Gate 1 — evidencia

- [ ] Claims públicos con fuente/propietario/aprobación.
- [ ] Textos legales revisados por responsable autorizado.
- [ ] Precios y catálogo aprobados por negocio.

## Gate 2 — ingeniería

- [ ] `npm ci`, `npm test` y `npm run build` en Node 22.12 o superior.
- [ ] Auditoría de dependencias sin hallazgos críticos no aceptados.
- [ ] Pruebas teclado, contraste, móvil 390 px y escritorio.
- [ ] Enlaces, formularios, robots, canonical, sitemap y 404 validados.
- [ ] RLS por rol y fallos de red probados.

## Gate 3 — operación

- [ ] Staging separado y aprobado.
- [ ] Backup de commit, datos, configuración y DNS exportado.
- [ ] Propietarios de GitHub, DNS, Supabase, analítica y soporte presentes.
- [ ] Monitoreo y rollback ensayados.

## Gate 4 — producción

- [ ] Aprobación humana explícita del commit exacto.
- [ ] Despliegue, smoke test y observación de 60 minutos.
- [ ] Registro de versión, hora, operador y resultado.

Pagos permanecen fuera de alcance hasta integrar proveedor real en sandbox y servidor.
