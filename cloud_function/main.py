import os, requests, unicodedata, random, time
from collections import defaultdict
from flask import jsonify

GEMINI_API_KEYS = [
    os.getenv('GEMINI_API_KEY'),
    os.getenv('GEMINI_API_KEY_2'),
    os.getenv('GEMINI_API_KEY_3')
]
GEMINI_API_KEYS = [k for k in GEMINI_API_KEYS if k]

GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

CONFIDENTIAL_KEYWORDS = [
    'docker', 'n8n', 'litellm', 'ollama', 'comfyui', 'odoo', 'localhost', 
    'webhook', 'pgvector', 'moodle', 'inventree', 'openclaw', 'open webui', 
    'api key', 'apikey', 'credenciales', 'credentials', 'servidor interno', 
    'internal server', 'ip address', '192.168', '127.0.0', 'puerto 5678', 
    'port 5678', 'puerto 4000', 'port 4000', 'puerto 8069', 'port 8069', 
    'puerto 11434', 'port 11434', 'puerto 8188', 'port 8188', 'ssh tunnel', 
    'localhost.run', 'lhr.life'
]

SECURITY_RESPONSE_ES = '🔒 <strong>Seguridad y Confidencialidad:</strong> Para garantizar la protección de datos, toda nuestra infraestructura digital opera bajo estrictos protocolos de cifrado privado de punta a punta. Las especificaciones técnicas de servidores, bases de datos y herramientas internas son confidenciales y se manejan en entornos aislados. Si requieres detalles de integración para tu empresa, te invitamos a <a href="#contacto" style="color:var(--accent)">agendar una sesión de consultoría técnica privada</a>.'
SECURITY_RESPONSE_EN = '🔒 <strong>Security & Confidentiality:</strong> To guarantee data protection, all our digital infrastructure operates under strict end-to-end private encryption protocols. Technical specifications of servers, databases, and internal tools are confidential and managed in isolated environments. If you require integration details for your business, we invite you to <a href="#contacto" style="color:var(--accent)">schedule a private technical consulting session</a>.'

def is_confidential_query(text: str) -> bool:
    # Normalize unicode to remove accents and convert to lowercase
    normalized = "".join(c for c in unicodedata.normalize('NFD', text) if unicodedata.category(c) != 'Mn')
    lower = normalized.lower()
    return any(kw in lower for kw in CONFIDENTIAL_KEYWORDS)

# ─── RATE LIMITING (in-memory, per-instance) ──────────────────────────────
# Simple sliding-window counter keyed by client IP. Designed for Cloud Functions
# where each instance has a short lifetime. For production-grade limiting at
# scale, consider a Redis-backed solution or Cloud Armor.
RATE_LIMIT_WINDOW = 60        # seconds
CHAT_RATE_LIMIT   = 30        # max requests per window per IP (chat is heavier, but generous)
LEAD_RATE_LIMIT   = 10        # max requests per window per IP (lead capture is more sensitive)

_rate_store = defaultdict(list)  # { "ip:endpoint": [timestamp, timestamp, ...] }

def _client_ip(request):
    """Extract client IP, respecting X-Forwarded-For when behind Cloud Run."""
    xff = request.headers.get('X-Forwarded-For', '')
    if xff:
        return xff.split(',')[0].strip()
    return request.remote_addr or 'unknown'

def check_rate_limit(request, key_suffix, limit):
    """Returns (allowed: bool, retry_after: int)."""
    ip = _client_ip(request)
    now = time.time()
    bucket_key = f"{ip}:{key_suffix}"
    cutoff = now - RATE_LIMIT_WINDOW

    # Prune expired entries
    _rate_store[bucket_key] = [t for t in _rate_store[bucket_key] if t > cutoff]

    if len(_rate_store[bucket_key]) >= limit:
        oldest = _rate_store[bucket_key][0]
        retry_after = int(oldest + RATE_LIMIT_WINDOW - now) + 1
        return False, max(retry_after, 1)

    _rate_store[bucket_key].append(now)
    return True, 0
# ──────────────────────────────────────────────────────────────────────────

