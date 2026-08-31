# Flujo Técnico Completo del MVP — MovieAI
**Issue:** #3  
**Fecha:** 2026-08-31  
**Scope:** MVP = Fase 1 (editor guión) + Fase 2 (storyboard B&N). Fase 3 (animación) excluida.

---

## 1. Diagrama de flujo MVP

```
┌─────────────────────────────────────────────────────────┐
│  FASE 1 — EDITOR DE GUIÓN                               │
│                                                         │
│  Usuario escribe guión en editor web                    │
│  (ProseMirror, autoformateo Fountain, Tab/Enter)        │
│           ↓                                             │
│  Guardado automático como texto Fountain (.fountain)    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  PARSING — fountain-js                                  │
│                                                         │
│  fountain.parse(text) → Array de escenas JSON           │
│  Cada escena: { slug, action, characters, dialogue }    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  FASE 2 — GENERACIÓN DE STORYBOARD                      │
│                                                         │
│  Por cada escena:                                       │
│  1. LLM local (Qwen via llama.cpp) analiza la escena    │
│     → genera prompt visual SDXL                         │
│           ↓                                             │
│  2. p-queue encola la petición de imagen                │
│           ↓                                             │
│  3. Backend llama ComfyUI API (/prompt)                 │
│     SDXL Base + LoRA Storyboard Sketch                  │
│           ↓                                             │
│  4. ComfyUI genera imagen B&N boceto (PNG)              │
│           ↓                                             │
│  5. Backend notifica frontend via SSE                   │
│           ↓                                             │
│  6. Usuario ve panel: Aprobar / Rechazar / Regenerar    │
└─────────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│  EXPORTACIÓN                                            │
│                                                         │
│  PDF storyboard: paneles en grid, diálogo bajo imagen   │
│  PDF guión: formato screenplay estándar                 │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Decisiones técnicas

| Decisión | Valor | Justificación |
|----------|-------|---------------|
| **LLM para análisis** | Qwen local (llama.cpp, Dragon) | Ya disponible, coste 0, privacidad total. API externa innecesaria para este caso |
| **Paneles por escena** | 1 panel por Slug Line | Simplicidad MVP; cada slug line es una escena visual distinta |
| **Cola de trabajos** | p-queue en memoria | Suficiente para un usuario; sin Redis en MVP (ADR-007) |
| **Progreso al usuario** | SSE (Server-Sent Events) | Más eficiente que polling; nativo en Node.js/Express sin dependencias |
| **Endpoint ComfyUI** | POST /prompt + GET /history/{id} | Flujo estándar de ComfyUI API |
| **Formato imagen** | PNG 1344×768 (16:9) | Resolución SDXL óptima para composición cinematográfica |
| **PDF export** | pdf-lib (Node.js) | Ligero, sin dependencias nativas, genera PDFs desde imágenes/texto |

---

## 3. Estructura JSON de escena (salida del parser Fountain)

```json
{
  "slug": "INT. COMISARÍA - NOCHE",
  "location": "COMISARÍA",
  "time": "NOCHE",
  "interior": true,
  "action": "El detective Torres revisa fotos en el tablón. El teléfono suena.",
  "characters": ["TORRES"],
  "dialogue": [
    { "character": "TORRES", "line": "Dígame." }
  ],
  "sceneIndex": 3
}
```

---

## 4. Prompt template SDXL

El LLM recibe la escena JSON y genera un prompt estructurado:

**System prompt del LLM:**
```
Dado el siguiente fragmento de guión, genera un prompt para Stable Diffusion 
que describa la composición visual del panel de storyboard.
El resultado debe ser en inglés, descriptivo, visual, sin diálogos.
Máximo 60 palabras.
```

**Prompt SDXL resultante (ejemplo):**
```
Positive:
digital sketch, black and white storyboard panel, pencil drawing, rough sketch style,
detective standing in dimly lit police station at night, photos pinned on board behind him,
phone ringing on desk, tense atmosphere, cross-hatching shadows, cinematic composition,
paper texture, minimal background

