# ADR-003 — Patrón de interfaz: chat conversacional + panel visual

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)
**Inspiración:** Google Flow Storyboard Studio

---

## Decisión

La interfaz de MovieAI sigue el patrón **chat conversacional + panel visual lado a lado**, inspirado en Google Flow.

---

## Layout principal

```
┌─────────────────────────────────────────────────────────────────┐
│                        MovieAI                                  │
├──────────────────────────┬──────────────────────────────────────┤
│                          │                                      │
│   PANEL IZQUIERDO        │   PANEL DERECHO                      │
│   Chat conversacional    │   Vista del storyboard               │
│                          │                                      │
│  IA: "¿Cuál es la        │   ┌─────────────────────────┐        │
│  emoción principal de    │   │   [Imagen del panel]    │        │
│  esta escena?"           │   │   generada por IA       │        │
│                          │   └─────────────────────────┘        │
│  Usuario: "Es una        │                                      │
│  escena de miedo,        │   ┌─────────────────────────┐        │
│  hay tormenta..."        │   │  Prompt que generó      │        │
│                          │   │  esta imagen:           │        │
│  IA: "Perfecto.          │   │                         │        │
│  He generado el          │   │  "Interior noche,       │        │
│  panel. ¿Lo ajustamos?"  │   │   tormenta, personaje   │        │
│                          │   │   mirando ventana,      │        │
│  [Campo de texto]        │   │   boceto lápiz B&N"     │        │
│  [Enviar]                │   │                         │        │
│                          │   │  [Editar texto]         │        │
│                          │   │  [Regenerar imagen]     │        │
│                          │   └─────────────────────────┘        │
└──────────────────────────┴──────────────────────────────────────┘
```

---

## Mecánica de interacción

### Flujo principal
1. La IA conversa con el usuario en el panel izquierdo
2. Cuando tiene suficiente información, genera automáticamente el panel de storyboard
3. La imagen aparece en el panel derecho con el **prompt que la generó visible y editable**
4. El usuario puede:
   - **Editar el prompt** directamente y hacer clic en "Regenerar"
   - **Continuar el chat** para refinar con lenguaje natural ("hazlo más oscuro", "añade lluvia")
   - **Aprobar el panel** y pasar al siguiente
   - **Rechazar y empezar de nuevo**

### Dos formas de refinar — siempre disponibles
| Método | Cómo | Para quién |
|--------|------|------------|
| **Chat natural** | "Quiero que el personaje esté más asustado" | Usuarios sin experiencia técnica |
| **Edición de prompt** | Modifica el texto directamente y regenera | Usuarios más avanzados |

### Navegación del storyboard
- Panel de miniaturas en la parte inferior: todos los paneles generados
- Clic en cualquier miniatura → se abre en el panel derecho para editar
- Orden drag & drop para reorganizar escenas

---

## Principios de UX

1. **El prompt siempre visible** — el usuario entiende qué generó la imagen, no es magia negra
2. **Edición inmediata** — sin modales, sin pasos extra; edita y regenera en el mismo lugar
3. **Chat como guía, no como obligación** — el usuario puede saltar al prompt si lo prefiere
4. **Progreso claro** — indica en qué escena está y cuántas quedan
5. **Nunca bloqueante** — si la IA no entiende algo, sugiere en lugar de pedir más datos

---

## Implicaciones técnicas

- Layout: **dos columnas responsivas** (chat izquierda, storyboard derecha)
- En móvil: tabs (Chat / Storyboard)
- El prompt es un `<textarea>` editable directamente, no solo lectura
- Botón "Regenerar" llama a la API de ComfyUI con el prompt modificado
- El chat usa streaming para respuesta fluida (typewriter effect)
- Estado persistido: el usuario puede cerrar y volver a su proyecto

---

## Referencia visual
- Google Flow Storyboard Studio — patrón de chat + imagen + prompt editable
- Cursor AI — chat lateral + código editable en el panel principal
- Notion AI — inline AI dentro del contenido

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
