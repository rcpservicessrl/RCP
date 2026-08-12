# Implementación web Blueprint 5

## Resultado

El sitio presenta primero a RCP Services, después Renovación, Consultoría y Publicidad, y coloca la tecnología como capacidad transversal. Conserva la identidad oficial y las bondades útiles del sitio anterior sin sostener la propuesta superada de Agencia 360, suite universal o plataforma soberana.

## Implementado

- Inicio español `/` e inglés `/en`, renderizados en servidor.
- Directorio completo de los tres pilares en `/servicios` y `/en/services`.
- Catálogo de productos de entrada y servicios de los tres pilares. Impresos, letreros y producción física forman parte de Publicidad; “Publicidad 360” describe ese alcance integral y no crea un cuarto pilar.
- Capacidades MIS, ERP, EAM, POS, CRM, CMS, PIM, WMS, SCM, MRP, HRMS/HCM, LMS, BPA, RPA, BI y e-CF.
- Selección validada de hasta cuatro rutas, transferida del catálogo al diagnóstico.
- Método RCP de siete momentos con evidencia y criterios de avance.
- Formulario mínimo con honeypot, límites, consentimiento, referencia, ingestión CRM opcional, notificación Resend opcional y salida por WhatsApp.
- Búsqueda local, claro/oscuro, ES/EN, música voluntaria y Pulso como guía contextual.
- Páginas Nosotros, Biblioteca, Red de especialistas, privacidad, términos, cookies y accesibilidad en ambos idiomas.
- Portal honesto y no indexable; checkout heredado transformado en revisión de referencias sin pagos ni precios obsoletos.
- Metadata, JSON-LD, canonicales, alternates, sitemap, robots, manifest, `llms.txt` e índice de catálogo.
- Next.js/App Router, OpenNext/Cloudflare, Vercel portable, cabeceras de seguridad, retiro del service worker Astro y CI con pnpm.

## Verificado

La evidencia reproducible está en `VERIFICATION_REPORT_2026-08-11.md`: tipado, 35 pruebas contractuales, 59 entradas generadas por Next, bundle Worker, flujo crítico, APIs, rutas públicas, escritorio, móvil, teclado y consola.

## No activado ni simulado

- Corte productivo o cambios DNS.
- Escritura real al CRM y entrega real por Resend hasta contar con credenciales y ambiente aprobado.
- Portal/Delivery Hub autenticado.
- Pagos, órdenes, precios públicos rígidos o casos de clientes sin permiso.
- PostHog, Sentry y UptimeRobot hasta completar cuentas, privacidad y pruebas.
- Nuevas poses de Pulso generadas por IA sin aprobación y hash.

## Decisión de herramientas

Cloudflare, Supabase, GitHub, Zoho Mail, RCP CRM y Resend cubren la operación principal. PostHog, Sentry y UptimeRobot son capas condicionadas. Clerk y Pinecone no aplican en esta fase porque duplicarían autenticación y búsqueda sin resolver un problema nuevo. El detalle está en `OPERATIONS_STACK.md`.
