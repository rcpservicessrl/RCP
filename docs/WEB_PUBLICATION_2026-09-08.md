---
id: web-publication-20260908
project: rcp-services-web
status: published-and-verified
recorded_at: 2026-09-08T03:25:33-04:00
source_commit: a85ece2a3b6dede3752fc71f82a7b95a9af532b6
deployment_id: dpl_wAVmuN8Ux5xmffeizgwQDf34KNgL
previous_deployment_id: dpl_8hSiy9t9L7LRWcu9rmwFM58B9ku2
public_origin: https://rcp.services
---

# Publicación web RCP Services — 8 de septiembre de 2026

## Resultado

La corrección visual y de idempotencia quedó publicada en Vercel y promovida al
dominio existente. No se cambiaron DNS, secretos, CRM, Supabase ni datos de
clientes.

- Fuente: rama `codex/rcp-human-customer-journey`, commit
  `a85ece2a3b6dede3752fc71f82a7b95a9af532b6`.
- Deployment: `dpl_wAVmuN8Ux5xmffeizgwQDf34KNgL`.
- URL de inspección: `https://vercel.com/rcp-services/rcp-services-web/wAVmuN8Ux5xmffeizgwQDf34KNgL`.
- Dominio promovido: `https://rcp.services`; `https://www.rcp.services` redirige al
  dominio canónico.
- Reversión preparada: `dpl_8hSiy9t9L7LRWcu9rmwFM58B9ku2`.

## Cambios aceptados

- Las escenas de «Explorar mi negocio» usan sus dimensiones verticales reales y
  marcos 3:2 con encuadres revisados en escritorio y móvil.
- El mapa SVG y los logos conservan sus rutas, estados y accesibilidad táctil.
- El formulario de especialistas conserva idempotencia por contenido y evita
  reutilizar una clave después de cambiar datos o completar una entrega.
- La documentación vigente identifica Next.js/Vercel como fuente y publicación;
  Astro/GitHub Pages queda como histórico.

## Verificación

- `pnpm run typecheck`: aprobado.
- `pnpm test`: 60 pruebas aprobadas.
- `pnpm run build`: aprobado en el build de producción Vercel; 65 páginas generadas.
- `pnpm audit --prod --audit-level high`: sin vulnerabilidades conocidas.
- `git diff --check`: aprobado.
- Verificación pública: 9 rutas HTTP con estado 200, salud `ok=true`, ES/EN,
  catálogo con 31 imágenes distintas, mapas en móvil y encuadres de sectores a
  1280/390 px; 0 errores de página y 0 envíos.

Evidencia reproducible fuera del checkout:

- `C:/RCP/.artifacts/web-visual-audit-20260908/public-final/public-results.json`
- `C:/RCP/.artifacts/web-visual-audit-20260908/public-sectors-results.json`
- `C:/RCP/.artifacts/web-visual-audit-20260908/public-final/public-home-390.png`
- `C:/RCP/.artifacts/web-visual-audit-20260908/public-final/public-services-390.png`

## Límite de entrega de correo

Production declara el modo `email` y las variables requeridas están presentes,
pero no se realizó un envío sintético ni se abrió una sesión autorizada en Resend
o Zoho. Por ello la recepción en el buzón no queda acreditada en este registro;
la verificación del contrato de entrega y la integración CRM siguen siendo gates
operativos separados del despliegue visual.
