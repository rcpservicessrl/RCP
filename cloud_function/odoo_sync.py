"""
Odoo + Supabase Sync Module
Used by Cloud Functions to create leads in both systems simultaneously.
Works with Odoo Online (free CRM) via XML-RPC API.
"""
import xmlrpc.client
import os

# ─── ODOO ONLINE CONFIG ───
# Tu instancia gratuita de Odoo Online
ODOO_URL = os.getenv('ODOO_URL', 'https://rcpservicessrl.odoo.com')
ODOO_DB = os.getenv('ODOO_DB', 'rcpservicessrl')
ODOO_USER = os.getenv('ODOO_USER', 'rcpservicessrl@gmail.com')
ODOO_API_KEY = os.getenv('ODOO_API_KEY', '')  # Generar en Odoo > Perfil > API Keys

def odoo_authenticate():
    """Authenticate with Odoo Online via XML-RPC"""
    if not ODOO_API_KEY:
        return None
    common = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/common')
    uid = common.authenticate(ODOO_DB, ODOO_USER, ODOO_API_KEY, {})
    return uid

def odoo_create_lead(name, email, phone, company, service, message=''):
    """Create a CRM lead in Odoo Online"""
    uid = odoo_authenticate()
    if not uid:
        return None
    
    models = xmlrpc.client.ServerProxy(f'{ODOO_URL}/xmlrpc/2/object')
    
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
