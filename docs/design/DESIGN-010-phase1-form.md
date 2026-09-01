# DESIGN-010 — Formulario guiado de Fase 1 (Pre-producción)

**Issue:** #10  
**Estado:** PROPOSED — pendiente de aprobación por Jordi  
**Fecha:** 2026-09-01  
**Autor:** Jarvis  
**Referencias:** ADR-005, ADR-006, ADR-007

---

## 1. Decisiones de diseño

| Decisión | Valor |
|----------|-------|
| Navegación entre secciones | Libre — el usuario puede ir a cualquier sección en cualquier momento |
| Feedback de IA | Orientativo — nunca bloqueante; el usuario puede ignorar sugerencias |
| Imágenes de referencia | Generadas por botón, previa revisión IA del texto del personaje/escenario |
| Persistencia | Ficheros Markdown — sin base de datos |
| Organización | Una carpeta por proyecto, un `.md` por entidad |

---

## 2. Estructura de carpetas y ficheros

```
projects/
└── {slug-del-proyecto}/
    ├── project.md                        ← índice + mapa de referencias
    ├── sinopsis.md
    ├── estructura.md
    ├── personajes/
    │   ├── {slug-personaje}.md
    │   └── {slug-personaje}-referencia.png   ← imagen generada, nombre derivado del .md
    ├── escenarios/
    │   ├── {slug-escenario}.md
    │   └── {slug-escenario}-referencia.png
    └── escenas/
        └── escena-{nn}-{slug-titulo}.md      ← nn = número con cero (01, 02…)
```

**Slugs:** lowercase, sin tildes, espacios → guiones. Ejemplo: "El último tren" → `el-ultimo-tren`.

---

## 3. Formato de cada fichero

### 3.1 `project.md` — Índice del proyecto

```markdown
# {Título del proyecto}

**Slug:** el-ultimo-tren  
**Género:** Drama  
**Fase:** 1  
**Creado:** 2026-09-01  
**Actualizado:** 2026-09-01  

## Documentos del proyecto

- [Sinopsis](sinopsis.md)
- [Estructura narrativa](estructura.md)

### Personajes
- [Marco](personajes/marco.md) — protagonista
- [Elena](personajes/elena.md) — antagonista

### Escenarios
- [Estación central](escenarios/estacion-central.md)
- [Apartamento de Marco](escenarios/apartamento-marco.md)

### Escenas
- [Escena 01 — El encuentro](escenas/escena-01-el-encuentro.md)
- [Escena 02 — La decisión](escenas/escena-02-la-decision.md)

## Estado de secciones

| Sección | Estado |
|---------|--------|
| Sinopsis | ✅ completo |
| Personajes | ⚠️ 1 de 2 completados |
| Escenarios | 🔲 vacío |
| Estructura | 🔲 vacío |
| Escenas | 🔲 vacío |
```

---

### 3.2 `sinopsis.md`

```markdown
# Sinopsis

**Título:** El último tren  
**Género:** Drama  
**Tono:** Serio, Íntimo  

## Logline

Un hombre que perdió su memoria debe decidir si subirse al tren que le llevará de vuelta a su pasado.

## Sinopsis corta

Marco, un hombre de 45 años sin recuerdos, llega a una estación abandonada...
```

---

### 3.3 `personajes/{slug}.md`

```markdown
# Personaje: Marco

**Rol:** protagonista  
**Edad:** 45  

## Aspecto físico

Alto, pelo canoso, gabardina beige desgastada. Ojos grises, mirada perdida.

## Personalidad

Reservado, melancólico, determinado cuando encuentra un propósito.

## Motivación

Recuperar su memoria y encontrar a la persona que dejó atrás.

## Imagen de referencia

![Marco — imagen de referencia](marco-referencia.png)  
_Generada el 2026-09-01. Regenerar si se modifica el aspecto físico._
```

---

### 3.4 `escenarios/{slug}.md`

```markdown
# Escenario: Estación central

**Tipo:** INT  
**Iluminación:** Penumbra  

## Descripción

Estación de tren abandonada de los años 40. Andenes de mármol agrietado...

## Atmósfera

Silenciosa y opresiva. El polvo flota en los rayos de luz que entran por las claraboyas rotas.

## Elementos clave

- Reloj parado a las 3:17
- Maletas abandonadas en el andén
- Un billete de tren en el suelo

## Imagen de referencia

![Estación central — imagen de referencia](estacion-central-referencia.png)  
_Generada el 2026-09-01. Regenerar si se modifica la descripción o atmósfera._
```

