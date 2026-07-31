#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
SUBAGENTE DE MANTENIMIENTO Y OPTIMIZACION DE CONTEXTO (maintenance.py)
---------------------------------------------------------------------
Mantenimiento programado del Vault de Obsidian (RAIZ DEL PROYECTO):
  1. Archivar notas temporales/log/draft con mas de 7 dias.
  2. Comprimir contexto: inyectar un "Resumen de Contexto" IA en notas extensas
     (>10.000 caracteres) para mantener la ventana de contexto limpia.
  3. Reconstruir el indice de notas activas en home.md.
  4. Actualizar el estado de salud del contexto (polucion).

Diseñado con cero dependencias externas (urllib + json) y UTF-8 limpio.
A partir de v2 apunta al VAULT GRANDE (raiz del proyecto) en lugar del
mini-vault 'vault/', y excluye directorios ajenos al conocimiento
(Sitio-Web, node_modules, .git, etc.).
"""

import os
import sys
import time
import json
import datetime
import argparse
import urllib.request
import urllib.error

# Por defecto el vault grande es la RAIZ DEL PROYECTO (padre de .neural_bridge).
# Esto corrige el bug historico: antes apuntaba a 'vault/' (1 sola nota).
_DEFAULT_VAULT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARCHIVE_DIR_NAME = "archive"

# Directorios que NO son conocimiento curado y deben excluirse del barrido.
EXCLUDE_DIRS = {
    "Sitio-Web", "node_modules", ".git", "dist", ".obsidian", ".vscode",
    ".kiro", ".agents", "graphify-out", "_pipelines-ia", "generations",
    ".neural_bridge", "vault",  # 'vault/' es ahora cache temporal
    "99 - Archivo y Fuentes",   # se gestiona aparte (deduplicacion via Graphify)
    "00 - Inicio",              # indices, no se comprimen
}

API_BASE = "http://127.0.0.1:4000/v1"   # LiteLLM
MODEL = "asistente-es"
API_KEY_DEFAULT = "mipyme_litellm_key_2026"

# Marcadores robustos en home.md / Mapa de la Boveda.
MARKER_NOTES_START = "<!-- OTHER_NOTES_START -->"
MARKER_NOTES_END = "<!-- OTHER_NOTES_END -->"
MARKER_STATUS_START = "<!-- CONTEXT_STATUS_START -->"
MARKER_STATUS_END = "<!-- CONTEXT_STATUS_END -->"


def cargar_env(vault_dir=None):
    """Carga variables desde .env buscando en el proyecto y directorios padre."""
    search_dirs = [os.path.dirname(os.path.abspath(__file__))]
    if vault_dir:
        search_dirs.insert(0, os.path.dirname(os.path.abspath(vault_dir)))
    env_vars = {}
    for d in search_dirs:
        env_path = os.path.join(d, ".env")
        if os.path.exists(env_path):
            try:
                with open(env_path, "r", encoding="utf-8") as f:
                    for line in f:
                        line = line.strip()
                        if line and not line.startswith("#") and "=" in line:
                            k, v = line.split("=", 1)
                            k = k.strip()
                            v = v.strip().strip('"').strip("'")
                            env_vars[k] = v
                            os.environ[k] = v
            except Exception:
                pass
            break
    return env_vars


def llamar_litellm(prompt, system_prompt, api_key):
    """Llama al modelo via LiteLLM con fallback a Ollama directo."""
    url = f"{API_BASE}/chat/completions"
    headers = {"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": prompt},
    ]
    payload = {"model": MODEL, "messages": messages, "temperature": 0.2}
    data = json.dumps(payload).encode("utf-8")
    proxy_handler = urllib.request.ProxyHandler({})
    opener = urllib.request.build_opener(proxy_handler)
    req = urllib.request.Request(url, data=data, headers=headers, method="POST")
    try:
        with opener.open(req, timeout=90) as response:
            res_data = json.loads(response.read().decode("utf-8"))
            return res_data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[ERROR] Inferencia LiteLLM fallida ({url}): {e}", file=sys.stderr)
        # Fallback a Ollama nativo
        fallback_url = "http://127.0.0.1:11434/api/chat"
        print(f"[FALLBACK] Intentando Ollama directo en {fallback_url}...", file=sys.stderr)
        try:
            ollama_payload = {
                "model": os.environ.get("OLLAMA_MODEL_ASSISTANT", "asistente-es:latest"),
                "messages": messages,
                "stream": False,
                "options": {"temperature": 0.2},
            }
            fb_data = json.dumps(ollama_payload).encode("utf-8")
            fb_req = urllib.request.Request(
                fallback_url, data=fb_data,
                headers={"Content-Type": "application/json"}, method="POST",
            )
            with opener.open(fb_req, timeout=90) as fb_res:
                fb_json = json.loads(fb_res.read().decode("utf-8"))
                return fb_json.get("message", {}).get("content", "")
        except Exception as e_fb:
            print(f"[ERROR] Fallback Ollama tambien fallo: {e_fb}", file=sys.stderr)
            return None


def optimizar_nota(filepath, api_key):
    """Inyecta un Resumen de Contexto IA al inicio de notas extensas (>10k chars)."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return False

    # Evitar re-inyectar si ya tiene resumen (deteccion robusta)
    if "Resumen de Contexto" in content:
        return False
    if len(content) < 10000:
        return False

    print(f"[COMPRESS] Comprimiendo contexto: {os.path.basename(filepath)} ({len(content)} chars)")
    system_prompt = (
        "Eres un gestor de bases de conocimiento. Escribe un resumen de contexto "
        "altamente condensado (1 parrafo corto, 3 a 5 lineas) de la nota de desarrollo. "
        "El resumen debe detallar con precision que contiene la nota para que un agente "
        "de IA pueda entender su relevancia sin leer toda la nota. Responde en español."
    )
    resumen = llamar_litellm(f"Contenido de la nota:\n{content}", system_prompt, api_key)
    if not resumen:
        print(f"[WARN] No se pudo generar resumen para {filepath}", file=sys.stderr)
        return False

    resumen_block = (
        "\n> [!NOTE]\n"
        "> ## 📄 Resumen de Contexto\n"
        f"> {resumen.strip().replace(chr(10), chr(10) + '> ')}\n\n---\n"
    )
    lines = content.splitlines()
    inserted = False
    for i, line in enumerate(lines):
        if line.startswith("# "):
            lines.insert(i + 1, resumen_block)
            inserted = True
            break
    new_content = "\n".join(lines) if inserted else resumen_block + content
    try:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"[COMPRESS] Resumen inyectado en {os.path.basename(filepath)}")
        return True
    except Exception as e:
        print(f"[ERROR] No se pudo escribir {filepath}: {e}", file=sys.stderr)
        return False


