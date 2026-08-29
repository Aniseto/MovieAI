# ADR-002 — Experiencia guiada: MovieAI como mentor narrativo

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Decisión

MovieAI no es solo una herramienta de generación. Es un **mentor narrativo interactivo** que guía al usuario paso a paso para crear su historia correctamente, con feedback de IA en cada etapa.

---

## Visión de la experiencia

El usuario no llega a una pantalla en blanco. MovieAI le acompaña desde el inicio:

```
1. ¿Qué historia quieres contar?        → El usuario describe su idea en texto libre
                                         → La IA da feedback: ¿es clara? ¿tiene conflicto?

2. Define tus personajes                 → IA guía: nombre, personalidad, motivación, aspecto
                                         → Feedback: ¿el personaje tiene profundidad?

3. Define tus escenarios                 → IA guía: dónde ocurre, qué atmósfera, qué hora
                                         → Feedback: ¿el escenario apoya la historia?

4. Estructura tu historia                → IA guía: planteamiento, nudo, desenlace
                                         → Feedback: ¿la estructura funciona?

5. Escena a escena                       → IA guía: qué ocurre, quién habla, qué emoción
                                         → Feedback: ¿la escena avanza la historia?

6. Genera el storyboard                  → Panel a panel, el usuario valida
                                         → IA explica cada decisión visual

7. Anima y exporta                       → Vídeo animado listo
```

---

## Principios de la experiencia guiada

### 1. Nunca pantalla en blanco
El usuario siempre tiene un punto de partida. Si no sabe qué escribir, la IA sugiere.

### 2. Feedback constructivo, no crítica
La IA no dice "esto está mal". Dice "esto podría ser más fuerte si...". Tono positivo, educativo.

### 3. Aprende mientras crea
Cada paso explica brevemente el concepto narrativo detrás. El usuario aprende qué es un conflicto, qué hace memorable a un personaje, cómo funciona la estructura en tres actos — sin teoría aburrida, en contexto.

### 4. El usuario siempre manda
La IA guía y sugiere, pero nunca fuerza. El usuario puede ignorar el feedback y continuar.

### 5. Progreso visible
Barra de progreso clara: "Paso 3 de 7 — Definiendo escenarios". El usuario sabe dónde está y cuánto le queda.

---

## Módulos del asistente narrativo

| Módulo | Qué hace la IA |
|--------|----------------|
| **Idea inicial** | Analiza la idea, detecta si tiene conflicto, protagonista y objetivo. Sugiere mejoras. |
| **Personajes** | Guía la creación: nombre, motivación, flaw, relación con otros personajes. Alerta si el personaje es plano. |
| **Escenarios** | Guía la descripción: lugar, época, atmósfera, iluminación. Conecta el escenario con la emoción de la escena. |
| **Estructura** | Verifica que la historia tiene planteamiento, nudo y desenlace. Sugiere dónde añadir tensión. |
| **Escenas** | Por cada escena: qué ocurre, quién está, qué se dice, qué emoción transmite. Feedback sobre ritmo y claridad. |
| **Storyboard** | Explica cada panel generado. Permite regenerar con instrucciones. |
| **Animación** | Preview antes de renderizar. Permite ajustar velocidad, transiciones. |

---

## Implicaciones técnicas

- El LLM (Gemini/GPT-4o o local Qwen) es el núcleo del asistente narrativo
- Cada módulo tiene su propio system prompt especializado en narrativa cinematográfica
- La interfaz es conversacional dentro de cada paso — no formularios fríos
- El estado de la historia se persiste entre sesiones (el usuario puede volver mañana)

---

## Por qué esto es el diferencial definitivo

Google Flow, Celtx, Boords — ninguno te enseña a contar historias. Solo generan.
MovieAI es la primera herramienta que **convierte a cualquier persona en guionista** antes de generar nada.

Esto abre el mercado a personas que nunca escribirían un guión por su cuenta:
- Un adolescente que quiere hacer una historia de fantasía
- Un profesor que quiere crear material educativo animado
- Alguien que quiere hacer un regalo especial (una historia animada personalizada)
- Un emprendedor que quiere un pitch visual de su idea

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
