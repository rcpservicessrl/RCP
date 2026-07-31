#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
CACHE SEMANTICA REAL (embeddings.py)
------------------------------------
Reemplaza la caché por hash exacto de bridge.py por una cache basada en
embeddings vectoriales (Gemini text-embedding-004) + similitud coseno.

Estrategia:
  - Genera embedding de la consulta (task + contexto).
  - Busca en la cache el item con similitud coseno >= UMBRAL (default 0.88).
  - Si hay match -> devuelve el resultado cacheado (ahorro de tokens).
  - Si no hay match -> devuelve None (el llamador consulta al modelo y luego
    almacena el nuevo resultado via guardar()).

Resiliencia:
  - Si Gemini no responde, degenera a coincidencia exacta por hash SHA-256
    (compatibilidad con la cache heredada de bridge.py).
  - Cero dependencias externas: urllib + json + hashlib + math.

Formato de cache (cache_embeddings.json):
  [
    {
      "hash": "<sha256>",       # clave exacta heredada
      "embedding": [...],       # vector (puede faltar si cayo a hash)
      "task": "...",
      "model": "...",
      "content_hash": "...",
      "result": "...",
      "ts": 1234567890
    }, ...
  ]
"""

import os
import sys
import json
import time
import math
import hashlib
import urllib.request
import urllib.error

GEMINI_EMBED_MODEL = "gemini-embedding-001"  # modelo establecido de embeddings
GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models"
UMBRAL_DEFAULT = 0.88


def _cargar_env():
    """Reutiliza el cargador de .env del bridge (mismo dir)."""
    here = os.path.dirname(os.path.abspath(__file__))
    env_path = os.path.join(os.path.dirname(here), ".env")
    env = {}
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        env[k.strip()] = v.strip().strip('"').strip("'")
                        os.environ[k.strip()] = env[k.strip()]
        except Exception:
            pass
    return env


def _obtener_keys():
    """Devuelve la lista de GEMINI_API_KEY* disponibles (rotacion)."""
    env = _cargar_env()
    keys = []
    for k in ("GEMINI_API_KEY", "GEMINI_API_KEY_2", "GEMINI_API_KEY_3"):
        v = env.get(k) or os.environ.get(k)
        if v:
            keys.append(v)
    return keys


def generar_embedding(texto):
    """Genera el embedding de un texto via Gemini. Devuelve lista[float] o None."""
    texto = (texto or "").strip()
    if not texto:
        return None
    keys = _obtener_keys()
    if not keys:
        return None
    url = f"{GEMINI_ENDPOINT}/{GEMINI_EMBED_MODEL}:embedContent"
    payload = json.dumps({"content": {"parts": [{"text": texto}]}}).encode("utf-8")
    proxy_handler = urllib.request.ProxyHandler({})
    opener = urllib.request.build_opener(proxy_handler)
    last_err = None
    for key in keys:
        full_url = f"{url}?key={key}"
        req = urllib.request.Request(
            full_url, data=payload,
            headers={"Content-Type": "application/json"}, method="POST",
        )
        try:
            with opener.open(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                emb = data.get("embedding", {}).get("values")
                if emb:
                    return emb
        except Exception as e:
            last_err = e
            continue
    if last_err:
        print(f"[EMBED] Gemini no respondio ({last_err}). Usando fallback hash.", file=sys.stderr)
    return None


def similitud_coseno(a, b):
    if not a or not b or len(a) != len(b):
        return 0.0
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    if na == 0 or nb == 0:
        return 0.0
    return dot / (na * nb)


def _ruta_cache():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache_embeddings.json")


def cargar_cache():
    path = _ruta_cache()
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []


def guardar_cache(cache):
    path = _ruta_cache()
    try:
        with open(path, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[EMBED] No se pudo guardar cache: {e}", file=sys.stderr)


def _hash_exacto(task, model, content):
    return hashlib.sha256(f"{task}||{model}||{content}".encode("utf-8")).hexdigest()


def buscar(task, model, content, umbral=UMBRAL_DEFAULT):
    """
    Busca un resultado cacheado.
    Devuelve (resultado, motivo) donde motivo es 'semantic' | 'exact' | None.
    """
    cache = cargar_cache()
    h = _hash_exacto(task, model, content)
    # 1. Coincidencia exacta (rapida, gratuita)
    for item in cache:
        if item.get("hash") == h:
            return item.get("result"), "exact"
    # 2. Coincidencia semantica via embeddings
    query_emb = generar_embedding(f"{task}\n{content[:2000]}")
    if not query_emb:
        return None, None
    mejor_score = 0.0
    mejor_result = None
    for item in cache:
        emb = item.get("embedding")
        if not emb:
            continue
        score = similitud_coseno(query_emb, emb)
        if score > mejor_score:
            mejor_score = score
            mejor_result = item.get("result")
    if mejor_score >= umbral and mejor_result:
        return mejor_result, "semantic"
    return None, None


def almacenar(task, model, content, result):
    """Guarda un nuevo resultado en cache con su embedding."""
    cache = cargar_cache()
    h = _hash_exacto(task, model, content)
    # Evitar duplicados exactos
    for item in cache:
        if item.get("hash") == h:
            return
    emb = generar_embedding(f"{task}\n{content[:2000]}")
    cache.append({
        "hash": h,
        "embedding": emb,
        "task": task[:500],
        "model": model,
        "result": result,
        "ts": int(time.time()),
    })
    # Limitar crecimiento: mantener ultimos 500 items
    if len(cache) > 500:
        cache = cache[-500:]
    guardar_cache(cache)


def estadisticas():
    cache = cargar_cache()
    con_emb = sum(1 for it in cache if it.get("embedding"))
    return {"total": len(cache), "con_embedding": con_emb}


if __name__ == "__main__":
    # Smoke test
    print("[TEST] estadisticas:", estadisticas())
    r, motivo = buscar("ping test", "test-model", "contenido de prueba")
    print(f"[TEST] buscar -> motivo={motivo}")
