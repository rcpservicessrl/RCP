# IA Corporativa Privada — Producto Vendible RCP Services

## ¿Qué es?

Un ecosistema de Inteligencia Artificial 100% privado instalado en la infraestructura del cliente (o en un servidor dedicado gestionado por RCP). Los datos nunca salen de sus servidores. Sin suscripciones mensuales de terceros.

## Componentes

| Componente | Función | Puerto |
|-----------|---------|--------|
| **Ollama** | Motor de IA local (LLMs: Llama 3, Mistral, etc.) | 11434 |
| **LiteLLM** | Proxy multi-modelo (unifica API OpenAI-compatible) | 4000 |
| **Open WebUI** | Interfaz de chat tipo ChatGPT para el equipo | 8188 |

## Paquetes y Precios

| Tier | RAM mínima | Modelos incluidos | Precio |
|------|-----------|-------------------|--------|
| **Básico** | 8GB | 1 modelo (7B params) | RD$ 80,000 setup |
| **Avanzado** | 16GB | 3 modelos + RAG (documentos) | RD$ 150,000 setup |
| **Enterprise** | 32GB+ | 5+ modelos + RAG + API propia | RD$ 250,000+ setup |

Todos incluyen: instalación, configuración, capacitación (2h), y 30 días de soporte.

Mensualidad opcional: RD$ 15,000/mes (monitoreo, actualizaciones, soporte prioritario).

## Requisitos del Cliente

### Opción A: Hardware del cliente
- PC/servidor con mínimo 8GB RAM (16GB recomendado)
- Procesador Intel i5+ o AMD Ryzen 5+
- 50GB de almacenamiento libre
- Windows 10/11, Ubuntu 22+, o macOS
- Conexión a internet (para setup inicial)

### Opción B: Servidor gestionado por RCP
- RCP provee y gestiona un mini-servidor en las instalaciones del cliente
- Hardware dedicado incluido en el precio
- Monitoreo remoto 24/7

## Instalación

```bash
# 1. Clonar configuración
git clone https://github.com/rcpservicessrl/ia-privada-stack.git
cd ia-privada-stack

# 2. Configurar variables
cp .env.example .env
# Editar .env con datos del cliente

# 3. Levantar stack
docker compose up -d

# 4. Verificar
curl http://localhost:11434/api/tags  # Ollama OK
curl http://localhost:4000/health     # LiteLLM OK
# Abrir http://localhost:8188         # Open WebUI
```

## Docker Compose

Ver `docker-compose.yml` en esta carpeta.

## Casos de Uso

1. **Chatbot interno**: Responde preguntas del equipo basado en manuales y SOPs
2. **Clasificación de correos**: Prioriza y categoriza emails automáticamente
3. **Generación de documentos**: Borradores de contratos, propuestas, reportes
4. **Asistente de ventas**: Responde preguntas de clientes por WhatsApp 24/7
5. **Análisis financiero**: Procesa estados financieros y genera insights

## Seguridad

- ✅ Datos 100% locales — nunca salen del servidor del cliente
- ✅ Sin APIs externas en producción (modelos corren en local)
- ✅ Sin suscripciones mensuales de OpenAI/Anthropic/Google
- ✅ Compliance con leyes de protección de datos RD
- ✅ Acceso controlado por usuarios y roles (Open WebUI)