Negative:
color, photorealistic, detailed background, neon lighting, smooth edges,
3D render, multiple frames, watermark, text
```

**Parámetros fijos:**
- Modelo: `sdxl_base.safetensors`
- LoRA: `storyboard_sketch_sdxl.safetensors`, strength: 0.8
- Sampler: Euler ancestral
- Steps: 25
- CFG: 7
- Resolución: 1344×768

---

## 5. Flujo de cola (p-queue)

```
POST /api/storyboard/generate
  → Recibe: { scriptId, scenes[] }
  → Para cada escena:
      1. LLM genera prompt (síncrono, ~1-2s por escena)
      2. p-queue.add(() => callComfyUI(prompt, sceneIndex))
  → Retorna: { jobId, totalPanels }

p-queue (concurrency: 1 — una imagen a la vez en MVP)
  → Worker llama POST /prompt en ComfyUI
  → Obtiene promptId en respuesta
  → Polling a GET /history/{promptId} cada 500ms
  → Cuando imagen lista: guarda PNG en disco
  → Emite SSE: { event: "panel_ready", sceneIndex, imageUrl }

Frontend (SSE listener):
  → Recibe "panel_ready" → renderiza panel en UI
  → Muestra botones: ✓ Aprobar / ✗ Rechazar / ↺ Regenerar
```

---

## 6. Integración ComfyUI API

**Enviar prompt:**
```http
POST http://127.0.0.1:8188/prompt
Content-Type: application/json

{
  "prompt": {
    "1": {
      "class_type": "CheckpointLoaderSimple",
      "inputs": { "ckpt_name": "sdxl_base.safetensors" }
    },
    "2": {
      "class_type": "LoraLoader",
      "inputs": {
        "model": ["1", 0],
        "clip": ["1", 1],
        "lora_name": "storyboard_sketch_sdxl.safetensors",
        "strength_model": 0.8,
        "strength_clip": 0.8
      }
    },
    "3": {
      "class_type": "CLIPTextEncode",
      "inputs": { "text": "<PROMPT_POSITIVO>", "clip": ["2", 1] }
    },
    "4": {
      "class_type": "CLIPTextEncode",
      "inputs": { "text": "<PROMPT_NEGATIVO>", "clip": ["2", 1] }
    },
    "5": {
      "class_type": "EmptyLatentImage",
      "inputs": { "width": 1344, "height": 768, "batch_size": 1 }
    },
    "6": {
      "class_type": "KSampler",
      "inputs": {
        "model": ["2", 0],
        "positive": ["3", 0],
        "negative": ["4", 0],
        "latent_image": ["5", 0],
        "sampler_name": "euler_ancestral",
        "scheduler": "normal",
        "steps": 25,
        "cfg": 7,
        "denoise": 1.0,
        "seed": -1
      }
    },
    "7": {
      "class_type": "VAEDecode",
      "inputs": { "samples": ["6", 0], "vae": ["1", 2] }
    },
    "8": {
      "class_type": "SaveImage",
      "inputs": { "images": ["7", 0], "filename_prefix": "storyboard_" }
    }
  }
}
```

**Respuesta:** `{ "prompt_id": "abc123" }`

**Polling resultado:**
```http
GET http://127.0.0.1:8188/history/abc123
→ Cuando status = "success": imagen en outputs[8].images[0].filename
→ Recuperar imagen: GET http://127.0.0.1:8188/view?filename=storyboard_00001_.png
```

---

## 7. Conclusiones accionables

1. **LLM:** usar Qwen local (llama.cpp en Dragon, puerto 8080) — sin API externa
2. **1 panel por Slug Line** — el parser Fountain cuenta los slug lines, eso define el número de paneles
3. **SSE en lugar de polling** para progreso en tiempo real al usuario
4. **p-queue concurrency: 1** en MVP — una imagen a la vez para no saturar la VRAM
5. **ComfyUI workflow hardcodeado** en MVP — no necesita ser configurable por el usuario
6. **PDF export con pdf-lib** — grid de paneles, imagen + diálogo de la escena debajo
7. **Regenerar panel** = reencolar la misma escena con seed diferente (seed aleatorio)
8. **Seed fijo por personaje** para consistencia visual entre paneles donde aparece el mismo personaje
