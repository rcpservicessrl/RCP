# Contratos API y eventos — RC2

Estado: contrato de implementación. Los endpoints del CRM no se habilitan en producción mientras exista `SECURITY-HOLD`.

## Frontera web pública y CRM

La web pública recibe las solicitudes en `/api/inquiries` y
`/api/specialist-applications`. Durante el piloto las entrega por Resend. Solo
cuando `RCP_INTAKE_DELIVERY_MODE=crm` está habilitado y el CRM tiene sus
credenciales server-side, el adaptador web reenvía el sobre firmado a los
endpoints internos `/api/integrations/site/intakes` y
`/api/integrations/site/specialist-applications` descritos abajo. No son rutas
públicas del sitio y no deben aparecer en el sitemap.

## Seguridad común

Toda llamada servidor-servidor requiere:

- `Authorization: Bearer <credencial limitada>`;
- `Idempotency-Key` de 8 a 100 caracteres;
- `X-RCP-Timestamp` en segundos Unix;
- `X-RCP-Signature: sha256=<hex>`, calculada con HMAC SHA-256 sobre `<timestamp>.<cuerpo exacto>`;
- tolerancia máxima de reloj de 300 segundos;
- `Content-Type: application/json` y límite de tamaño;
- verificación constante de firma, idempotencia durable y autorización antes de usar `service_role`.

La credencial identifica el sistema emisor y solo permite el contrato asignado. No se registra PII, cuerpo libre, tokens o firmas en logs, PostHog o Sentry.

## `POST /api/integrations/site/intakes`

Entrada mínima:

```json
{
  "reference": "RCP-EVAL-0123456789",
  "source": "rcp.services",
  "type": "initial_assessment_request",
  "journeyStage": "initial_evaluation_request",
  "name": "Persona de prueba",
  "company": "Negocio de prueba",
  "email": "test@example.com",
  "phone": "",
  "need": "ordenar",
  "sector": "servicios",
  "problem": "Texto validado de veinte caracteres o más.",
  "expectedOutcome": "Resultado esperado.",
  "contactPreference": "email",
  "selectedServices": [],
  "selectedCapability": null,
  "selectedSolution": null,
  "locale": "es",
  "next": "initial_evaluation_review"
}
```

Respuesta estable `202`:

```json
{
  "recorded": true,
  "reference": "RCP-EVAL-0123456789",
  "duplicate": false,
  "contactId": "uuid",
  "opportunityId": "uuid",
  "stage": "evaluation_requested"
}
```

El mismo `Idempotency-Key` y cuerpo devuelve la misma referencia con `duplicate: true`. Una clave reutilizada con otro cuerpo devuelve `409`. El CRM crea o vincula contacto, empresa y oportunidad dentro de la cuenta corporativa autorizada; nunca crea tenants.

## `POST /api/integrations/site/specialist-applications`

Acepta identidad y contacto básicos, categoría, experiencia, portafolio HTTPS opcional y disponibilidad. No acepta archivos, credenciales ni documentos sensibles. Responde el mismo sobre estable y usa `stage: specialist_review`. La postulación solo crea un registro interno pendiente de revisión manual.

## `GET /api/health`

No requiere autenticación y no consulta PII. Responde versión, estado del runtime, base de datos, outbox y hora. Un componente degradado produce `503` con un código estable, nunca detalles internos.

## Eventos Hub, CRM y Matrix

Sobre común:

```json
{
  "id": "uuid",
  "type": "opportunity.qualified.v1",
  "occurredAt": "2026-08-12T16:00:00-04:00",
  "producer": "rcp-crm",
  "organizationId": "uuid",
  "correlationId": "uuid",
  "payload": {}
}
```

Eventos autorizados:

- `opportunity.qualified.v1`: CRM → Hub; crea o resuelve de forma idempotente un engagement calificado pendiente de aceptación operativa.
- `engagement.created.v1`: Hub → CRM; enlaza oportunidad y engagement.
- `engagement.status_changed.v1`: Hub → CRM; sincroniza solo estado comercial resumido.
- `technical_work.approved.v1`: Hub → Matrix; autoriza un trabajo técnico acotado.
- `release.evidenced.v1`: Matrix → Hub; adjunta referencia, SHA y evidencia, nunca credenciales.

Cada sistema escribe primero su estado y el evento en una outbox dentro de la misma transacción. El consumidor registra inbox/idempotencia antes de aplicar. Los reintentos usan backoff; después del límite pasan a reconciliación manual. No existe escritura directa entre esquemas.
