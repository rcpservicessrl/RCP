# Contraste de la Fuente de Verdad 6.0-RC1

Fecha de control: 2026-08-12.  
Objeto revisado: `RCP_Services_Fuente_de_Verdad_6.0-RC1_2026-08-11.zip`.  
Base de contraste: Blueprint/Fuente de Verdad 5.0, decisiones posteriores aprobadas, implementación Next.js y evidencia técnica de esta rama.

## Resumen ejecutivo

La 6.0-RC1 mejora de forma importante el gobierno de negocio, el lenguaje comercial, los estados de oferta, los límites de comunicación, la producción de contenido y el control de activos. Es una buena base para preparar la 6.0-RC2, pero no puede reemplazar de una vez todo lo vigente.

La razón es verificable:

- la propia RC1 se declara candidata interna y no release final;
- deja sin ratificar el stack, el aislamiento, Delivery Hub, RCP Matrix, seguridad detallada, SLA, egreso y modelo de especialistas;
- el repositorio ya contiene decisiones técnicas implementadas y probadas que cubren esas materias;
- la RC1 planteó contradicciones directas sobre promesa, Publicidad 360, CRM, asuntos legales, e-CF, entrada comercial, catálogo tecnológico, rutas, especialistas y tipografía; D-01 ya fue resuelta y las restantes siguen reservadas;
- tres posturas de Pulso aprobadas el 2026-08-12 son posteriores al cierre de la RC1 y deben incorporarse a RC2.

Decisión de transición adoptada: la RC1 se acepta como autoridad candidata para negocio, marca, catálogo, contenido y claims en todo lo que no contradiga decisiones vigentes. Los ADR, el código y las pruebas conservan la autoridad técnica. Dirección General aprobó D-01 a D-11 el 2026-08-12; su resolución consolidada se publica en la Fuente de Verdad 6.0-RC2.

La revisión inicial no modificó el copy público, la oferta, las rutas ni el diseño del sitio. La resolución posterior de D-01 a D-11 sincroniza la promesa, el embudo comercial, el catálogo filtrado, el lenguaje tecnológico, los límites profesionales, las rutas y la identidad visual mediante RC2.

## Integridad y alcance real del paquete

- El ZIP contiene 194 archivos cubiertos por `MANIFEST_SHA256.txt`; 194 de 194 hashes coinciden y no hay faltantes en el paquete original.
- El validador oficial termina en `PASS`, comprueba 11 archivos requeridos y 30 piezas de contenido.
- El smoke test documenta 15 renders: tres conceptos en cinco formatos.
- Ese `PASS` no valida el sitio Next.js, formularios, CRM, seguridad, accesibilidad, SEO, despliegue ni operación comercial.
- El validador reescribe `11_QA_Y_VALIDACION/validation_report.json` después de verificar. Como ese archivo está incluido en el manifiesto, ejecutar el validador deja un hash distinto al firmado. El ZIP original es íntegro; el proceso de validación posterior no es idempotente.

Corrección requerida para RC2: generar el reporte antes de sellar los hashes o excluir el reporte generado del manifiesto; después, verificar el paquete cerrado sin mutarlo.

## Modelo de autoridad adoptado

| Materia | Autoridad durante la reconciliación | Regla |
|---|---|---|
| Posicionamiento, oferta, copy y claims | Decisiones vigentes + complementos no contradictorios de 6.0-RC1 | Una contradicción no cambia el sitio hasta aprobación explícita. |
| Arquitectura, seguridad, datos y despliegue | ADR vigentes, `ARCHITECTURE.md`, código y pruebas | RC1 no puede revocar materias que ella misma dejó pendientes. |
| Marca maestra | Logo Jaguar original y activos cuya identidad/hash coinciden | No redibujar ni regenerar el logo. |
| Pulso | Maestros + `pulso-presenta-v1`, `pulso-orienta-v1` y `pulso-avanza-v1` aprobados | Las tres posturas aprobadas son posteriores a RC1 y entran en RC2. |
| Históricos | Evidencia de migración | Nunca amplían oferta, claims o arquitectura por sí solos. |

## Coincidencias que se conservan

