# ADR-006 — Interfaz de Fase 1: formulario guiado obligatorio

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Decisión

La Fase 1 (Definición) se implementa como un **formulario web guiado y obligatorio**. El usuario no puede generar ninguna imagen hasta que todos los campos mínimos estén completos y validados por la IA.

---

## Principios

1. **Campos obligatorios bloqueantes** — el botón "Generar Storyboard" está deshabilitado hasta que todos los campos mínimos estén completos
2. **IA asistente por campo** — cada campo tiene un botón "Ayúdame" que abre el chat de la IA para ese campo concreto
3. **Feedback en tiempo real** — la IA evalúa cada campo al salir del foco y muestra sugerencias inline
4. **Progreso visible** — barra de progreso por sección: Sinopsis, Personajes, Escenarios, Estructura, Escenas
5. **Guardado automático** — el usuario puede cerrar y retomar en cualquier momento

---

## Estructura del formulario

### Sección 1 — Sinopsis
```
┌─────────────────────────────────────────────────────────┐
│  📽️ SINOPSIS                               ✅ Completo  │
├─────────────────────────────────────────────────────────┤
│  Título *                                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ El último tren                                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Género *                                               │
│  [Drama] [Comedia] [Terror] [Fantasía] [Sci-Fi] [Otro] │
│                                                         │
│  Logline * (una frase que resume la historia)           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Un hombre que perdió su memoria debe decidir    │   │
│  │ si subirse al tren que le llevará de vuelta...  │   │
│  └─────────────────────────────────────────────────┘   │
│  ✅ Buen logline — tiene protagonista, conflicto y      │
│     decisión. [Ver sugerencia de mejora]                │
│                                                         │
│  Sinopsis corta * (3-5 líneas)                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                 │   │
│  └─────────────────────────────────────────────────┘   │
│  ⚠️ Campo obligatorio                                   │
│                                                         │
│  Tono *                                                 │
│  [Serio] [Humorístico] [Épico] [Íntimo] [Oscuro]       │
│                                    [💬 Ayúdame con esto]│
└─────────────────────────────────────────────────────────┘

### Sección 2 — Personajes
┌─────────────────────────────────────────────────────────┐
│  👤 PERSONAJES                       ⚠️ 1/2 completados │
├─────────────────────────────────────────────────────────┤
│  [+ Añadir personaje]                                   │
│                                                         │
│  ▼ PERSONAJE 1 — Marco (Protagonista)   ✅             │
│    Nombre: Marco                                        │
│    Edad: 45                                             │
│    Aspecto físico: Alto, pelo canoso, gabardina...      │
│    Personalidad: Reservado, melancólico, determinado    │
│    Motivación: Recuperar su memoria y encontrar...      │
│    Imagen de referencia: [Subir foto] o [Describir]     │
│                                                         │
│  ▼ PERSONAJE 2 — Elena (Antagonista)    ⚠️ Incompleto  │
│    Nombre: Elena                                        │
│    Edad: [vacío] ← campo obligatorio                   │
│    ...                                                  │
└─────────────────────────────────────────────────────────┘

### Sección 3 — Escenarios
### Sección 4 — Estructura (3 actos)
### Sección 5 — Escenas (lista de escenas del proyecto)
```

---

## Feedback de la IA por campo

Cada campo importante tiene validación semántica por IA:

| Campo | Qué valida la IA |
|-------|-----------------|
| Logline | ¿Tiene protagonista, conflicto y objetivo? |
| Personaje — aspecto | ¿Es suficientemente descriptivo para generar una imagen? |
| Personaje — motivación | ¿Es clara y creíble? |
| Escenario — descripción | ¿Tiene suficiente detalle visual para generar imagen? |
| Escena — acción | ¿Está clara la acción principal? ¿Avanza la historia? |
| Estructura | ¿Los tres actos están equilibrados? |

---

## Estados de los campos

- 🔲 Vacío — obligatorio, bloquea avance
- ✏️ En edición
- ⚠️ Incompleto o con sugerencia de mejora
- ✅ Completo y validado por IA
- 🔒 Bloqueado — depende de otro campo

---

## Botón de generación

```
┌─────────────────────────────────────────────────────────┐
│  PROGRESO DEL PROYECTO                                  │
│  Sinopsis     ████████████ ✅                           │
│  Personajes   ████████░░░░ ⚠️ 1 incompleto              │
│  Escenarios   ████████████ ✅                           │
│  Estructura   ████░░░░░░░░ ⚠️ Acto 2 vacío              │
│  Escenas      ░░░░░░░░░░░░ ⚠️ Sin escenas               │
│                                                         │
│  [ Generar Storyboard ] ← DESHABILITADO                 │
│  Completa todos los campos para continuar               │
└─────────────────────────────────────────────────────────┘
```

Cuando todo está completo:

```
│  [ 🎬 Generar Storyboard ] ← HABILITADO, color primario │
```

---

## Implicaciones técnicas

- **Stack:** Next.js + React + formularios controlados
- **Validación:** Zod para validación de campos + llamada a LLM para validación semántica
- **Persistencia:** localStorage para draft + base de datos para proyectos guardados
- **LLM:** Gemini API para feedback por campo (peticiones pequeñas, bajo coste)
- **Estado global:** zustand o Context API para mantener el estado del formulario

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
