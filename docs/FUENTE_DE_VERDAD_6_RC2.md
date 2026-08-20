# RCP Services — Fuente de Verdad 6.0-RC2

Estado: aprobada para implementación y candidata de producción.  
Fecha de autoridad: 2026-08-12.  
Propietario: Dirección General de RCP Services SRL.

## 1. Regla de autoridad

Esta RC2 consolida Blueprint 5.0, los complementos compatibles de 6.0-RC1 y las decisiones D-01 a D-11 aprobadas. Para posicionamiento, oferta, copy, marca y claims prevalece RC2. Para arquitectura, seguridad, datos y despliegue prevalecen los ADR vigentes, el código probado y los contratos técnicos. Los materiales históricos no amplían la oferta.

Un cambio material requiere dueño, razón, evidencia, riesgo, fecha de vigencia y aprobación. Ninguna demo, icono, sigla, página histórica o prototipo convierte por sí solo una capacidad en producto disponible.

## 2. Identidad y propuesta de valor

RCP Services es una empresa dominicana que ayuda a pequeños negocios a recuperar orden, reducir riesgos y crecer con una presencia más clara. Integra tres pilares bajo una sola coordinación:

- Renovación: procesos, organización, experiencia, adopción y mejora operativa.
- Consultoría: apoyo impositivo, contable, financiero, administrativo y de control con límites profesionales.
- Publicidad: estrategia, marca, web, redes, contenido, pauta, analítica, impresos, letreros y materiales. “Publicidad 360” describe ese alcance; no es un cuarto pilar.

La tecnología es transversal. Entra cuando mejora el proceso y puede incluir software a la medida, integraciones, automatización, datos, alojamiento, mantenimiento y soporte.

Promesa principal: **“Le damos nuevo impulso a tu negocio.”**

La narrativa de corazón, pulso, ritmo, síntomas y reanimación puede explicar el método de forma secundaria y humana. No constituye una garantía médica, financiera, legal, fiscal ni comercial. RCP se presenta como empresa o equipo, nunca como “firma”. Rapidez, calidad y precio justo son principios de entrega, no resultados garantizados.

## 3. Entrada comercial

La `Evaluación Inicial RCP 360°` es una conversación de 45 minutos, sin costo y sujeta a confirmación. Sirve para escuchar, ubicar la prioridad y recomendar un próximo paso. No acepta documentos sensibles y no constituye contratación ni asesoría profesional.

El `Diagnóstico RCP 360` es una etapa posterior y pagada cuando hace falta investigar con más profundidad. Antes de comenzar se acuerdan alcance, entregables, responsables, inversión y forma de aceptación. No se publican cupos, plazos ni disponibilidad no demostrados.

La ruta operativa es: escuchar, diagnosticar, diseñar, asignar, ejecutar, verificar y evolucionar. RCP conserva la coordinación contractual y la comunicación principal con el cliente.

## 4. Oferta y estados

Toda oferta usa un estado comercial independiente de su madurez técnica:

- `public`: puede explicarse y seleccionarse públicamente.
- `contextual`: puede evaluarse como parte de una solución, no como producto universal.
- `under_review`: permanece documentada internamente y oculta al público.
- `in_development`: puede tener contenido educativo, sin CTA de contratación.
- `historical`: conserva trazabilidad y nunca se publica como oferta vigente.

La madurez técnica usa `proven`, `accelerator`, `pattern` o `design`. También se registran `regulated`, `requiresProfessionalReview` y `selectable`. Toda superficie pública consume una proyección filtrada; el servidor vuelve a validar cada selección.

Los servicios impositivos y contables públicos requieren revisión profesional. Los servicios legales corporativos, formalización, contratos y laboral permanecen `under_review` hasta acreditar responsable habilitado, contrato, alcance y proceso de asignación. La documentación empresarial pública se limita a organización administrativa y no sustituye asesoría profesional.

e-CF conserva su URL como guía educativa `in_development`. La integración no está disponible para contratación hasta existir evidencia operativa, autorización aplicable y revisión profesional.

El CRM operativo de RCP es interno y no se vende. Una necesidad de CRM, ERP o POS se enruta a software a la medida y se diseña alrededor del proceso real del cliente.

## 5. Seis soluciones tecnológicas públicas

1. Organiza tu operación y tus clientes.
2. Vende y controla tu inventario.
3. Crea tu página, catálogo o tienda.
4. Construye la herramienta que tu proceso necesita.
5. Reduce tareas repetitivas y entiende tus números.
6. Mantén tu solución funcionando.

MIS, ERP, EAM, POS, CRM, CMS, PIM, WMS, SCM, MRP, HRMS/HCM, LMS, BPA, RPA, BI y e-CF forman el glosario SSR para educación, búsqueda, SEO y AEO. No representan dieciséis productos listos. Propiedad, licencia, infraestructura, alojamiento, mantenimiento, soporte, terceros y salida se acuerdan por proyecto.

## 6. Red de especialistas

