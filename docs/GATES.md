# GATES.md — Criterios de avance entre Gates

MovieAI avanza por gates. Cada gate debe completarse antes de iniciar el siguiente.

---

## Gate A — Investigación y validación ✅ COMPLETADO (2026-08-31)

**Objetivo:** validar que el proyecto tiene base técnica y de mercado sólida antes de escribir código.

### Criterios de salida (todos completados)

- [x] Investigación de mercado: competidores, hueco competitivo identificado (issue #1)
- [x] Modelo IA seleccionado para storyboard B&N (issue #2)
- [x] Flujo técnico completo definido: guión → storyboard (issue #3)
- [x] Diseño del editor de guión: stack, UX, wireframe (issue #4)
- [x] ADRs fundacionales aprobados (#1-#8)
- [x] Decisiones de producto aprobadas por Jordi:
  - Sin auth en MVP
  - MVP = Fase 1 + Fase 2 (sin animación)
  - Fase 3 (vídeo) = v2 de pago
- [x] README y documentación fundacional (issue #6)

---

## Gate B — Implementación del MVP ⏳ PENDIENTE

**Objetivo:** construir el MVP funcional: editor de guión + generación de storyboard.

### Criterios de entrada

- Gate A completado ✅
- Issues de implementación aprobadas por Jordi

### Issues de implementación (pendientes de aprobación)

| Issue | Descripción | Estado |
|-------|-------------|--------|
| #10 | Diseñar formulario web guiado de Fase 1 | propuesto |
| #11 | Implementar parser Fountain: guión → JSON | propuesto |
| #12 | Implementar generador de prompts: JSON → prompt ComfyUI | propuesto |
| #13 | Implementar editor de guión web con formato screenplay | propuesto |
| #14 | Diseñar sistema de entidades: personajes y escenarios | propuesto |
| #15 | Definir arquitectura técnica completa (ADR-007) | propuesto |

### Criterios de salida

- [ ] Editor de guión funcional en web (ProseMirror + Fountain)
- [ ] Pipeline guión → storyboard funcionando end-to-end en Dragon
- [ ] Al menos 1 guión de prueba genera storyboard completo B&N
- [ ] Exportación PDF funcional (guión + storyboard)
- [ ] Tests básicos de integración
- [ ] Desplegado en Azure Container Apps (o accesible localmente)

---

## Gate C — Validación con usuarios (futuro)

**Objetivo:** validar que el MVP resuelve el problema real con usuarios reales.

### Criterios de entrada

- Gate B completado
- Al menos 5 guiones de prueba generados con éxito

### Criterios de salida

- [ ] 3+ usuarios externos han probado el MVP
- [ ] Feedback recogido y priorizado
- [ ] Decisión: continuar → Gate D (v2 con animación) o pivotar

---

## Gate D — v2: Animación (futuro)

**Objetivo:** añadir Fase 3 (generación de vídeo/animación) como funcionalidad de pago.

### Prerequisitos

- Gate C completado
- Decisión explícita de Jordi de continuar hacia v2
