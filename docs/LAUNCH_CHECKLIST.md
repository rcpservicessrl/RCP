# Checklist de lanzamiento RCP Services 6.0-RC2

La evidencia vigente está en `PRODUCTION_EVIDENCE_2026-08-20.md`. Las casillas
que siguen abiertas son gates reales, no tareas de código ocultas.

## 1. Negocio, marca y contenido

- [x] D-01 a D-11 consolidadas en RC2.
- [x] Tres pilares, Publicidad 360 como descriptor y tecnología transversal.
- [x] Evaluación gratuita separada del diagnóstico pagado.
- [x] Estados comerciales/técnicos filtran toda superficie pública.
- [x] Pulso y tres posturas aprobadas protegidos por hash.
- [ ] Aprobación visual/comercial del SHA exacto en staging.
- [ ] Revisión humana de políticas, privacidad y contratos aplicables.

## 2. Ingeniería local

- [x] TypeScript aprobado.
- [x] Baseline web y 47/47 pruebas RC2 aprobadas.
- [x] Build Next 16 con Node 24 aprobado.
- [x] Auditoría productiva sin vulnerabilidades conocidas.
- [x] 390×844, 768×1024, 1280×720 y 1440×900 revisados; sin overflow ni imágenes rotas.
- [x] ES/EN, claro/oscuro, música, búsqueda, menú, rutas, catálogo y cuatro pasos de evaluación funcionales.
- [x] Redirect 308, sitemap, robots de staging y headers comprobados.
- [ ] Auditoría automatizada de accesibilidad sin hallazgos críticos/serios.
- [x] Checks CI Linux del commit candidato.

## 3. Staging e integraciones

- [ ] Proyecto/equipo Vercel Pro confirmado.
- [ ] Deployment `staging.rcp.services` con `noindex` y SHA registrado.
- [ ] Resend/subdominio con SPF/DKIM y entrega única hacia Zoho.
- [ ] Turnstile y protección distribuida/rate limit comprobados.
- [ ] Sentry, PostHog y UptimeRobot configurados o diferidos formalmente.
- [ ] UAT visual, funcional, SEO/AEO y formulario aprobado.

## 4. CRM

- [x] Vulnerabilidades de autorización, SSRF, replay, medios y middleware cerradas en el candidato.
- [x] 667 pruebas y escenarios de seguridad aprobados por CI.
- [x] Replay aislado de las 39 migraciones locales aprobado; la deriva del ledger remoto sigue documentada y bloqueada para reconciliación forward-only.
- [ ] Secretos rotados y configuración re-cifrada.
- [ ] Backup/restauración, outbox, cron y contratos de intake comprobados.
- [ ] Vercel estable siete días antes de retirar Netlify.

## 5. Hub

- [x] Aplicación separada y esquema local implementados.
- [x] Flujo sintético, contratos, leases, RLS y gates verificados localmente.
- [x] Preview privado sintético publicado en Vercel con `noindex`, health verificable e integraciones desactivadas.
- [x] Ningún usuario externo durante piloto local.
- [ ] Para apertura: Supabase Pro separado, contrato, backup, MFA y RLS aprobados.

## 6. Corte web

- [ ] `main` protegida, PR aprobado y SHA/deployment registrados.
- [ ] Export Route 53 y rollback Astro comprobados.
- [ ] Cambiar solo apex/`www` y observar 60 min, 24 h, 7 días y 30 días.
- [ ] Mantener GitHub Pages 30 días.

No se marca la meta como completa mientras los gates externos sigan abiertos.
