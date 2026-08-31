# Investigación: Modelos IA para Storyboard Estilo Boceto a Lápiz
**Issue:** #2  
**Fecha:** 2026-08-31  
**Agente:** investigador

---

## 1. Modelo recomendado

**SDXL Base + LoRA "Storyboard Sketch"**

- SDXL es el equilibrio óptimo entre calidad y eficiencia en la RTX 5070 Ti (16GB VRAM)
- La LoRA *Storyboard Sketch* (Civitai) está entrenada específicamente en bocetos B&N de storyboards cinematográficos, aspectos 21:9, 16:9 y 1:1
- FLUX.1 también tiene versión de esta LoRA y cabe en 16GB, pero es más lento y el soporte ComfyUI es menos maduro
- SD 1.5 queda descartado: inferior en calidad de composición frente a SDXL para este caso de uso

**Alternativa a evaluar post-MVP**: FLUX.1 dev + misma LoRA si se quiere más detalle en los bocetos.

---

## 2. LoRA/Checkpoint recomendado

**Nombre**: Storyboard Sketch  
**Fuente**: https://civitai.com/models/162118/storyboard-sketch  
**Versión a descargar**: SDXL (versión base para MVP)  

**Características verificadas**:
- Entrenada en bocetos grises de storyboards y retratos de personajes
- Fuerza recomendada: 0.8–0.85 (equilibrio abstracción/detalle)
- Trigger words importantes: **no usar "storyboard"** en el prompt (hace que genere múltiples frames en la misma imagen); usar **"digital sketch"** como palabra clave principal
- Sampler recomendado: Euler ancestral
- Compatible con ComfyUI

---

## 3. Estrategia de consistencia de personajes (MVP)

**Para el MVP: prompt estructurado fijo por personaje**

- Definir un bloque de descripción fijo por personaje (ej: "tall man, short dark hair, beard, wearing a coat") que se inyecta en cada panel donde aparece
- El mismo LoRA + mismo seed por personaje mejora la coherencia sin infraestructura adicional
- **No usar IP-Adapter en MVP**: añade complejidad significativa (requiere imagen de referencia del personaje, nodos adicionales, más VRAM)
- **IP-Adapter + ControlNet**: reservar para v2 si la consistencia por prompt no es suficiente

---

## 4. Ejemplo de prompt

**Positive**:
```
digital sketch, black and white storyboard panel, pencil drawing, rough sketch style, 
cinema scene, [descripción de escena], [descripción de personaje], 
cross-hatching shadows, minimal background, cinematic composition, paper texture
```

**Negative**:
```
color, photorealistic, detailed background, digital painting, neon lighting, 
smooth edges, 3D render, multiple frames, collage, watermark
```

**Ejemplo concreto** (escena de interior):
```
Positive: digital sketch, black and white storyboard panel, pencil drawing, rough sketch style, 
INT office day, man sitting at desk looking at camera, short dark hair, 
cross-hatching shadows, minimal background, cinematic composition

Negative: color, photorealistic, detailed background, neon lighting, smooth edges, 3D render, multiple frames
```

---

## 5. Workflow ComfyUI

**Nodos necesarios para texto→imagen sketch**:

1. `Load Checkpoint` → `sdxl_base.safetensors`
2. `Load LoRA` → `storyboard_sketch_sdxl.safetensors`, strength: 0.8
3. `CLIP Text Encode` (positive) → prompt positivo
4. `CLIP Text Encode` (negative) → prompt negativo
5. `Empty Latent Image` → resolución 16:9 (1344x768 para SDXL)
6. `KSampler` → Euler ancestral, 20–25 pasos, CFG 7
7. `VAE Decode`
8. `Image Save`

**Workflows públicos de referencia**:
- ComfyUI Wiki: https://comfyui-wiki.com/es/interface/workflow
- El workflow base de SDXL en ComfyUI ya soporta este setup sin nodos custom

---

## 6. Conclusiones accionables

| Decisión | Valor |
|----------|-------|
| Modelo base | SDXL Base (`sdxl_base.safetensors`) |
| LoRA | Storyboard Sketch v SDXL — Civitai #162118 |
| Fuerza LoRA | 0.8 |
| Sampler | Euler ancestral |
| Pasos | 20–25 |
| CFG | 7 |
| Resolución panel | 1344×768 (16:9) |
| Trigger word | "digital sketch" — **nunca "storyboard"** |
| Consistencia MVP | Prompt fijo por personaje + mismo seed |
| Consistencia v2 | IP-Adapter + ControlNet (posponer) |
| Formato salida | PNG B&N por panel |

**Próximos pasos**:
1. Descargar SDXL Base desde HuggingFace (`stabilityai/stable-diffusion-xl-base-1.0`)
2. Descargar LoRA Storyboard Sketch (SDXL) desde Civitai #162118
3. Montar workflow base en ComfyUI en Dragon
4. Validar con 3–4 prompts de escenas de prueba antes de integrar con el backend