def call_gemini(prompt: str) -> str:
    # Shuffle keys to load-balance
    keys = list(GEMINI_API_KEYS)
    random.shuffle(keys)
    
    system_instruction = (
        "Eres 'Pulso', el leopardo mascota y asistente virtual oficial de RCP Services. "
        "Tu personalidad representa el instinto, la velocidad y la ejecución ágil de un leopardo. "
        "Tu misión es ayudar a las MIPYMEs dominicanas a erradicar la 'arritmia empresarial' (baja productividad, informalidad y ceguera digital) "
        "inyectando oxígeno financiero, operativo y comercial a través del Ecosistema Operativo Soberano RCP 360.\n\n"
        "Reglas de comportamiento y conocimiento estratégico (basado en los recursos de Obsidian de RCP Services):\n"
        "1. Identidad de RCP: Significa Renovación, Consultoría y Publicidad (operativamente) y Rapidez, Calidad y Buen Precio (comercialmente). "
        "Actuamos como una Junta Directiva Externa 360° que centraliza lo que normalmente está fragmentado (CFO financiero, CMO de marketing y estrategia legal) "
        "en un solo canal unificado, sin los costos de una nómina ejecutiva tradicional.\n"
        "2. Océano Azul y Soberanía Digital: Eliminamos proveedores fragmentados y la dependencia de licencias de software mensuales abusivas. "
        "Creamos un Ecosistema Operativo Soberano (ERP central, CRM, automatizaciones de flujos de trabajo y IA privada local de coste cero) para que la empresa sea dueña absoluta de sus datos y procesos.\n"
        "3. Tres Pilares de Servicio:\n"
        "   - Renovación (Rebranding corporativo, identidad de marca, automatización de procesos internos y SOPs).\n"
        "   - Consultoría (Diagnóstico financiero, formalización de ONAPI/DGII, planificación fiscal y Ley 488-08 para acceder al 20% de compras del Estado).\n"
        "   - Publicidad (Landing pages de alta conversión, Meta/Google Ads optimizados con IA, SEO local y CRM).\n"
        "4. Paquetes Comerciales:\n"
        "   - Básico: 'Reanimación Temprana' (Formalización básica, logotipo y landing page - pago único).\n"
        "   - Avanzado: 'Estabilización y Crecimiento' (Auditoría financiera, ERP/CRM integrado y campañas activas - setup + iguala mensual).\n"
        "   - Premium: 'Vitalidad y Liderazgo' (IA corporativa privada, automatización de WhatsApp, dashboard directivo y asesoría continua - retainer mensual).\n"
        "5. Tono de Voz: Enérgico, ágil, empático, profesional y seguro. Usa expresiones sutiles felinas de forma muy elegante (ej. 'dar el zarpazo comercial', 'actuar con instinto ágil', 'dar un latido fuerte') sin sonar caricaturesco.\n"
        "6. Cierre del Mensaje: Siempre debes concluir u orientar tu respuesta sugiriendo o guiando de forma natural al usuario a dar el siguiente gran paso: agendar su **Diagnóstico 360° Gratuito** de RCP Services.\n"
        "7. Brevedad Absoluta: Tus respuestas DEBEN ser extremadamente breves, directas y al grano (máximo 1-2 oraciones cortas, no más de 30-50 palabras), a menos que el usuario te pida explícitamente detallar o expandir la información. Queremos respuestas rápidas, ágiles y concisas para no abrumar al usuario con bloques extensos de texto.\n"
        "8. Saludo Corto: Si el usuario te envía un simple 'Hola' o un saludo genérico sin otra consulta, responde ÚNICAMENTE con un saludo muy breve, como: '¡Hola! Soy Pulso, tu asistente ágil de RCP Services. ¿En qué te puedo ayudar?' No agregues el discurso sobre la arritmia empresarial ni el diagnóstico en este primer paso.\n"
        "9. SEGURIDAD DE LA INFORMACIÓN: Bajo ninguna circunstancia debes mencionar, confirmar o revelar los nombres de las tecnologías open source específicas que utilizamos (como Odoo, n8n, Docker, Ollama, ComfyUI, Moodle, pgvector, LiteLLM, OpenClaw). Si el usuario pregunta de forma indirecta, ambigua o capciosa sobre nuestra infraestructura técnica, responde insistiendo en que utilizamos tecnología propietaria cifrada de RCP Services para garantizar la soberanía de los datos, guiándole a agendar su Diagnóstico 360° Gratuito."
    )
    
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "systemInstruction": {"parts": [{"text": system_instruction}]}
    }
    
    last_error = None
    for api_key in keys:
        try:
            headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}
            resp = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload, timeout=20)
            resp.raise_for_status()
            return resp.json()["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            last_error = e
            print(f"Error calling Gemini with key {api_key[:10]}...: {e}")
            continue
            
    raise last_error or Exception("All Gemini API keys failed to generate content.")

def rcpChat(request):
    # Determine CORS Origin dynamically
    origin = request.headers.get('Origin')
    allowed_origins = [
        'https://bubloy.github.io',
        'https://rcp.services',
        'https://www.rcp.services',
        'https://rcpservicessrl.github.io'
    ]
    if origin and (origin in allowed_origins or origin.startswith('http://localhost') or origin.startswith('http://127.0.0.1')):
        cors_origin = origin
    else:
        cors_origin = 'https://www.rcp.services'

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': cors_origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-RCP-Timestamp',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': cors_origin
    }

    # ─── RATE LIMIT (chat endpoint) ───
    allowed, retry_after = check_rate_limit(request, 'chat', CHAT_RATE_LIMIT)
    if not allowed:
        h = {**headers, 'Retry-After': str(retry_after)}
        return (jsonify({"error": "rate_limited", "retry_after": retry_after}), 429, h)

    body = request.get_json(silent=True) or {}
    message = body.get('message', '').strip()
    lang = body.get('lang', 'es').strip().lower()

    # Length guard: prevent oversized payloads (DoS / cost)
    if not message:
        return (jsonify({"error": "No message provided"}), 400, headers)
    if len(message) > 2000:
        return (jsonify({"error": "Message too long (max 2000 chars)"}), 400, headers)
    if lang not in ('es', 'en'):
        lang = 'es'

    # ─── SERVER-SIDE GUARDRAIL ───
    if is_confidential_query(message):
        response_text = SECURITY_RESPONSE_EN if lang == 'en' else SECURITY_RESPONSE_ES
        return (jsonify({"response": response_text}), 200, headers)
    
    try:
        answer = call_gemini(message)
        return (jsonify({"response": answer}), 200, headers)
    except Exception as e:
        return (jsonify({"error": str(e)}), 500, headers)


