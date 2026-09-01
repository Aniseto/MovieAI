# Formato de `project.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, USER-JOURNEY.md

---

## 1. Schema comentado

`project.md` es el índice central del proyecto. La IA lo carga siempre como primer paso antes de procesar cualquier otro documento.

### Estructura del fichero

```
# {Título del proyecto}

slug: {slug-del-proyecto}
genre: {género}
tone: {tono1}, {tono2}
phase: {1|2|3}
created: {YYYY-MM-DD}
updated: {YYYY-MM-DD}

## Visión de autor

{texto libre — descripción de la obra, intenciones, referencias, tono deseado}

## Documentos

synopsis: sinopsis.md
structure: estructura.md

## Personajes

- slug: {slug}
  name: {Nombre}
  role: {protagonista|antagonista|secundario|otro}
  file: personajes/{slug}.md
  image: personajes/{slug}-referencia.png
  status: {draft|complete}

## Escenarios

- slug: {slug}
  name: {Nombre}
  file: escenarios/{slug}.md
  image: escenarios/{slug}-referencia.png
  status: {draft|complete}

## Escenas

- order: {nn}
  slug: {slug}
  title: {Título}
  file: escenas/escena-{nn}-{slug}.md
  status: {draft|complete}

## Estado

synopsis: {draft|complete}
structure: {draft|complete}
characters: {n}/{total}
locations: {n}/{total}
scenes: {n}/{total}
can_generate: {true|false}
```

---

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# {Título}` | Heading H1 | ✅ | Título del proyecto tal como lo ve el usuario |
| `slug` | string | ✅ | Identificador único de carpeta. Lowercase, sin tildes, espacios → guiones |
| `genre` | string | ✅ | Género principal (Drama, Comedia, Terror…) |
| `tone` | string (lista separada por comas) | ✅ | Uno o varios tonos (Serio, Íntimo, Épico…) |
| `phase` | integer (1\|2\|3) | ✅ | Fase actual del proyecto |
| `created` | date YYYY-MM-DD | ✅ | Fecha de creación — se escribe una vez, nunca se modifica |
| `updated` | date YYYY-MM-DD | ✅ | Fecha de última modificación — actualizado automáticamente |
| `## Visión de autor` | texto libre | ✅ | Campo clave. Descripción libre de la obra: intenciones, referencias cinematográficas, valores narrativos, tono deseado. La IA la usa como brújula de coherencia para todo el proyecto |
| `synopsis` (en Documentos) | ruta relativa | ✅ | Siempre `sinopsis.md` |
| `structure` (en Documentos) | ruta relativa | ✅ | Siempre `estructura.md` |
| Entrada en `## Personajes` | objeto | ❌ opcional | Una entrada por personaje. Se añade automáticamente al crear un bloque de tipo Personaje |
| Entrada en `## Escenarios` | objeto | ❌ opcional | Una entrada por escenario |
| Entrada en `## Escenas` | objeto | ❌ opcional | Una entrada por escena, con `order` para mantener el orden |
| `## Estado` | campos calculados | ✅ | Calculado automáticamente por la app. `can_generate: true` cuando todas las condiciones mínimas se cumplen |

---

## 2. Ejemplo real completo — "El último tren"

```markdown
# El último tren

slug: el-ultimo-tren
genre: Drama
tone: Serio, Íntimo, Melancólico
phase: 1
created: 2026-09-01
updated: 2026-09-01

## Visión de autor

Una historia sobre la memoria y la identidad. Quiero un tono melancólico, referencias
a Tarkovsky y Bergman. El protagonista no es un héroe — es un hombre ordinario
enfrentado a una decisión imposible. La estética debe ser sobria, casi documental.
Sin música extradiegética. La luz natural como personaje.

## Documentos

synopsis: sinopsis.md
structure: estructura.md

## Personajes

- slug: marco
  name: Marco
  role: protagonista
  file: personajes/marco.md
  image: personajes/marco-referencia.png
  status: complete

- slug: elena
  name: Elena
  role: antagonista
  file: personajes/elena.md
  image: personajes/elena-referencia.png
  status: draft

## Escenarios

- slug: estacion-central
  name: Estación central
  file: escenarios/estacion-central.md
  image: escenarios/estacion-central-referencia.png
  status: complete

- slug: apartamento-marco
  name: Apartamento de Marco
  file: escenarios/apartamento-marco.md
  image: escenarios/apartamento-marco-referencia.png
  status: draft

## Escenas

- order: 01
  slug: el-encuentro
  title: El encuentro
  file: escenas/escena-01-el-encuentro.md
  status: complete

- order: 02
  slug: la-decision
  title: La decisión
  file: escenas/escena-02-la-decision.md
  status: draft

## Estado

synopsis: complete
structure: draft
characters: 1/2
locations: 1/2
scenes: 1/2
can_generate: false
```