1. RCP Services es una empresa dominicana de transformación empresarial para emprendedores, dueños de negocio, mipymes y empresas en crecimiento.
2. Los tres pilares son Renovación, Consultoría y Publicidad.
3. Tecnología es transversal y no constituye un cuarto pilar.
4. RCP no se presenta como firma, agencia genérica, marketplace, superapp ni suite universal.
5. La solución parte del problema y del proceso, no de vender primero una aplicación.
6. RCP coordina el alcance y responde frente al cliente; los especialistas no forman un directorio desarticulado.
7. Datos, propiedad, licencia, soporte, alojamiento, terceros y salida se acuerdan por proyecto.
8. No se publican precios rígidos, resultados garantizados, urgencias inventadas ni 24/7 sin SLA.
9. Casos, métricas, testimonios, logos y capturas de clientes requieren evidencia, autorización y sanitización.
10. Pulso acompaña orientación, método y educación; no reemplaza el logo ni el criterio profesional.

## Complementos incorporados para RC2

| ID | Complemento aceptado | Aplicación acordada |
|---|---|---|
| C-01 | Jerarquía documental, versionado y registro mínimo de cambios | Se incorpora al gobierno; cada cambio material tendrá dueño, evidencia, riesgo y vigencia. |
| C-02 | Estados `PÚBLICA`, `BAJO REVISIÓN`, `EN DESARROLLO` e `HISTÓRICA` | Se adoptan como autorización comercial, separados de la madurez técnica de una capacidad. |
| C-03 | Registro de claims variables | Todo claim variable tendrá dueño, fuente, fecha, alcance, revisión y regla de retiro. |
| C-04 | Sistema verbal dominicano neutro | Lenguaje humano, directo y explicativo; siglas solo con explicación inicial. |
| C-05 | Modelo P3 | Todo producto tecnológico público se diseña después de evaluar la operación. |
| C-06 | Políticas de casos, testimonios y capturas | No se publican resultados o datos de clientes sin autorización, evidencia y copia sanitizada. |
| C-07 | Separación de costos de terceros | Medios, impresión, materiales, licencias, dominios, pasarelas y proveedores se identifican aparte. |
| C-08 | Biblioteca de 30 conceptos | Se incorpora como backlog editorial sujeto a aprobación por pieza, no como publicación automática. |
| C-09 | Producción visual exacta | IA puede apoyar fondos o fotografía; texto, logo, Pulso, QR, CTA e interfaces se componen y verifican fuera del generador. |
| C-10 | QA móvil y cinco formatos | Se adoptan áreas seguras, lectura al 25 %, reflujo por formato y contactos legibles. |
| C-11 | Activos complementarios | QR separados y los ocho iconos 2.5D pueden usarse en marketing; la interfaz conserva SVG ligeros y accesibles. |
| C-12 | Nuevas posturas de Pulso | Las tres variantes aprobadas el 2026-08-12 se añaden a la lista oficial de RC2 con sus hashes actuales. |
| C-13 | Mercado remoto internacional | Puede comunicarse sujeto a capacidad y ajuste, sin prometer cobertura universal. |
| C-14 | Modalidades tecnológicas | Apps móviles, hosting, mantenimiento, soporte y modalidad administrada/suscripción entran al catálogo RC2 bajo evaluación y alcance. |
| C-15 | Validación automatizada | El validador se integrará al CI después de corregir su mutabilidad y de contrastar destinos con las rutas reales. |

## Decisiones reconciliadas y contradicciones reservadas

La matriz ejecutable está en `FUENTE_DE_VERDAD_6_RC1_DECISION_MATRIX.csv`. D-01 fue resuelta por aprobación explícita; las demás decisiones no se aplican silenciosamente.

### D-01 — Promesa principal — APROBADA 2026-08-12

- Anterior: “Le damos un nuevo impulso al corazón de tu negocio.”
- Aprobada: “Le damos nuevo impulso a tu negocio.”
- Aplicación: la frase corta es la promesa maestra. “Corazón”, “pulso”, “ritmo” y la metáfora de reanimación quedan como narrativa secundaria contextual, sin convertirse en otra promesa, servicio o resultado garantizado.
- Autoridad: `ADR-016`.

### D-02 — Uso de “Publicidad 360”

- Actual: descriptor del alcance integral del pilar Publicidad.
- RC1: reserva “360” para Evaluación Inicial y Diagnóstico RCP 360.
- Recomendación: mantener el nombre del pilar como `Publicidad` y permitir `Publicidad 360` solo como descriptor comercial, no como cuarto pilar ni categoría institucional.

