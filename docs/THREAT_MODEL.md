# Modelo de amenazas

## Activos

Identidad corporativa, catálogo/precios, solicitudes y PII, cuentas del portal, documentos de clientes, cupones, órdenes, analítica, configuración de despliegue y credenciales de integraciones.

## Límites de confianza

Navegador público → GitHub Pages → Supabase público; navegador → Google Cloud lead endpoint; usuario autenticado → Supabase Auth/RLS; repositorio → GitHub Actions → Pages. El navegador nunca es autoridad de precio, descuento, pago, rol o estado de orden.

## Riesgos prioritarios

| Amenaza | Control actual/cambio | Pendiente |
|---|---|---|
| Manipulación de precio por URL | Checkout transaccional retirado; solo acepta SKU y reconsulta catálogo | Crear orden/cotización autoritativa en servidor |
| Pago falso o doble | Simulación CardNet/PayPal retirada | Integrar proveedor sandbox con idempotencia y webhook firmado |
| XSS en catálogo | Escape de campos en puntos críticos | Centralizar render seguro y CSP viable |
| Abuso de formularios | Validación y consentimiento explícito en cotización | Rate limit/CAPTCHA accesible en backend |
| Acceso indebido a datos | Supabase RLS confirmado | Pruebas automatizadas de cada rol |
| Fuga de secretos | `.env` no versionado; clave pública separada | Rotación coordinada solo con inventario y rollback |
| Cadena de suministro | Lockfile y CI | Resolver 5 avisos de dependencias con upgrade probado |
| Contenido privado indexado | `noindex` en propuesta | Autenticación real si debe seguir accesible |

## Casos obligatorios antes de pagos

Idempotencia, repetición de webhook, firma inválida, importe alterado, SKU inactivo, cupón vencido, timeout, pago exitoso sin persistencia, persistencia sin pago, reembolso y conciliación.
