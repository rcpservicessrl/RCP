# Infraestructura RCP Services

## Health Check

El script `health_check.py` monitorea todos los servicios críticos:

```bash
# Ejecutar manualmente
cd cloud_function
python health_check.py

# Ejecutar como cron (cada 15 minutos)
# Agregar a crontab: */15 * * * * cd /path/to/cloud_function && python health_check.py >> /var/log/rcp_health.log 2>&1
```

### Servicios monitoreados

| Servicio | Método | Endpoint |
|----------|--------|----------|
| Website | GET rcp.services | HTTP 200 |
| Supabase | GET /rest/v1/roles | Array response |
| rcpChat | OPTIONS preflight | HTTP 204 |
| rcpLead | OPTIONS preflight | HTTP 204 |
| n8n | GET /healthz | HTTP 200 (si tunnel activo) |
| Odoo | GET odoo.com | HTTP 200 |

### Variables de entorno

```env
SUPABASE_URL=https://wpfovxgbennpgydbellw.supabase.co
SUPABASE_KEY=<anon_key>
N8N_TUNNEL_URL=https://tu-tunnel.trycloudflare.com
ODOO_URL=https://rcp-services.odoo.com
WHATSAPP_NOTIFY=http://localhost:8080/message/sendText/rcp_whatsapp_2026
```

## Cloudflare Tunnel para n8n

### Setup (una sola vez)

1. Instalar `cloudflared`:
   ```bash
   # Windows
   winget install cloudflare.cloudflared
   
   # Docker (ya disponible si usas la imagen oficial n8n)
   docker pull cloudflare/cloudflared
   ```

2. Autenticar:
   ```bash
   cloudflared tunnel login
   ```

3. Crear tunnel:
   ```bash
   cloudflared tunnel create rcp-n8n
   ```

4. Configurar `~/.cloudflared/config.yml`:
   ```yaml
   tunnel: <TUNNEL_ID>
   credentials-file: ~/.cloudflared/<TUNNEL_ID>.json

   ingress:
     - hostname: n8n.rcp.services
       service: http://localhost:5678
     - service: http_status:404
   ```

5. Agregar registro DNS en Cloudflare:
   ```bash
   cloudflared tunnel route dns rcp-n8n n8n.rcp.services
   ```

6. Ejecutar como servicio:
   ```bash
   cloudflared service install
   cloudflared service start
   ```

### Docker Compose (alternativa)

Agregar al `docker-compose.yml` existente:

```yaml
  cloudflared:
    image: cloudflare/cloudflared:latest
    command: tunnel --no-autoupdate run --token ${CLOUDFLARE_TUNNEL_TOKEN}
    restart: unless-stopped
    depends_on:
      - n8n
```

El token se obtiene desde el dashboard de Cloudflare Zero Trust → Tunnels → Create.

## Stack Docker actual (~12GB RAM)

| Contenedor | Puerto | Función |
|-----------|--------|---------|
| n8n | 5678 | Automatización workflows |
| Ollama | 11434 | 7 modelos LLM locales |
| LiteLLM | 4000 | Proxy multi-modelo |
| Open WebUI | 8188 | Chat UI |
| Odoo | 8069 | ERP/CRM |
| PostgreSQL | 5432 | DB Odoo |
| Evolution API | 8080 | WhatsApp Business |

## Deployment

El sitio se despliega automáticamente via GitHub Actions:
- Push a `master` → Astro build → GitHub Pages
- CNAME: `rcp.services` → GitHub Pages
- SSL: gestionado por GitHub automáticamente
