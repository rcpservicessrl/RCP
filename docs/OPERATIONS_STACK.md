# Inventario operativo RCP Services 6.0-RC2

## Regla

Se activa una herramienta solo cuando tiene proceso, propietario, datos autorizados y salida documentada. RCP no reconstruye Asana, Notion o Slack ni duplica autenticación, analítica o búsqueda sin una necesidad comprobada.

| Necesidad | Herramienta | Propietario | Costo/estado RC2 | Datos | Salida |
|---|---|---|---|---|---|
| Repositorio, PR y CI | GitHub | Tecnología | activo | código y artefactos técnicos | mirror Git + export de issues/releases |
| Web pública | Vercel Pro | Tecnología | plan pagado aprobado; activación pendiente | assets públicos y solicitudes en tránsito | Next.js portable + Cloudflare/OpenNext validado |
| DNS autoritativo | AWS Route 53 | Tecnología | activo | zonas y registros | export completo de zona antes del corte |
| Correo humano | Zoho Mail | Operaciones | activo | correspondencia comercial | export de buzones y DNS documentado |
| Correo transaccional | Resend | Tecnología | piloto pendiente | destinatario y contenido mínimo de solicitud | cambiar proveedor conservando el adaptador server-side |
| Antiabuso | Cloudflare Turnstile | Tecnología | gratuito; credenciales pendientes | token técnico, IP procesada por proveedor | desactivar por variable y sustituir challenge |
| Datos y Auth del CRM | Supabase existente | Tecnología | gratuito durante piloto | datos corporativos bajo esquema `crm` | backup lógico cifrado y migraciones forward-only |
| Datos y Auth del Hub | Supabase local / Pro separado | Tecnología | local ahora; Pro es gate externo | organizaciones, proyectos y evidencia | export SQL/Storage y contratos API versionados |
| Errores | Sentry | Tecnología | activación pendiente | telemetría técnica sin PII | export de issues y retiro del DSN |
| Analítica pública | PostHog | Comercial/Tecnología | activación pendiente | eventos consentidos sin PII/texto libre | export de eventos y retiro del script |
| Disponibilidad | UptimeRobot | Tecnología | activación tras staging | URL, estado y latencia | export de monitores |
| Operación comercial | RCP CRM | Operaciones | `SECURITY-HOLD` hasta saneamiento | contactos, empresas, oportunidades y consentimientos | export por cuenta + outbox reconciliable |
| Entrega | RCP Delivery Hub | Operaciones/Tecnología | piloto local | proyectos, especialistas, entregables y QA | export por organización + revocación |
| Búsqueda pública | índice SSR local | Tecnología | activo, sin proveedor | contenido público filtrado | JSON descargable y código portable |

## No aplican ahora

- Clerk: duplicaría Supabase Auth y sus reglas de membresía.
- Pinecone: el catálogo público es pequeño y estructurado; no justifica vectorizar consultas.
- Odoo o n8n como núcleo universal: pueden formar parte de una solución concreta, no gobiernan RCP.
- Cloudflare DNS/Workers: evaluación posterior separada; Route 53 y Vercel son la decisión RC2.
- Namecheap: solo importa como registrador si existe una decisión de transferencia; no es requisito técnico.

## Gates de activación

1. Vercel: cuenta/equipo Pro, proyecto, entornos y secretos separados.
2. Resend: subdominio verificado, DKIM/SPF, remitente y entrega hacia Zoho comprobada.
3. Turnstile: site/secret key del dominio y fallo cerrado probado.
4. Sentry/PostHog: mapa de datos y pruebas que demuestren ausencia de PII.
5. UptimeRobot: monitores de staging aprobados y escalamiento definido.
6. CRM: hold de seguridad cerrado, backup/restauración y rotación de secretos.
7. Hub externo: Supabase Pro separado, contrato revisado, backup y aislamiento RLS entre dos organizaciones.
