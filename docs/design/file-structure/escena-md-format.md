# Formato de `escenas/escena-{nn}-{slug}.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, project-md-format.md, USER-JOURNEY.md

---

## 1. Schema comentado

Cada escena tiene su propio fichero en `escenas/escena-{nn}-{slug}.md`. Es la unidad de producción de MovieAI — cada escena genera uno o más paneles de storyboard en Fase 2.

Las escenas usan **referencias inline** a los ficheros de personajes y escenarios (Opción C del sistema de referencias). Esto permite a la IA cargar exactamente el contexto necesario sin leer todo el proyecto.

El nombre de fichero incluye el número de orden con cero inicial (`01`, `02`…) para garantizar ordenación correcta en el sistema de ficheros.

### Estructura del fichero

```
# Escena {nn} — {Título}

order: {nn}
slug: {slug}
location: escenarios/{slug-escenario}.md
moment: {Mañana|Tarde|Noche|Amanecer|Atardecer}
emotion: {emoción1}, {emoción2}
duration: {segundos estimados}
updated: {YYYY-MM-DD}

## Personajes

- [Nombre del personaje](../personajes/{slug}.md)
- [Nombre del personaje](../personajes/{slug}.md)

## Acción

{Texto libre. Qué ocurre en esta escena. Qué hace cada personaje.
Cómo avanza la historia.}

## Diálogos clave

{Texto libre. Los intercambios de diálogo más importantes de la escena.
Formato libre — no es Fountain, es un apunte narrativo.}

## Notas de producción

{Texto libre opcional. Notas adicionales sobre la escena: ángulo de cámara
sugerido, referencia visual, intención dramática concreta, etc.}
```

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# Escena {nn} — {Título}` | Heading H1 | ✅ | Número de orden + título. El número permite ordenación visual |
| `order` | integer | ✅ | Número de orden en el proyecto (1-based). Debe coincidir con el `nn` del nombre de fichero |
| `slug` | string | ✅ | Slug del título de la escena |
| `location` | ruta relativa | ✅ | Referencia al fichero `.md` del escenario donde ocurre la escena |
| `moment` | enum | ✅ | `Mañana` · `Tarde` · `Noche` · `Amanecer` · `Atardecer` |
| `emotion` | string (lista separada por comas) | ✅ | Emoción o emociones que debe transmitir la escena |
| `duration` | integer (segundos) | ❌ opcional | Duración estimada en segundos |
| `updated` | date YYYY-MM-DD | ✅ | Actualizado automáticamente al guardar |
| `## Personajes` | lista de enlaces Markdown | ✅ | Referencias inline a los `.md` de los personajes presentes |
| `## Acción` | texto libre multilínea | ✅ | Descripción de lo que ocurre en la escena |
| `## Diálogos clave` | texto libre multilínea | ❌ opcional | Apuntes de diálogo — no Fountain, texto narrativo libre |
| `## Notas de producción` | texto libre multilínea | ❌ opcional | Notas adicionales del autor |

---

## 2. Ejemplo real completo — "Escena 01 — El encuentro"

```markdown
# Escena 01 — El encuentro

order: 1
slug: el-encuentro
location: escenarios/estacion-central.md
moment: Noche
emotion: Tensión, Misterio
duration: 90
updated: 2026-09-01

## Personajes

- [Marco](../personajes/marco.md)
- [Elena](../personajes/elena.md)

## Acción

Marco entra en la estación abandonada. Las únicas luces son los rayos de luna que
entran por las claraboyas rotas. Camina lentamente por el andén vacío, mirando las
maletas abandonadas. Al llegar al fondo, ve a Elena sentada en un banco, inmóvil,
mirando las vías. Ella no se gira cuando él se acerca. Sabe que estaba allí.

## Diálogos clave

Marco se detiene a pocos metros de Elena.

MARCO: ¿Quién eres tú?

Elena espera unos segundos antes de responder, sin girarse.

ELENA: La pregunta correcta es quién eres tú.

Silencio. Marco mira las vías.

## Notas de producción

La escena debe sentirse como un encuentro inevitable, no accidental. Elena no está
sorprendida — estaba esperándole. La cámara debería mantener distancia al principio
y acercarse solo cuando Elena habla.
```

---

## 3. Reglas de actualización automática

| Evento | Acción sobre el fichero |
|--------|------------------------|
| Crear nueva escena | Se crea el fichero con H1, metadatos y H2 vacíos. `order` se asigna como el siguiente disponible |
| Guardar cambios en la escena | Se sobreescribe el fichero completo |
| Reordenar escenas | Se renombran los ficheros y se actualizan todos los valores `order`. Se actualiza `project.md` |
| Añadir/eliminar personaje de la escena | Se actualiza la lista en `## Personajes` |
| Eliminar escena | Se elimina el fichero. Se actualizan los `order` de las escenas siguientes y `project.md` |

---

## 4. Notas de implementación para el parser

- Campos de metadatos (`order`, `slug`, `location`, `moment`, `emotion`, `duration`, `updated`) entre el H1 y el primer H2
- `location` es una ruta relativa — el parser la resuelve relativa a la carpeta del proyecto
- `## Personajes` es una lista Markdown de enlaces — el parser extrae el texto del enlace (nombre) y la ruta (para cargar el `.md`)
- `emotion` es string separada por comas — convertir a array dividiendo por `, `
- `duration` es opcional — si está ausente, tratar como `null`
- `## Diálogos clave` y `## Notas de producción` son opcionales — pueden estar ausentes
- Completitud: `complete` cuando `location`, `moment`, `emotion`, al menos 1 personaje en `## Personajes` y `## Acción` con contenido
- **Carga de contexto por la IA:** para procesar una escena, la IA carga `project.md` + `sinopsis.md` + este fichero + los `.md` de todos los personajes y escenarios referenciados
