#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
PUENTE NEURONAL DE ANTIGRAVITY (bridge.py)
------------------------------------------
Este script actúa como el núcleo de la Capa Neuronal.
Permite delegar tareas de desarrollo de forma automatizada (explicaciones, pruebas unitarias, refactorización) al motor local o a la nube gratuita de Gemini, reduciendo el consumo de tokens en llamadas principales.

Incorpora una CACHÉ SEMÁNTICA LOCAL para recuperar instantáneamente resultados de tareas repetidas sin realizar nuevas llamadas al modelo.
"""

import os
import sys
import json
import time
import hashlib
import argparse
import urllib.request
import urllib.error
import subprocess

DEFAULT_API_BASE = "http://127.0.0.1:11434/v1"
DEFAULT_MODEL = "openrouter/free"
DEFAULT_KEY = "mipyme_litellm_key_2026"
ENABLE_TOOL_USE = True
ALLOWED_COMMANDS = ["git", "python", "powershell", "cmd", "dir", "ls", "mkdir", "copy", "move", "del", "rmdir"]

# Importar caché semantica por embeddings (modulo vecino)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
try:
    import embeddings as _embed
except Exception:
    _embed = None


def _tokens_path():
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "tokens.json")


def _estimar_tokens(texto):
    """Aproximacion simple: ~4 chars por token."""
    return max(1, len(texto or "") // 4)


def registrar_telemetria(modelo, prompt, resultado, fuente):
    """Registra una entrada de telemetria de tokens en tokens.json."""
    try:
        path = _tokens_path()
        data = []
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                except Exception:
                    data = []
        data.append({
            "ts": int(time.time()),
            "modelo": modelo,
            "prompt_tokens": _estimar_tokens(prompt),
            "completion_tokens": _estimar_tokens(resultado),
            "fuente": fuente,  # 'cache_exact' | 'cache_semantic' | 'modelo'
        })
        # Mantener ultimas 1000 entradas
        data = data[-1000:]
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[TELEMETRIA] no se pudo registrar: {e}", file=sys.stderr)


def resumen_telemetria():
    """Devuelve un dict resumen de la telemetria acumulada."""
    try:
        path = _tokens_path()
        if not os.path.exists(path):
            return {"total_llamadas": 0, "ahorro_cache": 0, "tokens_modelo": 0}
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        cache_hits = sum(1 for d in data if d.get("fuente", "").startswith("cache"))
        tokens_modelo = sum(d.get("completion_tokens", 0) for d in data if not d.get("fuente", "").startswith("cache"))
        return {
            "total_llamadas": len(data),
            "cache_hits": cache_hits,
            "tokens_modelo": tokens_modelo,
            "ahorro_estimado_tokens": sum(d.get("prompt_tokens", 0) for d in data if d.get("fuente", "").startswith("cache")),
        }
    except Exception:
        return {"total_llamadas": 0, "ahorro_cache": 0, "tokens_modelo": 0}

def cargar_env():
    """Carga variables desde el archivo .env si existe en el workspace central o local."""
    env_vars = {}
    search_dirs = [os.getcwd(), os.path.dirname(os.getcwd()), r"C:\\Antigravity"]
    for d in search_dirs:
        env_path = os.path.join(d, ".env")
        if os.path.exists(env_path):
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#"):
                        if "=" in line:
                            parts = line.split("=", 1)
                            key = parts[0].strip()
                            val = parts[1].strip().strip('"').strip("'")
                            env_vars[key] = val
                            os.environ[key] = val
            break
    return env_vars

def obtener_hash_cache(task, model, content):
    """Genera un hash SHA-256 único de la consulta para indexar la caché."""
    hash_input = f"{task}||{model}||{content}"
    return hashlib.sha256(hash_input.encode('utf-8')).hexdigest()

def cargar_cache(cache_path):
    if os.path.exists(cache_path):
        try:
            with open(cache_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def guardar_cache(cache_path, cache_data):
    try:
        parent = os.path.dirname(cache_path)
        if parent:
            os.makedirs(parent, exist_ok=True)
        with open(cache_path, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"[WARNING] No se pudo guardar la cache: {e}", file=sys.stderr)

def determinar_modelo_conveniente(task, file_content):
    task_lower = task.lower()
    if len(file_content) > 6000:
        return "gemini-2.5-flash", f"Contexto extenso ({len(file_content)} caracteres). Enrutado a Gemini 2.5 Flash para procesamiento instantáneo."
    palabras_complejas = ["test", "prueba", "unittest", "bug", "error", "falla", "corrije", "fix", "optimiza", "refactoriza", "algoritmo", "arquitectura", "disena", "crea"]
    for palabra in palabras_complejas:
        if palabra in task_lower:
            return "gemini-2.5-flash", f"Tarea requiere razonamiento avanzado (detectada palabra clave '{palabra}'). Enrutado a Gemini 2.5 Flash."
    return "coder-es-fast", "Tarea y contexto livianos. Enrutado a Ollama local para ahorrar tokens de nube."

def llamar_litellm(api_base, model, key, messages, temperature=0.2):
    proxy_handler = urllib.request.ProxyHandler({})
    opener = urllib.request.build_opener(proxy_handler)
    
    # Si es un modelo de OpenRouter, anulamos el api_base y la clave por defecto
    if model.startswith("openrouter/") or model == "openrouter/free":
        openrouter_key = os.environ.get("OPENROUTER_API_KEY", "")
        if not openrouter_key:
            print("[WARNING] Clave de API de OpenRouter no encontrada en el entorno. Intentando fallback local...", file=sys.stderr)
            raise urllib.error.URLError("No OpenRouter API key provided")
        
        api_base = "https://openrouter.ai/api/v1"
        key = openrouter_key
        url = f"{api_base}/chat/completions"
        headers = {
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/google-deepmind/antigravity",
            "X-Title": "Antigravity Neural Bridge"
        }
    else:
        url = f"{api_base}/chat/completions"
        headers = {"Authorization": f"Bearer {key}", "Content-Type": "application/json"}

    payload = {"model": model, "messages": messages, "temperature": temperature}
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with opener.open(req, timeout=120) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except urllib.error.URLError as e:
        if model.startswith("openrouter/") or model == "openrouter/free":
            print(f"[ERROR] al conectar con OpenRouter ({url}): {e}", file=sys.stderr)
        else:
            print(f"[ERROR] al conectar con LiteLLM ({url}): {e}", file=sys.stderr)
            
        # Fallback to direct Ollama API
        fallback_url = "http://127.0.0.1:11434/api/chat"
        print(f"[FALLBACK] Intentando conexión directa a Ollama en {fallback_url}...", file=sys.stderr)
        try:
            # Mapear modelo para Ollama si venía de OpenRouter o modelo rápido
            if model.startswith("openrouter/") or model == "openrouter/free":
                local_model = os.environ.get("OLLAMA_MODEL_CODING", "qwen2.5-coder:7b")
            elif model == "coder-es-fast":
                local_model = "coder-es-fast:latest"
            else:
                local_model = model

            ollama_payload = {
                "model": local_model,
                "messages": messages,
                "stream": False,
                "options": {"temperature": temperature}
            }
            fallback_data = json.dumps(ollama_payload).encode("utf-8")
            fallback_req = urllib.request.Request(fallback_url, data=fallback_data, headers={"Content-Type": "application/json"}, method="POST")
            with opener.open(fallback_req, timeout=120) as fallback_res:
                fallback_res_data = json.loads(fallback_res.read().decode("utf-8"))
                return fallback_res_data.get("message", {}).get("content", "")
        except Exception as e_fallback:
            print(f"[ERROR] Fallback a Ollama también falló: {e_fallback}", file=sys.stderr)
            sys.exit(1)

def main():
    parser = argparse.ArgumentParser(description="Puente Neuronal de Antigravity.")
    parser.add_argument("--task", type=str, help="Descripción de la tarea.")
    parser.add_argument("--telemetria", action="store_true", help="Mostrar resumen de telemetria de tokens y salir.")
    parser.add_argument("--input", type=str, help="Archivo de entrada para contexto.")
    parser.add_argument("--output", type=str, help="Archivo donde escribir el resultado.")
    parser.add_argument("--model", type=str, default=DEFAULT_MODEL, help="Modelo (auto, coder-es-fast, gemini-2.5-flash).")
    parser.add_argument("--mode", type=str, choices=["write", "refactor", "analyze"], default="analyze", help="Modo.")
    parser.add_argument("--temp", type=float, default=0.2, help="Temperatura.")
    args = parser.parse_args()

    # Modo telemetria: reportar y salir sin llamar al modelo
    if args.telemetria:
        print(json.dumps(resumen_telemetria(), ensure_ascii=False, indent=2))
        if _embed is not None:
            print(json.dumps(_embed.estadisticas(), ensure_ascii=False, indent=2))
        return

    if not args.task:
        parser.error("--task es requerido (o usa --telemetria)")

    MAX_ITER = 10
    iteration = 0

    env_vars = cargar_env()
    api_key = env_vars.get("LITELLM_MASTER_KEY", DEFAULT_KEY)

    file_content = ""
    if args.input and os.path.exists(args.input):
        try:
            with open(args.input, "r", encoding="utf-8") as f:
                file_content = f.read()
        except Exception as e:
            print(f"[ERROR] al leer archivo: {e}", file=sys.stderr)
            sys.exit(1)

    modelo_elegido = args.model
    if args.model == "auto":
        modelo_elegido, razon = determinar_modelo_conveniente(args.task, file_content)
        print(f"[ROUTER] {razon}")
    else:
        if args.model == DEFAULT_MODEL:
            print(f"[ROUTER] Utilizando modelo predeterminado: {modelo_elegido}")
        else:
            print(f"[ROUTER] Modelo especificado manualmente: {modelo_elegido}")

    cache_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "cache.json")
    cache_data = cargar_cache(cache_path)
    query_hash = obtener_hash_cache(args.task, modelo_elegido, file_content)

    # 1) Cache semantica por embeddings (nuevo, preferido)
    resultado = None
    if _embed is not None:
        resultado, motivo = _embed.buscar(args.task, modelo_elegido, file_content)
        if resultado:
            print(f"[CACHE] Coincidencia {motivo} detectada. Recuperando resultado (ahorro de tokens)...")
            registrar_telemetria(modelo_elegido, args.task + file_content, resultado, f"cache_{motivo}")
    # 2) Fallback/legacy: cache por hash exacto heredada
    if resultado is None and query_hash in cache_data:
        print("[CACHE] Coincidencia exacta (legacy). Recuperando resultado...")
        resultado = cache_data[query_hash]
        registrar_telemetria(modelo_elegido, args.task + file_content, resultado, "cache_exact")

    if resultado is not None:
        # Salida directa del resultado cacheado (mismo flujo que abajo)
        if args.output:
            try:
                parent_dir = os.path.dirname(os.path.abspath(args.output))
                if parent_dir:
                    os.makedirs(parent_dir, exist_ok=True)
                with open(args.output, "w", encoding="utf-8") as f:
                    f.write(resultado)
                print(f"[SAVE] Resultado guardado en: {args.output}")
            except Exception as e:
                print(f"[ERROR] al guardar salida: {e}", file=sys.stderr)
                sys.exit(1)
        else:
            print("\n=== RESPUESTA DE LA CAPA NEURONAL (cache) ===")
            print(resultado)
            print("==============================================\n")
    else:
        system_prompt = (
            "Eres un programador experto del Consorcio Agéntico. Tu objetivo es realizar tareas de desarrollo "
            "de forma rápida, precisa y con código limpio. Responde siempre en español. Si generas código, "
            "entregalo dentro de bloques markdown de código ``` y asegúrate de comentar las partes clave en español."
        )
        user_prompt = f"Tarea a realizar: {args.task}\n"
        if file_content:
            user_prompt += f"\n--- CONTENIDO DEL ARCHIVO CONTEXTO ({args.input}) ---\n{file_content}\n---------------------------------------\n"
        if args.mode == "refactor":
            system_prompt += ("\nMODO REFACTORIZACIÓN: Analiza el código proporcionado y devuélvelo modificado o refactorizado "
                               "según la tarea solicitada. Devuelve SOLAMENTE el bloque de código final. Evita explicaciones "
                               "redundantes fuera del bloque de código para facilitar su parsing.")
        messages = [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        while True:
            if iteration >= MAX_ITER:
                print("[AGENTE] Máximo número de iteraciones alcanzado, terminando.")
                break
            iteration += 1
            print(f"[LLM] Enviando tarea a [{modelo_elegido}] (iteración {iteration})...")
            resultado = llamar_litellm(api_base=DEFAULT_API_BASE, model=modelo_elegido, key=api_key, messages=messages, temperature=args.temp)
            # Guardar en cache exacta heredada y cache semantica por embeddings
            cache_data[query_hash] = resultado
            guardar_cache(cache_path, cache_data)
            if _embed is not None:
                try:
                    _embed.almacenar(args.task, modelo_elegido, file_content, resultado)
                except Exception as e:
                    print(f"[CACHE] no se pudo almacenar embedding: {e}", file=sys.stderr)
            registrar_telemetria(modelo_elegido, args.task + file_content, resultado, "modelo")
            if ENABLE_TOOL_USE:
                try:
                    resp_json = json.loads(resultado)
                    if isinstance(resp_json, dict) and "action" in resp_json:
                        action = resp_json["action"]
                        if action == "run_command":
                            cmd = resp_json.get("command", "")
                            confirm = input(f"[TOOL] Ejecutar comando '{cmd}'? (S/N): ")
                            if confirm.lower() == "s":
                                cmd_name = cmd.split()[0]
                                if cmd_name not in ALLOWED_COMMANDS:
                                    print(f"[TOOL] Comando '{cmd_name}' no está permitido. Saltando.")
                                else:
                                    print(f"[TOOL] Ejecutando: {cmd}")
                                    try:
                                        out = subprocess.check_output(cmd, shell=True, text=True, stderr=subprocess.STDOUT)
                                        print(f"[TOOL] Salida:\n{out}")
                                        messages.append({"role": "assistant", "content": f"Resultado del comando: {out}"})
                                        continue
                                    except subprocess.CalledProcessError as e:
                                        print(f"[TOOL] Error al ejecutar: {e.output}")
                            else:
                                print("[TOOL] Ejecución cancelada por el usuario.")
                except json.JSONDecodeError:
                    pass
            if args.output:
                try:
                    processed_result = resultado
                    if args.mode == "refactor" and "```" in resultado:
                        parts = resultado.split("```")
                        for i in range(1, len(parts), 2):
                            content = parts[i]
                            lines = content.splitlines()
                            if len(lines) > 0 and not lines[0].startswith(" ") and len(lines[0]) < 10:
                                processed_result = "\n".join(lines[1:])
                            else:
                                processed_result = content
                            break
                    parent_dir = os.path.dirname(os.path.abspath(args.output))
                    if parent_dir:
                        os.makedirs(parent_dir, exist_ok=True)
                    with open(args.output, "w", encoding="utf-8") as f:
                        f.write(processed_result)
                    print(f"[SAVE] Resultado guardado en: {args.output}")
                except Exception as e:
                    print(f"[ERROR] al guardar salida: {e}", file=sys.stderr)
                    sys.exit(1)
            else:
                print("\n=== RESPUESTA DE LA CAPA NEURONAL ===")
                print(resultado)
                print("======================================\n")
            break

if __name__ == "__main__":
    main()
