---
id: web-pulso-workers-ai-20261012
project: rcpservicessrl/RCP
status: partial
recorded_at: 2026-10-12T02:13:43.088Z
source_refs:
  - master:3d6393df4ab8ee0453313196aa8df35d98eb6e8d
  - components/pulso-question.tsx
  - lib/pulso-public.ts
  - workers/pulso/worker.ts
validation:
  - local types/lint/unit/build and SQLite; final receipt records browser results
  - remote account metadata: blocked by current token scopes; no inference
supersedes:
  - ADR-010 prohibition of text response generation, only within this gated implementation
superseded_by: null
owner: RCP Services
---

# Pulso público: Workers AI y respaldo local

Implementación preparada en `codex/pulso-workers-ai-free-20261012`, desde el
master integrado PR32. Conserva PR30/31/32, el manifiesto visual aprobado,
Mercado Aurora, los enlaces, la búsqueda local y las imágenes de Pulso.
No está publicada ni activada. La autorización permite implementar y probar;
la creación de permisos/secretos y la publicación requieren confirmación.

## Funcionamiento independiente del equipo

El sitio sigue en Vercel. El navegador consulta directamente un pequeño Worker
de Cloudflare con una URL pública fija y permitida por CSP. La consulta no
añade una función API en Vercel ni depende de un servidor, túnel o modelo local.
El equipo de desarrollo sólo construye y prueba. Una vez publicado, el respaldo
está incluido en el JavaScript del sitio y funciona con el panel cargado incluso
si se pierde la red. Abrir la web por primera vez sigue necesitando red; no se
promete disponibilidad ilimitada ni una web enteramente offline.

La URL `NEXT_PUBLIC_PULSO_WORKER_URL` vacía deja todo Pulso en modo local.
El Worker también tiene `AI_ENABLED=false` y `ACCOUNT_TIER=unverified` por defecto.
Los tres estados deben comprobarse antes de activar. Cambiar un flag no verifica
por sí mismo el plan de la cuenta. No utilizar una cuenta Workers Paid ni créditos
de AI Gateway para esta solución de coste adicional cero.

## Frontera pública y privacidad

- `scripts/pulso-knowledge.mjs` proyecta **12 IDs explícitos** de `lib/content.ts`
  a `lib/pulso-knowledge.json`. Nueve admiten generación. Las fichas de servicios
  requieren disponibilidad pública, selección y ausencia de revisión regulada.
  `--check` detecta cambios para exigir revisión del contenido y regeneración.
- La selección ocurre en el navegador. Sólo se transmiten IDs permitidos,
  idioma, versión del corpus y UUID de intento. El texto libre, documentos,
  contexto de página, cookies e historial **no se transmiten al Worker**.
- El Worker vuelve a comprobar la lista, la cantidad (máximo dos fuentes),
  versión, locale y tamaño antes de llamar al modelo. No tiene crawler, herramientas,
  búsqueda remota, acceso a Supabase, Leads, expedientes o grafos de clientes.
- El modelo recibe únicamente títulos y descripciones de la proyección pública.
  Los enlaces salen del código, nunca de URLs propuestas por el modelo.
- Preguntas de precios, fiscalidad, certificación, finanzas o contenido privado
  usan orientación predefinida y contacto humano. La ruta pública de e-CF conserva
  las exclusiones comerciales vigentes. No se expone proveedor fiscal ni se afirma
  certificación DGII propia.
- JSON, fuentes, longitud, palabras, HTML, URLs, cifras, divisas y términos de
  afirmaciones reguladas se validan antes de mostrar una generación. La validación
  no prueba verdad semántica absoluta: las respuestas llevan aviso de IA y fuentes.
  La calidad del modelo en español sigue pendiente de prueba real autorizada.
