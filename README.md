# RCP Services — Web 6.0-RC2

Sitio comercial de RCP Services SRL para pequeños negocios de República Dominicana.

**Le damos nuevo impulso a tu negocio.**

La propuesta une tres pilares oficiales —Renovación, Consultoría y Publicidad— con tecnología transversal. Publicidad 360 es el descriptor de la oferta publicitaria, no un cuarto pilar. El sitio explica, orienta y capta solicitudes; el CRM y el Delivery Hub son productos internos separados.

## Estado comprobado

- Next.js 16.3, React 19 y TypeScript.
- 42 pruebas automatizadas, TypeScript y build de producción aprobados.
- Rutas ES/EN, claro/oscuro, búsqueda, música, Pulso, catálogo y evaluación guiada verificados localmente.
- Destino de la web: Vercel Pro. Route 53 conserva la autoridad DNS.
- `rcp.services` continúa en Astro/GitHub Pages hasta superar UAT, entrega real del formulario y autorización de corte.
- Cloudflare/OpenNext queda como alternativa técnica validada, fuera del lanzamiento RC2.

## Límites públicos

- La Evaluación Inicial RCP 360° dura 45 minutos, no tiene costo y está sujeta a confirmación.
- El Diagnóstico RCP 360 es una etapa posterior pagada, cuando haga falta, con alcance e inversión acordados.
- CRM, ERP y POS para clientes se presentan como software a la medida; el CRM interno de RCP no se vende.
- Los servicios legales profesionales permanecen ocultos hasta acreditar responsable y revisión.
- e-CF es contenido educativo en desarrollo, sin CTA de contratación.
- `/portal` permanece `noindex` y fuera de navegación hasta abrir el Hub.

## Desarrollo

Requiere Node.js 24 y pnpm 11.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Verificación:

```bash
pnpm run typecheck
pnpm test
pnpm run build
pnpm audit --prod --audit-level high
```

## Variables

Copiar `.env.example` a `.env.local`. Ningún secreto puede usar el prefijo `NEXT_PUBLIC_`.

- `RCP_DEPLOYMENT_ENV`: `development`, `preview` o `production`.
- `RCP_INTAKE_DELIVERY_MODE`: `email` durante el piloto; `crm` solo tras cerrar el hold del CRM.
- `RESEND_API_KEY`, `RCP_INQUIRY_EMAIL_FROM`, `RCP_INQUIRY_EMAIL_TO`, `RCP_SPECIALIST_EMAIL_TO`: entrega server-side por Resend hacia Zoho.
- `RCP_CRM_INGEST_*` y `RCP_CRM_SPECIALIST_INGEST_*`: contratos server-to-server con token limitado, HMAC e idempotencia.
- `RCP_REQUIRE_TURNSTILE`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`: protección antiabuso.

La API solo confirma éxito cuando el proveedor seleccionado acepta la entrega y devuelve una referencia.

## Documentación

La autoridad comienza en `docs/FUENTE_DE_VERDAD_6_RC2.md`. El índice completo, contratos, runbooks y gates están en `docs/README.md`.

## Marca

Pulso es la Mascota Jaguar RCP. Solo se usan sus tres posturas aprobadas y protegidas por hash. El encabezado usa el logo compacto según tema; el lockup R·C·P es secundario.

## Contacto institucional

- `info@rcp.services`
- +1 829 806 8092
- Santo Domingo, República Dominicana
- RNC 132-147103