### D-03 — Evaluación inicial y diagnóstico

- Actual: el formulario y el CTA inicial se llaman Diagnóstico RCP 360.
- RC1: crea una Evaluación Inicial gratuita de 45 minutos y separa un Diagnóstico RCP 360 pagado.
- Recomendación: adoptar el embudo de dos etapas, pero no publicar “10 cupos semanales” ni “resumen en dos días” hasta tener agenda, responsable, capacidad y seguimiento medible.

### D-04 — CRM público

- Actual: CRM aparece como capacidad activa y como software adaptable.
- RC1: CRM está bajo revisión y no puede anunciarse como producto público.
- Recomendación: conservar CRM como capacidad P3 a la medida, nunca como producto universal listo, si Dirección confirma que existe capacidad real de entrega.

### D-05 — Asuntos legales corporativos

- Actual: asuntos legales, formalización, contratos y laboral aparecen públicamente con revisión profesional.
- RC1: asuntos legales corporativos están bajo revisión y no se publican.
- Recomendación: publicarlos solo si existe profesional habilitado, contrato, alcance, responsabilidad y proceso de asignación confirmados; de lo contrario, ocultarlos temporalmente.

### D-06 — e-CF

- Actual: se presenta preparación e integración como capacidad evaluable.
- RC1: únicamente educación y preparación conceptual; integración en desarrollo.
- Recomendación: conservar la URL por SEO/AEO, pero convertirla temporalmente en recurso educativo y de preparación hasta demostrar una integración autorizada y operativa.

### D-07 — Catálogo tecnológico de siglas

- Actual: publica MIS, ERP, EAM, POS, CRM, CMS, PIM, WMS, SCM, MRP, HRMS/HCM, LMS, BPA, RPA, BI y e-CF.
- RC1: concentra la oferta pública en ERP, POS/inventario, web/ecommerce, software a la medida, automatización y operación administrada.
- Recomendación: presentar primero soluciones en lenguaje humano; conservar las siglas como capacidades de búsqueda y SEO, con estado comercial explícito y sin insinuar dieciséis productos listos.

### D-08 — Rutas canónicas

- Actual: `/nosotros`, `/servicios/*`, `/catalogo`, `/soluciones-tecnologicas`, `/diagnostico` y `/facturacion-electronica`.
- RC1: propone `/quienes-somos`, `/renovacion`, `/consultoria`, `/publicidad`, `/tecnologia`, `/productos` y `/evaluacion-rcp-360`.
- Recomendación: conservar las rutas actuales por continuidad SEO y mapear dentro de ellas el copy aprobado; crear alias 308 solo cuando una campaña necesite una ruta alternativa.

### D-09 — Red de especialistas

- Actual: presenta red, categorías, postulación, revisión y coordinación; el Hub autenticado sigue separado y pendiente.
- RC1: confirma la coordinación de capacidades, pero deja Delivery Hub y el modelo de especialistas/compensación bajo revisión.
- Recomendación: mantener la página pública de red y postulación con límites honestos; no anunciar asignación automatizada, perfiles operativos o Hub hasta ratificar el modelo.

### D-10 — Tipografía de títulos

- Actual: Montserrat en cuerpo y Space Grotesk en títulos.
- RC1: Montserrat como familia canónica de toda la marca.
- Recomendación: decidir mediante prueba visual comparativa en las páginas críticas. La legibilidad debe pesar más que la novedad tipográfica.

### D-11 — Lockup de tres pilares

- RC1 lo llama variante oficial, pero su propio QA registra aprobación visual final pendiente.
- Recomendación: mantener intacto el logo maestro y aprobar o rechazar el lockup como variante secundaria para campañas, portadas y footer; no sustituir automáticamente el logo compacto del encabezado.

## Correcciones obligatorias para RC2

