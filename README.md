# MovieAI

> Escribe tu guión. Obtén tu storyboard. Simple.

MovieAI es una aplicación web que convierte un guión en formato screenplay en un storyboard completo en blanco y negro, estilo boceto a lápiz, generado automáticamente con IA local.

Sin suscripciones. Sin datos en la nube. Sin conocimientos técnicos necesarios.

---

## ¿Qué hace el MVP?

El usuario pasa por dos fases:

### Fase 1 — Editor de guión
- Editor web minimalista inspirado en Movie Master 3.09
- Formato screenplay automático (Fountain): Slug Line, Acción, Personaje, Diálogo
- Tab/Enter cambia el elemento de guión — sin clics, sin menús
- Guardado automático. Exportación a PDF y .fountain

### Fase 2 — Storyboard automático
- 1 panel por escena (Slug Line + Acción)
- Estilo boceto B&N a lápiz — sin color, sin fotorrealismo
- El LLM analiza cada escena y genera el prompt visual
- ComfyUI genera la imagen con SDXL + LoRA Storyboard Sketch
- El usuario aprueba, rechaza o regenera cada panel
- Exportación del storyboard completo como PDF

> **Fase 3 (animación/vídeo)** está fuera del MVP. Será funcionalidad de pago en v2.

---

## Referencia espiritual

**Movie Master 3.09** — software MS-DOS de los 80/90 que Eric Roth (Oscar por Forrest Gump) usó para escribir Dune (2021). Sencillez extrema, foco total en escribir. Eso es lo que MovieAI replica en web.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind + shadcn/ui |
| Editor de guión | ProseMirror con gramática Fountain |
| Parser Fountain | fountain-js |
| Estado global | Zustand |
| Tiempo real | SSE (Server-Sent Events) |
| API | Next.js API Routes |
| Colas | p-queue en memoria (MVP) |
| Base de datos | SQLite + Drizzle (MVP) |
| LLM | Qwen3-14B local via llama.cpp (puerto 8080) |
| Generación imágenes | SDXL Base + LoRA Storyboard Sketch via ComfyUI |
| PDF export | pdf-lib |
| Hosting | Azure Container Apps |

### Gestión de VRAM (RTX 5070 Ti 16GB)

Las fases son **secuenciales** — nunca dos modelos grandes simultáneos:

```
Fase A  →  Qwen3-14B activo (~10GB)   — analiza TODAS las escenas → genera TODOS los prompts
           ↓ descargar Qwen
Fase B  →  SDXL+LoRA activo (~7GB)    — genera TODOS los paneles con ComfyUI
```

---

## Decisiones aprobadas

| Tema | Decisión |
|------|----------|
| Auth MVP | Sin autenticación |
| Scope MVP | Fase 1 (guión) + Fase 2 (storyboard B&N) |
| Fase 3 (vídeo/animación) | Fuera del MVP — v2, funcionalidad de pago |
| Modelo imagen | SDXL Base + LoRA Storyboard Sketch (Civitai #162118) |
| LLM | Qwen local, sin APIs externas |
| Editor | ProseMirror + Fountain |
| Formato estilo | B&N boceto lápiz — trigger word: "digital sketch" |

Ver todas las decisiones de arquitectura en [`docs/decisions/`](docs/decisions/).

---

## Estructura del repositorio

```
MovieAI/
├── docs/
│   ├── decisions/        # ADRs (Architecture Decision Records)
│   ├── VISION.md         # Propuesta de valor y público objetivo
│   ├── PIPELINE.md       # Flujo técnico completo
│   └── GATES.md          # Criterios de avance entre gates
├── research/             # Investigaciones de Gate A
│   ├── issue-1-market-research.md
│   ├── issue-2-modelos-storyboard-ia.md
│   └── issue-3-flujo-tecnico-mvp.md
├── design/               # Diseños y wireframes
│   └── issue-4-editor-guion.md
└── src/                  # Código fuente (Gate B)
```

---

## Estado del proyecto

🔵 **Gate A completado** — investigación y decisiones arquitectónicas finalizadas.  
⏳ **Gate B pendiente** — implementación del MVP.

Ver issues abiertas: [github.com/Aniseto/MovieAI/issues](https://github.com/Aniseto/MovieAI/issues)
