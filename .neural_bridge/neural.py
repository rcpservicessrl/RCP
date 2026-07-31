#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
WRAPPER DE LA CAPA NEURONAL (neural.py)
---------------------------------------
Interpreta los atajos definidos en home.md (!local, !flash, !refactor, !test,
!doc, !graph) y los traduce en llamadas a bridge.py. Ademas, integra Graphify
como conector de contexto: antes de invocar el modelo, recupera el subgrafo
relevante via `graphify query` y lo inyecta en el prompt.

Uso:
    python neural.py !local "explica bridge.py"
    python neural.py !flash --input README.md "resume este documento"
    python neural.py !refactor --input mod.py "anade type hints"
    python neural.py !graph "donde se define la identidad de marca"

Beneficios:
    - Contexto rico: Graphify entrega solo los nodos relevantes (ahorro tokens).
    - Atajos consistentes con la documentacion del vault.
    - Cache semantica automatica via bridge.py / embeddings.py.
"""

import os
import sys
import json
import shutil
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
BRIDGE = os.path.join(HERE, "bridge.py")

# Mapa de atajos -> (modelo sugerido, modo)
ATAJOS = {
    "!local":    ("auto",             "analyze"),
    "!flash":    ("gemini-2.5-flash", "analyze"),
    "!refactor": ("gemini-2.5-flash", "refactor"),
    "!test":     ("gemini-2.5-flash", "analyze"),
    "!doc":      ("coder-es-fast",    "analyze"),
    "!graph":    (None,               "analyze"),  # Solo conector Graphify
}


def graphify_disponible():
    """True si la CLI de Graphify esta instalada."""
    return shutil.which("graphify") is not None


def graphify_query(consulta, top_k=8):
    """
    Consulta el knowledge graph y devuelve un bloque de texto con los nodos
    relevantes. Si Graphify no esta disponible, devuelve cadena vacia.
    """
    if not graphify_disponible():
        print("[GRAPH] Graphify no instalado: omitiendo conector de contexto.", file=sys.stderr)
        return ""
    try:
        cmd = ["graphify", "query", consulta, "--top-k", str(top_k), "--format", "json"]
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=60, encoding="utf-8")
        if res.returncode != 0:
            print(f"[GRAPH] graphify query fallo: {res.stderr.strip()}", file=sys.stderr)
            return ""
        data = json.loads(res.stdout or "{}")
        nodos = data.get("nodes") or data.get("results") or []
        if not nodos:
            return ""
        lineas = [f"--- CONTEXTO RECUPERADO DESDE GRAPHIFY (top {len(nodos)}) ---"]
        for n in nodos[:top_k]:
            path = n.get("path") or n.get("file") or "?"
            snippet = (n.get("snippet") or n.get("summary") or "").strip().replace("\n", " ")
            if snippet:
                lineas.append(f"• {path}: {snippet[:300]}")
            else:
                lineas.append(f"• {path}")
        lineas.append("-" * 51)
        return "\n".join(lineas)
    except Exception as e:
        print(f"[GRAPH] error consultando graphify: {e}", file=sys.stderr)
        return ""


def mostrar_ayuda():
    print(__doc__)
    print("\nAtajos disponibles:")
    for k, (modelo, modo) in ATAJOS.items():
        m = modelo or "(via graphify)"
        print(f"  {k:<10} modelo={m:<20} modo={modo}")
    sys.exit(0)


def main(argv=None):
    argv = argv if argv is not None else sys.argv[1:]
    if not argv or argv[0] in ("-h", "--help", "help"):
        mostrar_ayuda()

    atajo = argv[0]
    resto = argv[1:]

    if atajo not in ATAJOS:
        print(f"[ERROR] atajo desconocido: {atajo}", file=sys.stderr)
        print("Atajos validos: " + ", ".join(ATAJOS.keys()))
        sys.exit(2)

    modelo_sugerido, modo = ATAJOS[atajo]

    # Parsear flags simples: --input ARCHIVO, --output ARCHIVO, --temp FLOAT
    input_file = None
    output_file = None
    temp = 0.2
    tokens_posicionales = []
    i = 0
    while i < len(resto):
        tok = resto[i]
        if tok == "--input" and i + 1 < len(resto):
            input_file = resto[i + 1]; i += 2; continue
        if tok == "--output" and i + 1 < len(resto):
            output_file = resto[i + 1]; i += 2; continue
        if tok == "--temp" and i + 1 < len(resto):
            try:
                temp = float(resto[i + 1])
            except ValueError:
                pass
            i += 2; continue
        tokens_posicionales.append(tok)
        i += 1

    task = " ".join(tokens_posicionales).strip()
    if not task:
        print("[ERROR] falta la descripcion de la tarea.", file=sys.stderr)
        sys.exit(2)

    # --- Atajo especial !graph: solo recuperar contexto y mostrarlo ---
    if atajo == "!graph":
        print(graphify_query(task) or "[GRAPH] sin resultados.")
        return

    # --- Para los demas atajos: enriquecer tarea con contexto Graphify ---
    contexto_graph = graphify_query(task)
    task_enriquecida = f"{task}\n\n{contexto_graph}" if contexto_graph else task

    cmd = [sys.executable, BRIDGE, "--task", task_enriquecida, "--mode", modo, "--temp", str(temp)]
    if modelo_sugerido:
        cmd += ["--model", modelo_sugerido]
    if input_file:
        cmd += ["--input", input_file]
    if output_file:
        cmd += ["--output", output_file]

    print(f"[NEURAL] atajo={atajo} modelo={modelo_sugerido or 'auto'} modo={modo}")
    try:
        proc = subprocess.run(cmd)
        sys.exit(proc.returncode)
    except KeyboardInterrupt:
        sys.exit(130)


if __name__ == "__main__":
    main()
