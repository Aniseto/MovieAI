# DESIGN-010 — Formulario guiado de Fase 1 (Pre-producción)

**Issue:** #10  
**Estado:** PROPOSED — pendiente de aprobación por Jordi  
**Fecha:** 2026-09-01  
**Autor:** Jarvis  
**Referencias:** ADR-005, ADR-006, ADR-007

---

## Objetivo

Definir el diseño detallado del formulario web guiado de Fase 1 antes de iniciar la implementación. Este documento cubre: arquitectura de componentes, modelo de datos del formulario, lógica de validación, feedback de IA, persistencia y estados de UI.

---

## 1. Estructura de navegación

El formulario se organiza en **5 secciones secuenciales** accesibles mediante una barra lateral de progreso. El usuario puede navegar entre secciones completadas libremente, pero no puede saltar a una sección bloqueada.

```
Layout:
┌──────────────────────────────────────────────────────────┐
│  MovieAI — Proyecto: [Título del proyecto]               │
├──────────────┬───────────────────────────────────────────┤
│              │                                           │
│  PROGRESO    │   CONTENIDO DE LA SECCIÓN ACTIVA          │
│              │                                           │
│  ✅ Sinopsis │                                           │
│  ⚠️ Personajes│                                           │
│  🔲 Escenarios│                                           │
│  🔲 Estructura│                                           │
│  🔲 Escenas  │                                           │
│              │                                           │
│  ──────────  │                                           │
│  [🎬 Generar]│                                           │
│  (bloqueado) │                                           │
│              │                                           │
└──────────────┴───────────────────────────────────────────┘
```

**Regla de navegación:**
- Secciones 2–5 se desbloquean cuando la anterior está completa (≥ campos obligatorios rellenos)
- Excepción: el usuario puede crear personajes y escenarios antes de completar sinopsis si accede directamente desde un enlace directo (no es el flujo estándar)

---

## 2. Secciones y campos

### 2.1 Sección 1 — Sinopsis

| Campo | Tipo | Obligatorio | Validación semántica IA |
|-------|------|-------------|-------------------------|
| Título | Text input | ✅ | No |
| Género | Chips de selección única | ✅ | No |
| Tono | Chips de selección múltiple | ✅ | No |
| Logline | Textarea (1–2 líneas) | ✅ | ✅ — ¿tiene protagonista, conflicto y objetivo? |
| Sinopsis corta | Textarea (3–5 líneas) | ✅ | ✅ — ¿coherente con logline y género? |

**Géneros disponibles:** Drama · Comedia · Terror · Fantasía · Sci-Fi · Thriller · Animación · Documental · Otro  
**Tonos disponibles:** Serio · Humorístico · Épico · Íntimo · Oscuro · Esperanzador · Irónico

---

### 2.2 Sección 2 — Personajes

Lista dinámica de personajes. Mínimo **1 personaje** (protagonista) para completar la sección.

**Por cada personaje:**

| Campo | Tipo | Obligatorio | Validación semántica IA |
|-------|------|-------------|-------------------------|
| Nombre | Text input | ✅ | No |
| Rol | Select (protagonista/antagonista/secundario/otro) | ✅ | No |
| Edad | Number input | ✅ | No |
| Aspecto físico | Textarea | ✅ | ✅ — ¿suficientemente descriptivo para generar imagen? |
| Personalidad | Textarea | ✅ | ✅ — ¿clara y consistente? |
| Motivación | Textarea | ✅ | ✅ — ¿creíble y que impulse la historia? |
| Imagen de referencia | Upload o texto | ❌ opcional | No |

**Restricción:** debe existir exactamente 1 personaje con rol `protagonista`.

---

### 2.3 Sección 3 — Escenarios

Lista dinámica de escenarios. Mínimo **1 escenario** para completar.

**Por cada escenario:**

| Campo | Tipo | Obligatorio | Validación semántica IA |
|-------|------|-------------|-------------------------|
| Nombre | Text input | ✅ | No |
| Tipo | Toggle INT / EXT | ✅ | No |
| Descripción | Textarea | ✅ | ✅ — ¿tiene suficiente detalle visual? |
| Atmósfera | Textarea | ✅ | ✅ — ¿evoca una sensación clara? |
| Iluminación | Chips de selección | ✅ | No |
| Elementos clave | Tags (lista libre) | ❌ opcional | No |

**Iluminaciones disponibles:** Luz natural · Artificial · Nocturno · Penumbra · Contraluz · Neblina · Otros

---

### 2.4 Sección 4 — Estructura narrativa

Formulario fijo de 3 actos con puntos de giro.

