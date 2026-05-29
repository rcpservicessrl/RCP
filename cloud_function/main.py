import os, requests
from flask import jsonify

GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def call_gemini(prompt: str) -> str:
    headers = {"Content-Type": "application/json", "x-goog-api-key": GEMINI_API_KEY}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    resp = requests.post(GEMINI_ENDPOINT, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    return resp.json()["candidates"][0]["content"]["parts"][0]["text"]

def rcpChat(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    body = request.get_json(silent=True) or {}
    message = body.get('message', '').strip()
    if not message:
        return (jsonify({"error": "No message provided"}), 400, headers)
    
    try:
        answer = call_gemini(message)
        return (jsonify({"response": answer}), 200, headers)
    except Exception as e:
        return (jsonify({"error": str(e)}), 500, headers)
