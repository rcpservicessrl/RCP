# Capa Neuronal v2 — RCP Services Sitio Web

> Arquitectura de la capa neuronal del proyecto. Combina un **vault Obsidian**
> como base de conocimiento, **Graphify** como knowledge graph semántico, y un
> **puente Python** (`.neural_bridge/`) para delegar tareas IA con ahorro de
> tokens y memoria persistente entre sesiones.

---

## 🧩 Componentes

```
                ┌─────────────────────────────────────────────┐
                │              Vault Obsidian                 │
                │   (raíz del proyecto = vault grande)        │
                │   00-08 áreas curadas + home.md (centro)    │
                └───────────────┬─────────────────────────────┘
                                ▼
   ┌────────────────┐   ┌──────────────────┐   ┌──────────────────┐
   │  Graphify      │◄──┤  neural.py       │──►│  bridge.py       │
   │  knowledge     │   │  (wrapper de     │   │  (router de      │
   │  graph         │   │   atajos)        │   │   modelos +      │
   │  (graphify-out)│   │                  │   │   tool-use)      │
   └────────────────┘   └──────────────────┘   └────────┬─────────┘
                                                        │
                                          ┌─────────────┼─────────────┐
                                          ▼             ▼             ▼
                                  ┌────────────┐ ┌────────────┐ ┌────────────┐
                                  │ embeddings │ │ LiteLLM    │ │ tokens.json│
                                  │ .py (cache │ │ /Ollama/   │ │ (telemetría│
                                  │  semántica)│ │ Gemini     │ │  tokens)   │
                                  └────────────┘ └────────────┘ └────────────┘
```

## Configuración activa

- **Backend IA:** `gemini`
- **Ollama:** `http://127.0.0.1:11434` (modelo coding: `qwen2.5-coder:7b`)
- **LiteLLM:** `http://127.0.0.1:4000`
- **Umbral caché semántica:** `0.88`

## 📜 Scripts

| Script | Rol |
|--------|-----|
| `bridge.py` | Router de modelos + caché semántica + tool-use + telemetría. |
| `embeddings.py` | Caché por embeddings (coseno ≥ umbral), fallback a hash exacto. |
| `neural.py` | Wrapper de atajos `!local/!flash/!refactor/!graph` + conector Graphify. |
| `maintenance.py` | Compresión de notas largas + archivado + índice home.md. |

## 🚀 Uso

```bash
python .neural_bridge/neural.py !local "explica X"
python .neural_bridge/neural.py !graph "¿dónde se define Y?"
python .neural_bridge/bridge.py --telemetria
# Mantenimiento semanal:
Lanzar_Obsidian.bat   # (o lanzar_obsidian.sh en Unix)
```

## 🎯 Bondades

1. Caché semántica real (coseno).
2. Enrutado inteligente Ollama/Gemini.
3. Compresión de notas >10k chars.
4. Graphify como conector de contexto (~71× menos tokens).
5. Telemetría medible en `tokens.json`.
6. Resiliencia en cascada (Gemini → OpenRouter → LiteLLM → Ollama).
7. Cero dependencias externas.