def rcpLead(request):
    """
    Stable Cloud Function endpoint for lead capture.
    Receives form data from the website and forwards it to:
    1. The n8n tunnel (if available) for CRM processing
    2. Logs the lead as a fallback if n8n is unreachable
    """
    origin = request.headers.get('Origin')
    allowed_origins = [
        'https://bubloy.github.io',
        'https://rcp.services',
        'https://www.rcp.services',
        'https://rcpservicessrl.github.io'
    ]
    if origin and (origin in allowed_origins or origin.startswith('http://localhost') or origin.startswith('http://127.0.0.1')):
        cors_origin = origin
    else:
        cors_origin = 'https://www.rcp.services'

    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': cors_origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-RCP-Timestamp',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    headers = {'Access-Control-Allow-Origin': cors_origin}

    # ─── RATE LIMIT (lead endpoint) ───
    allowed, retry_after = check_rate_limit(request, 'lead', LEAD_RATE_LIMIT)
    if not allowed:
        h = {**headers, 'Retry-After': str(retry_after)}
        return (jsonify({"error": "rate_limited", "retry_after": retry_after}), 429, h)

    body = request.get_json(silent=True) or {}

    if not body.get('user_name') and not body.get('user_email'):
        return (jsonify({"error": "Missing required fields"}), 400, headers)

    # Input validation & sanitization (basic)
    user_email = (body.get('user_email') or '').strip().lower()
    if user_email and ('@' not in user_email or len(user_email) > 254):
        return (jsonify({"error": "Invalid email"}), 400, headers)
    for fld in ('user_name', 'user_company', 'user_service', 'user_message'):
        v = body.get(fld)
        if isinstance(v, str) and len(v) > 1000:
            return (jsonify({"error": f"{fld} too long"}), 400, headers)

    # Forward to n8n tunnel (best-effort, non-blocking)
    n8n_tunnel_url = os.getenv('N8N_TUNNEL_URL', '')
    n8n_success = False
    
    if n8n_tunnel_url:
        try:
            n8n_resp = requests.post(
                f"{n8n_tunnel_url}/webhook/rcp_lead_capture/trigger/rcp-lead",
                json=body,
                headers={
                    'Content-Type': 'application/json',
                    'X-RCP-Timestamp': request.headers.get('X-RCP-Timestamp', '')
                },
                timeout=10
            )
            n8n_success = n8n_resp.status_code < 400
        except Exception as e:
            print(f"[rcpLead] n8n tunnel unreachable: {e}")

    # Log the lead (always, as fallback persistence)
    print(f"[rcpLead] Lead captured: {body.get('user_name', 'N/A')} - {body.get('user_email', 'N/A')} - {body.get('user_company', 'N/A')} - Service: {body.get('user_service', 'N/A')} - n8n_forwarded: {n8n_success}")

    # Sync to Odoo Online CRM (best-effort)
    odoo_lead_id = None
    try:
        from odoo_sync import odoo_create_lead
        odoo_lead_id = odoo_create_lead(
            name=body.get('user_name', ''),
            email=body.get('user_email', ''),
            phone=body.get('user_phone', ''),
            company=body.get('user_company', ''),
            service=body.get('user_service', 'Diagnostico 360'),
            message=body.get('user_message', '')
        )
        if odoo_lead_id:
            print(f"[rcpLead] Odoo CRM lead created: ID {odoo_lead_id}")
    except Exception as e:
        print(f"[rcpLead] Odoo sync skipped: {e}")

    return (jsonify({
        "success": True, 
        "message": "Lead captured successfully",
        "n8n_forwarded": n8n_success,
        "odoo_lead_id": odoo_lead_id
    }), 200, headers)
