# ADR-005 — Flujo de producción en tres fases: definición → validación → producción

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Decisión

MovieAI sigue un flujo de producción en **tres fases secuenciales** inspirado en el proceso real de producción cinematográfica. No se puede avanzar a la siguiente fase sin completar y validar la anterior.

---

## Las tres fases

### FASE 1 — Definición (Pre-producción)
*"Escribe bien antes de generar nada."*

El usuario completa una serie de documentos de proyecto antes de que se genere ninguna imagen. La IA guía y da feedback en cada punto.

**Documentos obligatorios mínimos:**

```
1. SINOPSIS
   - Título del proyecto
   - Género (drama, comedia, terror, fantasía...)
   - Logline: una frase que resume la historia
   - Sinopsis corta: 3-5 líneas
   - Tono: serio, humorístico, épico, íntimo...

2. PERSONAJES
   Por cada personaje:
   - Nombre
   - Edad y aspecto físico (descripción detallada)
   - Personalidad y motivación
   - Rol en la historia (protagonista, antagonista, secundario)
   - Imagen de referencia (opcional: foto real o descripción)

3. ESCENARIOS / LOCALIZACIONES
   Por cada escenario:
   - Nombre
   - Descripción detallada (interior/exterior, época, estado)
   - Atmósfera y iluminación (soleado, nocturno, tenebroso...)
   - Elementos clave presentes

4. ESTRUCTURA NARRATIVA
   - Acto 1 — Planteamiento: presentación de personajes y situación
   - Punto de giro 1: qué cambia
   - Acto 2 — Nudo: conflicto principal, desarrollo
   - Punto de giro 2: momento de máxima tensión
   - Acto 3 — Desenlace: resolución

5. ESCENAS
   Por cada escena:
   - Número y título
   - Localización (referencia a escenario definido)
   - Personajes presentes (referencia a personajes definidos)
   - Momento del día / iluminación
   - Acción principal: qué ocurre
   - Diálogos clave
   - Emoción de la escena: qué debe sentir el espectador
   - Duración estimada (segundos)
```

**La IA actúa como editor:** revisa cada documento y da feedback antes de marcarlo como completo. No se puede pasar a Fase 2 hasta que todos los documentos estén completos y validados.

---

### FASE 2 — Storyboard en baja calidad (Validación)
*"Valida barato antes de producir caro."*

Con todos los documentos de Fase 1 completados, MovieAI genera el storyboard en **baja calidad / boceto rápido**.

**Características de esta fase:**
- Imágenes en **blanco y negro, resolución baja (512px)**, generación rápida
- Estilo: boceto muy suelto, líneas simples — suficiente para validar composición y acción
- Diálogos escritos integrados en el panel
- **Generación rápida y barata** (segundos por panel, mínimo VRAM)
- El usuario puede:
  - ✅ Aprobar el panel → pasa a producción
  - ✏️ Modificar el texto/prompt → regenerar ese panel
  - 🔄 Pedir variación → misma escena, diferente composición
  - ❌ Rechazar → redefinir la escena desde Fase 1

**Regla clave:** una escena no puede pasar a Fase 3 hasta que todos sus paneles estén aprobados en Fase 2.

**Propagación activa:** si se modifica un personaje o escenario durante la validación, todos los paneles de esa entidad se marcan como pendientes de regenerar (ADR-004).

---

### FASE 3 — Producción (Alta calidad + Animación)
*"Produce solo lo que ya está validado."*

Solo cuando una escena completa está aprobada en Fase 2, se genera en alta calidad y se anima.

**Subfase 3A — Imágenes de alta calidad:**
- Resolución alta (1024px+), mayor detalle del boceto
- Misma estética B&N lápiz pero con más definición
- Generación más lenta — se hace en cola, no en tiempo real
- El usuario puede ajustar detalles finos

**Subfase 3B — Animación:**
- Cada panel de alta calidad se anima con WAN 2.7
- Clip de 3-8 segundos por panel
- El usuario aprueba cada clip antes del montaje final

**Subfase 3C — Montaje final:**
- Todos los clips aprobados se montan en orden
- Añadir música/sonido (opcional, fase futura)
- Exportar como MP4 listo para compartir

---

## Diagrama del flujo completo

```
FASE 1 — DEFINICIÓN
┌─────────────────────────────────────────────┐
│  Sinopsis → Personajes → Escenarios         │
│  → Estructura → Escenas                     │
│  (IA da feedback en cada paso)              │
│  Estado: DRAFT → COMPLETO                   │
└──────────────────┬──────────────────────────┘
                   │ Todo completo y validado
                   ▼
FASE 2 — STORYBOARD BAJA CALIDAD
┌─────────────────────────────────────────────┐
│  Genera paneles B&N 512px rápidos           │
│  Usuario valida panel a panel               │
│  Modifica → Regenera → Aprueba             │
│  Estado: PENDIENTE → APROBADO              │
└──────────────────┬──────────────────────────┘
                   │ Escena completa aprobada
                   ▼
FASE 3A — IMÁGENES ALTA CALIDAD
┌─────────────────────────────────────────────┐
│  Regenera paneles aprobados en 1024px+      │
│  Más detalle, misma estética B&N            │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
FASE 3B — ANIMACIÓN
┌─────────────────────────────────────────────┐
│  WAN 2.7: imagen → clip 3-8s por panel      │
│  Usuario aprueba cada clip                  │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
FASE 3C — MONTAJE FINAL
┌─────────────────────────────────────────────┐
│  Clips ordenados → MP4 final                │
│  Exportar y compartir                       │
└─────────────────────────────────────────────┘
```

---

## Por qué este flujo es correcto

1. **Evita el desperdicio** — no se genera en alta calidad algo que luego se cambia
2. **Fuerza la reflexión** — el usuario piensa su historia antes de ver imágenes; las imágenes no reemplazan el pensamiento
3. **Validación progresiva** — cada fase tiene un criterio de salida claro
4. **Coste controlado** — la Fase 2 usa mínima VRAM y es casi instantánea; la Fase 3 es costosa pero solo se ejecuta una vez por escena aprobada
5. **Proceso profesional** — es exactamente cómo funciona la pre-producción real en cine y animación

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
