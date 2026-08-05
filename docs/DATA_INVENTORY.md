# Inventario de datos

Inventario de esquema y código; no contiene valores personales.

| Entidad | Fuente | Clasificación | Exposición | Propietario lógico | Acción |
|---|---|---|---|---|---|
| Productos | `public.productos` (72 filas estimadas) | Comercial pública | Lectura pública de activos | Operaciones/Comercial | Conservar y versionar |
| Cupones | `public.cupones` (0 filas estimadas) | Comercial confidencial hasta publicar | Lectura pública solo activos/vigentes | Comercial | Validar en servidor |
| Clientes | `public.clientes` (6 filas estimadas) | Personal/confidencial | RLS propia/admin; insert anónimo | Comercial/Soporte | Minimizar y proteger |
| Órdenes | `public.ordenes` (0 filas estimadas) | Comercial/personal | Lectura propia | Operaciones/Finanzas | Crear por RPC idempotente |
| Items de orden | `public.orden_items` | Comercial | Lectura propia | Operaciones | Derivar de catálogo servidor |
| Avances | `public.producto_avances` | Confidencial cliente | Lectura propia | Operaciones | Conservar |
| Roles/permisos | `roles`, `permissions`, `role_permissions`, `user_roles` | Interna sensible | Lectura limitada/RLS | Seguridad | Conservar; revisar grants |
| Auditoría RBAC | `rbac_audit_log` | Interna sensible | `rbac.manage` | Seguridad | Conservar y ampliar |
| Marketing | `marketing_metrics` | Comercial/confidencial | RLS | Marketing | No enviar PII a analítica |
| Postulaciones | `postulaciones` | Personal | insert público validado | RR. HH. | Consentimiento, retención, antiabuso |
| Diagnóstico | Solo estado cliente actual | Personal/comercial potencial | Sin persistencia consistente | Consultoría | Definir metodología y consentimiento |
| Catálogo estático | `public/tienda.js` | Comercial obsoleta/duplicada | Pública | Sin propietario | Retirar como fallback de precios |
| Precios de paquetes | portada y checkout | Comercial contradictoria | Pública | Sin propietario | Migrar al catálogo |
| DOCX estratégicos | raíz del repo | Interna/pública pendiente | Versionados | Dirección | Clasificar claims antes de publicar |

## Calidad detectada

- Duplicación de catálogo y precios en tres superficies.
- Producto gratuito representado como precio cero comprable.
- Catálogo remoto incluye 72 registros, pero no se verificó la aprobación comercial individual.
- La inserción anónima de clientes permite abuso aunque la lectura esté protegida.
- No existe entidad versionada completa para vigencia/publicación de precios.
- Las migraciones están en `snippets`; falta historial reproducible convencional.
