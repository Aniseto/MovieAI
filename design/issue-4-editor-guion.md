# Diseño del Editor de Guión — MovieAI
**Issue:** #4  
**Fecha:** 2026-08-31  
**Referencia espiritual:** Movie Master 3.09 — sencillez extrema, foco total en escribir

---

## 1. Decisiones de plataforma y stack

| Decisión | Valor | Justificación |
|----------|-------|---------------|
| **Plataforma** | Web app (Next.js) | Consistente con el stack aprobado (ADR-007); sin instalación; accesible desde cualquier dispositivo |
| **Editor** | ProseMirror | Decisión ya tomada en ADR-007. Control total sobre el modelo de documento, extensible, sin overhead de Monaco (orientado a código) ni CodeMirror (más genérico) |
| **Formato interno** | Fountain | Estándar de facto, portabilidad total, parseable con fountain-js |
| **Offline** | No en MVP | La app requiere backend para generación de storyboard; offline añade complejidad innecesaria en MVP |
| **Guardado** | Automático cada 30s + al cerrar tab | Sin botón "Guardar"; comportamiento tipo Notion/Google Docs |

---

## 2. Elementos de guión en MVP

Solo los elementos esenciales del formato screenplay Hollywood:

| Elemento | Tecla | Formato visual | Ejemplo |
|----------|-------|----------------|---------|
| **Slug Line** | Enter en línea vacía desde Acción | MAYÚSCULAS, negrita, margen izquierdo | `INT. COMISARÍA - NOCHE` |
| **Acción** | Tab desde Slug Line | Normal, margen izquierdo | `Torres revisa las fotos.` |
| **Personaje** | Tab desde Acción | MAYÚSCULAS, centrado | `TORRES` |
| **Diálogo** | Enter desde Personaje | Normal, margen central estrecho | `¿Qué has encontrado?` |
| **Paréntesis** | Tab desde Personaje | Cursiva, centrado, entre paréntesis | `(susurrando)` |

**Ciclo de Tab:**  
`Slug Line → Acción → Personaje → Diálogo → Acción → ...`

**Enter en línea vacía:** siempre vuelve a Acción (o Slug Line si es el inicio).

---

## 3. Atajos de teclado

| Acción | Tecla |
|--------|-------|
| Cambiar al siguiente elemento | `Tab` |
| Volver al elemento anterior | `Shift+Tab` |
| Nueva Slug Line forzada | `Ctrl+Enter` |
| Ir a Personaje directamente | `Ctrl+Shift+P` |
| Exportar PDF | `Ctrl+Shift+E` |
| Búsqueda en guión | `Ctrl+F` |

Sin más atajos en MVP. Sin menús de formato. Sin barra de herramientas visible mientras se escribe.

---

## 4. Wireframe de interfaz

```
┌─────────────────────────────────────────────────────────────────────┐
│  MovieAI                                    [Generar Storyboard] [⋮] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                                                                     │
│   INT. COMISARÍA DE POLICÍA - NOCHE                                 │
│                                                                     │
│   El detective Torres revisa un tablón de corcho lleno de           │
│   fotografías. La sala está en penumbra. Suena el teléfono.         │
│                                                                     │
│                             TORRES                                  │
│                                                                     │
│                       Dígame. ¿Qué tienes?                         │
│                                                                     │
│   Torres anota algo en su libreta.                                  │
│                                                                     │
│   EXT. CALLE MAYOR - AMANECER                                       │
│                                                                     │
│   _                                                                 │
│                                                                     │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Escena 2 de 4 · Guardado hace 12s                   [.fountain] [PDF] │
└─────────────────────────────────────────────────────────────────────┘
```

**Principios de diseño:**
- Fondo blanco o gris muy claro, fuente monoespaciada (Courier Prime o similar)
- Sin sidebar, sin paneles laterales, sin herramientas flotantes
- La única acción prominente es "Generar Storyboard"
- Status bar mínima: número de escena actual + estado de guardado + exportaciones
- El elemento de guión actual se indica con un color de cursor diferente, no con iconos ni labels

---

## 5. Comportamiento de autoformateo

ProseMirror aplica el formato en tiempo real según el contexto:

```
Usuario escribe: "int. oficina - día" + Enter
→ ProseMirror detecta patrón INT./EXT.
→ Convierte automáticamente a MAYÚSCULAS
→ Aplica estilo Slug Line (negrita, margen izquierdo)
→ Cursor pasa a nuevo bloque de Acción

Usuario escribe nombre de personaje en bloque Personaje + Enter
→ Convierte a MAYÚSCULAS
→ Centra el texto
→ Cursor pasa a bloque Diálogo
```

**Detección de Slug Line:** cualquier línea que empiece por `INT.`, `EXT.`, `INT./EXT.` o `I/E.` se convierte automáticamente, sin necesidad de Tab.

---

## 6. Exportaciones MVP

| Formato | Implementación | Notas |
|---------|---------------|-------|
| **PDF** | pdf-lib + jsPDF | Layout screenplay estándar: márgenes Hollywood, Courier 12pt |
| **Fountain (.fountain)** | Serialización directa del modelo ProseMirror | Portabilidad total; importable en Final Draft, Highland, Fade In |

Sin exportación FDX en MVP (formato propietario de Final Draft, innecesario con Fountain).

---

## 7. Conclusiones accionables

1. **ProseMirror** como base del editor — crear un schema con nodos: `slug_line`, `action`, `character`, `dialogue`, `parenthetical`
2. **Autoformateo por Tab/Enter** — implementar como ProseMirror plugin de InputRules + KeymapPlugin
3. **Detección automática de Slug Line** — regex `/^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.)/i` en InputRules
4. **Guardado automático** — debounce de 30s sobre el contenido serializado a Fountain, POST a `/api/scripts/{id}`
5. **Fuente:** Courier Prime (Google Fonts, gratis, diseñada para screenplays, más legible que Courier New)
6. **Tema:** fondo `#FAFAFA`, texto `#1A1A1A`, slug lines `#000000` bold — sin modo oscuro en MVP
7. **Botón "Generar Storyboard"** — único CTA prominente; dispara el pipeline LLM→ComfyUI
8. **Status bar** — solo: escenas totales, personajes únicos, estado guardado, links exportación
