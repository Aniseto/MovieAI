# ADR-001 — Visión de producto y público objetivo

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Visión

> **Cualquier persona con una historia que contar puede crear un storyboard y convertirlo en un vídeo animado como si fuera una película.**

MovieAI elimina la barrera técnica y económica entre tener una idea y verla en pantalla. No hace falta saber dibujar, ni tener presupuesto, ni conocer herramientas profesionales. Solo hace falta escribir.

---

## Público objetivo

### Público primario — Cualquier persona con una historia
- Sin requisitos de conocimiento técnico
- Edad: 16-50+
- Perfil: cualquiera que tenga una historia en la cabeza y quiera verla animada
- Ejemplos: un padre que quiere hacer un cuento animado para sus hijos, alguien que sueña con hacer una película, un youtuber que quiere previsualizar su guión

### Público secundario — Guionistas indie y estudiantes de cine
- Edad: 18-40
- Perfil: escribe guiones de forma independiente o como parte de sus estudios
- Necesidad: visualizar su guión con el lenguaje del cine (storyboard) antes de producirlo
- Valor añadido: editor de guión serio con formato screenplay

### Público terciario — Creadores de contenido narrativo
- Edad: 20-35
- Perfil: YouTubers, TikTokers, creadores de cortos, animadores indie
- Necesidad: convertir sus ideas en vídeos animados sin equipo de producción

---

## Flujo de usuario objetivo

```
[El usuario escribe su historia en texto libre o formato guión]
              ↓
[MovieAI la convierte en un storyboard panel a panel — estilo boceto B&N]
              ↓
[El usuario revisa, ajusta y aprueba el storyboard]
              ↓
[MovieAI anima cada panel → vídeo animado estilo película]
              ↓
[El usuario tiene su corto animado listo para compartir]
```

---

## Propuesta de valor

- **Accesible:** sin conocimientos técnicos, sin presupuesto, sin equipo
- **Artesanal:** estética de boceto B&N — el lenguaje visual del cine, no fotorrealismo de IA genérico
- **Con control:** el usuario valida el storyboard antes de animar — no es una caja negra
- **Local:** sin dependencia de cloud, sin coste por generación, privacidad total
- **Completo:** de la historia al vídeo animado en un solo flujo

---

## Diferencial vs competencia

| | MovieAI | Google Flow | Celtx | Boords |
|---|---------|-------------|-------|--------|
| Público | **Cualquiera** | Creadores avanzados | Profesionales | Agencias |
| Entrada | **Texto libre o guión** | Prompts | Guión | Imágenes |
| Estética | **B&N boceto lápiz** | Fotorrealista color | N/A | Cualquiera |
| Flujo completo guión→vídeo | **Sí** | Parcial | No | No |
| Control panel a panel | **Sí** | No | N/A | Sí |
| Local / sin cloud | **Sí** | No | No | No |
| Precio objetivo | **Freemium + €9-29** | $20+/mes | $20+/mes | $15+/mes |

---

## Implicaciones de diseño

### Debe ser extremadamente fácil de usar
- La entrada puede ser texto libre ("quiero una historia de un niño que encuentra un dragón") o formato screenplay
- El LLM convierte el texto libre en estructura de escenas automáticamente
- Sin jerga técnica en la interfaz

### La estética B&N boceto es la identidad visual del producto
- No fotorrealista, no a color — eso es Google Flow
- El boceto a lápiz tiene personalidad y es universalmente legible como "historia"
- Es el lenguaje visual que cualquier persona asocia con "película en proceso"

### El storyboard exportable es el MVP
- PDF con todos los paneles, diálogos y descripciones de acción
- Ya tiene valor por sí solo antes de la animación

### La animación es el paso que lo hace mágico
- Cada panel cobra vida → sensación de "estoy viendo mi película"
- No necesita ser fotorrealista — la animación sencilla sobre boceto B&N tiene su propia estética poderosa

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
