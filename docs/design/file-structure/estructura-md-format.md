# Formato de `estructura.md` — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Referencias:** DESIGN-010, project-md-format.md

---

## 1. Schema comentado

`estructura.md` define la estructura narrativa de 3 actos del proyecto. Es un documento de referencia que la IA consulta para verificar que las escenas respetan la progresión dramática acordada por el autor.

### Estructura del fichero

```
# {Título del proyecto} — Estructura narrativa

updated: {YYYY-MM-DD}

## Acto 1 — Planteamiento

{Texto libre. Presentación del protagonista, mundo y situación inicial.
¿Quién es el personaje? ¿Cuál es su vida antes de que todo cambie?}

## Punto de giro 1

{Texto libre. El evento que cambia el estado inicial de forma irreversible.
¿Qué ocurre que obliga al protagonista a actuar?}

## Acto 2 — Nudo

{Texto libre. El conflicto principal y su desarrollo.
¿Qué obstáculos enfrenta el protagonista? ¿Cómo evoluciona?}

## Punto de giro 2

{Texto libre. Momento de máxima tensión. Todo parece perdido.
¿Cuál es el momento más oscuro o la revelación más importante?}

## Acto 3 — Desenlace

{Texto libre. Resolución del conflicto principal.
¿Cómo termina la historia? ¿Qué cambia definitivamente?}
```

### Descripción de campos

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `# {Título} — Estructura narrativa` | Heading H1 | ✅ | Identifica el fichero de forma autocontenida |
| `updated` | date YYYY-MM-DD | ✅ | Actualizado automáticamente al guardar |
| `## Acto 1 — Planteamiento` | texto libre multilínea | ✅ | Presentación del mundo y el protagonista |
| `## Punto de giro 1` | texto libre multilínea | ✅ | Evento que desencadena el conflicto principal |
| `## Acto 2 — Nudo` | texto libre multilínea | ✅ | Desarrollo del conflicto |
| `## Punto de giro 2` | texto libre multilínea | ✅ | Clímax dramático — momento de máxima tensión |
| `## Acto 3 — Desenlace` | texto libre multilínea | ✅ | Resolución y cierre |

---

## 2. Ejemplo real completo — "El último tren"

```markdown
# El último tren — Estructura narrativa

updated: 2026-09-01

## Acto 1 — Planteamiento

Marco aparece en una estación de tren abandonada sin ningún recuerdo de quién es.
No tiene documentación, no recuerda su nombre. Solo lleva una gabardina desgastada
y un billete de tren con su nombre y la fecha de ese día. La estación parece llevar
años cerrada, pero hay señales de que alguien estuvo allí recientemente.

## Punto de giro 1

Marco encuentra una fotografía dentro de la taquilla de la estación: él mismo, varios
años más joven, junto a una mujer y un niño pequeño. Al dorso: una dirección y una
fecha. Hoy. Alguien le dejó esa fotografía para que la encontrara.

## Acto 2 — Nudo

Marco investiga la estación buscando más pistas. Encuentra a Elena, que le conoce pero
se niega a decirle quién es. A medida que recupera fragmentos de memoria, emerge una
verdad perturbadora: él mismo pidió que le borraran la memoria para proteger a alguien.
Cuanto más recuerda, más peligroso se vuelve el entorno — alguien no quiere que recupere
su identidad completa.

## Punto de giro 2

Marco descubre que Elena fue quien le borró la memoria, por encargo suyo. Y que la
persona a la que protegía está en el tren que llega en pocas horas. Si sube al tren
recuperará todo — pero también pondrá en peligro a quien protegía. Si se queda,
esa persona estará a salvo, pero Marco perderá su identidad para siempre.

## Acto 3 — Desenlace

Marco decide subirse al tren. No para recuperar su pasado, sino para cerrar el único
capítulo pendiente: decirle adiós a quien dejó atrás. El tren parte. La estación
queda vacía. Elena recoge la fotografía del suelo — Marco la dejó allí a propósito.
```

---

## 3. Reglas de actualización automática

| Evento | Acción sobre `estructura.md` |
|--------|------------------------------|
| Crear proyecto | Se crea el fichero con el H1 y todos los H2 vacíos |
| Guardar bloque de Estructura en el editor | Se sobreescribe el fichero completo con el nuevo contenido |
| El fichero se considera completo cuando | Todos los H2 tienen texto (longitud > 0) |

---

## 4. Notas de implementación para el parser

- El único campo clave-valor es `updated` — va entre el H1 y el primer H2
- Cada sección `## Heading` es texto libre multilínea hasta el siguiente H2
- Los headings de sección son fijos y siempre los mismos — el parser puede usarlos como anclas
- El fichero es autocontenido: el H1 incluye "— Estructura narrativa" para identificarlo sin ambigüedad
- Estado de completitud: `complete` si los 5 bloques tienen contenido; `draft` si alguno está vacío