---

## 3. Reglas de actualización automática

| Evento | Campos que actualiza la app |
|--------|----------------------------|
| Crear proyecto | Crea `project.md` con todos los campos de metadatos. `phase: 1`. `## Estado` todo en `draft` |
| Guardar bloque de Sinopsis | `synopsis: complete` en `## Estado` · `updated` |
| Guardar bloque de Estructura | `structure: complete` en `## Estado` · `updated` |
| Añadir bloque Personaje | Nueva entrada en `## Personajes` con `status: draft` · `updated` |
| Completar bloque Personaje (todos los campos obligatorios) | `status: complete` en la entrada del personaje · recalcula `characters: n/total` · `updated` |
| Generar imagen de referencia de personaje/escenario | Actualiza `image:` en la entrada correspondiente · `updated` |
| Añadir escena | Nueva entrada en `## Escenas` con `order` correlativo · `updated` |
| Reordenar escenas | Actualiza todos los valores `order:` · `updated` |
| Eliminar personaje/escenario/escena | Elimina la entrada correspondiente · recalcula contadores · `updated` |
| Cambiar de fase (usuario pulsa Generar Storyboard) | `phase: 2` · `updated` |
| Recalcular `can_generate` | Se evalúa tras cualquier cambio: `true` si synopsis complete + al menos 1 personaje con role protagonista + al menos 1 escenario + al menos 2 escenas, todos en status complete |

---

## 4. Qué carga la IA según la operación

| Operación | Ficheros que carga la IA | Motivo |
|-----------|--------------------------|--------|
| Feedback de cualquier bloque (botón Ayúdame) | `project.md` + fichero del bloque activo | Necesita la visión de autor y el contexto del bloque |
| Feedback de bloque Personaje | `project.md` + `sinopsis.md` + `personajes/{slug}.md` | Contrasta con el género, tono y sinopsis |
| Feedback de bloque Escenario | `project.md` + `sinopsis.md` + `escenarios/{slug}.md` | Ídem |
| Feedback de bloque Escena | `project.md` + `sinopsis.md` + `escenas/{slug}.md` + `.md` de personajes y escenarios referenciados en la escena | Necesita contexto completo de la escena |
| Verificar texto antes de generar imagen (personaje) | `project.md` + `sinopsis.md` + `personajes/{slug}.md` | Evalúa si la descripción es suficientemente visual |
| Verificar texto antes de generar imagen (escenario) | `project.md` + `sinopsis.md` + `escenarios/{slug}.md` | Ídem |
| Verificación de coherencia global | `project.md` + todos los `.md` del proyecto | Solo cuando el usuario lo solicita explícitamente |

---

## 5. Notas de implementación para el parser

- El fichero usa **Markdown con campos clave-valor simples** (`clave: valor`) fuera de los headings — no es YAML frontmatter, es texto plano con convención propia
- Los campos de primer nivel (`slug:`, `genre:`, etc.) van entre el H1 y el primer H2
- Las listas bajo `## Personajes`, `## Escenarios` y `## Escenas` usan sintaxis de lista Markdown con sub-campos indentados
- El parser debe leer línea a línea: detectar H1 como título, detectar `clave: valor` como metadato, detectar `## Sección` para cambiar de contexto
- El campo `## Visión de autor` es texto libre multilínea hasta el siguiente H2
- Todos los valores son strings. `phase`, `order` y los contadores en `## Estado` son los únicos campos que se tratan como números
