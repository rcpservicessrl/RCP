# Inventario de datos Blueprint 5

Este inventario describe contratos; no contiene registros personales.

| Entidad | Fuente/propietario | Clasificación | Sitio público |
|---|---|---|---|
| Pilares, capacidades, método y catálogo | `lib/content.ts` / Negocio | Pública aprobada | lectura y búsqueda local |
| Activos de marca/Pulso | Fuente de Verdad / Marca | Pública controlada | solo derivados aprobados |
| Solicitud inicial | visitante / Comercial | Personal y comercial | POST server-side; no caché |
| Referencia de solicitud | API web / Comercial | Operativa | se muestra al usuario; no analítica |
| Lead CRM | RCP CRM / Comercial | Personal y confidencial | nunca lectura directa del navegador |
| Notificación | Resend/Zoho / Comercial | Personal y confidencial | server-side solamente |
| Consentimiento analítico | almacenamiento local / Privacidad | Preferencia | denegado por defecto |
| Evento de analítica | PostHog futuro / Marketing | Técnico | solo allowlist sin PII |
| Error técnico | Sentry futuro / Ingeniería | Técnico potencialmente sensible | redacción obligatoria |
| Perfil, rol, expediente y entregables | Portal/Delivery Hub | Confidencial cliente/profesional | fuera del sitio público |
| Datos de aplicaciones cliente | proyecto/entorno del cliente | Confidencial | aislados del pool corporativo |

No se crean órdenes, pagos, precios ni documentos de cliente en el sitio público Blueprint 5.
