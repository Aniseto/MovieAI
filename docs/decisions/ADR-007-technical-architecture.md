# ADR-007 ÔÇö Arquitectura t├®cnica completa de MovieAI

**Estado:** APPROVED
**Aprobado por:** Jordi
**Fecha de aprobación:** 2026-09-01

> **Nota de implementación:** La persistencia se implementa en ficheros Markdown (sin BD) para Fase 1. SQLite/PostgreSQL se incorporan en fases posteriores cuando el proyecto lo requiera. El resto del stack (Next.js, Zustand, Tailwind/shadcn, Socket.io, p-queue, Drizzle, ComfyUI) permanece igual.
**Fecha:** 2026-08-29
**Issue:** #15

---

## PARTE 1 ÔÇö Stack tecnol├│gico

### Decisiones por capa

| Capa | Tecnolog├¡a | Justificaci├│n |
|------|-----------|---------------|
| **Frontend** | Next.js 15 + TypeScript | SSR/SSG, API Routes integradas, consistente con otros proyectos |
| **Editor de gui├│n** | **ProseMirror** | Editor de documento (no c├│digo), permite formateo visual screenplay, TAB entre elementos, extensible |
| **Estado global** | Zustand | Ligero, sin boilerplate, perfecto para estado de proyecto/paneles |
| **UI** | Tailwind + shadcn/ui | R├ípido de implementar, accesible, personalizable |
| **WebSockets** | Socket.io o Next.js + PartyKit | Notificaciones en tiempo real cuando ComfyUI termina |
| **API** | Next.js API Routes | Suficiente para MVP, sin servidor separado |
| **Colas** | BullMQ + Redis | Est├índar para colas Node.js, reintentos, prioridades, monitorizaci├│n |
| **Auth** | Sin auth en MVP | Proyectos locales, sin login; a├▒adir NextAuth en v2 |
| **BD** | SQLite (dev) ÔåÆ PostgreSQL (prod) | SQLite sin fricci├│n local; Postgres en Azure para producci├│n |
| **ORM** | Drizzle | Type-safe, ligero, compatible SQLite + Postgres sin cambiar c├│digo |
| **Im├ígenes** | Local (dev) ÔåÆ Azure Blob Storage (prod) | Sin coste en dev, escalable en prod |
| **LLM chat** | Qwen3-14B-Q5_K_M local (llama-swap) | 100% local, Ôé¼0 coste, privacidad total ÔÇö ver ADR-008 |

---

## PARTE 2 ÔÇö Schema de base de datos

```sql
-- Proyectos
CREATE TABLE projects (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL,
  genre       TEXT,
  logline     TEXT,
  synopsis    TEXT,
  tone        TEXT,
  phase       INTEGER DEFAULT 1,  -- 1=definici├│n, 2=storyboard, 3=producci├│n
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

-- Escenas del gui├│n
CREATE TABLE scenes (
  id          TEXT PRIMARY KEY,
  project_id  TEXT REFERENCES projects(id),
  order_index INTEGER NOT NULL,
  heading     TEXT NOT NULL,   -- "INT. ESTACI├ôN - NOCHE"
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

-- Relaci├│n panel <-> entidades (para propagaci├│n ADR-004)
CREATE TABLE panel_entities (
  panel_id     TEXT REFERENCES panels(id),
  entity_type  TEXT NOT NULL,  -- 'character' | 'location'
  entity_id    TEXT NOT NULL,
  PRIMARY KEY (panel_id, entity_type, entity_id)
);

-- Cola de trabajos de generaci├│n
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

## PARTE 3 ÔÇö API Endpoints

### Proyectos
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| GET | `/api/projects` | Listar proyectos |
| POST | `/api/projects` | Crear proyecto |
| GET | `/api/projects/:id` | Obtener proyecto completo |
| PATCH | `/api/projects/:id` | Actualizar proyecto |
| DELETE | `/api/projects/:id` | Eliminar proyecto |

### Entidades
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| POST | `/api/projects/:id/characters` | Crear personaje |
| PATCH | `/api/characters/:id` | Modificar personaje ÔåÆ trigger propagaci├│n |
| POST | `/api/projects/:id/locations` | Crear escenario |
| PATCH | `/api/locations/:id` | Modificar escenario ÔåÆ trigger propagaci├│n |

### Gui├│n y parser
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| PUT | `/api/projects/:id/screenplay` | Guardar gui├│n Fountain |
| POST | `/api/projects/:id/parse` | Parsear Fountain ÔåÆ JSON paneles |

### Generaci├│n
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| POST | `/api/panels/:id/generate` | Encolar generaci├│n de imagen |
| GET | `/api/jobs/:id/status` | Estado del trabajo |
| PATCH | `/api/panels/:id/approve` | Aprobar panel |
| PATCH | `/api/panels/:id/reject` | Rechazar panel |

### Exportaci├│n
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| GET | `/api/projects/:id/export/pdf` | Exportar storyboard como PDF |
| GET | `/api/projects/:id/export/video` | Exportar corto final como MP4 |

### LLM
| M├®todo | Ruta | Descripci├│n |
|--------|------|-------------|
| POST | `/api/ai/feedback` | Feedback narrativo de un campo |
| POST | `/api/ai/expand-prompt` | Expandir descripci├│n a prompt visual |

---

## PARTE 4 ÔÇö Sistema de colas de generaci├│n

```
POST /api/panels/:id/generate
         Ôåô
