# Investigación de Mercado: Herramientas de Guión y Storyboard
**Issue:** #1  
**Fecha:** 2026-08-31  
**Agente:** investigador

---

## 1. Movie Master 3.09: Qué lo hace especial

Aunque la documentación técnica directa de Movie Master 3.09 es escasa (software MS-DOS de los 80/90), el análisis de su reputación y herramientas comparables revela por qué guionistas como Eric Roth (Oscar por Forrest Gump, Dune 2021) lo siguen usando:

- **Sencillez sin compromisos**: flujo de trabajo minimalista, sin distracciones, sin menús complejos. La interfaz desaparece y el guionista solo ve el texto.
- **Autoformateo instantáneo**: slug lines, diálogos, acotaciones y transiciones se formatean solos al pulsar Tab/Enter. El guionista nunca piensa en el formato.
- **Atajos de teclado fluidos**: cambio entre elementos de guión (escena → personaje → diálogo → acotación) sin ratón, sin menús.
- **Velocidad de arranque**: abre en segundos, sin proyectos, sin configuración. Abres y escribes.
- **Sin features que distraigan**: sin colaboración en tiempo real, sin comentarios, sin versiones cloud, sin integraciones. Solo escritura.
- **Exportación a texto plano y PDF**: portabilidad total, sin lock-in.

**Lección clave para MovieAI**: la velocidad, el foco y el autoformateo transparente son lo que los guionistas profesionales valoran. El software moderno añade features y pierde esa fluidez.

---

## 2. Análisis de Competidores

| Herramienta | Precio | Autoformateo | Storyboard | Sencillez | Notas |
|-------------|--------|--------------|------------|-----------|-------|
| **Final Draft** | ~$250 | ✅ Excelente | ❌ No | ❌ Complejo | Estándar industria, pero pesado y caro |
| **Celtx** | Freemium | ✅ Bueno | ⚠️ Básico (manual) | ⚠️ Medio | Muchas features, pierde foco |
| **Highland 2** | $49.99 (Mac) | ✅ Muy bueno | ❌ No | ✅ Bueno | Solo Mac, basado en Fountain |
| **Fade In** | $79.99 | ✅ Bueno | ❌ No | ✅ Bueno | Multiplataforma, bien valorado |
| **WriterDuet** | Freemium | ✅ Bueno | ❌ No | ⚠️ Medio | Foco en colaboración |
| **Trelby** | Gratis | ✅ Básico | ❌ No | ✅ Simple | Open source, sin mantenimiento activo |
| **Storyboarder** | Gratis | N/A | ✅ Manual | ✅ Simple | Solo storyboard, no integrado con guión |
| **Boords** | Freemium | N/A | ✅ Manual | ⚠️ Medio | SaaS storyboard, sin guión |

**Hueco identificado**: ninguna herramienta combina (1) sencillez extrema de escritura + (2) autoformateo transparente + (3) generación automática de storyboard integrada con el guión.

---

## 3. Hueco Competitivo de MovieAI

El mercado está dividido en dos silos:
- **Herramientas de guión** (Final Draft, Celtx, Fade In): no generan storyboard
- **Herramientas de storyboard** (Storyboarder, Boords): no leen el guión, son manuales

MovieAI ocupa el espacio vacío: **guión → storyboard automático en un solo flujo**, con la sencillez como principio de diseño, no como feature.

**Diferencial concreto**:
1. Escribe el guión con autoformateo tipo Movie Master (Tab/Enter cambia elemento)
2. El sistema analiza cada escena automáticamente
3. Genera un panel de storyboard B&N estilo boceto/lápiz por escena
4. El resultado es un storyboard imprimible completo sin trabajo manual adicional

No hay ninguna herramienta que haga esto de forma integrada, sencilla y local.

---

## 4. Recomendación sobre Fountain

**Usar Fountain como formato base interno.** Razones:

- Es el estándar de facto para guiones en texto plano (soportado por Final Draft, Highland, Fade In, WriterDuet, Celtx)
- Permite importar/exportar con cualquier herramienta profesional
- Es legible por humanos sin procesamiento
- Tiene parsers open source maduros (fountain.js, fountain-js)
- El usuario no necesita conocer la sintaxis: el editor la genera automáticamente

**Propuesta**: el editor genera Fountain internamente, pero el usuario nunca ve la sintaxis. Solo ve el guión formateado visualmente. Al exportar, puede elegir PDF o `.fountain`.

---

## 5. Conclusiones Accionables

### Decisiones de diseño derivadas

1. **UX inspirada en Movie Master**: Tab/Enter como único mecanismo de cambio de elemento. Sin clics, sin menús para escribir.
2. **Formato interno: Fountain** — con parser fountain-js para parsing y generación.
3. **Elementos de guión en MVP**: Slug Line (INT/EXT), Acción, Personaje, Diálogo, Paréntesis. Transiciones opcionales.
4. **Autoformateo visual**: el editor formatea en tiempo real (negrita para slug lines, centrado para personajes, etc.)
5. **Storyboard automático**: cada Slug Line + bloque de Acción genera un panel. El LLM extrae escena, personajes y acción → prompt → imagen B&N.
6. **Exportaciones MVP**: PDF del guión + PDF del storyboard.
7. **Sin colaboración, sin comentarios, sin versiones en MVP**: foco total en escritura individual.
8. **Posicionamiento**: "Escribe tu guión. Obtén tu storyboard. Simple."