- Sólo se conserva la última pregunta/respuesta en memoria del panel; cerrar lo
  borra y aborta la espera. Sin transcript, almacenamiento de texto o eventos de
  analítica. El aviso ES/EN y la política de privacidad describen Cloudflare y los
  contadores. Cloudflare recibe la IP a través de la conexión; el modelo no la recibe.

## Límites y respaldo

| Control | Implementación |
| --- | --- |
| Texto del visitante | 400 caracteres; permanece local |
| Entrada al Worker | 1.024 bytes, lectura de cuerpo hasta 2 s; claves explícitas |
| Contexto del modelo | Máximo 8.192 bytes UTF-8 de mensajes; sólo fuentes locales |
| Salida | `max_tokens=256`, respuesta validada hasta 90 palabras / 1.200 caracteres |
| Espera | 6,5 s Worker; 10 s navegador; lectura de respuesta hasta 1 s |
| Visitante | Seis reservas/día UTC, al menos 30 s entre ellas; por IP compartida |
| Global | 100 reservas/día UTC; reserva conservadora de 64 neuronas/intento, 6.400/día |
| Atomicidad | Un Durable Object SQLite `pulso-global-v1`, transacciones persistentes |
| Idempotencia | UUID ya reservado no vuelve a invocar el modelo |
| Cuota del proveedor | Código 3036: circuito hasta medianoche UTC |
| Modelo/cuenta/acuerdo | 5016/5018/3023/3041/5035: circuito hasta medianoche |
| Caída, capacidad, timeout o respuesta inválida | Circuito 60 s; información predefinida |
| Almacenamiento de cuota no disponible | Cero llamadas al modelo; respaldo local |
| Reintento | Sólo manual, una vez tras fallo de transporte, mismo UUID |

La reserva no se devuelve por fallo, respuesta inválida o timeout. El binding
puede seguir procesando después de agotarse la espera; ese intento sigue gastado
y no se reintenta automáticamente. La estimación por bytes presupone como máximo
un token por byte más overhead: con las tarifas de este modelo, contexto máximo
y 256 tokens de salida quedan bajo la reserva de 64 neuronas. La medición exacta
del proveedor manda; la cuenta Free corta por error, sin overage facturable.
La cuota diaria de Cloudflare es compartida con otras cargas de la cuenta.

Los contadores guardan HMAC diario de la IP, timestamp del último intento,
cuentas y UUIDs, nunca conversaciones. El estado es reemplazado en la primera
operación del siguiente día UTC; si no hay nuevas operaciones puede permanecer
en almacenamiento hasta entonces. No se registra el cuerpo ni se habilitan logs
de observabilidad de la aplicación. CORS restringe los dos orígenes públicos
exactos; no es autenticación de personas y un atacante puede agotar la cuota.
Los límites globales y Workers Free conservan el respaldo y el coste cero.

## Documentación verificada el 12 de octubre