---

### 3.5 `estructura.md`

```markdown
# Estructura narrativa

## Acto 1 — Planteamiento

Marco aparece en la estación sin recuerdos...

## Punto de giro 1

Encuentra un billete con su nombre y la fecha de hoy.

## Acto 2 — Nudo

Marco investiga la estación buscando pistas de su identidad...

## Punto de giro 2

Descubre que Elena es quien borró sus recuerdos, y lo hizo para protegerle.

## Acto 3 — Desenlace

Marco debe elegir: subirse al tren (recuperar el pasado) o quedarse (empezar de nuevo).
```

---

### 3.6 `escenas/escena-{nn}-{slug}.md`

```markdown
# Escena 01 — El encuentro

**Escenario:** [Estación central](../escenarios/estacion-central.md)  
**Personajes:** [Marco](../personajes/marco.md), [Elena](../personajes/elena.md)  
**Momento:** Noche  
**Emoción:** Tensión, Misterio  
**Duración estimada:** 90 segundos  

## Acción principal

Marco entra en la estación vacía. Al fondo, Elena está sentada en un banco, mirando al vacío.

## Diálogos clave

**Marco:** ¿Quién eres tú?  
**Elena:** La pregunta correcta es quién eres tú.

## Notas de producción

_Campo libre para notas adicionales._
```

---

## 4. Sistema de referencias entre documentos

### Principio (Opción C)

- **`project.md`** actúa como índice central: lista todas las entidades con sus rutas relativas.
- **Escenas** incluyen referencias inline explícitas a los personajes y escenarios que intervienen.
- **Personajes y escenarios** son documentos independientes sin referencias a otros (son entidades base).
- **La IA**, antes de procesar una escena, carga: `project.md` + el `.md` de la escena + los `.md` de personajes y escenarios referenciados en esa escena.

### Qué carga la IA según el contexto

| Operación | Ficheros que carga la IA |
|-----------|--------------------------|
| Feedback de sinopsis | `project.md` + `sinopsis.md` |
| Feedback de personaje | `project.md` + `sinopsis.md` + `{personaje}.md` |
| Generar imagen de personaje | `sinopsis.md` + `{personaje}.md` |
| Feedback de escena | `project.md` + `sinopsis.md` + `escena.md` + personajes y escenarios referenciados |
| Generar imagen de escenario | `sinopsis.md` + `{escenario}.md` |
| Verificar coherencia global | `project.md` + todos los `.md` del proyecto |

---

## 5. Flujo de generación de imágenes de referencia

```
Usuario rellena descripción del personaje/escenario
              ↓
Pulsa [Generar imagen de referencia]
              ↓
API llama a IA para revisar el texto:
  ¿Es suficientemente descriptivo para ComfyUI?
  ¿Tiene información visual concreta (colores, formas, iluminación)?
  ¿Hay contradicciones internas?
              ↓
         ¿Pasa revisión?
        /             \
      SÍ               NO
       ↓                ↓
Lanza workflow       Muestra sugerencias
ComfyUI              "El aspecto físico necesita
       ↓              más detalle visual antes
Imagen generada       de generar la imagen"
       ↓
Guarda como {slug}-referencia.png
junto al .md del personaje/escenario
       ↓
Actualiza el .md con referencia a la imagen
y fecha de generación
```

**Nota:** Si el usuario modifica el texto después de generar la imagen, aparece un aviso: _"La descripción ha cambiado desde la última generación. ¿Regenerar imagen?"_

---

## 6. Layout del formulario

