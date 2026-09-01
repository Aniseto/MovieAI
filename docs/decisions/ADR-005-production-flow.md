# ADR-005 ÔÇö Flujo de producci├│n en tres fases: definici├│n ÔåÆ validaci├│n ÔåÆ producci├│n

**Estado:** APPROVED
**Aprobado por:** Jordi
**Fecha de aprobación:** 2026-09-01
**Fecha:** 2026-08-29
**Autor:** Jordi (decisi├│n de producto)

---

## Decisi├│n

MovieAI sigue un flujo de producci├│n en **tres fases secuenciales** inspirado en el proceso real de producci├│n cinematogr├ífica. No se puede avanzar a la siguiente fase sin completar y validar la anterior.

---

## Las tres fases

### FASE 1 ÔÇö Definici├│n (Pre-producci├│n)
*"Escribe bien antes de generar nada."*

El usuario completa una serie de documentos de proyecto antes de que se genere ninguna imagen. La IA gu├¡a y da feedback en cada punto.

**Documentos obligatorios m├¡nimos:**

```
1. SINOPSIS
   - T├¡tulo del proyecto
   - G├®nero (drama, comedia, terror, fantas├¡a...)
   - Logline: una frase que resume la historia
   - Sinopsis corta: 3-5 l├¡neas
   - Tono: serio, humor├¡stico, ├®pico, ├¡ntimo...

2. PERSONAJES
   Por cada personaje:
   - Nombre
   - Edad y aspecto f├¡sico (descripci├│n detallada)
   - Personalidad y motivaci├│n
   - Rol en la historia (protagonista, antagonista, secundario)
   - Imagen de referencia (opcional: foto real o descripci├│n)

3. ESCENARIOS / LOCALIZACIONES
   Por cada escenario:
   - Nombre
   - Descripci├│n detallada (interior/exterior, ├®poca, estado)
   - Atm├│sfera y iluminaci├│n (soleado, nocturno, tenebroso...)
   - Elementos clave presentes

4. ESTRUCTURA NARRATIVA
   - Acto 1 ÔÇö Planteamiento: presentaci├│n de personajes y situaci├│n
   - Punto de giro 1: qu├® cambia
   - Acto 2 ÔÇö Nudo: conflicto principal, desarrollo
   - Punto de giro 2: momento de m├íxima tensi├│n
   - Acto 3 ÔÇö Desenlace: resoluci├│n

5. ESCENAS
   Por cada escena:
   - N├║mero y t├¡tulo
   - Localizaci├│n (referencia a escenario definido)
   - Personajes presentes (referencia a personajes definidos)
   - Momento del d├¡a / iluminaci├│n
   - Acci├│n principal: qu├® ocurre
   - Di├ílogos clave
   - Emoci├│n de la escena: qu├® debe sentir el espectador
   - Duraci├│n estimada (segundos)
```

**La IA act├║a como editor:** revisa cada documento y da feedback antes de marcarlo como completo. No se puede pasar a Fase 2 hasta que todos los documentos est├®n completos y validados.

---

### FASE 2 ÔÇö Storyboard en baja calidad (Validaci├│n)
*"Valida barato antes de producir caro."*

Con todos los documentos de Fase 1 completados, MovieAI genera el storyboard en **baja calidad / boceto r├ípido**.

**Caracter├¡sticas de esta fase:**
- Im├ígenes en **blanco y negro, resoluci├│n baja (512px)**, generaci├│n r├ípida
- Estilo: boceto muy suelto, l├¡neas simples ÔÇö suficiente para validar composici├│n y acci├│n
- Di├ílogos escritos integrados en el panel
- **Generaci├│n r├ípida y barata** (segundos por panel, m├¡nimo VRAM)
- El usuario puede:
  - Ô£à Aprobar el panel ÔåÆ pasa a producci├│n
  - Ô£Å´©Å Modificar el texto/prompt ÔåÆ regenerar ese panel
  - ­ƒöä Pedir variaci├│n ÔåÆ misma escena, diferente composici├│n
  - ÔØî Rechazar ÔåÆ redefinir la escena desde Fase 1

