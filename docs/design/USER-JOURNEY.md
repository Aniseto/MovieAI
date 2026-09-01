# USER-JOURNEY.md — MovieAI

**Versión:** 1.0  
**Fecha:** 2026-09-01  
**Autor:** Jarvis  
**Issue:** #38  
**Estado:** PROPOSED — pendiente de aprobación por Jordi

---

## Principios de diseño

- **App 100% web** — no hay cliente de escritorio
- **Editor de bloques libre** — el autor añade lo que quiera, cuando quiera
- **IA orientativa, nunca bloqueante** — las sugerencias se pueden ignorar
- **Imagen por bloque** — cada bloque visual puede generar su propia imagen de referencia
- **Escenas como unidad de producción** — estructura separada del editor libre; son las que generan paneles de storyboard
- **Persistencia en Markdown** — sin base de datos; ficheros de texto plano

---

## Flujo 1 — Primera vez: crear un proyecto

### 1.1 El usuario abre MovieAI

**Pantalla:** Lista de proyectos (estado vacío)

```
┌────────────────────────────────────────────────┐
│  🎬 MovieAI                                    │
│                                                │
│         No tienes proyectos todavía.           │
│         Empieza escribiendo tu historia.       │
│                                                │
│              [ + Nueva película ]              │
│                                                │
└────────────────────────────────────────────────┘
```

**Sistema:** muestra estado vacío con CTA central.

---

### 1.2 El usuario pulsa "+ Nueva película"

**Pantalla:** Modal de creación de proyecto

```
┌────────────────────────────────────┐
│  Nueva película                    │
│                                    │
│  Título *                          │
│  ┌──────────────────────────────┐  │
│  │ El último tren               │  │
│  └──────────────────────────────┘  │
│                                    │
│  Género *                          │
│  [Drama] [Comedia] [Terror] ...    │
│                                    │
│  Tono * (puedes elegir varios)     │
│  [Serio] [Íntimo] [Épico] ...      │
│                                    │
│  Visión de autor *                 │
│  ┌──────────────────────────────┐  │
│  │ Una historia sobre la        │  │
│  │ memoria y la identidad.      │  │
│  │ Quiero un tono melancólico,  │  │
│  │ referencias a Tarkovsky...   │  │
│  └──────────────────────────────┘  │
│  (La IA usará esto como brújula    │
│   para detectar incoherencias)     │
│                                    │
│  [ Cancelar ]  [ Crear proyecto ]  │
└────────────────────────────────────┘
```

**Sistema:** crea la carpeta `projects/{slug}/` y el fichero `project.md` con los datos introducidos.

---

### 1.3 El usuario entra al editor

**Pantalla:** Editor de bloques — proyecto nuevo vacío

```
┌─────────────────────────────────────────┬──────────────────┐
│  🎬 El último tren          [Guardar]   │                  │
│  Drama · Serio · Íntimo                 │   Sin imagen     │
│                          [🎬 Generar ▸] │   seleccionada   │
├─────────────────────────────────────────┤                  │
│                                         │  Selecciona un   │
│  Empieza añadiendo bloques a tu         │  bloque con 🖼   │
│  proyecto. No hay orden obligatorio.    │  para ver la     │
│                                         │  imagen aquí.    │
│  [ + Añadir bloque ]                    │                  │
│                                         │                  │
└─────────────────────────────────────────┴──────────────────┘
```

**Sistema:** el botón "Generar ▸" está deshabilitado hasta que existan al menos 2 escenas.

---

## Flujo 2 — Construir el proyecto con bloques

### 2.1 El usuario añade un bloque

Al pulsar "+ Añadir bloque" aparece un selector:

```
┌─────────────────────────────┐
│  ¿Qué quieres añadir?       │
│                             │
│  📝 Sinopsis / descripción  │
│  👤 Personaje               │
│  🏛️  Escenario               │
│  🎭 Acción                  │
│  💬 Diálogo                 │
│  🗒️  Nota del autor          │
│  🎬 Ir a Escenas →          │
└─────────────────────────────┘
```

---

### 2.2 Bloque sin imagen (ej. Sinopsis)