La Red amplía capacidad mediante profesionales y empresas sometidos a revisión proporcional. La postulación es manual y no garantiza empleo, activación ni proyectos. RCP decide asignaciones humanas según alcance, disponibilidad, riesgo, conflicto y credenciales. No se publican perfiles, compensaciones, marketplace ni asignación automática.

El sitio público no crea cuentas. El Delivery Hub será privado, separado y por invitación. Su apertura externa requiere Supabase Pro separado, respaldo, revisión contractual, MFA privilegiado y aislamiento RLS probado.

## 7. Marca y experiencia digital

Montserrat gobierna el cuerpo; Space Grotesk es una excepción digital para títulos. El texto principal usa como mínimo 18 px/500 y el contenido funcional 16 px. Escritorio puede presentar escenas completas sin cortar títulos, CTA o tarjetas; móvil conserva flujo natural.

El encabezado usa el logo compacto adecuado al tema. El lockup R·C·P con Renovación, Consultoría y Publicidad es secundario para footer, Nosotros y campañas; no sustituye el logo maestro. Pulso usa exclusivamente `pulso-presenta-v1`, `pulso-orienta-v1` y `pulso-avanza-v1`, protegidos por hash. No se recortan ni regeneran en producción.

La experiencia mantiene ES/EN, claro/oscuro, búsqueda, música discreta, cursor solo para mouse, accesibilidad, `prefers-reduced-motion`, iconos SVG y SEO/AEO renderizado en servidor.

## 8. Sistemas y fuentes de verdad

- Web pública: contenido comercial filtrado y captación.
- CRM: contactos, empresas, inbox, WhatsApp, Evaluación Inicial, embudo, responsables y traspaso al Hub; uso interno de RCP.
- Delivery Hub: ejecución contractual, proyectos, especialistas, entregables, QA, aceptación, riesgos, cambios, cierre y auditoría.
- RCP Matrix: autoridad de trabajo técnico y evidencia de releases.

Ningún sistema escribe directamente en el esquema de otro. Las integraciones usan contratos versionados, HMAC, timestamp, idempotencia, outbox, reintentos y reconciliación manual. El traspaso canónico del CRM al Hub es `opportunity.qualified.v1`.

El canal oficial de WhatsApp es `+1 829-806-8092`. Su futura conexión al CRM debe usar WhatsApp Business App Coexistence y conservar la aplicación y el catálogo. La activación de Meta Business Agent permanece pendiente por decisión de Dirección General, fuera del camino crítico de RC2 y condicionada a elegibilidad, términos, costos, privacidad y control humano.

## 9. Publicación y gates

La web se dirige a Vercel Pro con Route 53 autoritativo. Staging permanece `noindex`. GitHub Pages/Astro se conserva como rollback 30 días. El piloto de captación usa Resend hacia Zoho y solo confirma éxito cuando el proveedor acepta el correo. Al habilitar el CRM saneado se cambia a modo `crm`, sin doble escritura.

El CRM no sale de `SECURITY-HOLD` hasta corregir autorización, SSRF, webhooks, almacenamiento, middleware y rate limiting; reconciliar migraciones; rotar secretos; probar aislamiento, backup y restauración. El Hub permanece local con datos sintéticos hasta superar su gate externo.

## 10. Decisiones D-01 a D-13

| ID | Decisión aprobada |
|---|---|
| D-01 | Promesa corta; metáfora RCP secundaria. |
| D-02 | Publicidad es pilar; Publicidad 360 es descriptor. |
| D-03 | Evaluación inicial gratuita separada del diagnóstico pagado. |
| D-04 | CRM de RCP interno; necesidades de cliente por software a la medida. |
| D-05 | Legales ocultos hasta acreditación y revisión. |
| D-06 | e-CF educativo y en desarrollo, sin contratación. |
| D-07 | Seis soluciones humanas; 16 siglas como glosario. |
| D-08 | Canónicas Next actuales y alias 308 aprobados. |
| D-09 | Red manual, sin marketplace ni Portal público. |
| D-10 | Montserrat cuerpo, Space Grotesk títulos digitales y mínimos legibles. |
| D-11 | Lockup secundario; logo compacto en encabezado. |
| D-12 | Vercel puede alojar pruebas funcionales autorizadas mientras la plataforma las admita; no sustituye gates de seguridad, datos o usuarios externos. |
| D-13 | `+1 829-806-8092` es el WhatsApp oficial; CRM únicamente por Coexistence, con aplicación y catálogo preservados. Meta Business Agent queda pendiente. |

## 11. Criterio de salida de RC2

RC2 puede promoverse a 6.0.0 cuando no existan contradicciones públicas, el catálogo filtrado sea consistente, el sitio pase UAT visual/funcional/SEO/accesibilidad, la captación confirme recepción real, el despliegue tenga rollback probado y Dirección General apruebe el resultado de producción. CRM y Hub conservan gates propios; su condición incompleta no autoriza a presentarlos como productos públicos.
