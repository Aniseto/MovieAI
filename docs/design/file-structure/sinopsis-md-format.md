# Formato de `sinopsis.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, project-md-format.md

---

## 1. Schema comentado

`sinopsis.md` contiene los metadatos narrativos básicos del proyecto. Es el primer documento que lee la IA al dar feedback sobre cualquier elemento, ya que define el género, tono y logline que sirven de referencia para la coherencia global.

### Estructura del fichero

```
# {Título del proyecto}

title: {Título}
genre: {género}
tone: {tono1}, {tono2}
updated: {YYYY-MM-DD}

## Logline

{Una frase de 1-2 líneas que resume la historia: protagonista + conflicto + objetivo}

## Sinopsis

{3-5 líneas que desarrollan la premisa. Quién es el protagonista, qué ocurre, qué está en juego}
```

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# {Título}` | Heading H1 | ✅ | Título del proyecto — debe coincidir con el de `project.md` |
| `title` | string | ✅ | Repetición del título como campo clave-valor — hace el fichero autocontenido |
| `genre` | string | ✅ | Género principal (Drama, Comedia, Terror, Fantasía, Sci-Fi, Thriller…) |
| `tone` | string (lista separada por comas) | ✅ | Uno o varios tonos. Ej: `Serio, Íntimo, Melancólico` |
| `updated` | date YYYY-MM-DD | ✅ | Actualizado automáticamente al guardar |
| `## Logline` | texto libre (1-2 líneas) | ✅ | Resumen de la historia en una frase. Debe tener: protagonista, conflicto y objetivo |
| `## Sinopsis` | texto libre (3-5 líneas) | ✅ | Desarrollo de la premisa con contexto suficiente para que la IA entienda la historia |

---

## 2. Ejemplo real completo — "El último tren"

```markdown
# El último tren

title: El último tren
genre: Drama
tone: Serio, Íntimo, Melancólico
updated: 2026-09-01

## Logline

Un hombre sin memoria llega a una estación abandonada y debe decidir si subirse al tren
que le llevará de vuelta a su pasado, o quedarse y empezar de cero.

## Sinopsis

Marco, un hombre de 45 años, aparece en una estación de tren abandonada sin ningún recuerdo
de quién es. Encuentra un billete con su nombre y la fecha de ese día. Mientras investiga
la estación en busca de pistas, se encuentra con Elena, una mujer que parece conocerle pero
que le oculta algo. A medida que Marco recupera fragmentos de su memoria, descubre que su
pasado esconde una verdad que alguien preferiría que no recordara.
```

---

## 3. Reglas de actualización automática

| Evento | Acción sobre `sinopsis.md` |
|--------|---------------------------|
| Crear proyecto | Se crea el fichero con `title`, `genre`, `tone` del modal de creación. `## Logline` y `## Sinopsis` vacíos |
| Guardar bloque de Sinopsis en el editor | Se sobreescribe el fichero completo con los nuevos valores |
| Cambiar género o tono desde el editor | Se actualiza el campo correspondiente y `updated` |

---

## 4. Notas de implementación para el parser

- Los campos `title`, `genre`, `tone`, `updated` van entre el H1 y el primer H2
- `tone` es una string con valores separados por comas — el parser la convierte en array dividiendo por `, `
- `## Logline` es texto libre hasta el siguiente H2 — puede ser multilínea
- `## Sinopsis` es texto libre hasta el final del fichero (o hasta el siguiente H2 si lo hubiera)
- El fichero es autocontenido: puede leerse sin `project.md` y tiene sentido por sí solo