1. Incorporar las tres posturas aprobadas de Pulso con versión y hash.
2. Corregir el validador para que no invalide el manifiesto al ejecutarse.
3. Regenerar el mapa de rutas y destinos contra la implementación Next.js real.
4. Distinguir `estado comercial` de `madurez técnica` en catálogo, contenido y pruebas.
5. Verificar el RNC contra el documento fiscal antes de normalizar `132-14710-3` o `132-147103`.
6. Resolver la tensión entre “cuentas críticas a nombre del cliente” y “RCP administra dominio y hosting salvo acuerdo distinto”.
7. Resolver la contradicción interna sobre la aprobación del lockup.
8. Ampliar QA: sitio, accesibilidad, formularios, SEO/AEO, seguridad, build, Worker, destinos, QR e integridad cerrada.
9. Sustituir el estado `planned` de los 30 destinos por un mapa real de `live`, `alias`, `redirect`, `pending` o `rejected`.
10. Incorporar las decisiones de esta matriz y emitir RC2 antes de declarar una Fuente de Verdad 6.0 final.

## Elementos no aplicables como sustitución

- Reemplazar Next.js, OpenNext, Cloudflare, Supabase o los ADR con el renderer Python de piezas sociales.
- Usar la RC1 para revocar seguridad, aislamiento, Delivery Hub, RCP Matrix, SLA o egreso sin una decisión técnica nueva.
- Convertir el sitio comercial en CRM, marketplace, checkout, repositorio de expedientes o sistema profesional.
- Publicar automáticamente las 30 piezas o considerar un icono/demo como prueba de un producto listo.
- Volver a una plataforma universal de once capas o reconstruir Asana, Notion o Slack.
- Utilizar `99_ARCHIVO_HISTORICO_NO_USAR` como autoridad.

## Evidencia principal

### Dentro de la 6.0-RC1

- `00_EMPIEZA_AQUI.md:3-7, 36-64`
- `01_FUENTE_DE_VERDAD/00_DOCUMENTO_RECTOR_6.0-RC1.md:3-17, 19-44, 68-105, 139-146`
- `01_FUENTE_DE_VERDAD/01_DECISIONES_APROBADAS_2026-08-11.md:6-62`
- `01_FUENTE_DE_VERDAD/02_GOBIERNO_DE_AUTORIDAD_Y_CAMBIOS.md:7-48`
- `01_FUENTE_DE_VERDAD/03_POLITICAS_HEREDADAS_Y_PENDIENTES.md:14-41`
- `02_PROPUESTA_DE_VALOR_Y_MENSAJES/00_SISTEMA_VERBAL_6.0.md:3-13, 49-89`
- `02_PROPUESTA_DE_VALOR_Y_MENSAJES/04_COPY_MAESTRO_SITIO_WEB_6.0.md:20-57, 157-231`
- `03_CATALOGO_DE_PRODUCTOS_Y_SERVICIOS/01_ESTADOS_DE_OFERTA.csv:2-34`
- `04_SISTEMA_DE_MARCA/00_MANUAL_DE_MARCA_6.0.md:26-59`
- `04_SISTEMA_DE_MARCA/01_LOGO_Y_LOCKUP.md:3-37`
- `08_CLAIMS_Y_LIMITES/00_MATRIZ_DE_CLAIMS_Y_LIMITES.md:14-53`
- `10_SISTEMA_EDITABLE/validate_source_of_truth.py:18-92`
- `11_QA_Y_VALIDACION/08_QA_REPORT_RC1.md:3-32`

### En la implementación vigente

- `docs/DECISION_LOG.md:54-76`
- `docs/BLUEPRINT_5_IMPLEMENTATION.md:3-37`
- `ARCHITECTURE.md:3-59`
- `docs/OPERATIONS_STACK.md:3-37`
- `docs/BRAND_IMPLEMENTATION.md:5-29`
- `docs/PULSO_INTERACTION_SYSTEM.md:7-45`
- `lib/content.ts:18-80, 132-230, 241-249`
- `components/home-experience.tsx:24-67`
- `components/diagnosis-page.tsx:11-50`
- `components/information-page.tsx:120-274`
- `app/sitemap.ts:3-58`

## Siguiente orden de ejecución

1. Resolver las decisiones D-02 a D-11, una por una; D-01 ya está cerrada.
2. Preparar la RC2 reconciliada y volver a sellar su integridad.
3. Actualizar el catálogo, copy, rutas y activos del sitio únicamente con las decisiones aprobadas.
4. Ejecutar pruebas completas y UAT visual.
5. Convertir RC2 a 6.0.0 solo con cero contradicciones públicas y aprobación final de Dirección General.
