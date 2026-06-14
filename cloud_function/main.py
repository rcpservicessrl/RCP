import os, requests, unicodedata, random
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
        'https://www.rcp.services'
    ]
    if origin and (origin in allowed_origins or origin.startswith('http://localhost') or origin.startswith('http://127.0.0.1')):
        cors_origin = origin
    else:
        cors_origin = 'https://rcp.services'

    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': cors_origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-RCP-Token',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': cors_origin
    }

    body = request.get_json(silent=True) or {}
    message = body.get('message', '').strip()
    lang = body.get('lang', 'es').strip().lower()

    if not message:
        return (jsonify({"error": "No message provided"}), 400, headers)
    
    # ─── SERVER-SIDE GUARDRAIL ───
    if is_confidential_query(message):
        response_text = SECURITY_RESPONSE_EN if lang == 'en' else SECURITY_RESPONSE_ES
        return (jsonify({"response": response_text}), 200, headers)
    
    try:
        answer = call_gemini(message)
        return (jsonify({"response": answer}), 200, headers)
    except Exception as e:
        return (jsonify({"error": str(e)}), 500, headers)
