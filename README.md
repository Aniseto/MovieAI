# MovieAI

> Cualquier persona con una historia que contar puede crear un storyboard y convertirlo en un vídeo animado como si fuera una película.

MovieAI es una aplicación web que guía al usuario paso a paso — desde la idea inicial hasta un corto animado exportable — usando inteligencia artificial local. Sin suscripciones de IA, sin datos en la nube, sin conocimientos técnicos necesarios.

---

## ¿Qué hace?

El usuario pasa por tres fases secuenciales:

### Fase 1 — Pre-producción (formulario guiado)
Antes de generar ninguna imagen, el usuario define su historia:
- **Sinopsis:** título, género, logline, tono
- **Personajes:** aspecto físico, personalidad, motivación
- **Escenarios:** descripción, atmósfera, iluminación
- **Estructura:** 3 actos (planteamiento, nudo, desenlace)
- **Escenas:** acción, diálogos, personajes presentes, localización

La IA acompaña cada paso con feedback narrativo: "¿tiene conflicto tu logline?", "¿es tu personaje suficientemente descriptivo para generar una imagen coherente?"

### Fase 2 — Storyboard en baja calidad (validación)
- Genera paneles en blanco y negro estilo boceto lápiz, rápidos (< 30 segundos)
- El usuario aprueba, modifica o rechaza panel a panel
- Los diálogos aparecen como bocadillos integrados en el panel
- Si se modifica un personaje o escenario → todos los paneles que lo contienen se regeneran automáticamente

### Fase 3 — Producción (alta calidad + animación)
- **3A:** regenera los paneles aprobados en alta resolución
- **3B:** anima cada panel → clip de vídeo
- **3C:** monta todos los clips → MP4 final listo para compartir

---

## Interfaz

Layout de dos columnas:
- **Izquierda:** chat conversacional con la IA (feedback, guía narrativa)
- **Derecha:** panel visual con la imagen generada y el prompt editable directamente

El usuario puede refinar cada panel de dos formas: hablando con la IA en lenguaje natural ("hazlo más oscuro, que parezca de noche") o editando el prompt directamente.

---

## Público objetivo

| Perfil | Descripción |
|--------|-------------|
| **Primario** | Cualquier persona con una historia (16–50+), sin conocimientos técnicos |
| **Secundario** | Guionistas indie y estudiantes de cine (18–40) |
| **Terciario** | Creadores de contenido narrativo (YouTubers, TikTokers) |

---

## Características clave

- **Coherencia global:** personajes y escenarios son entidades con identidad propia. Al modificar uno, todos los paneles que lo referencian se actualizan automáticamente.
- **Formato Fountain:** el guión se escribe en formato estándar de Hollywood (Fountain), con formateo automático por contexto.
- **Exportación:** storyboard completo en PDF imprimible + corto animado en MP4.
- **Privacidad total:** ningún dato sale del dispositivo. Toda la inferencia (LLM, imágenes, vídeo) es local.
- **Sin suscripción de IA:** el coste de inferencia es €0 — todo en GPU local (RTX 5070 Ti).

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | Next.js 15 + TypeScript + Tailwind + shadcn/ui |
| Editor de guión | ProseMirror con gramática Fountain |
| Estado global | Zustand |
| Tiempo real | Socket.io |
| API | Next.js API Routes |
| Colas | p-queue (dev) → BullMQ + Redis (prod) |
| Base de datos | SQLite + Drizzle (dev) → PostgreSQL (prod) |
| LLM | Qwen3-14B-Q5_K_M local via llama-swap |
| Generación imágenes | FLUX.1-schnell + LoRA StoryboardDiffusion via ComfyUI |
| Animación | WAN 2.7 via ComfyUI |
| Exposición | Cloudflare Tunnel |
| Hosting (prod) | Azure Container Apps |
| Almacenamiento | Local (dev) → Azure Blob Storage (prod) |

### Gestión de VRAM (16GB RTX)

Las fases son secuenciales — nunca se necesitan dos modelos grandes al mismo tiempo:

```
Fase 1  →  Qwen3-14B activo (~8 GB)   — ComfyUI inactivo
Fase 2  →  FLUX.1 activo (~8.5 GB)    — Qwen3 descargado
Fase 3  →  WAN 2.7 activo (~8 GB)     — FLUX.1 descargado
```

**llama-swap** gestiona el swap automático entre modelos.

---

## Coste estimado en producción (100 usuarios)

| Servicio | Coste/mes |
|----------|-----------|
| Azure Container Apps | ~€15 |
| Azure Redis Cache | ~€15 |
| Azure PostgreSQL | ~€12 |
| Azure Blob Storage | ~€2 |
| APIs externas de IA | **€0** |
| **Total** | **~€44/mes** |

---

## Decisiones de arquitectura

Todas las decisiones están documentadas en [`docs/decisions/`](docs/decisions/):

| ADR | Decisión |
|-----|----------|
| [ADR-001](docs/decisions/ADR-001-target-audience.md) | Público: cualquier persona con una historia |
| [ADR-002](docs/decisions/ADR-002-guided-experience.md) | Experiencia guiada como mentor narrativo |
| [ADR-003](docs/decisions/ADR-003-ui-pattern.md) | UI: chat + panel visual con prompt editable |
| [ADR-004](docs/decisions/ADR-004-global-coherence.md) | Coherencia global: propagación automática entre paneles |
| [ADR-005](docs/decisions/ADR-005-production-flow.md) | Flujo 3 fases secuenciales |
| [ADR-006](docs/decisions/ADR-006-guided-form.md) | Formulario guiado obligatorio de pre-producción |
| [ADR-007](docs/decisions/ADR-007-technical-architecture.md) | Arquitectura técnica completa |
| [ADR-008](docs/decisions/ADR-008-local-inference.md) | Inferencia 100% local — sin APIs externas de pago |

---

## Preguntas abiertas (pendientes de decisión)

1. **¿El MVP incluye login/usuarios?** — actualmente diseñado sin auth (proyectos locales). Si se quiere que múltiples usuarios guarden proyectos en la nube se necesita NextAuth.
2. **¿La animación (Fase 3) es parte del MVP o de v2?** — el storyboard en PDF ya tiene valor por sí solo. La animación añade ~3 semanas de desarrollo.
3. **¿Qué limita el freemium?** — ¿Fases 1+2 gratis y Fase 3 (animación) de pago? ¿O hay otro corte?

---

## Estado del proyecto

🟡 **En diseño** — Fases de investigación y decisiones arquitectónicas completadas. Pendiente de aprobación para iniciar implementación.

Ver issues abiertas: [github.com/Aniseto/MovieAI/issues](https://github.com/Aniseto/MovieAI/issues)