```
┌─────────────────────────────────────────┐
│  📝 Sinopsis                   [IA] [×] │
│  ┌───────────────────────────────────┐  │
│  │ Un hombre que perdió su memoria   │  │
│  │ llega a una estación abandonada   │  │
│  │ y debe decidir si subirse al tren │  │
│  │ que le llevará de vuelta...       │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

- `[IA]` — valida coherencia con la visión de autor y otros bloques
- `[×]` — eliminar bloque (con confirmación si hay contenido)

---

### 2.3 Bloque con imagen (ej. Personaje)

```
┌─────────────────────────────────────────┐
│  👤 Personaje                  [IA] [🖼] [×] │
│  ┌───────────────────────────────────┐  │
│  │ Marco, 45 años. Alto, pelo canoso │  │
│  │ gabardina beige desgastada.       │  │
│  │ Reservado, melancólico.           │  │
│  │ Busca recuperar su identidad.     │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

Al pulsar `[🖼]`:
1. La IA verifica que el texto tiene suficiente detalle visual
2. Si pasa → lanza ComfyUI → imagen aparece en el panel lateral derecho
3. Si no pasa → sugerencias orientativas (el usuario puede forzar la generación igualmente)

**Panel lateral al generar:**
```
┌──────────────────┐
│  👤 Marco        │
│  ┌────────────┐  │
│  │  [imagen   │  │
│  │   B&N      │  │
│  │   boceto]  │  │
│  └────────────┘  │
│  Generada: hoy   │
│  [Regenerar]     │
│  [✓ Validar]     │
└──────────────────┘
```

---

### 2.4 Feedback de IA al pulsar `[IA]`

La IA carga: `project.md` + bloque actual + bloques relacionados del mismo proyecto.

```
┌─────────────────────────────────────────┐
│  📝 Sinopsis                   [IA] [×] │
│  ┌───────────────────────────────────┐  │
│  │ Un hombre que perdió su memoria...│  │
│  └───────────────────────────────────┘  │
│                                         │
│  💡 Sugerencia de IA:                   │
│  El tono melancólico que describes en   │
│  la visión de autor encaja bien. Sin    │
│  embargo, "debe decidir" es vago —      │
│  ¿cuál es la consecuencia concreta      │
│  de cada opción?                        │
│                          [Entendido]    │
└─────────────────────────────────────────┘
```

---

### 2.5 Aviso de incoherencia global

Cuando el usuario lleva varios bloques, la IA puede detectar incoherencias entre ellos:

```
┌─────────────────────────────────────────┐
│  ⚠️  La IA ha detectado una posible      │
│  incoherencia:                          │
│                                         │
│  El personaje "Elena" se describe como  │
│  antagonista en el bloque de personaje, │
│  pero en la Escena 03 aparece ayudando  │
│  al protagonista sin explicación.       │
│                          [Ver detalle]  │
│                          [Ignorar]      │
└─────────────────────────────────────────┘
```

---

## Flujo 3 — Gestión de Escenas

Las escenas son una sección separada del editor libre. Se accede desde el menú lateral o desde el selector de bloques ("🎬 Ir a Escenas →").

### 3.1 Vista de escenas

```
┌─────────────────────────────────────────┬──────────────────┐
│  🎬 El último tren  › Escenas           │                  │
│                         [+ Nueva escena]│                  │
├─────────────────────────────────────────┤                  │
│                                         │                  │
│  01 — El encuentro              [editar]│                  │
│  02 — La decisión               [editar]│                  │
│  03 — El último andén           [editar]│                  │
│                                         │                  │
└─────────────────────────────────────────┴──────────────────┘
```

### 3.2 Editor de escena individual

Cada escena tiene **estructura mínima** + **bloques libres internos**:

```
┌─────────────────────────────────────────┐
│  Escena 01 — El encuentro               │
│                                         │
│  Escenario: [Estación central ▾]        │
│  Momento:   [Noche ▾]                   │
│  Personajes: [Marco ×] [Elena ×] [+]    │
│                                         │
│  ── Bloques de la escena ──────────     │
│                                         │
│  🎭 Acción                    [IA] [🖼] │
│  Marco entra en la estación vacía...    │
│                                         │
│  💬 Diálogo                   [IA]      │
│  MARCO: ¿Quién eres tú?                 │
│  ELENA: La pregunta correcta es...      │
│                                         │
│  [ + Añadir bloque a esta escena ]      │
│                                         │
│  [🖼 Generar panel de storyboard]       │
└─────────────────────────────────────────┘
```

---

## Flujo 4 — Generar Storyboard (entrada a Fase 2)

### 4.1 Condición de desbloqueo

El botón `[🎬 Generar ▸]` se habilita cuando:
- Existe al menos 1 bloque en el editor libre (proyecto tiene contenido)
- Existen al menos 2 escenas con escenario, momento y al menos 1 personaje asignados

### 4.2 Confirmación antes de generar

```
┌─────────────────────────────────────────┐
│  🎬 Generar Storyboard                  │
│                                         │
│  Se generarán paneles en baja calidad   │
│  (boceto B&N) para:                     │
│                                         │
│  · 3 escenas                            │
│  · ~9 paneles estimados                 │
│                                         │
│  Podrás seguir editando el proyecto     │
│  mientras se genera. Los cambios        │
│  posteriores requerirán regenerar los   │
│  paneles afectados.                     │
│                                         │
│  [ Cancelar ]  [ Generar ]              │
└─────────────────────────────────────────┘
```

### 4.3 Generación en tiempo real (Fase 2)

El usuario va a la vista de Fase 2. Los paneles aparecen uno a uno:

```
┌─────────────────────────────────────────┐
│  Escena 01 — El encuentro               │
│                                         │
│  ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ Panel 1  │ │ Panel 2  │ │  ...   │  │
│  │ [imagen] │ │ ⏳ genera │ │        │  │
│  │ [✓] [✗] │ │          │ │        │  │
│  └──────────┘ └──────────┘ └────────┘  │
│                                         │
│  Escena 02 — La decisión                │
│  ┌──────────┐                           │
│  │ ⏳ espera│                           │
│  └──────────┘                           │
└─────────────────────────────────────────┘
```

---

## Flujo 5 — Volver a un proyecto existente

### 5.1 Pantalla de inicio con proyectos

```
┌────────────────────────────────────────────────┐
│  🎬 MovieAI                  [ + Nueva película]│
│                                                │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ El último    │  │ La ciudad    │            │
│  │ tren         │  │ olvidada     │            │
│  │ Drama        │  │ Sci-Fi       │            │
│  │ Fase 1 · 80% │  │ Fase 2 · 3/5 │            │
│  │ [Continuar]  │  │ escenas ✓    │            │
│  └──────────────┘  │ [Continuar]  │            │
│                    └──────────────┘            │
└────────────────────────────────────────────────┘
```

Cada tarjeta muestra: título, género, fase actual, progreso resumido.

---

## Flujo 6 — Editar después de avanzar a Fase 2

### 6.1 El usuario quiere modificar un bloque de Fase 1

Desde Fase 2, hay un botón "← Editar proyecto" que vuelve al editor libre. El usuario puede modificar cualquier bloque libremente.

**Si modifica un bloque que ya tiene imagen generada:**
```
⚠️ Has modificado la descripción de Marco.
   La imagen de referencia puede no ser coherente.
   [Regenerar imagen]  [Mantener imagen actual]
```

**Si modifica un personaje o escenario referenciado en escenas:**
```
⚠️ Marco aparece en 3 escenas con paneles generados.
   Los cambios pueden afectar la coherencia visual.
   [Ver paneles afectados]  [Continuar igualmente]
```

### 6.2 El usuario elimina un personaje referenciado en escenas

```
⚠️ Marco está asignado a 3 escenas:
   · Escena 01 — El encuentro
   · Escena 02 — La decisión
   · Escena 03 — El último andén

   Si eliminas este personaje, se eliminará
   de esas escenas. Los paneles ya generados
   no se modifican automáticamente.

   [ Cancelar ]  [ Eliminar igualmente ]
```

---

## Flujo 7 — Errores y casos límite

