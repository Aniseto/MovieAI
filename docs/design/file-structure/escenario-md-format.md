# Formato de `escenarios/{slug}.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, project-md-format.md

---

## 1. Schema comentado

Cada escenario tiene su propio fichero en `escenarios/{slug}.md`. Es un documento base — no referencia a otros ficheros. La imagen de referencia se guarda como `escenarios/{slug}-referencia.png`.

### Estructura del fichero

```
# Escenario: {Nombre}

slug: {slug}
type: {INT|EXT}
lighting: {iluminación principal}
updated: {YYYY-MM-DD}

## Descripción

{Texto libre. Qué es este lugar, su estado, época, estilo arquitectónico o natural.
Debe ser suficientemente visual para generar una imagen coherente en ComfyUI.}

## Atmósfera

{Texto libre. Qué sensación produce el espacio. Sonidos, olores, temperatura implícita.
Qué emoción evoca en quien lo habita.}

## Elementos clave

{Texto libre o lista. Objetos, detalles o rasgos visuales que distinguen este escenario
y que pueden aparecer en los paneles del storyboard.}

## Imagen de referencia

image: escenarios/{slug}-referencia.png
image_updated: {YYYY-MM-DD}
```

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# Escenario: {Nombre}` | Heading H1 | ✅ | Identifica el fichero de forma autocontenida |
| `slug` | string | ✅ | Debe coincidir con el nombre del fichero |
| `type` | enum | ✅ | `INT` (interior) o `EXT` (exterior) — convención estándar de guión cinematográfico |
| `lighting` | string | ✅ | Iluminación principal: `Luz natural` · `Artificial` · `Nocturno` · `Penumbra` · `Contraluz` · `Neblina` · `Mixta` |
| `updated` | date YYYY-MM-DD | ✅ | Actualizado automáticamente al guardar |
| `## Descripción` | texto libre multilínea | ✅ | Campo clave para generación de imagen |
| `## Atmósfera` | texto libre multilínea | ✅ | Tono sensorial y emocional del espacio |
| `## Elementos clave` | texto libre o lista | ❌ opcional | Detalles visuales distintivos del escenario |
| `## Imagen de referencia` | sección con campos | ❌ opcional | Se añade al generar la imagen |
| `image` | ruta relativa | ❌ opcional | Ruta al PNG generado |
| `image_updated` | date YYYY-MM-DD | ❌ opcional | Si `updated > image_updated` la app avisa de regenerar |

---

## 2. Ejemplo real completo — "Estación central"

```markdown
# Escenario: Estación central

slug: estacion-central
type: INT
lighting: Penumbra
updated: 2026-09-01

## Descripción

Estación de tren abandonada de estilo art déco de los años 40. Andenes de mármol
agrietado cubiertos de polvo. Las claraboyas del techo, algunas rotas, dejan entrar
rayos de luz que iluminan el polvo suspendido en el aire. Las taquillas de madera
oscura están cerradas con candados oxidados. Los carteles informativos aún cuelgan
de las paredes, con fechas de décadas pasadas.

## Atmósfera

Silenciosa y opresiva. El silencio no es paz — es ausencia. Cada paso resuena en el
mármol. Hay algo detenido en el tiempo aquí, como si la estación estuviera esperando
que alguien volviera. La luz es escasa y directa, creando sombras largas y contrastes
duros.

## Elementos clave

- Reloj de pared parado a las 3:17
- Maletas de cuero abandonadas en el andén principal
- Un billete de tren en el suelo cerca de la taquilla central
- Banco de madera oscura al fondo del andén

## Imagen de referencia

image: escenarios/estacion-central-referencia.png
image_updated: 2026-09-01
```

---

## 3. Reglas de actualización automática

| Evento | Acción sobre el fichero |
|--------|------------------------|
| Añadir bloque Escenario en el editor | Se crea el fichero con H1, metadatos y H2 de contenido vacíos |
| Guardar cambios en el bloque Escenario | Se sobreescribe el fichero completo |
| Generar imagen de referencia | Se añade o actualiza `## Imagen de referencia` |
| Modificar `## Descripción` o `## Atmósfera` tras generar imagen | La app detecta `updated > image_updated` y avisa de regenerar |
| Eliminar escenario | Se elimina `.md` y `.png`. Se actualiza `project.md` y se desvincula de las escenas que lo usaban |

---

## 4. Notas de implementación para el parser

- Campos `slug`, `type`, `lighting`, `updated` entre el H1 y el primer H2
- `type` tiene valores fijos (`INT` / `EXT`) — validar en el parser
- `## Elementos clave` es opcional — puede ser texto libre o lista Markdown con guiones
- `## Imagen de referencia` puede estar ausente — tratarla como opcional
- Completitud: `complete` cuando `## Descripción` y `## Atmósfera` tienen contenido