- [Workers AI: cuota y modelos con pago requerido](https://developers.cloudflare.com/workers-ai/platform/pricing/):
  10.000 neuronas diarias gratis, reinicio 00:00 UTC; Free falla al superar cuota.
- [Modelo candidato Llama 3.2 3B](https://developers.cloudflare.com/workers-ai/models/llama-3.2-3b-instruct/):
  `@cf/meta/llama-3.2-3b-instruct`, 4.625 neuronas/M tokens de entrada y
  30.475/M de salida. No pertenece a la lista de modelos con facturación requerida.
  Es un candidato fijo, **no un acceso acreditado en esta cuenta**.
- [Errores de Workers AI](https://developers.cloudflare.com/workers-ai/platform/errors/):
  cuota, capacidad, modelos de pago y posible aceptación pendiente de términos.
- [Rechazo de capacidad ocupada](https://developers.cloudflare.com/workers-ai/features/reject-if-busy/):
  `rejectIfBusy: true` en el tercer argumento del binding.
- [Durable Objects Free](https://developers.cloudflare.com/durable-objects/platform/pricing/):
  SQLite disponible; al superar límites gratuitos se rechazan operaciones.

No se instala un segundo proveedor de IA ni se usan embeddings, créditos,
batch asíncrono, AutoRAG o servicios de pago. Los costes de infraestructura que
ya existan para el sitio se mantienen fuera de esta nueva inferencia directa.

## Accesos pendientes, juntos y mínimos

La sesión existente identifica la cuenta Cloudflare, pero las lecturas devolvieron
401 en `workers/account-settings` y 403 en `subscriptions` y `ai/models/search`.
No se deduce un plan Free de esa falta de acceso. No se aceptaron licencias,
crearon conexiones/secretos, cambiaron planes ni ejecutaron inferencias.

Antes de activar se necesita confirmar, en un único paso de autorización:

1. Acceso del propietario para comprobar **Workers Free**, cuota disponible y
   acceso al modelo candidato. Para verificación por API: cuenta específica con
   `Account Settings: Read`, `Workers Scripts: Read`, `Workers AI: Read`; si la
   lectura de suscripción requiere `Billing: Read`, puede comprobarse visualmente
   en el dashboard en lugar de ampliar permisos. Nunca `Billing: Edit`.
2. Autorización de despliegue del **Worker Pulso** y de su namespace SQLite en
   esa cuenta Free. Token limitado a la cuenta con `Workers Scripts: Edit` y
   `Workers AI: Edit`, conservando únicamente las lecturas necesarias de cuenta.
   No DNS, KV, R2, clientes, Supabase ni otros proveedores.
3. El propietario crea e introduce `VISITOR_HMAC_SECRET` (aleatorio, mínimo 32
   caracteres) en los secretos de ese Worker mediante dashboard o CLI segura.
   No se solicita por chat, no se usa el token de administración como secreto y
   no se introduce por él. Si Cloudflare pide términos de Meta, revisarlos con él.
4. Configurar la URL pública `/answer` en Vercel (`NEXT_PUBLIC_PULSO_WORKER_URL`)
   y autorizar revisión/integración/publicación del commit exacto del sitio.
   La URL no es un secreto; la cuenta Vercel no recibe credenciales de IA.

Después: desplegar inicialmente desactivado; comprobar CORS/contadores/modelo
con preguntas públicas sintéticas y consumo observado; habilitar sólo tras
confirmar coste Free. Verificar apex/www, ES/EN, móvil, cierre y simulación de
fallo/cuota. Si cambia el plan o modelo, desactivar y revisar. No contratar,
activar facturación, bajar planes, borrar namespaces ni publicar automáticamente.

## Pruebas reproducibles y límites de aceptación

`pnpm check` incluye tipos, lint de Pulso, proyección pública, suite completa y
build. `pnpm run test:pulso:sqlite` construye el Worker con dry-run y prueba
transacciones en SQLite real local con Miniflare/workerd, sin AI binding.
`pnpm run test:pulso:browser` usa Playwright; construir el sitio de prueba con
`NEXT_PUBLIC_PULSO_WORKER_URL=https://pulso-fixture.example.workers.dev/answer`
y Turnstile sintético. Esa URL se intercepta siempre: no se despliega ni se
utiliza como endpoint real. La configuración por defecto vacía conserva el
respaldo sin conexión al Worker.

La instalación integra ESLint mantenido y React hooks. TypeScript mantiene
`tsc` 7.0.2, con la API compatible de TypeScript 6 para lint según el
[procedimiento oficial de Microsoft](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).
Next.js 16.3.8 y React 19.2.8 permanecen en el lockfile integrado.

Ver `PULSO_WORKERS_AI_VALIDATION_2026-10-12.json` para resultados finales,
hashes y rutas de evidencia. No se acredita inferencia real, calidad del modelo,
plan de cuenta, aceptación en equipos físicos ni publicación remota.

Rollback: vaciar la URL pública del sitio y mantener `AI_ENABLED=false` en el
Worker. La guía, búsqueda, servicios y contacto humano permanecen disponibles.
