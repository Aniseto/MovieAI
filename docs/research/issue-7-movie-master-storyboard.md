# Investigación Issue #7 — Movie Master 3.09 + Storyboard B&N

**Fecha:** 2026-08-29
**Issue:** [#7](https://github.com/Aniseto/MovieAI/issues/7)

---

## PARTE 1: Movie Master 3.09 — Lecciones para el editor

### Elementos del formato screenplay implementados
- `INT./EXT. UBICACIÓN - MOMENTO` en mayúsculas (slug line)
- Acción: descripciones narrativas en párrafos
- Personaje: nombre en mayúsculas centrado antes del diálogo
- Diálogo: alineado con margen, saltos de línea naturales
- Paréntesis: notas de actuación `(entra lentamente)`
- Transiciones: `CUT TO:`, `FADE OUT`

### Automatismos clave
- `TAB` para cambiar entre elementos (slug → acción → personaje → diálogo)
- `Ctrl+Enter` para insertar nueva escena
- Formateo automático por contexto
- Exportación a `.txt` y `.scr` (formato propio)

### Lecciones de UX para MovieAI
- Formateo automático por contexto — el editor detecta el tipo de elemento, el usuario solo escribe
- Atajos de teclado como flujo principal, no menús
- Interfaz sin distracciones — el texto es el protagonista
- Portabilidad: texto plano como formato base

---

## PARTE 2: Formato Fountain — análisis y librerías

### Qué es Fountain
Lenguaje de marcado basado en Markdown para guiones cinematográficos. Texto plano legible por humanos y parseable por máquinas.

```
INT. LABORATORIO - NOCHE

ALAN
(mirando la pantalla)
Esto no puede ser real.

CUT TO:
```

### Por qué es el formato correcto para MovieAI
- Portabilidad total — texto plano, sin obsolescencia
- Compatible con Fade In, Highland 2, Final Draft (importación)
- Fácil de parsear y generar con LLMs
- Estándar abierto, sin dependencias de vendor

### Librerías open source para parsear Fountain
| Lenguaje | Librería |
|----------|----------|
| JavaScript | `fountain` (npm) |
| Python | `fountain-parser` (PyPI) |
| Java | `Fountain4j` (Maven) |

### Características que los guionistas valoran hoy
- Integración con IA para sugerencias de escena
- Exportación a PDF con formato Hollywood correcto
- Guardado automático y versionado
- Sin fricción — el formato se aplica solo

---

## PARTE 3: Modelos y técnicas para storyboard B&N en ComfyUI

### Modelos/LoRAs recomendados
| Modelo/LoRA | Fuente | Uso |
|-------------|--------|-----|
| `StoryboardDiffusion` | CivitAI | Paneles cinematográficos B&N |
| `black_and_white_sketch_v1` | HuggingFace | Bocetos a lápiz |
| Miyazaki-style storyboard workflow | comfyui.org | Storyboard animación |
| Advertising Storyboard workflow | CivitAI | 6 paneles B&N desde lista de escenas |

### Añadir bocadillos/texto en ComfyUI
- Nodo `Text on Image` con posición configurable
- Fuente sans-serif, sombra sutil para legibilidad sobre boceto

### Resolución y aspect ratio recomendados
- **16:9 (1920×1080)** para paneles individuales — estándar cinematográfico
- **4:3** como alternativa para escenas más cuadradas

---

## PARTE 4: Estructura del panel de storyboard MovieAI

### Contenido de cada panel
- Imagen B&N estilo boceto a lápiz con sombras suaves
- Bocadillo de diálogo integrado en la imagen
- Leyenda inferior: descripción breve de la acción
- Número de panel y nombre de escena

### Estructura de página
- 3 paneles por fila (aspect ratio 16:9)
- Márgenes del 10% para legibilidad
- Grupos de escenas separados por línea horizontal

### Prompt de ejemplo para ComfyUI
```
Generate a black-and-white storyboard panel of [ACTION],
with speech bubbles containing [DIALOGUE],
16:9 aspect ratio, pencil sketch style,
soft shadows, 10% margin around the frame,
cinematic composition, storyboard style
```

---

## CONCLUSIONES

| Decisión | Recomendación |
|----------|---------------|
| Formato de guión | **Fountain** — texto plano, estándar abierto, parseable con LLM |
| Librería de parseo | **`fountain` (npm)** si el editor es web, `fountain-parser` si es Python |
| Modelo/LoRA storyboard | **StoryboardDiffusion (CivitAI)** + `black_and_white_sketch_v1` |
| Aspect ratio panel | **16:9** — estándar cinematográfico |
| Estructura página | **3 paneles por fila**, bocadillos integrados, leyenda de acción inferior |

---

## Siguiente paso sugerido
Avanzar a issue #4 (diseño del editor de guión) con el formato Fountain como base decidida.