| Situación | Lo que ve el usuario |
|-----------|---------------------|
| ComfyUI no disponible al generar imagen | "No se puede conectar con el motor de imágenes. Comprueba que ComfyUI está activo en Dragon." + [Reintentar] |
| IA local no responde al pulsar [IA] | "El asistente no está disponible ahora. Puedes continuar sin validación." (timeout 10s) |
| El usuario cierra el navegador con cambios sin guardar | Guardado automático cada 1s de inactividad — al reabrir, los cambios están |
| Fichero `.md` corrupto o ilegible | "No se pudo cargar este bloque. El fichero puede estar dañado." + ruta del fichero |
| Generación de storyboard interrumpida a mitad | Los paneles ya generados se conservan. Al retomar, continúa desde el último panel pendiente |

---

## Pantallas identificadas

| Pantalla | Cubierta por issue |
|----------|--------------------|
| Lista de proyectos (vacía y con proyectos) | ⚠️ No tiene issue — nuevo issue necesario |
| Modal de creación de proyecto | ⚠️ No tiene issue — nuevo issue necesario |
| Editor de bloques libre | ⚠️ Reemplaza el diseño anterior de T-03 a T-08 |
| Selector de tipo de bloque | ⚠️ No tiene issue específico |
| Panel lateral de imagen | ⚠️ No tiene issue específico |
| Vista de escenas (lista) | ⚠️ Parcialmente en T-08 — revisar |
| Editor de escena individual | ⚠️ Parcialmente en T-08 — revisar |
| Confirmación de generación | ⚠️ En T-09 — revisar |
| Vista de Fase 2 (storyboard en tiempo real) | ❌ Fuera de scope Fase 1 |

---

## Decisiones de UX pendientes

| # | Pregunta | Impacto |
|---|----------|---------|
| D1 | ¿Los bloques tienen orden fijo (drag & drop para reordenar) o el orden es el de creación? | UX del editor |
| D2 | ¿El editor libre y las escenas son tabs del mismo layout o pantallas separadas? | Navegación global |
| D3 | ¿Hay límite de bloques por proyecto? | Rendimiento con muchos bloques |
| D4 | ¿Los bloques de tipo "Diálogo" y "Acción" en el editor libre son diferentes a los de dentro de una escena, o son el mismo componente? | Arquitectura de componentes |

---

## Gaps detectados respecto a issues actuales

Los issues T-03 a T-08 fueron diseñados para un formulario de 5 secciones fijas. Con el nuevo concepto de editor de bloques, **necesitan ser revisados o reemplazados**:

| Issue | Estado | Acción recomendada |
|-------|--------|--------------------|
| T-01 (#27) | ✅ Válido | Mantener — estructura de ficheros sigue igual |
| T-02 (#28) | ✅ Válido | Mantener — API de persistencia sigue siendo necesaria |
| T-03 (#29) | 🔄 Revisar | El layout cambia: editor de bloques + panel lateral |
| T-04 (#30) | 🔄 Revisar | Sinopsis pasa a ser un tipo de bloque, no una sección |
| T-05 (#31) | 🔄 Revisar | Personaje pasa a ser un tipo de bloque |
| T-06 (#32) | 🔄 Revisar | Escenario pasa a ser un tipo de bloque |
| T-07 (#33) | 🔄 Revisar | Estructura narrativa pasa a ser un tipo de bloque |
| T-08 (#34) | 🔄 Revisar | Escenas tienen su propio editor con bloques internos |
| T-09 (#35) | ✅ Válido | Lógica de desbloqueo del botón Generar — condición cambia ligeramente |
| T-10 (#36) | ✅ Válido | Feedback IA por bloque — concepto se mantiene |
| T-11 (#37) | ✅ Válido | Generación de imágenes — concepto se mantiene |
| — | ❌ Falta | Nueva pantalla: lista de proyectos + creación |
| — | ❌ Falta | Nueva tarea: editor de bloques libre (core de la app) |
| — | ❌ Falta | Nueva tarea: panel lateral de imagen |
| — | ❌ Falta | Nueva tarea: editor de escena individual con bloques internos |
