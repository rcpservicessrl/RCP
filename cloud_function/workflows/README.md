# Workflows n8n — RCP Services

## Supabase → Odoo Sale Order (`supabase_to_odoo_order.json`)

### Flujo

```
Supabase DB Webhook (ordenes.status → 'paid')
  → n8n Webhook receives payload
  → Validate order data
  → Fetch client info from Supabase
  → Search/Create partner in Odoo
  → Create Sale Order in Odoo with line items
  → Update Supabase order with sale_order_id
  → Notify via WhatsApp (Evolution API)
```

### Requisitos para activar

1. **n8n accesible desde internet** (Cloudflare Tunnel o dominio público)
2. **Supabase Database Webhook** configurado:
   - Tabla: `ordenes`
   - Evento: `UPDATE`
   - Filtro: `status = 'paid'`
   - URL: `https://<n8n-domain>/webhook/rcp-order-paid`
3. **Credenciales Odoo** (XML-RPC o JSON-RPC)
4. **Evolution API** activa para notificaciones WhatsApp

### Cómo importar en n8n

1. Abrir n8n (http://localhost:5678)
2. Menú → Import from File
3. Seleccionar `supabase_to_odoo_order.json`
4. Configurar las credenciales en cada nodo
5. Activar el workflow

### Variables de entorno necesarias

```env
SUPABASE_URL=https://wpfovxgbennpgydbellw.supabase.co
SUPABASE_SERVICE_KEY=<tu_service_role_key>
ODOO_URL=https://rcp-services.odoo.com
ODOO_DB=rcp-services
ODOO_UID=2
ODOO_PASSWORD=<tu_api_key_odoo>
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=<tu_key>
```

### Edge Cases manejados

- **Duplicados**: Verificar `sale_order_id` antes de crear
- **Partner inexistente**: Se crea automáticamente en Odoo
- **Odoo offline**: Retry con backoff exponencial
- **Payload inválido**: Se loguea y no se procesa