**Regla clave:** una escena no puede pasar a Fase 3 hasta que todos sus paneles est├®n aprobados en Fase 2.

**Propagaci├│n activa:** si se modifica un personaje o escenario durante la validaci├│n, todos los paneles de esa entidad se marcan como pendientes de regenerar (ADR-004).

---

### FASE 3 ÔÇö Producci├│n (Alta calidad + Animaci├│n)
*"Produce solo lo que ya est├í validado."*

Solo cuando una escena completa est├í aprobada en Fase 2, se genera en alta calidad y se anima.

**Subfase 3A ÔÇö Im├ígenes de alta calidad:**
- Resoluci├│n alta (1024px+), mayor detalle del boceto
- Misma est├®tica B&N l├ípiz pero con m├ís definici├│n
- Generaci├│n m├ís lenta ÔÇö se hace en cola, no en tiempo real
- El usuario puede ajustar detalles finos

**Subfase 3B ÔÇö Animaci├│n:**
- Cada panel de alta calidad se anima con WAN 2.7
- Clip de 3-8 segundos por panel
- El usuario aprueba cada clip antes del montaje final

**Subfase 3C ÔÇö Montaje final:**
- Todos los clips aprobados se montan en orden
- A├▒adir m├║sica/sonido (opcional, fase futura)
- Exportar como MP4 listo para compartir

---

## Diagrama del flujo completo

```
FASE 1 ÔÇö DEFINICI├ôN
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Sinopsis ÔåÆ Personajes ÔåÆ Escenarios         Ôöé
Ôöé  ÔåÆ Estructura ÔåÆ Escenas                     Ôöé
Ôöé  (IA da feedback en cada paso)              Ôöé
Ôöé  Estado: DRAFT ÔåÆ COMPLETO                   Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
                   Ôöé Todo completo y validado
                   Ôû╝
FASE 2 ÔÇö STORYBOARD BAJA CALIDAD
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Genera paneles B&N 512px r├ípidos           Ôöé
Ôöé  Usuario valida panel a panel               Ôöé
Ôöé  Modifica ÔåÆ Regenera ÔåÆ Aprueba             Ôöé
Ôöé  Estado: PENDIENTE ÔåÆ APROBADO              Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
                   Ôöé Escena completa aprobada
                   Ôû╝
FASE 3A ÔÇö IM├üGENES ALTA CALIDAD
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Regenera paneles aprobados en 1024px+      Ôöé
Ôöé  M├ís detalle, misma est├®tica B&N            Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
                   Ôöé
                   Ôû╝
FASE 3B ÔÇö ANIMACI├ôN
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  WAN 2.7: imagen ÔåÆ clip 3-8s por panel      Ôöé
Ôöé  Usuario aprueba cada clip                  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
                   Ôöé
                   Ôû╝
FASE 3C ÔÇö MONTAJE FINAL
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Clips ordenados ÔåÆ MP4 final                Ôöé
Ôöé  Exportar y compartir                       Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

## Por qu├® este flujo es correcto

1. **Evita el desperdicio** ÔÇö no se genera en alta calidad algo que luego se cambia
2. **Fuerza la reflexi├│n** ÔÇö el usuario piensa su historia antes de ver im├ígenes; las im├ígenes no reemplazan el pensamiento
3. **Validaci├│n progresiva** ÔÇö cada fase tiene un criterio de salida claro
4. **Coste controlado** ÔÇö la Fase 2 usa m├¡nima VRAM y es casi instant├ínea; la Fase 3 es costosa pero solo se ejecuta una vez por escena aprobada
5. **Proceso profesional** ÔÇö es exactamente c├│mo funciona la pre-producci├│n real en cine y animaci├│n

---

## Estado de aprobaci├│n
PROPOSED ÔÇö pendiente de confirmaci├│n por Jordi.


