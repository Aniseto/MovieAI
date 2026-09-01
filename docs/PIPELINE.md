# PIPELINE.md — Flujo Técnico MovieAI MVP

El flujo completo del MVP va de guión a storyboard en dos fases secuenciales.

---

## Diagrama

```
┌──────────────────────────────────────────────────────────────┐
│  FASE 1 — EDITOR DE GUIÓN                                    │
│                                                              │
│  Usuario escribe en editor ProseMirror (web)                 │
│  Autoformateo Fountain: Tab/Enter cambia elemento            │
│  Guardado automático cada 30s                                │
│           ↓                                                  │
│  Serialización a texto Fountain (.fountain)                  │
└──────────────────────────────────────────────────────────────┘
                         ↓  Usuario pulsa "Generar Storyboard"
┌──────────────────────────────────────────────────────────────┐
│  FASE A — ANÁLISIS LLM (llama.cpp activo, ~10GB VRAM)        │
│                                                              │
│  fountain-js parsea el texto → Array de escenas JSON         │
│  Por cada escena: LLM Qwen genera prompt SDXL                │
│  Todos los prompts generados antes de tocar ComfyUI          │
│           ↓  Qwen descargado (libera VRAM)                   │
└──────────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────────────────────────────────────────────────┐
│  FASE B — GENERACIÓN IMÁGENES (ComfyUI activo, ~7GB VRAM)    │
│                                                              │
│  ComfyUI carga SDXL Base + LoRA Storyboard Sketch            │
│  p-queue (concurrency: 1) procesa los prompts                │
│  Por cada prompt: POST /prompt a ComfyUI                     │
│  Polling GET /history/{id} → imagen PNG lista                │
│  SSE notifica al frontend: panel listo                       │
│           ↓                                                  │
│  Usuario ve panel: ✓ Aprobar / ✗ Rechazar / ↺ Regenerar     │
└──────────────────────────────────────────────────────────────┘
                         ↓  Usuario aprueba todos los paneles
┌──────────────────────────────────────────────────────────────┐
│  EXPORTACIÓN                                                 │
│                                                              │
│  PDF storyboard: grid de paneles, diálogo bajo imagen        │
│  PDF guión: formato screenplay estándar (Courier Prime 12pt) │
└──────────────────────────────────────────────────────────────┘
```

---

## Tecnología por nodo

| Nodo | Tecnología |
|------|-----------|
| Editor web | ProseMirror + plugin Fountain |
| Parser | fountain-js |
| LLM análisis | Qwen3-14B via llama.cpp (localhost:8080) |
| Cola de trabajos | p-queue concurrency: 1 |
| Generación imagen | ComfyUI API (localhost:8188) |
| Modelo imagen | SDXL Base + LoRA Storyboard Sketch (Civitai #162118) |
| Progreso frontend | SSE (Server-Sent Events) |
| PDF export | pdf-lib |

---

## Parámetros de generación de imagen

| Parámetro | Valor |
|-----------|-------|
| Modelo | sdxl_base.safetensors |
| LoRA | storyboard_sketch_sdxl.safetensors |
| Fuerza LoRA | 0.8 |
| Sampler | Euler ancestral |
| Steps | 25 |
| CFG | 7 |
| Resolución | 1344×768 (16:9) |
| Trigger word | "digital sketch" — nunca "storyboard" |

---

## Gestión de VRAM

La RTX 5070 Ti tiene 16GB. Qwen (~10GB) y SDXL+LoRA (~7GB) no pueden coexistir.  
El backend coordina el swap secuencial:

1. llama.cpp procesa **todas** las escenas
2. Backend llama al endpoint de descarga de llama.cpp
3. ComfyUI carga SDXL y genera **todos** los paneles

Ver detalle: [`research/issue-3-flujo-tecnico-mvp.md`](../research/issue-3-flujo-tecnico-mvp.md)