API crea job en BD (status: queued)
API a├▒ade job a BullMQ queue
         Ôåô
BullMQ Worker (proceso separado en Dragon):
  1. Recibe job
  2. Construye prompt desde panel + entidades
  3. POST http://localhost:8188/api/prompt ÔåÆ ComfyUI
  4. Polling GET /api/history/:prompt_id hasta completado
  5. Descarga imagen resultado
  6. Guarda en almacenamiento
  7. Actualiza BD: panel.image_low_url, job.status = done
         Ôåô
Socket.io emite evento 'panel:generated' al frontend
         Ôåô
Frontend actualiza el panel con la imagen recibida
```

### Decisi├│n BullMQ vs alternativas
- **BullMQ + Redis:** recomendado ÔÇö reintentos autom├íticos, prioridades, UI de monitorizaci├│n (Bull Board), battle-tested
- **Alternativa sin Redis (MVP):** cola en memoria con `p-queue` ÔÇö m├ís simple pero sin persistencia si el servidor cae
- **Decisi├│n:** empezar con `p-queue` en MVP local, migrar a BullMQ cuando se despliegue en producci├│n

### Gesti├│n de errores
- Timeout: si ComfyUI no responde en 5 min ÔåÆ marcar job como failed
- Reintentos: m├íximo 3 intentos autom├íticos
- Notificaci├│n: Socket.io emite `panel:error` al frontend con mensaje

---

## PARTE 5 ÔÇö Estrategia de despliegue

### Desarrollo (local en Dragon)
```
Dragon:
Ôö£ÔöÇÔöÇ Next.js dev server     :3000
Ôö£ÔöÇÔöÇ ComfyUI                :8188
Ôö£ÔöÇÔöÇ SQLite                 ./data/movieai.db
Ôö£ÔöÇÔöÇ Redis (opcional MVP)   :6379
ÔööÔöÇÔöÇ Socket.io              integrado en Next.js
```
Sin Cloudflare Tunnel necesario en desarrollo.

### Producci├│n
```
Azure Container Apps
Ôö£ÔöÇÔöÇ movieai-web (Next.js)
Ôö£ÔöÇÔöÇ movieai-worker (BullMQ worker)
ÔööÔöÇÔöÇ Redis Cache (Azure Cache for Redis)

Dragon (expuesto via Cloudflare Tunnel)
ÔööÔöÇÔöÇ ComfyUI :8188 ÔåÆ tunnel ÔåÆ comfyui.movieai.app

Azure Storage
ÔööÔöÇÔöÇ Blob Container: images, videos

Azure Database for PostgreSQL
ÔööÔöÇÔöÇ movieai-prod
```

### Estimaci├│n de costes mensuales (100 usuarios activos)
| Servicio | Coste estimado |
|----------|---------------|
| Azure Container Apps (web + worker) | ~Ôé¼15/mes |
| Azure Cache for Redis (Basic C0) | ~Ôé¼15/mes |
| Azure Database PostgreSQL (Flexible, B1ms) | ~Ôé¼12/mes |
| Azure Blob Storage (100GB) | ~Ôé¼2/mes |
| Gemini API (feedback narrativo, ~10k llamadas) | ~Ôé¼5/mes |
| Cloudflare Tunnel | Gratis |
| **Total** | **~Ôé¼49/mes** |

Coste de inferencia (im├ígenes + v├¡deo): **Ôé¼0** ÔÇö todo local en Dragon con RTX 5070 Ti.

---

## Estimaci├│n de tiempo para MVP funcional

| Fase | Semanas | Entregable |
|------|---------|------------|
| Setup + BD + API base | 1 | Proyecto creado, CRUD funcionando |
| Editor de gui├│n (ProseMirror) | 2 | Escribe y guarda Fountain |
| Formulario Fase 1 + LLM feedback | 2 | Pre-producci├│n completa |
| Parser Fountain + generador prompts | 1 | JSON de paneles |
| Integraci├│n ComfyUI + colas | 2 | Genera im├ígenes B&N |
| UI storyboard + validaci├│n | 1 | Aprueba paneles |
| Exportaci├│n PDF | 1 | MVP completo Fases 1-2 |
| **Total Fases 1-2** | **~10 semanas** | Storyboard exportable |
| Animaci├│n WAN 2.7 + montaje | 3 | Fase 3 ÔÇö corto animado |

---

## Stack final recomendado

```
Frontend:    Next.js 15 + TypeScript + Tailwind + shadcn/ui
Editor:      ProseMirror con gram├ítica Fountain personalizada
Estado:      Zustand
Tiempo real: Socket.io
API:         Next.js API Routes
Colas (MVP): p-queue en memoria ÔåÆ BullMQ + Redis en producci├│n
BD (MVP):    SQLite + Drizzle ÔåÆ PostgreSQL en producci├│n
LLM:         Qwen3-14B-Q5_K_M local via llama-swap (ver ADR-008)
Im├ígenes:    FLUX.1 local + LoRA sketch B&N via ComfyUI
V├¡deo:       WAN 2.7 local via ComfyUI
Exposici├│n:  Cloudflare Tunnel para Dragon en producci├│n
Hosting:     Azure Container Apps
```
