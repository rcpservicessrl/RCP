"""
Odoo + Supabase Sync Module
Used by Cloud Functions to create leads in both systems simultaneously.
Works with Odoo Online (free CRM) via XML-RPC API.
"""
import xmlrpc.client
import os

# ─── ODOO ONLINE CONFIG ───
# Tu instancia gratuita de Odoo Online
ODOO_URL = os.getenv('ODOO_URL', 'https://rcp-services.odoo.com')
ODOO_DB = os.getenv('ODOO_DB', 'rcp-services')
ODOO_USER = os.getenv('ODOO_USER', 'rcpservicessrl@gmail.com')
ODOO_API_KEY = os.getenv('ODOO_API_KEY', '')  # Generar en Odoo > Perfil > API Keys

# Hard timeouts (seconds) so a slow/unreachable Odoo never blocks the Cloud
# Function invocation. Cloud Functions default deadline is 60s; keep well under.
ODOO_CONNECT_TIMEOUT = float(os.getenv('ODOO_CONNECT_TIMEOUT', '8'))
ODOO_REQUEST_TIMEOUT = float(os.getenv('ODOO_REQUEST_TIMEOUT', '15'))

# Transport with explicit connect timeout. xmlrpc uses urllib under the hood,
# which honors a socket-level timeout for both connect and response.
class _TimeoutTransport(xmlrpc.client.Transport):
    def __init__(self, timeout, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._timeout = timeout
    def make_connection(self, host):
        conn = super().make_connection(host)
        conn.timeout = self._timeout
        return conn

def _server_proxy(path):
    return xmlrpc.client.ServerProxy(
        f'{ODOO_URL}{path}',
        transport=_TimeoutTransport(ODOO_REQUEST_TIMEOUT),
        # allow_none=False is the XML-RPC default; Odoo tolerates it.
    )

def odoo_authenticate():
    """Authenticate with Odoo Online via XML-RPC"""
    if not ODOO_API_KEY:
        return None
    try:
        common = _server_proxy('/xmlrpc/2/common')
        uid = common.authenticate(ODOO_DB, ODOO_USER, ODOO_API_KEY, {})
        return uid
    except Exception as e:
        print(f"[odoo_sync] authenticate failed: {e}")
        return None

def odoo_create_lead(name, email, phone, company, service, message=''):
    """Create a CRM lead in Odoo Online"""
    uid = odoo_authenticate()
    if not uid:
        return None

    try:
        models = _server_proxy('/xmlrpc/2/object')

        lead_data = {
            'name': f'Web Lead: {company} - {service}',
            'contact_name': name,
            'email_from': email,
            'phone': phone,
            'partner_name': company,
            'description': message,
            'type': 'lead',
            'source_id': False,  # Can map to a source later
        }

        lead_id = models.execute_kw(
            ODOO_DB, uid, ODOO_API_KEY,
            'crm.lead', 'create', [lead_data]
        )
        return lead_id
    except Exception as e:
        print(f"[odoo_sync] create_lead failed: {e}")
        return None
