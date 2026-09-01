# ADR-006 ÔÇö Interfaz de Fase 1: formulario guiado obligatorio

**Estado:** APPROVED
**Aprobado por:** Jordi
**Fecha de aprobación:** 2026-09-01
**Fecha:** 2026-08-29
**Autor:** Jordi (decisi├│n de producto)

---

## Decisi├│n

La Fase 1 (Definici├│n) se implementa como un **formulario web guiado y obligatorio**. El usuario no puede generar ninguna imagen hasta que todos los campos m├¡nimos est├®n completos y validados por la IA.

---

## Principios

1. **Campos obligatorios bloqueantes** ÔÇö el bot├│n "Generar Storyboard" est├í deshabilitado hasta que todos los campos m├¡nimos est├®n completos
2. **IA asistente por campo** ÔÇö cada campo tiene un bot├│n "Ay├║dame" que abre el chat de la IA para ese campo concreto
3. **Feedback en tiempo real** ÔÇö la IA eval├║a cada campo al salir del foco y muestra sugerencias inline
4. **Progreso visible** ÔÇö barra de progreso por secci├│n: Sinopsis, Personajes, Escenarios, Estructura, Escenas
5. **Guardado autom├ítico** ÔÇö el usuario puede cerrar y retomar en cualquier momento

---

## Estructura del formulario

### Secci├│n 1 ÔÇö Sinopsis
```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒô¢´©Å SINOPSIS                               Ô£à Completo  Ôöé
Ôö£ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöñ
Ôöé  T├¡tulo *                                               Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ   Ôöé
Ôöé  Ôöé El ├║ltimo tren                                  Ôöé   Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ   Ôöé
Ôöé                                                         Ôöé
Ôöé  G├®nero *                                               Ôöé
Ôöé  [Drama] [Comedia] [Terror] [Fantas├¡a] [Sci-Fi] [Otro] Ôöé
Ôöé                                                         Ôöé
Ôöé  Logline * (una frase que resume la historia)           Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ   Ôöé
Ôöé  Ôöé Un hombre que perdi├│ su memoria debe decidir    Ôöé   Ôöé
Ôöé  Ôöé si subirse al tren que le llevar├í de vuelta...  Ôöé   Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ   Ôöé
Ôöé  Ô£à Buen logline ÔÇö tiene protagonista, conflicto y      Ôöé
Ôöé     decisi├│n. [Ver sugerencia de mejora]                Ôöé
Ôöé                                                         Ôöé
Ôöé  Sinopsis corta * (3-5 l├¡neas)                         Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ   Ôöé
Ôöé  Ôöé                                                 Ôöé   Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ   Ôöé
Ôöé  ÔÜá´©Å Campo obligatorio                                   Ôöé
Ôöé                                                         Ôöé
Ôöé  Tono *                                                 Ôöé
Ôöé  [Serio] [Humor├¡stico] [├ëpico] [├ìntimo] [Oscuro]       Ôöé
Ôöé                                    [­ƒÆ¼ Ay├║dame con esto]Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ

### Secci├│n 2 ÔÇö Personajes
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒæñ PERSONAJES                       ÔÜá´©Å 1/2 completados Ôöé
Ôö£ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöñ
Ôöé  [+ A├▒adir personaje]                                   Ôöé
Ôöé                                                         Ôöé
Ôöé  Ôû╝ PERSONAJE 1 ÔÇö Marco (Protagonista)   Ô£à             Ôöé
Ôöé    Nombre: Marco                                        Ôöé
Ôöé    Edad: 45                                             Ôöé
Ôöé    Aspecto f├¡sico: Alto, pelo canoso, gabardina...      Ôöé
Ôöé    Personalidad: Reservado, melanc├│lico, determinado    Ôöé
Ôöé    Motivaci├│n: Recuperar su memoria y encontrar...      Ôöé
Ôöé    Imagen de referencia: [Subir foto] o [Describir]     Ôöé
Ôöé                                                         Ôöé
Ôöé  Ôû╝ PERSONAJE 2 ÔÇö Elena (Antagonista)    ÔÜá´©Å Incompleto  Ôöé
Ôöé    Nombre: Elena                                        Ôöé
Ôöé    Edad: [vac├¡o] ÔåÉ campo obligatorio                   Ôöé
Ôöé    ...                                                  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ

### Secci├│n 3 ÔÇö Escenarios
### Secci├│n 4 ÔÇö Estructura (3 actos)
### Secci├│n 5 ÔÇö Escenas (lista de escenas del proyecto)
```

---

## Feedback de la IA por campo

Cada campo importante tiene validaci├│n sem├íntica por IA:

| Campo | Qu├® valida la IA |
|-------|-----------------|
| Logline | ┬┐Tiene protagonista, conflicto y objetivo? |
| Personaje ÔÇö aspecto | ┬┐Es suficientemente descriptivo para generar una imagen? |
| Personaje ÔÇö motivaci├│n | ┬┐Es clara y cre├¡ble? |
| Escenario ÔÇö descripci├│n | ┬┐Tiene suficiente detalle visual para generar imagen? |
| Escena ÔÇö acci├│n | ┬┐Est├í clara la acci├│n principal? ┬┐Avanza la historia? |
| Estructura | ┬┐Los tres actos est├ín equilibrados? |

---

## Estados de los campos

- ­ƒö▓ Vac├¡o ÔÇö obligatorio, bloquea avance
- Ô£Å´©Å En edici├│n
- ÔÜá´©Å Incompleto o con sugerencia de mejora
- Ô£à Completo y validado por IA
- ­ƒöÆ Bloqueado ÔÇö depende de otro campo

---

## Bot├│n de generaci├│n

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  PROGRESO DEL PROYECTO                                  Ôöé
Ôöé  Sinopsis     ÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûê Ô£à                           Ôöé
Ôöé  Personajes   ÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûæÔûæÔûæÔûæ ÔÜá´©Å 1 incompleto              Ôöé
Ôöé  Escenarios   ÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûêÔûê Ô£à                           Ôöé
Ôöé  Estructura   ÔûêÔûêÔûêÔûêÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæ ÔÜá´©Å Acto 2 vac├¡o              Ôöé
Ôöé  Escenas      ÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæÔûæ ÔÜá´©Å Sin escenas               Ôöé
Ôöé                                                         Ôöé
Ôöé  [ Generar Storyboard ] ÔåÉ DESHABILITADO                 Ôöé
Ôöé  Completa todos los campos para continuar               Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

Cuando todo est├í completo:

```
Ôöé  [ ­ƒÄ¼ Generar Storyboard ] ÔåÉ HABILITADO, color primario Ôöé
```

---

## Implicaciones t├®cnicas

- **Stack:** Next.js + React + formularios controlados
- **Validaci├│n:** Zod para validaci├│n de campos + llamada a LLM para validaci├│n sem├íntica
- **Persistencia:** localStorage para draft + base de datos para proyectos guardados
- **LLM:** Gemini API para feedback por campo (peticiones peque├▒as, bajo coste)
- **Estado global:** zustand o Context API para mantener el estado del formulario

---

## Estado de aprobaci├│n
PROPOSED ÔÇö pendiente de confirmaci├│n por Jordi.