| Campo | Tipo | Obligatorio | Validación semántica IA |
|-------|------|-------------|-------------------------|
| Acto 1 — Planteamiento | Textarea | ✅ | ✅ — ¿presenta personajes y situación inicial? |
| Punto de giro 1 | Textarea | ✅ | ✅ — ¿cambia el estado inicial de forma clara? |
| Acto 2 — Nudo | Textarea | ✅ | ✅ — ¿hay conflicto y desarrollo? |
| Punto de giro 2 | Textarea | ✅ | ✅ — ¿momento de máxima tensión identificable? |
| Acto 3 — Desenlace | Textarea | ✅ | ✅ — ¿resuelve el conflicto principal? |

---

### 2.5 Sección 5 — Escenas

Lista dinámica de escenas. Mínimo **2 escenas** para completar.

**Por cada escena:**

| Campo | Tipo | Obligatorio | Validación semántica IA |
|-------|------|-------------|-------------------------|
| Número y título | Text input | ✅ | No |
| Localización | Select (referencia a escenarios definidos) | ✅ | No |
| Momento del día | Select (mañana/tarde/noche/amanecer/atardecer) | ✅ | No |
| Personajes presentes | Multi-select (referencia a personajes definidos) | ✅ | No |
| Acción principal | Textarea | ✅ | ✅ — ¿clara y que avance la historia? |
| Diálogos clave | Textarea | ❌ opcional | No |
| Emoción de la escena | Chips de selección | ✅ | No |
| Duración estimada | Number (segundos) | ❌ opcional | No |

**Emociones disponibles:** Tensión · Ternura · Miedo · Alegría · Tristeza · Sorpresa · Rabia · Nostalgia

---

## 3. Sistema de feedback de IA

### 3.1 Modalidades

**A — Validación automática al salir del campo (on blur)**
- Se dispara cuando el usuario sale de un campo con validación semántica
- Muestra un indicador de carga inline breve (< 2s objetivo)
- Resultado: ✅ mensaje de confirmación · ⚠️ sugerencia de mejora · ❌ problema claro

**B — Botón "Ayúdame" por campo**
- Disponible en todos los campos con validación semántica
- Abre un panel lateral de chat contextual preconfigurado con el campo actual
- El usuario puede hacer preguntas libres sobre ese campo

### 3.2 Llamadas a la API de IA

Endpoint: `POST /api/ai/feedback`

```json
{
  "field": "logline",
  "section": "synopsis",
  "value": "Un hombre que perdió su memoria...",
  "context": {
    "genre": "Drama",
    "tone": ["Serio", "Íntimo"]
  }
}
```

Respuesta:
```json
{
  "status": "warning",
  "message": "El logline tiene protagonista y conflicto, pero el objetivo final del personaje no está claro. ¿Qué busca conseguir exactamente?",
  "suggestion": "Considera añadir: 'para [objetivo concreto]' al final del logline."
}
```

**Modelo:** Qwen3-14B-Q5_K_M local (ADR-007/008). Gemini API como fallback si el modelo local no está disponible.

### 3.3 Límites y throttle
- Máximo 1 llamada por campo cada 3 segundos (debounce)
- Si el campo tiene < 20 caracteres: no llamar a la IA
- Timeout: 10 segundos; si supera → mostrar "No se pudo validar, continúa igualmente"

---

## 4. Estados de campo y sección

### Estados de campo
| Estado | Icono | Descripción |
|--------|-------|-------------|
| `empty` | 🔲 | Vacío, obligatorio |
| `editing` | ✏️ | En edición activa |
| `validating` | ⏳ | Llamada IA en curso |
| `warning` | ⚠️ | Relleno pero con sugerencia de mejora |
| `complete` | ✅ | Relleno y validado (o sin validación requerida) |
| `error` | ❌ | Vacío al intentar avanzar |

### Estados de sección
| Estado | Icono | Condición |
|--------|-------|-----------|
| `locked` | 🔒 | Sección anterior no completada |
| `incomplete` | ⚠️ | Al menos un campo obligatorio vacío o con error |
| `partial` | 📝 | Campos obligatorios rellenos, algunos opcionales vacíos o con warnings |
| `complete` | ✅ | Todos los campos obligatorios completos y sin errores bloqueantes |

---

## 5. Persistencia

### 5.1 localStorage (draft automático)
- Guardado automático cada vez que el usuario modifica un campo (debounce 1s)
- Clave: `movieai_project_draft_{projectId}`
- Al cargar la página: restaurar desde localStorage si existe draft más reciente que BD
- Límite: si el proyecto ya está guardado en BD, localStorage solo es cache temporal

### 5.2 Base de datos
- Guardado explícito con botón "Guardar proyecto" visible en la barra superior
- También se guarda automáticamente al navegar entre secciones
- Schema: tablas `projects`, `characters`, `locations`, `scenes` (ADR-007)

### 5.3 Conflicto localStorage vs BD
- Si localStorage tiene cambios más recientes que BD: mostrar banner "Tienes cambios sin guardar" con opciones [Guardar ahora] [Descartar]

