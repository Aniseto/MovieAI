# ADR-004 — Coherencia global: propagación automática de cambios entre paneles

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Decisión

Cualquier cambio en un elemento del storyboard (personaje, escenario, estilo visual, iluminación, objeto) **se propaga automáticamente a todos los paneles que contengan ese elemento**, manteniendo coherencia visual y narrativa en todo el proyecto.

---

## El problema que resuelve

Sin este sistema, el usuario modifica el personaje principal en el panel 3 y los paneles 1, 2, 4, 5... siguen con la versión antigua. El storyboard queda inconsistente y parece generado por partes inconexas. Eso rompe la ilusión de "película".

---

## Cómo funciona

### Modelo de datos: entidades con estado global

Cada proyecto tiene un **registro de entidades**:

```
Proyecto
├── Personajes
│   ├── Ana: [descripción visual, rasgos, ropa, expresión base]
│   ├── Marco: [descripción visual, rasgos, ropa, expresión base]
│   └── ...
├── Escenarios
│   ├── Bosque nocturno: [árboles, niebla, luna, paleta B&N]
│   ├── Casa abandonada: [ventanas rotas, polvo, oscuridad]
│   └── ...
├── Estilo global
│   ├── Estética: boceto lápiz B&N
│   ├── Grosor de línea: medio
│   ├── Sombreado: hatching suave
│   └── ...
└── Paneles
    ├── Panel 1: [ref: Ana, ref: Bosque nocturno, acción, diálogo]
    ├── Panel 2: [ref: Ana, ref: Marco, acción, diálogo]
    └── ...
```

Cada panel **referencia entidades**, no las copia. Cuando una entidad cambia, todos los paneles que la referencian saben que deben regenerarse.

---

## Flujo de propagación

```
Usuario modifica "Ana" → nuevo corte de pelo, abrigo rojo→azul
              ↓
Sistema detecta: paneles 1, 2, 4, 7, 9 contienen a "Ana"
              ↓
Notificación: "Ana ha cambiado. 5 paneles serán actualizados."
              ↓
Usuario confirma (o cancela)
              ↓
Sistema regenera los 5 paneles con la nueva definición de Ana
              ↓
Storyboard coherente en todo el proyecto
```

---

## Tipos de cambio y propagación

| Tipo de cambio | Propagación | Paneles afectados |
|----------------|-------------|-------------------|
| Aspecto de personaje | Automática tras confirmación | Todos los que contienen ese personaje |
| Escenario / localización | Automática tras confirmación | Todos los que usan ese escenario |
| Estilo visual global (B&N, grosor línea) | Automática, todos los paneles | Todo el storyboard |
| Iluminación de escena | Solo esa escena (grupo de paneles) | Paneles del mismo acto/escena |
| Diálogo / texto | Solo ese panel | 1 panel |
| Acción específica | Solo ese panel | 1 panel |

---

## Experiencia de usuario

### Notificación de propagación
```
┌─────────────────────────────────────────────────────┐
│  ⚡ Has modificado a "Ana"                           │
│                                                     │
│  Este cambio afecta a 5 paneles:                    │
│  Panel 1, 2, 4, 7, 9                               │
│                                                     │
│  ¿Actualizar todos?                                 │
│  [Actualizar todos]  [Solo este panel]  [Cancelar]  │
└─────────────────────────────────────────────────────┘
```

### Indicador de estado por panel
- 🟢 Panel coherente — actualizado
- 🟡 Panel pendiente — hay cambios sin propagar
- 🔄 Panel regenerando — en proceso

### Vista de entidades (panel lateral)
- Lista de todos los personajes y escenarios del proyecto
- Clic en cualquier entidad → ver todos los paneles donde aparece
- Editar la entidad desde aquí → propagación automática

---

## Implicaciones técnicas

- **Base de datos de entidades** por proyecto: JSON o SQLite local
- **Grafo de dependencias** panel ↔ entidad para saber qué regenerar
- **Cola de regeneración** para procesar múltiples paneles sin bloquear la UI
- **Versionado de entidades**: guardar historial de cambios por si el usuario quiere revertir
- **IP-Adapter / ControlNet** en ComfyUI para mantener consistencia visual del personaje al regenerar

---

## Por qué esto es el diferencial técnico más importante

Google Flow no hace esto. Boords no hace esto. Ninguna herramienta actual propaga cambios automáticamente entre paneles.

Un guionista que modifica el look de su protagonista a mitad del proceso no debería tener que regenerar manualmente cada panel. MovieAI lo hace por él. Eso es lo que convierte una colección de imágenes en un **storyboard coherente como una película**.

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
