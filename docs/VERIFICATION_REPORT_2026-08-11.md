# Reporte de verificación — 2026-08-11

## Resultado

La implementación Blueprint 5 queda apta para preview y validación de aceptación. No se realizó corte de producción, cambio DNS ni envío de datos a servicios externos.

- `pnpm run typecheck`: aprobado.
- `pnpm test`: 36/36 pruebas aprobadas.
- `pnpm run build`: aprobado; Next.js generó 59 entradas de ruta.
- `pnpm run build:cloudflare`: aprobado; `.open-next/worker.js` generado con OpenNext 1.20.2.
- `pnpm exec wrangler deploy --dry-run`: aprobado; 6 524,30 KiB sin comprimir y 1 324,58 KiB comprimidos.
- Preview local OpenNext/Workerd: activo en `http://127.0.0.1:8788/`.
- Sitemap: 44 rutas públicas; 44/44 respondieron HTTP 200.

## Decisiones de negocio comprobadas

- Existen exactamente tres pilares: Renovación, Consultoría y Publicidad.
- “Publicidad 360” describe el alcance de Publicidad; no aparece como un cuarto pilar.
- Impresos, letreros, rotulación, material promocional y producción física pertenecen a Publicidad.
- La tecnología se presenta como capacidad transversal y se conecta con soluciones según la necesidad del negocio.
- En este corte se comprobó el encabezado entonces vigente: “Le damos un nuevo impulso al corazón de tu negocio.” ADR-016 lo sustituyó el 2026-08-12 por “Le damos nuevo impulso a tu negocio.” y reservó “corazón” para la narrativa secundaria.
- El lenguaje evita la denominación descartada “firma” y reduce siglas técnicas en la experiencia principal.

## Runtime Cloudflare comprobado

- `GET /api/health`: HTTP 200.
- Inicio, inglés, servicios, catálogo, diagnóstico, especialistas, software a la medida, facturación electrónica, manifiesto, robots y `llms.txt`: HTTP 200.
- Canonical, `og:url`, `og:locale` y Twitter Card de `/en/services`: correctos para la ruta inglesa.
- Los archivos públicos heredados `/script.js`, `/styles.css`, `/scripts/es.json`, `/tienda.js`, `/manifest.json` y `/_headers`: HTTP 404, por lo que no compiten con App Router.
- `GET /api/inquiries` y `GET /api/specialist-applications`: HTTP 405 con límite de método.

## Formularios y seguridad de registro

- Solicitud sintética válida sin CRM configurado: HTTP 503, `accepted=false` y `recorded=false`; el sistema no presenta como guardado un contacto que no llegó al CRM.
- Campo trampa activado: HTTP 202, `accepted=false` y `discarded=true`.
- Postulación sintética válida sin CRM de especialistas: HTTP 503, `accepted=false` y `recorded=false`, con salida segura por correo.
- Las pruebas usaron dominios `.test` y no transmitieron datos a CRM, Resend ni otros servicios externos.
- El código exige confirmación explícita del CRM antes de responder con éxito.
- Turnstile es opcional por configuración y se vuelve obligatorio de forma consistente cuando `RCP_REQUIRE_TURNSTILE=true`.
- CSP, protección de frames, `nosniff`, política de referer y permisos están cubiertos por pruebas contractuales.

## Interfaz y accesibilidad

- La revisión interactiva cubrió escritorio de baja altura y móvil, temas claro/oscuro, navegación, buscador, filtros, panel de Pulso y transferencia del catálogo al diagnóstico.
- No se detectó desbordamiento horizontal en 1280 × 720 ni 390 × 844 durante la inspección visual.
- El cuerpo usa 18 px y peso 500; el texto funcional más pequeño queda en 14,4 px. La jerarquía recupera legibilidad sin romper los viewports comprobados.
- El logotipo principal se amplió a 208 px en escritorio, 172 px en tableta y 164 px en móvil; el logotipo del pie llega a 224 px.
- La portada ocupa 720 px en 1280 × 720 y 844 px en 390 × 844; el título, acciones, señales de confianza y Pulso permanecen dentro del primer cuadro de pantalla.
- Las páginas interiores incorporan entrada progresiva, línea de recorrido, luces ambientales y respuesta de superficies, enlaces y botones a puntero, foco y pulsación.
- El puntero de escritorio usa un aro ámbar de 2 px y cambia a un aro verde de 48 px con centro romboidal sobre elementos interactivos. En dispositivos táctiles se conserva el puntero nativo.
- Menús y paneles gestionan foco, cierre con Escape y retorno al activador; las pestañas admiten teclado y existe alternativa para movimiento reducido.
- Música sin reproducción automática y control más discreto.
- Pulso usa tres imágenes completas e independientes con transparencia real y `object-fit: contain`; el sprite recortado dejó de formar parte del runtime. Los maestros oficiales permanecen intactos.
- Las poses `pulso-presenta-v1`, `pulso-orienta-v1` y `pulso-avanza-v1` están versionadas, protegidas por hash y fueron aprobadas explícitamente por RCP Services el 2026-08-12.

## Pendientes externos

- Aprobación visual y comercial final del sitio completo por RCP Services; la aprobación específica de las tres posturas `v1` de Pulso ya está cerrada.
- Credenciales y prueba E2E real del CRM de clientes y del CRM de especialistas.
- Configuración y entrega real de Resend, y activación de Turnstile con claves del ambiente aprobado.
- Autenticación de Cloudflare, Worker de staging, revisión legal, corte DNS y plan de reversión.
- Portal/Delivery Hub autenticado.
- Alta y consentimiento correspondientes antes de activar PostHog, Sentry y UptimeRobot.

La entrega está técnicamente preparada para UAT. No debe describirse como producción activa hasta cerrar esos controles externos.