def _excluded(path):
    """True si alguna componente del path esta en EXCLUDE_DIRS."""
    parts = set(p for p in path.replace("\\", "/").split("/") if p)
    return bool(parts & EXCLUDE_DIRS)


def _leer_dashboard_tokens():
    """Lee tokens.json y devuelve un bloque markdown para el dashboard de home.md."""
    tokens_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "tokens.json")
    if not os.path.exists(tokens_path):
        return None
    try:
        with open(tokens_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        total = len(data)
        cache_hits = sum(1 for d in data if str(d.get("fuente", "")).startswith("cache"))
        tokens_modelo = sum(d.get("completion_tokens", 0) for d in data if not str(d.get("fuente", "")).startswith("cache"))
        ahorro = sum(d.get("prompt_tokens", 0) for d in data if str(d.get("fuente", "")).startswith("cache"))
        return (
            f"- **Última lectura:** {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}\n"
            f"- **Total de llamadas:** {total}\n"
            f"- **Cache hits (ahorro):** {cache_hits}\n"
            f"- **Tokens consumidos por modelo:** {tokens_modelo}\n"
            f"- **Tokens ahorrados por cache:** {ahorro}"
        )
    except Exception:
        return None


def main():
    parser = argparse.ArgumentParser(description="Mantenimiento del Vault de Obsidian (raiz del proyecto).")
    parser.add_argument("--vault", type=str, default=_DEFAULT_VAULT,
                        help="Ruta absoluta al vault (default: raiz del proyecto).")
    args = parser.parse_args()
    vault_dir = os.path.abspath(args.vault)

    print(f"[MAINTENANCE] Iniciando mantenimiento del Vault: {vault_dir}")
    env_vars = cargar_env(vault_dir)
    api_key = env_vars.get("LITELLM_MASTER_KEY", API_KEY_DEFAULT)

    archive_dir = os.path.join(vault_dir, ARCHIVE_DIR_NAME)
    os.makedirs(archive_dir, exist_ok=True)

    now = time.time()
    siete_dias = 7 * 24 * 60 * 60
    notas_archivadas = 0
    notas_optimizadas = 0
    notas_activas = []

    # 1. Escanear y archivar notas temporales antiguas
    for root, dirs, files in os.walk(vault_dir):
        # Podar directorios excluidos in-place (no bajar a ellos)
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        if "archive" in root.replace("\\", "/").split("/"):
            continue
        for fname in files:
            if not fname.endswith(".md"):
                continue
            fpath = os.path.join(root, fname)
            if fname.lower() == "home.md":
                continue
            mtime = os.path.getmtime(fpath)
            age = now - mtime
            is_temp = any(t in fname.lower() for t in ("temp", "log", "draft"))
            if is_temp and age > siete_dias:
                dest = os.path.join(archive_dir, fname)
                try:
                    os.rename(fpath, dest)
                    print(f"[ARCHIVE] {fname}")
                    notas_archivadas += 1
                    continue
                except Exception as e:
                    print(f"[ERROR] al archivar {fname}: {e}", file=sys.stderr)
            notas_activas.append((fname, fpath))

    # 2. Comprimir notas extensas
    for fname, fpath in notas_activas:
        if optimizar_nota(fpath, api_key):
            notas_optimizadas += 1

    # 3. Reconstruir indice en home.md si existe (mini-vault) o Mapa de la Boveda
    index_candidates = [
        os.path.join(vault_dir, "home.md"),
        os.path.join(vault_dir, "00 - Inicio", "Mapa de la Boveda RCP Services.md"),
    ]
    enlaces = []
    for fname, fpath in notas_activas:
        note_name = fname[:-3]
        if note_name in ("home", "Mapa de la Boveda RCP Services", "CLAUDE"):
            continue
        enlaces.append(f"- [[{note_name}]] - Actualizado recientemente.")
    enlaces_str = "\n".join(enlaces) if enlaces else "- Ninguna nota adicional activa."

    today = datetime.date.today().strftime("%Y-%m-%d")
    if len(notas_activas) <= 15:
        status = "🟢 **Limpio (Libre de polucion)**"
    elif len(notas_activas) <= 30:
        status = "🟡 **Moderado (Limpieza sugerida)**"
    else:
        status = "🔴 **Saturado (Polucion alta)**"
    estado_block = (
        f"- **Último Mantenimiento:** {today}\n"
        f"- **Estado de Polución:** {status}\n"
        f"- **Notas Archivadas:** {notas_archivadas}\n"
        f"- **Notas Optimizadas:** {notas_optimizadas}\n"
        f"- **Notas Activas:** {len(notas_activas)}"
    )

    for idx_path in index_candidates:
        if not os.path.exists(idx_path):
            continue
        try:
            with open(idx_path, "r", encoding="utf-8") as f:
                idx_content = f.read()
            new_content = idx_content
            if MARKER_NOTES_START in new_content and MARKER_NOTES_END in new_content:
                pre, post = new_content.split(MARKER_NOTES_START, 1)
                post = post.split(MARKER_NOTES_END, 1)[1]
                new_content = pre + MARKER_NOTES_START + "\n" + enlaces_str + "\n" + MARKER_NOTES_END + post
            if MARKER_STATUS_START in new_content and MARKER_STATUS_END in new_content:
                pre, post = new_content.split(MARKER_STATUS_START, 1)
                post = post.split(MARKER_STATUS_END, 1)[1]
                new_content = pre + MARKER_STATUS_START + "\n" + estado_block + "\n" + MARKER_STATUS_END + post
            # Dashboard de tokens (si existen los marcadores)
            dash = _leer_dashboard_tokens()
            if dash and "<!-- TOKENS_DASHBOARD_START -->" in new_content and "<!-- TOKENS_DASHBOARD_END -->" in new_content:
                pre, post = new_content.split("<!-- TOKENS_DASHBOARD_START -->", 1)
                post = post.split("<!-- TOKENS_DASHBOARD_END -->", 1)[1]
                new_content = pre + "<!-- TOKENS_DASHBOARD_START -->\n" + dash + "\n<!-- TOKENS_DASHBOARD_END -->" + post
            with open(idx_path, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"[INDEX] {os.path.basename(idx_path)} actualizado.")
        except Exception as e:
            print(f"[ERROR] al actualizar {idx_path}: {e}", file=sys.stderr)

    print(f"[MAINTENANCE] OK. Archivadas: {notas_archivadas}, Optimizadas: {notas_optimizadas}, Activas: {len(notas_activas)}")


if __name__ == "__main__":
    main()
