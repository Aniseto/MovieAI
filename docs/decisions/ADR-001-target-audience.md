# ADR-001 — Público objetivo: guionistas indie y estudiantes de cine

**Estado:** PROPOSED
**Fecha:** 2026-08-29
**Autor:** Jordi (decisión de producto)

---

## Contexto

Durante la fase de investigación inicial se identificaron múltiples perfiles de usuario potencial para MovieAI. Google Flow (Google I/O 2025) cubre el segmento de creadores de vídeo general con estética fotorrealista y flujo automatizado. Existe un hueco claro en el segmento de guionistas y estudiantes que necesitan una herramienta con más control creativo, estética artesanal y sin coste de cloud.

## Decisión

**El público objetivo de MovieAI son guionistas indie y estudiantes de cine/animación.**

### Perfil primario — Guionista indie
- Edad: 20-40
- Perfil: escribe guiones de forma independiente, sin acceso a presupuesto de producción
- Necesidad: visualizar su guión como storyboard antes de buscar financiación o producir
- Dolor actual: las herramientas profesionales (Final Draft, Celtx) no generan storyboard; las que generan storyboard (Flow, Higgsfield) no tienen editor de guión serio ni estética artesanal
- Disposición a pagar: media-baja, valora herramientas asequibles o de pago único

### Perfil secundario — Estudiante de cine / animación / comunicación audiovisual
- Edad: 18-26
- Perfil: estudia en escuela de cine, universidad o de forma autodidacta
- Necesidad: aprender el flujo guión → storyboard → animación, entregar proyectos con calidad visual sin presupuesto
- Dolor actual: no puede permitirse software profesional ni producción real
- Disposición a pagar: baja, valora freemium o licencia de estudiante

### Perfil terciario — Creador de contenido / YouTuber / TikToker narrativo
- Edad: 20-35
- Perfil: crea contenido de formato largo con narrativa (mini-documentales, cortos, sketches)
- Necesidad: previsualizar su contenido antes de grabar, crear animatics
- Disposición a pagar: media

---

## Implicaciones de diseño

### Lo que SÍ debe tener MovieAI para estos perfiles
- Editor de guión serio con formato screenplay (Fountain) — el guionista indie necesita escribir, no solo generar
- Estética de boceto B&N — auténtica, artesanal, no fotorrealista; es el lenguaje visual del storyboard profesional
- Control panel a panel — el usuario revisa y aprueba cada frame antes de animar
- Exportación de storyboard en PDF — para presentar a productores, profesores o colaboradores
- Precio accesible — freemium o pago único bajo; sin suscripción cara
- Funcionamiento local o con opción offline — privacidad, sin dependencia de cloud

### Lo que NO necesita MovieAI (para no perder el foco)
- Estética fotorrealista o a color (eso es Google Flow)
- Integración con TikTok o redes sociales (eso es TiktokAI)
- Producción de vídeo de alta calidad para distribución comercial
- Colaboración en equipo en tiempo real (complejidad innecesaria para el MVP)

---

## Consecuencias

- La estética B&N lápiz NO es una limitación técnica, es la propuesta de valor
- El editor de guión es tan importante como el generador de storyboard
- El precio debe ser accesible: objetivo €0 freemium + €9-29 pago único o mensual bajo
- La animación es el paso 3, no el MVP — el storyboard exportable ya tiene valor para estos perfiles
- Referencia de competencia a vigilar: Celtx (estudiantes), Boords (indie), Google Flow (general)

---

## Estado de aprobación
PROPOSED — pendiente de confirmación por Jordi.
