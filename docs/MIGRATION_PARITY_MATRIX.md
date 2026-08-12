# Matriz de paridad Astro → Blueprint 5

| Capacidad heredada | Implementación Blueprint 5 | Estado |
|---|---|---|
| Identidad RCP, logos y Montserrat | Activos oficiales, tokens y contraste por tema | Completa |
| Claro/oscuro | Preferencia persistente y SSR estable | Completa |
| Música | Global, voluntaria, discreta, sin autoplay y con volumen limitado | Completa |
| Búsqueda | Paleta local con pilares, servicios, capacidades y rutas | Completa |
| Español/inglés | Rutas server-rendered, canonicales, alternates y `lang` correcto | Completa |
| Pulso | Jaguar oficial, cinco escenas deterministas y guía contextual | Completa |
| Servicios | Directorio de Renovación, Consultoría y Publicidad | Completa |
| Catálogo/tienda | Catálogo sin precios rígidos, hasta cuatro referencias y diagnóstico | Sustituida correctamente |
| Checkout | Revisión no indexable de referencias heredadas, sin pagos ni importes obsoletos | Compatibilidad controlada |
| Diagnóstico | Formulario público mínimo, validación server-side, referencia y WhatsApp | Completa; CRM/Resend opcionales |
| Media | Biblioteca con carga externa solo después de clic | Completa para el archivo aprobado |
| Carreras | Red de especialistas sin promesa de asignación | Completa |
| Nosotros | Modelo, propiedad y cadena de evidencia | Completa |
| Portal | Entrada honesta y noindex | Parcial; autenticación/Delivery Hub es producto separado |
| Dashboard/onboarding | Redirección temporal a Portal | Retirados del sitio público |
| Caso Electromuebles | No publicado sin autorización y evidencia | Pendiente de negocio, no bloqueo técnico |
| Propuesta de inversión | Redirigida fuera del sitio público | Retirada por confidencialidad |
| SEO/AEO | metadata, JSON-LD, 24 rutas, sitemap, robots, `llms.txt` e índice | Completa localmente |
| Service worker Astro | Worker de retiro elimina cachés y se desregistra | Completa para el corte |
| Hosting GitHub Pages | Next/OpenNext sobre Cloudflare Workers; Vercel portable | Bundle completo; corte pendiente |

## Gates que no deben simularse

- El Portal no se declara operativo hasta validar autenticación, roles, RLS, recuperación y destino definitivo.
- Una solicitud no se declara registrada en CRM si el endpoint no confirma éxito.
- Resend, Sentry, PostHog y UptimeRobot no se declaran activos sin credenciales y evidencia del entorno.
- No se publica un cliente, resultado, certificación, precio ni garantía sin autorización documentada.
