# ADR-007 — Arquitectura técnica completa de MovieAI

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Issue:** #15

---

## PARTE 1 — Stack tecnológico

### Decisiones por capa

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Frontend** | Next.js 15 + TypeScript | SSR/SSG, API Routes integradas, consistente con otros proyectos |
| **Editor de guión** | **ProseMirror** | Editor de documento (no código), permite formateo visual screenplay, TAB entre elementos, extensible |
| **Estado global** | Zustand | Ligero, sin boilerplate, perfecto para estado de proyecto/paneles |
| **UI** | Tailwind + shadcn/ui | Rápido de implementar, accesible, personalizable |
| **WebSockets** | Socket.io o Next.js + PartyKit | Notificaciones en tiempo real cuando ComfyUI termina |
| **API** | Next.js API Routes | Suficiente para MVP, sin servidor separado |
| **Colas** | BullMQ + Redis | Estándar para colas Node.js, reintentos, prioridades, monitorización |
| **Auth** | Sin auth en MVP | Proyectos locales, sin login; añadir NextAuth en v2 |
| **BD** | SQLite (dev) → PostgreSQL (prod) | SQLite sin fricción local; Postgres en Azure para producción |
| **ORM** | Drizzle | Type-safe, ligero, compatible SQLite + Postgres sin cambiar código |
| **Imágenes** | Local (dev) → Azure Blob Storage (prod) | Sin coste en dev, escalable en prod |
| **LLM chat** | Qwen3-14B-Q5_K_M local (llama-swap) | 100% local, €0 coste, privacidad total — ver ADR-008 |

---

## PARTE 2 — Schema de base de datos

```sql
-- Proyectos
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  genre       TEXT,
  logline     TEXT,
  synopsis    TEXT,
  tone        TEXT,
  phase       INTEGER DEFAULT 1,  -- 1=definición, 2=storyboard, 3=producción
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Personajes
CREATE TABLE characters (
  id                   TEXT PRIMARY KEY,
  project_id           TEXT REFERENCES projects(id),
  name                 TEXT NOT NULL,
  age                  INTEGER,
  physical_description TEXT,
  personality          TEXT,
  motivation           TEXT,
  visual_prompt        TEXT,   -- prompt generado para ComfyUI
  reference_image_url  TEXT,   -- imagen de referencia para IP-Adapter
  version              INTEGER DEFAULT 1,
  updated_at           DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Escenarios
CREATE TABLE locations (
  id           TEXT PRIMARY KEY,
  project_id   TEXT REFERENCES projects(id),
  name         TEXT NOT NULL,
  type         TEXT,            -- INT / EXT
  description  TEXT,
  atmosphere   TEXT,
  lighting     TEXT,
  visual_prompt TEXT,
  version      INTEGER DEFAULT 1,
  updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Escenas del guión
CREATE TABLE scenes (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id),
  order_index INTEGER NOT NULL,
  heading     TEXT NOT NULL,   -- "INT. ESTACIÓN - NOCHE"
  location_id TEXT REFERENCES locations(id),
  time_of_day TEXT,
  fountain    TEXT,            -- texto Fountain de la escena completa
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Paneles de storyboard
CREATE TABLE panels (
  id            TEXT PRIMARY KEY,
  scene_id      TEXT REFERENCES scenes(id),
  order_index   INTEGER NOT NULL,
  action        TEXT,
  dialogue      TEXT,          -- JSON: [{character, line, parenthetical}]
  shot_type     TEXT,          -- primer plano, plano general, etc.
  prompt_low    TEXT,          -- prompt Fase 2 (baja calidad)
  prompt_high   TEXT,          -- prompt Fase 3A (alta calidad)
  image_low_url TEXT,          -- imagen Fase 2 generada
  image_high_url TEXT,         -- imagen Fase 3A generada
  video_url     TEXT,          -- clip animado Fase 3B
  status        TEXT DEFAULT 'pending', -- pending/generating/approved/rejected
  phase         INTEGER DEFAULT 2,
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Relación panel <-> entidades (para propagación ADR-004)
CREATE TABLE panel_entities (
  panel_id     TEXT REFERENCES panels(id),
  entity_type  TEXT NOT NULL,  -- 'character' | 'location'
  entity_id    TEXT NOT NULL,
  PRIMARY KEY (panel_id, entity_type, entity_id)
);

-- Cola de trabajos de generación
CREATE TABLE generation_jobs (
  id          TEXT PRIMARY KEY,
  panel_id    TEXT REFERENCES panels(id),
  job_type    TEXT NOT NULL,   -- 'image_low' | 'image_high' | 'video'
  status      TEXT DEFAULT 'queued', -- queued/processing/done/failed
  prompt      TEXT,
  result_url  TEXT,
  error       TEXT,
  attempts    INTEGER DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## PARTE 3 — API Endpoints

### Proyectos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects/:id` | Obtener proyecto completo |
| PATCH | `/api/projects/:id` | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Eliminar proyecto |

### Entidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/projects/:id/characters` | Crear personaje |
| PATCH | `/api/characters/:id` | Modificar personaje → trigger propagación |
| POST | `/api/projects/:id/locations` | Crear escenario |
| PATCH | `/api/locations/:id` | Modificar escenario → trigger propagación |

