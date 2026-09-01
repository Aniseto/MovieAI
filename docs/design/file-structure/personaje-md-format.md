# Formato de `personajes/{slug}.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, project-md-format.md

---

## 1. Schema comentado

Cada personaje tiene su propio fichero en `personajes/{slug}.md`. Es un documento base — no referencia a otros ficheros. La IA lo carga junto a `project.md` y `sinopsis.md` para dar feedback de coherencia.

La imagen de referencia generada por ComfyUI se guarda como `personajes/{slug}-referencia.png` — en la misma carpeta, con el mismo slug.

### Estructura del fichero

```
# Personaje: {Nombre}

slug: {slug}
role: {protagonista|antagonista|secundario|otro}
age: {número}
updated: {YYYY-MM-DD}

## Aspecto físico

{Texto libre. Descripción visual detallada: altura, complexión, rasgos faciales,
color de pelo y ojos, forma de vestir, gestos característicos.
Debe ser suficientemente descriptivo para generar una imagen coherente en ComfyUI.}

## Personalidad

{Texto libre. Carácter, virtudes, defectos, forma de relacionarse con los demás.}

## Motivación

{Texto libre. Qué quiere este personaje. Qué le impulsa. Qué teme perder.}

## Imagen de referencia

image: personajes/{slug}-referencia.png
image_updated: {YYYY-MM-DD}
```

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# Personaje: {Nombre}` | Heading H1 | ✅ | Identifica el fichero de forma autocontenida |
| `slug` | string | ✅ | Debe coincidir con el nombre del fichero y la carpeta |
| `role` | enum | ✅ | `protagonista` · `antagonista` · `secundario` · `otro`. Solo puede haber un `protagonista` por proyecto |
| `age` | integer | ✅ | Edad del personaje |
| `updated` | date YYYY-MM-DD | ✅ | Actualizado automáticamente al guardar |
| `## Aspecto físico` | texto libre multilínea | ✅ | Campo clave para generación de imagen. Si es insuficiente, la IA avisará antes de generar |
| `## Personalidad` | texto libre multilínea | ✅ | Carácter y forma de relacionarse |
| `## Motivación` | texto libre multilínea | ✅ | Objetivo y motor dramático del personaje |
| `## Imagen de referencia` | sección con campos | ❌ opcional | Se añade automáticamente cuando se genera la imagen. Ausente si aún no se ha generado |
| `image` | ruta relativa | ❌ opcional | Ruta a la imagen PNG generada |
| `image_updated` | date YYYY-MM-DD | ❌ opcional | Fecha de última generación — si el aspecto físico cambia después de esta fecha, la app avisa |

---

## 2. Ejemplo real completo — personaje "Marco"

```markdown
# Personaje: Marco

slug: marco
role: protagonista
age: 45
updated: 2026-09-01

## Aspecto físico

Hombre de 45 años, complexión media-alta, ligeramente delgado. Pelo canoso, corto y
descuidado. Ojos grises, mirada perdida y cansada. Lleva una gabardina beige desgastada
sobre ropa oscura. Camina despacio, con los hombros ligeramente caídos. Tiene una
pequeña cicatriz sobre la ceja izquierda.

## Personalidad

Reservado y melancólico por naturaleza. No habla más de lo necesario. Cuando algo le
preocupa lo rumia en silencio. Tiene un sentido del deber muy marcado — cuando decide
hacer algo, lo hace hasta el final. Desconfía de los demás por defecto, pero es leal
de forma incondicional con quien se gana su confianza.

## Motivación

Recuperar su identidad y entender qué ocurrió. No necesariamente volver a quien era,
sino saber quién es. En el fondo, lo que busca es cerrar el único capítulo que dejó
abierto: despedirse de la persona a la que dejó atrás.

## Imagen de referencia

image: personajes/marco-referencia.png
image_updated: 2026-09-01
```

---

## 3. Ejemplo — personaje sin imagen generada todavía

```markdown
# Personaje: Elena

slug: elena
role: antagonista
age: 38
updated: 2026-09-01

## Aspecto físico

Mujer de unos 38 años, pelo negro recogido, ropa oscura y funcional. Movimientos
precisos y controlados. Mirada directa, casi sin parpadear. Parece siempre estar
calculando algo.

## Personalidad

Fría en apariencia pero con una lealtad absoluta hacia sus principios. No miente —
simplemente omite. Tiene un código ético propio que no siempre coincide con el de los demás.

## Motivación

Proteger a Marco de sí mismo, aunque él no lo entienda así. Cumplir el encargo que
Marco le hizo, aunque hacerlo le cueste más de lo que esperaba.
```

_(La sección `## Imagen de referencia` está ausente — aún no se ha generado imagen)_

---

## 4. Reglas de actualización automática

| Evento | Acción sobre el fichero |
|--------|------------------------|
| Añadir bloque Personaje en el editor | Se crea el fichero con H1, campos de metadatos y los 3 H2 de contenido vacíos |
| Guardar cambios en el bloque Personaje | Se sobreescribe el fichero completo |
| Generar imagen de referencia | Se añade (o actualiza) la sección `## Imagen de referencia` con `image` e `image_updated` |
| Modificar `## Aspecto físico` después de generar imagen | La app detecta que `updated > image_updated` y muestra aviso: _"La descripción ha cambiado — ¿regenerar imagen?"_ |
| Eliminar personaje | Se elimina el fichero `.md` y el `.png` si existe. Se actualiza `project.md` |

---

## 5. Notas de implementación para el parser

- Los campos `slug`, `role`, `age`, `updated` van entre el H1 y el primer H2
- `role` tiene valores fijos — el parser debe validar que sea uno de los 4 valores permitidos
- Los H2 `## Aspecto físico`, `## Personalidad`, `## Motivación` son texto libre multilínea hasta el siguiente H2
- `## Imagen de referencia` puede estar ausente — el parser lo trata como opcional
- `image` e `image_updated` dentro de `## Imagen de referencia` siguen la convención `clave: valor`
- Completitud: el personaje está `complete` cuando los 3 bloques de contenido tienen texto y `role` está definido
- Validación de unicidad: si `role: protagonista`, verificar que no existe otro personaje con ese rol en el mismo proyecto (leyendo `project.md`)
