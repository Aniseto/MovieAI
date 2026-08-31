# Investigación: Movie Master 3.09 — Funcionalidades clave para guionistas
**Issue:** #7  
**Fecha:** 2026-08-31

---

## 1. Contexto y por qué importa

Movie Master 3.09 es un software de escritura de guiones para MS-DOS desarrollado en los años 80/90. Eric Roth (Oscar por Forrest Gump, Munich, Benjamin Button) lo usó para escribir el guión de **Dune (2021)** — una película de $165M presupuesto, escrita en un programa de DOS de hace 30+ años.

En una entrevista de 2014 Roth explicó: *"Trabajo con un programa de ordenador antiguo que ya no existe. Es mitad superstición y mitad miedo al cambio."* En 2020 seguía usándolo. En vídeo se le ve arrancando Movie Master 3.09 en una ventana DOS dentro de Windows XP, con un teclado mecánico beige de los 80.

**Su sucesor directo:** Hollywood Screenplay para Windows usó el código fuente de Movie Master añadiendo mejoras. Más tarde evolucionó a Movie Magic Screenwriter (Write Brothers, Inc.), que sigue existiendo hoy.

---

## 2. Características técnicas documentadas

### Formato de archivo
- Extensión propietaria: **`.scr`** (Movie Master Screenplay Data)
- Formato binario propio, no legible por otros programas directamente
- **Sin exportación a PDF o FDX** — la única salida era la impresora directa o texto plano
- Roth confirma: *"Tengo que darles una copia impresa. Tienen que escanearla y meterla en sus ordenadores"*
- **Limitación de 40 páginas por archivo** — Roth la convirtió en ventaja estructural: *"Me gusta porque me crea actos. Si no lo he dicho en 40 páginas, es que tengo un problema"*

### Interfaz
- Interfaz de texto pura (TUI), sin ratón
- Menú mínimo accesible por teclas de función (F1-F10)
- Sin sidebar, sin toolbar, sin paneles — pantalla completa de texto
- Velocidad de arranque: segundos desde DOS
- Sin acceso a internet posible por diseño

### Elementos de guión implementados
Basado en el sucesor directo (Hollywood Screenplay / Movie Magic Screenwriter) que heredó el mismo modelo:

| Elemento | Comportamiento |
|----------|---------------|
| **Scene Heading (Slug Line)** | MAYÚSCULAS, margen izquierdo. Detecta INT./EXT. automáticamente |
| **Action** | Texto normal, margen izquierdo. El elemento por defecto |
| **Character** | MAYÚSCULAS, centrado. Aparece antes del diálogo |
| **Dialogue** | Normal, margen central estrecho (~3.5" desde izquierda) |
| **Parenthetical** | Entre paréntesis, cursiva, centrado bajo el personaje |
| **Transition** | MAYÚSCULAS, margen derecho (CORTE A:, FUNDIDO A:) |

### Flujo de teclado (Tab/Enter)
El sistema Tab/Enter es el corazón del software — heredado y documentado en Movie Magic Screenwriter:

```
[Action]     → Tab  → [Character]
[Character]  → Enter → [Dialogue]
[Dialogue]   → Enter → [Action]
[Dialogue]   → Tab  → [Parenthetical]
[Action]     → Enter en línea vacía → [Scene Heading]
[Transition] → Enter → [Scene Heading]
```

- **Tab** sube en la jerarquía (Action → Character, Character → Parenthetical)
- **Enter** baja o continúa (Character → Dialogue, Dialogue → Action)
- **Enter en línea vacía de Action** → nueva Scene Heading
- **Detección automática de INT./EXT.**: al escribir "int." o "ext." en una línea de Action se convierte automáticamente a Scene Heading en mayúsculas

### Autocompletado
- **Nombres de personajes**: al empezar a escribir en elemento Character, sugiere personajes ya usados en el guión
- **Scene Headings**: sugiere localizaciones ya usadas (INT. COMISARÍA, INT. CASA...)
- Sin autocompletado de diálogos ni acciones

---

## 3. Por qué guionistas profesionales lo siguen usando

### Razones documentadas (Roth y equivalentes)

1. **Foco absoluto**: sin internet, sin notificaciones, sin menús que distraigan. La única cosa posible es escribir.

2. **El límite de 40 páginas como herramienta estructural**: fuerza a dividir el guión en actos naturales. Roth lo describe como una ventaja, no una limitación.

3. **Velocidad de flujo**: Tab/Enter sin ratón permite que los dedos nunca abandonen el teclado. El formato ocurre solo, el escritor solo piensa en la historia.

4. **Familiaridad muscular**: después de 20-30 años usando el mismo software, los atajos son reflejos, no decisiones.

5. **Sin lock-in de features**: no hay tentación de usar colaboración en tiempo real, comentarios, versiones, estadísticas. Hay solo texto.

### Comparativa con escritores equivalentes
- **George RR Martin**: usa WordStar para DOS para escribir los libros de Juego de Tronos — misma filosofía, mismo período
- Ambos describen el software antiguo como liberador, no limitante

---

## 4. Lo que el software moderno ha perdido

| Característica | Movie Master | Software moderno |
|----------------|-------------|-----------------|
| Arranque instantáneo | ✅ Segundos | ❌ 5-15 segundos + splash |
| Sin distracciones | ✅ Imposible distraerse | ❌ Notificaciones, colaboración, stats |
| Foco en teclado | ✅ 100% teclado | ⚠️ Ratón necesario para muchas acciones |
| Límite estructural | ✅ 40 páginas/acto | ❌ Ilimitado (puede ser malo) |
| Velocidad de formato | ✅ Instantáneo, invisible | ⚠️ A veces visible, a veces lento |
| Sin internet | ✅ Imposible conectar | ❌ Siempre conectado |

---

## 5. Conclusiones para MovieAI — Qué replicar exactamente en ProseMirror

### Replicar obligatoriamente en MVP

1. **Ciclo Tab/Enter estándar** (documentado arriba) — sin desviaciones
2. **Detección automática INT./EXT.** — regex en InputRules, conversión instantánea a Scene Heading
3. **Autocompletado de personajes** — lista de personajes ya usados en el guión, sugerencia al escribir en elemento Character
4. **Autocompletado de localizaciones** — lista de Scene Headings ya usadas
5. **Pantalla completa de escritura** — sin sidebar, sin panel lateral, solo el texto
6. **MAYÚSCULAS automáticas** en Scene Heading, Character y Transition — sin que el usuario tenga que activar Caps Lock

### Adaptar al contexto web (mejoras justificadas)

7. **Sin límite de 40 páginas** — pero mostrar contador de páginas prominente para mantener consciencia estructural
8. **Guardado automático** en lugar de guardado manual — el contexto web lo exige
9. **Exportación a PDF y .fountain** — Movie Master no podía; es una mejora necesaria

### No replicar

- La limitación de memoria/40 páginas como restricción técnica (solo como indicador visual)
- La interfaz de texto pura TUI — usamos web, pero mantenemos la filosofía de foco
- La falta de exportación — en 2026 es inaceptable
