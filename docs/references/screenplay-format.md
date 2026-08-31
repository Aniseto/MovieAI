# Formato de guión cinematográfico — Referencia técnica

**Fecha:** 2026-08-29
**Uso:** Referencia para el parser de Fountain y el editor de guión de MovieAI

---

## El estándar Master Scene Format

Es el formato estándar de Hollywood desde los años 40. Movie Master 3.09 lo implementaba íntegramente. Tiene 7 elementos con sintaxis fija.

---

## Los 7 elementos

### 1. Encabezado de escena (Scene Heading / Slug Line)

```
INT. CAFETERÍA - DÍA
EXT. BOSQUE OSCURO - NOCHE
INT./EXT. COCHE EN MOVIMIENTO - ATARDECER
```

- Siempre en MAYÚSCULAS
- Estructura: `INT/EXT. LUGAR - MOMENTO`
- `INT` = interior, `EXT` = exterior
- Momentos válidos: DÍA, NOCHE, AMANECER, ATARDECER, MÁS TARDE, CONTINUO

**Mapeo a storyboard:** escenario de referencia + iluminación del panel

---

### 2. Acción (Action / Description)

```
Marco entra despacio. Mira a su alrededor con desconfianza.
La lluvia golpea los cristales. Hay poca luz.
```

- Texto normal, margen izquierdo
- Siempre en presente ("entra", no "entró")
- Solo lo que la cámara VE y el micrófono OYE — sin pensamientos internos
- Máximo 3-4 líneas por bloque

**Mapeo a storyboard:** composición visual del panel, descripción de acción bajo el frame

---

### 3. Personaje (Character Cue)

```
                    MARCO
```

- MAYÚSCULAS, centrado
- Justo encima del diálogo
- Variantes:
  - `MARCO (V.O.)` — voz en off
  - `MARCO (O.S.)` — fuera de pantalla
  - `MARCO (CONT'D)` — continúa hablando tras una acción

**Mapeo a storyboard:** referencia al personaje definido en Fase 1

---

### 4. Diálogo (Dialogue)

```
                    MARCO
          No recuerdo nada. Ni mi nombre.
```

- Bloque estrecho, centrado bajo el nombre
- Directo, como habla la gente de verdad
- Sin adornos literarios

**Mapeo a storyboard:** bocadillo de texto integrado en el panel

---

### 5. Paréntesis (Parenthetical)

```
                    MARCO
               (mirando al suelo)
          No recuerdo nada.
```

- Entre el nombre y el diálogo
- Solo para aclaraciones de actuación imprescindibles
- Usarlos con moderación — el diálogo debe hablar por sí solo

**Mapeo a storyboard:** expresión facial / postura del personaje en el panel

---

### 6. Transición (Transition)

```
                                        CORTE A:
                                        FUNDIDO A NEGRO.
                                        DISOLVENCIA A:
```

- Alineado a la derecha
- El corte directo es el default implícito — no hace falta escribirlo
- Usarlos solo cuando la transición es narrativamente significativa

**Mapeo a storyboard:** separación visual entre paneles / indicador de cambio de escena

---

### 7. Nota de plano (Shot / Insert)

```
PRIMER PLANO — el reloj marca las 3:00 AM.
INSERTO — la carta dice "No vuelvas nunca".
```

- Para planos específicos narrativamente necesarios
- No abusar — el director decide los planos

**Mapeo a storyboard:** encuadre del panel (primer plano, plano general, etc.)

---

## Ejemplo completo

```fountain
INT. ESTACIÓN DE TREN - NOCHE

La sala de espera está casi vacía. Un fluorescente
parpadea. MARCO (45, gabardina mojada) entra y se
detiene en seco al ver el andén.

En el fondo, un tren antiguo espera con las puertas
abiertas. Nadie más lo ve.

                    MARCO
               (en voz baja)
          Esto no puede ser real.

Una MUJER MAYOR sentada cerca levanta la vista del
libro. Le mira como si fuera invisible.

                    MUJER MAYOR
          ¿Ha dicho algo?

Marco la mira. Traga saliva.

                    MARCO
          No. Nada.

Se gira hacia el tren. Ya no está.

                                        CORTE A:

EXT. CALLE MOJADA - NOCHE CONTINUA

Marco sale corriendo de la estación.
```

---

## Mapeo completo elemento → storyboard

| Elemento screenplay | Componente del panel |
|--------------------|----------------------|
| Encabezado de escena | Escenario + iluminación |
| Acción | Composición visual + leyenda inferior |
| Personaje + diálogo | Bocadillo de texto |
| Paréntesis | Expresión facial / postura |
| Transición | Separador entre paneles |
| Nota de plano | Encuadre del frame |

---

## Fountain — el formato digital equivalente

Fountain es el estándar abierto moderno equivalente al formato Master Scene. Es Markdown para guiones.

Reglas básicas:
- Encabezados: líneas que empiezan por `INT.`, `EXT.`, `INT./EXT.`
- Personajes: líneas en MAYÚSCULAS solas
- Paréntesis: entre paréntesis `(así)`
- Transiciones: líneas en MAYÚSCULAS que terminan en `:` o `TO:`
- Todo lo demás: acción

Librerías de parseo:
- JavaScript: `fountain` (npm) — https://www.npmjs.com/package/fountain
- Python: `fountain-parser` (PyPI)

---

## Reglas de estilo para MovieAI

1. El editor aplica el formato automáticamente por contexto (TAB para avanzar entre elementos)
2. El LLM que genera prompts de storyboard lee cada elemento y lo convierte en descripción visual
3. Los diálogos siempre van como bocadillos en el panel — nunca se omiten
4. La acción determina la composición del panel (plano general vs primer plano)
5. El encabezado de escena referencia siempre a un escenario definido en Fase 1
