# ADR-008 — Inferencia 100% local: sin APIs externas de pago

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Decisión

MovieAI funciona **100% localmente** en Dragon. No se usa ninguna API externa de pago (Gemini, OpenAI, Anthropic). Todo el procesamiento de IA — LLM, imágenes y vídeo — se ejecuta en la RTX 5070 Ti 16GB.

---

## Motivación

- **Coste:** Gemini API costaría ~€5-20/mes en producción y escala con el uso
- **Privacidad:** las historias e ideas del usuario nunca salen del dispositivo
- **Independencia:** sin riesgo de cambios de precios, límites de API o discontinuación
- **Ya disponible:** Dragon tiene la infraestructura necesaria funcionando hoy

---

## Gestión de VRAM — llama-swap

16GB no pueden cargar todos los modelos simultáneamente. La solución es **llama-swap**: proxy delante de llama.cpp que carga el modelo solicitado y descarga el anterior automáticamente.

Esto es viable porque las funciones de MovieAI son **secuenciales**, no concurrentes:

```
Fase 1 (escribir/feedback)  → solo LLM activo
Fase 2 (generar storyboard) → solo FLUX.1 activo  
Fase 3 (animar)             → solo WAN 2.7 activo
```

---

## Modelos asignados por función

| Función MovieAI | Modelo | VRAM | Fuente |
|-----------------|--------|------|--------|
| Chat narrativo guiado | Qwen3-14B-Q5_K_M | ~8 GB | ya instalado |
| Feedback por campo (Fase 1) | Qwen3-14B-Q5_K_M | ~8 GB | ya instalado |
| Expansión de prompts visuales | Qwen3-14B-Q5_K_M | ~8 GB | ya instalado |
| Parser Fountain → JSON | Qwen3-14B-Q5_K_M | ~8 GB | ya instalado |
| Generación storyboard B&N | FLUX.1-schnell Q8 GGUF | ~8 GB | HuggingFace |
| LoRA sketch B&N | StoryboardDiffusion | ~0.5 GB | CivitAI |
| Animación paneles | WAN 2.7 | ~8 GB | ComfyUI nodes |

**Un solo modelo LLM (Qwen3-14B) cubre todas las funciones de texto.** No hace falta swapear entre LLMs distintos para texto.

---

## Arquitectura local completa

```
Dragon (RTX 5070 Ti 16GB — Windows 11)
│
├── llama-swap proxy (:8080)
│   └── Qwen3-14B-Q5_K_M   → LLM para todo: chat, feedback, prompts
│
├── ComfyUI (:8188)
│   ├── FLUX.1-schnell Q8 + LoRA StoryboardDiffusion → imágenes B&N
│   └── WAN 2.7                                      → animación clips
│
└── Next.js MovieAI (:3000)
    ├── API Routes → llama-swap (:8080) para LLM
    ├── API Routes → ComfyUI (:8188) para imágenes/vídeo
    └── SQLite + Drizzle para persistencia
```

---

## Flujo de VRAM por fase

### Fase 1 — Pre-producción (escribir + feedback)
```
VRAM activa: Qwen3-14B (~8 GB)
VRAM libre:  ~8 GB (ComfyUI inactivo)
```

### Fase 2 — Generación storyboard
```
Qwen3 se descarga (llama-swap)
FLUX.1-schnell se carga (~8 GB)
VRAM activa: FLUX.1 + LoRA (~8.5 GB)
VRAM libre:  ~7.5 GB
```

### Fase 3 — Animación
```
FLUX.1 se descarga
WAN 2.7 se carga (~8 GB)
VRAM activa: WAN 2.7 (~8 GB)
VRAM libre:  ~8 GB
```

---

## Cambios respecto al ADR-007

| Componente | ADR-007 (antes) | ADR-008 (ahora) |
|------------|-----------------|-----------------|
| Chat narrativo | Gemini API | **Qwen3-14B local** |
| Feedback por campo | Gemini API | **Qwen3-14B local** |
| Expansión de prompts | Gemini API | **Qwen3-14B local** |
| Coste LLM/mes | ~€5-20 | **€0** |
| Privacidad | Datos a Google | **100% local** |

El resto del ADR-007 se mantiene igual.

---

## Coste mensual actualizado (100 usuarios)

| Servicio | Coste |
|----------|-------|
| Azure Container Apps | ~€15 |
| Azure Cache for Redis | ~€15 |
| Azure Database PostgreSQL | ~€12 |
| Azure Blob Storage | ~€2 |
| APIs externas de IA | **€0** |
| **Total** | **~€44/mes** |

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