### Guión y parser
| Método | Ruta | Descripción |
|--------|------|-------------|
| PUT | `/api/projects/:id/screenplay` | Guardar guión Fountain |
| POST | `/api/projects/:id/parse` | Parsear Fountain → JSON paneles |

### Generación
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/panels/:id/generate` | Encolar generación de imagen |
| GET | `/api/jobs/:id/status` | Estado del trabajo |
| PATCH | `/api/panels/:id/approve` | Aprobar panel |
| PATCH | `/api/panels/:id/reject` | Rechazar panel |

### Exportación
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects/:id/export/pdf` | Exportar storyboard como PDF |
| GET | `/api/projects/:id/export/video` | Exportar corto final como MP4 |

### LLM
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/ai/feedback` | Feedback narrativo de un campo |
| POST | `/api/ai/expand-prompt` | Expandir descripción a prompt visual |

---

## PARTE 4 — Sistema de colas de generación

```
POST /api/panels/:id/generate
         ↓
API crea job en BD (status: queued)
API añade job a BullMQ queue
         ↓
BullMQ Worker (proceso separado en Dragon):
  1. Recibe job
  2. Construye prompt desde panel + entidades
  3. POST http://localhost:8188/api/prompt → ComfyUI
  4. Polling GET /api/history/:prompt_id hasta completado
  5. Descarga imagen resultado
  6. Guarda en almacenamiento
  7. Actualiza BD: panel.image_low_url, job.status = done
         ↓
Socket.io emite evento 'panel:generated' al frontend
         ↓
Frontend actualiza el panel con la imagen recibida
```

### Decisión BullMQ vs alternativas
- **BullMQ + Redis:** recomendado — reintentos automáticos, prioridades, UI de monitorización (Bull Board), battle-tested
- **Alternativa sin Redis (MVP):** cola en memoria con `p-queue` — más simple pero sin persistencia si el servidor cae
- **Decisión:** empezar con `p-queue` en MVP local, migrar a BullMQ cuando se despliegue en producción

### Gestión de errores
- Timeout: si ComfyUI no responde en 5 min → marcar job como failed
- Reintentos: máximo 3 intentos automáticos
- Notificación: Socket.io emite `panel:error` al frontend con mensaje

---

## PARTE 5 — Estrategia de despliegue

### Desarrollo (local en Dragon)
```
Dragon:
├── Next.js dev server     :3000
├── ComfyUI                :8188
├── SQLite                 ./data/movieai.db
├── Redis (opcional MVP)   :6379
└── Socket.io              integrado en Next.js
```
Sin Cloudflare Tunnel necesario en desarrollo.

### Producción
```
Azure Container Apps
├── movieai-web (Next.js)
├── movieai-worker (BullMQ worker)
└── Redis Cache (Azure Cache for Redis)

Dragon (expuesto via Cloudflare Tunnel)
└── ComfyUI :8188 → tunnel → comfyui.movieai.app

Azure Storage
└── Blob Container: images, videos

Azure Database for PostgreSQL
└── movieai-prod
```

### Estimación de costes mensuales (100 usuarios activos)
| Servicio | Coste estimado |
|----------|---------------|
| Azure Container Apps (web + worker) | ~€15/mes |
| Azure Cache for Redis (Basic C0) | ~€15/mes |
| Azure Database PostgreSQL (Flexible, B1ms) | ~€12/mes |
| Azure Blob Storage (100GB) | ~€2/mes |
| Gemini API (feedback narrativo, ~10k llamadas) | ~€5/mes |
| Cloudflare Tunnel | Gratis |
| **Total** | **~€49/mes** |

Coste de inferencia (imágenes + vídeo): **€0** — todo local en Dragon con RTX 5070 Ti.

---

## Estimación de tiempo para MVP funcional

| Fase | Semanas | Entregable |
|------|---------|------------|
| Setup + BD + API base | 1 | Proyecto creado, CRUD funcionando |
| Editor de guión (ProseMirror) | 2 | Escribe y guarda Fountain |
| Formulario Fase 1 + LLM feedback | 2 | Pre-producción completa |
| Parser Fountain + generador prompts | 1 | JSON de paneles |
| Integración ComfyUI + colas | 2 | Genera imágenes B&N |
| UI storyboard + validación | 1 | Aprueba paneles |
| Exportación PDF | 1 | MVP completo Fases 1-2 |
| **Total Fases 1-2** | **~10 semanas** | Storyboard exportable |
| Animación WAN 2.7 + montaje | 3 | Fase 3 — corto animado |

---

## Stack final recomendado

```
Frontend:    Next.js 15 + TypeScript + Tailwind + shadcn/ui
Editor:      ProseMirror con gramática Fountain personalizada
Estado:      Zustand
Tiempo real: Socket.io
API:         Next.js API Routes
Colas (MVP): p-queue en memoria → BullMQ + Redis en producción
BD (MVP):    SQLite + Drizzle → PostgreSQL en producción
LLM:         Qwen3-14B-Q5_K_M local via llama-swap (ver ADR-008)
Imágenes:    FLUX.1 local + LoRA sketch B&N via ComfyUI
Vídeo:       WAN 2.7 local via ComfyUI
Exposición:  Cloudflare Tunnel para Dragon en producción
Hosting:     Azure Container Apps
```
