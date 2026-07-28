---
title: "Nodo Neuronal: Guía Profesional Contabilidad RD & RCP Documentos"
type: neural_bridge_node
aliases: ["Guía Contabilidad RD", "RCP Documentos Bridge", "Modulo Fiscal & e-CF"]
tags:
  - #capa-neuronal/bridge
  - #obsidian/link
  - #graphify/contabilidad-rd
last_updated: 2026-07-28
conversation_id: "7b1b6664-d929-49c5-9fcc-6f6d2c267919"
conversation_title: "Guía Profesional Contabilidad RD"
source_workspace: "g:/Mi unidad/RCP Documentos"
target_workspace: "C:/RCP/RCP Services/Sitio-Web"
graphify_weight: 1.0
---

# 🌉 Enlace Neuronal: Guía Profesional Contabilidad RD ↔ RCP Services

Este nodo conecta el proyecto **RCP Services (Sitio Web & Tienda)** con el módulo y la conversación **"Guía Profesional Contabilidad RD"** (`7b1b6664-d929-49c5-9fcc-6f6d2c267919`), ubicada en el espacio de trabajo **RCP Documentos** (`g:/Mi unidad/RCP Documentos`).

---

## 🗺️ Mapa del Grafo de Conocimiento Interconectado

```mermaid
graph TD
    RCP_WEB["🌐 RCP Services (Sitio Web)<br/>(C:/RCP/RCP Services/Sitio-Web)"]
    
    BRIDGE["🌉 [[NODO_GUIA_CONTABILIDAD_RD]]<br/>Conversación: 7b1b6664-d929-49c5-9fcc-6f6d2c267919"]
    
    CORE_DOCS["🧠 Matriz Neuronal RCP Documentos<br/>(g:/Mi unidad/RCP Documentos/knowledge_graph/000_MATRIZ_NEURONAL_CENTRAL.md)"]
    
    N_DGII["📊 [[NODO_DGII_IMPUESTOS]]<br/>Formatos 606/607/IT-1/RST (Ley 11-92)"]
    N_ECF["⚡ [[NODO_ECF_FACTURACION_ELECTRONICA]]<br/>Ley 32-23 / Firma XML-DSig RSA-SHA256 / WS DGII"]
    N_LEGAL["⚖️ [[NODO_LEGAL_SOCIETARIO]]<br/>ONAPI / Registro Mercantil / Ley 479-08 / Ley 488-08"]
    N_TSS["👷 [[NODO_LABORAL_TSS_SIRLA]]<br/>TSS (SFS, AFP, SRL) / SIRLA (DGT-3, DGT-4)"]
    N_CODE["💻 [[NODO_MOTOR_RCP_AUDIT]]<br/>Package src/rcp_audit & 252 Pytests"]
    N_BOT["🔐 [[NODO_AUTOMATIZACION_PLAYWRIGHT_VAULT]]<br/>Playwright Automation & Bóveda AES-256 Fernet"]

    RCP_WEB <--> BRIDGE
    BRIDGE <--> CORE_DOCS
    CORE_DOCS --> N_DGII
    CORE_DOCS --> N_ECF
    CORE_DOCS --> N_LEGAL
    CORE_DOCS --> N_TSS
    CORE_DOCS --> N_CODE
    CORE_DOCS --> N_BOT
```

---

## 📍 Ubicación e Índice del Conocimiento

1. **Conversación de Origen**:
   - **ID**: `7b1b6664-d929-49c5-9fcc-6f6d2c267919`
   - **Título**: `Guía Profesional Contabilidad RD`
   - **Transcript**: [transcript.jsonl](file:///C:/Users/balmi/.gemini/antigravity/brain/7b1b6664-d929-49c5-9fcc-6f6d2c267919/.system_generated/logs/transcript.jsonl)

2. **Matriz Neuronal de Conocimiento (Obsidian MOC)**:
   - **Archivo**: [000_MATRIZ_NEURONAL_CENTRAL.md](file:///g:/Mi%20unidad/RCP%20Documentos/knowledge_graph/000_MATRIZ_NEURONAL_CENTRAL.md)
   - **Índice JSON**: [graphify_index.json](file:///g:/Mi%20unidad/RCP%20Documentos/knowledge_graph/graphify_index.json)

3. **Motor Python & Bóveda Cifrada**:
   - **Paquete**: [src/rcp_audit](file:///g:/Mi%20unidad/RCP%20Documentos/src/rcp_audit)
   - **Bóveda AES-256**: [vault.py](file:///g:/Mi%20unidad/RCP%20Documentos/src/rcp_audit/security/vault.py)
   - **Automatización Playwright**: [dgii_ofv.py](file:///g:/Mi%20unidad/RCP%20Documentos/src/rcp_audit/automation/dgii_ofv.py) y [tss_onapi.py](file:///g:/Mi%20unidad/RCP%20Documentos/src/rcp_audit/automation/tss_onapi.py)
   - **Backend Server**: [server.py](file:///g:/Mi%20unidad/RCP%20Documentos/server.py) (Puerto 8000)

---

## 🏷️ Grafo de Etiquetas Compartidas
- `#capa-neuronal/bridge`
- `#graphify/contabilidad-rd`
- `#dgii/ley11-92`
- `#facturacion-electronica/ley32-23`
- `#rcp-services/integracion`