---

## 6. Botón "Generar Storyboard"

### Estado bloqueado (default)
```
[ 🔒 Generar Storyboard ]   ← disabled, color gris
  Completa todas las secciones para continuar
  Sinopsis ✅ · Personajes ⚠️ · Escenarios 🔲 · Estructura 🔲 · Escenas 🔲
```

### Estado desbloqueado
```
[ 🎬 Generar Storyboard ]   ← enabled, color primario
  Proyecto listo — 1 protagonista · 3 personajes · 2 escenarios · 5 escenas
```

**Condición de desbloqueo:** todas las secciones en estado `complete` o `partial` (campos obligatorios rellenos, sin errores bloqueantes).

**Al hacer clic:** confirmación modal antes de iniciar la generación:
> "Vas a generar el storyboard en baja calidad de 5 escenas. Una vez iniciado, podrás seguir editando el guión, pero los cambios requerirán regenerar los paneles afectados. ¿Continuar?"

---

## 7. Arquitectura de componentes React

```
/app/projects/[id]/phase1/
├── page.tsx                          ← layout principal con barra de progreso
├── components/
│   ├── Phase1Sidebar.tsx             ← barra lateral con progreso y botón generar
│   ├── Phase1ProgressBar.tsx         ← barra de progreso global (mobile)
│   ├── sections/
│   │   ├── SynopsisSection.tsx
│   │   ├── CharactersSection.tsx
│   │   ├── LocationsSection.tsx
│   │   ├── StructureSection.tsx
│   │   └── ScenesSection.tsx
│   ├── fields/
│   │   ├── ValidatedField.tsx        ← wrapper con feedback IA inline
│   │   ├── ChipSelector.tsx          ← selección de chips (género, tono, emoción)
│   │   ├── DynamicList.tsx           ← lista dinámica (personajes, escenarios, escenas)
│   │   └── AiHelpPanel.tsx           ← panel lateral de chat contextual
│   └── GenerateButton.tsx            ← botón con lógica de desbloqueo
├── hooks/
│   ├── usePhase1Form.ts              ← estado global del formulario (Zustand)
│   ├── useAiFeedback.ts              ← llamadas a /api/ai/feedback con debounce
│   └── useAutosave.ts                ← persistencia localStorage + BD
└── store/
    └── phase1Store.ts                ← Zustand store tipado con el estado completo
```

---

## 8. Modelo de estado Zustand

```typescript
interface Phase1State {
  projectId: string;
  synopsis: {
    title: string;
    genre: string;
    tones: string[];
    logline: string;
    synopsis: string;
  };
  characters: Character[];
  locations: Location[];
  structure: {
    act1: string;
    turningPoint1: string;
    act2: string;
    turningPoint2: string;
    act3: string;
  };
  scenes: Scene[];
  
  // Estado de validación por campo
  fieldStatus: Record<string, FieldStatus>;
  
  // Estado de secciones
  sectionStatus: Record<SectionKey, SectionStatus>;
  
  // Computed
  canGenerate: boolean;
  
  // Actions
  updateSynopsis: (data: Partial<SynopsisData>) => void;
  addCharacter: () => void;
  updateCharacter: (id: string, data: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  // ... etc.
}
```

---

## 9. Preguntas abiertas (requieren decisión de Jordi)

| # | Pregunta | Opciones | Impacto |
|---|----------|----------|---------|
| P1 | ¿La navegación entre secciones es **libre** (cualquier sección en cualquier momento) o **secuencial** (solo avanzas cuando la anterior está completa)? | A) Libre — más flexible, más complejo de validar · B) Secuencial — más guiado, más simple | UX y lógica de validación |
| P2 | ¿El feedback de IA es **bloqueante** (no puedes avanzar sin resolver warnings) o **orientativo** (puedes ignorar los warnings y avanzar)? | A) Bloqueante — más calidad de datos · B) Orientativo — más libertad | Criterio de desbloqueo del botón Generar |
| P3 | ¿Los campos de **imagen de referencia** para personajes son MVP o se dejan para v2? | A) MVP — añade complejidad de upload · B) v2 — simplifica el MVP | Scope y tiempo de implementación |
| P4 | ¿El **panel de chat de IA** (botón "Ayúdame") es MVP o se implementa como mejora posterior? | A) MVP — mejor UX · B) Post-MVP — simplifica el primer entregable | Scope y tiempo de implementación |

---

## 10. Estado de aprobación

**PROPOSED** — Este documento es una propuesta de diseño. No se inicia implementación hasta que Jordi apruebe:
1. El diseño general del formulario
2. Las respuestas a las preguntas abiertas (sección 9)
3. El estado de los ADRs 005 y 006 (actualmente PROPOSED en el repo)