```
┌──────────────────────────────────────────────────────────┐
│  MovieAI — {Título del proyecto}        [Guardar]        │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  SECCIONES   │   CONTENIDO DE LA SECCIÓN ACTIVA          │
│              │                                           │
│  📝 Sinopsis │   (campos, feedback IA inline,            │
│  👤 Personajes│    botones de ayuda y generación)         │
│  🏛️ Escenarios│                                           │
│  📖 Estructura│                                           │
│  🎬 Escenas  │                                           │
│              │                                           │
│  ──────────  │                                           │
│  PROGRESO    │                                           │
│  [████░░] 3/5│                                           │
│              │                                           │
│  [🎬 Generar]│                                           │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

---

## 7. Estados de campo y sección

| Estado | Icono | Descripción |
|--------|-------|-------------|
| `empty` | 🔲 | Vacío |
| `filled` | 📝 | Relleno, sin revisión IA |
| `warning` | ⚠️ | Con sugerencia de mejora (orientativa, no bloqueante) |
| `complete` | ✅ | Relleno (con o sin revisión IA) |

**El botón Generar Storyboard se desbloquea cuando todos los campos obligatorios de todas las secciones están en estado `filled` o `complete`** — independientemente de warnings.

---

## 8. Arquitectura de componentes React

```
/app/projects/[slug]/phase1/
├── page.tsx
├── components/
│   ├── Phase1Layout.tsx            ← sidebar + contenido
│   ├── Phase1Sidebar.tsx           ← navegación secciones + progreso + botón generar
│   ├── sections/
│   │   ├── SynopsisSection.tsx
│   │   ├── CharactersSection.tsx
│   │   ├── LocationsSection.tsx
│   │   ├── StructureSection.tsx
│   │   └── ScenesSection.tsx
│   ├── fields/
│   │   ├── AiField.tsx             ← campo con botón "Ayúdame" + feedback inline
│   │   ├── ChipSelector.tsx
│   │   ├── DynamicList.tsx         ← lista dinámica (personajes, escenarios, escenas)
│   │   └── ImageGenerator.tsx     ← botón generar imagen + estado + preview
│   └── GenerateButton.tsx
├── hooks/
│   ├── usePhase1Store.ts           ← Zustand store
│   ├── useAiFeedback.ts            ← llamadas a /api/ai/feedback
│   ├── useImageGeneration.ts       ← llamadas a /api/generate/reference-image
│   └── useMarkdownPersistence.ts   ← leer/escribir ficheros .md via API
└── store/
    └── phase1Store.ts
```

---

## 9. API Routes necesarias

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/projects` | Listar proyectos (leer carpeta `projects/`) |
| GET | `/api/projects/[slug]` | Leer `project.md` + parsear estado |
| PUT | `/api/projects/[slug]/[doc]` | Escribir/actualizar un `.md` concreto |
| POST | `/api/ai/feedback` | Revisión orientativa de un campo |
| POST | `/api/ai/verify-for-image` | Verificar texto antes de generar imagen |
| POST | `/api/generate/reference-image` | Lanzar workflow ComfyUI + guardar PNG |

---

## 10. Plan de implementación propuesto (tareas atómicas)

El siguiente desglose es una **propuesta** de orden de implementación. Cada tarea es independiente y verificable antes de pasar a la siguiente.

| # | Tarea | Descripción | Dependencias |
|---|-------|-------------|--------------|
| T-01 | Estructura de ficheros | Definir y validar el formato exacto de cada `.md` con ejemplos reales | — |
| T-02 | API de persistencia | CRUD de ficheros `.md` via Next.js API Routes | T-01 |
| T-03 | Layout base | Sidebar + navegación entre secciones + routing | — |
| T-04 | Sección Sinopsis | Formulario + guardado en `sinopsis.md` | T-02, T-03 |
| T-05 | Sección Personajes | Lista dinámica + guardado en `personajes/{slug}.md` | T-02, T-03 |
| T-06 | Sección Escenarios | Lista dinámica + guardado en `escenarios/{slug}.md` | T-02, T-03 |
| T-07 | Sección Estructura | Formulario 3 actos + guardado en `estructura.md` | T-02, T-03 |
| T-08 | Sección Escenas | Lista dinámica con referencias + guardado | T-02, T-03, T-05, T-06 |
| T-09 | Progreso y botón Generar | Calcular estado de secciones + desbloqueo | T-04…T-08 |
| T-10 | Feedback IA por campo | Botón "Ayúdame" + sugerencias inline | T-04…T-08 |
| T-11 | Generación de imágenes | Verificación IA + workflow ComfyUI + guardar PNG | T-05, T-06, T-10 |

---

## 11. Estado de aprobación

**PROPOSED** — No se inicia implementación hasta aprobación de Jordi.

Pendiente de confirmar:
1. Formato de los ficheros `.md` (sección 3)
2. Estructura de carpetas (sección 2)
3. Plan de implementación (sección 10) — orden y granularidad de tareas
4. Estado de ADR-005 y ADR-006 (actualmente PROPOSED en el repo)
