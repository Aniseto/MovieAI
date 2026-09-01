# USER-JOURNEY.md ÔÇö MovieAI

**Versi├│n:** 1.0  
**Fecha:** 2026-09-01  
**Autor:** Jarvis  
**Issue:** #38  
**Estado:** PROPOSED ÔÇö pendiente de aprobaci├│n por Jordi

---

## Principios de dise├▒o

- **App 100% web** ÔÇö no hay cliente de escritorio
- **Editor de bloques libre** ÔÇö el autor a├▒ade lo que quiera, cuando quiera
- **IA orientativa, nunca bloqueante** ÔÇö las sugerencias se pueden ignorar
- **Imagen por bloque** ÔÇö cada bloque visual puede generar su propia imagen de referencia
- **Escenas como unidad de producci├│n** ÔÇö estructura separada del editor libre; son las que generan paneles de storyboard
- **Persistencia en Markdown** ÔÇö sin base de datos; ficheros de texto plano

---

## Flujo 1 ÔÇö Primera vez: crear un proyecto

### 1.1 El usuario abre MovieAI

**Pantalla:** Lista de proyectos (estado vac├¡o)

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒÄ¼ MovieAI                                    Ôöé
Ôöé                                                Ôöé
Ôöé         No tienes proyectos todav├¡a.           Ôöé
Ôöé         Empieza escribiendo tu historia.       Ôöé
Ôöé                                                Ôöé
Ôöé              [ + Nueva pel├¡cula ]              Ôöé
Ôöé                                                Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

**Sistema:** muestra estado vac├¡o con CTA central.

---

### 1.2 El usuario pulsa "+ Nueva pel├¡cula"

**Pantalla:** Modal de creaci├│n de proyecto

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Nueva pel├¡cula                    Ôöé
Ôöé                                    Ôöé
Ôöé  T├¡tulo *                          Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé El ├║ltimo tren               Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
Ôöé                                    Ôöé
Ôöé  G├®nero *                          Ôöé
Ôöé  [Drama] [Comedia] [Terror] ...    Ôöé
Ôöé                                    Ôöé
Ôöé  Tono * (puedes elegir varios)     Ôöé
Ôöé  [Serio] [├ìntimo] [├ëpico] ...      Ôöé
Ôöé                                    Ôöé
Ôöé  Visi├│n de autor *                 Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé Una historia sobre la        Ôöé  Ôöé
Ôöé  Ôöé memoria y la identidad.      Ôöé  Ôöé
Ôöé  Ôöé Quiero un tono melanc├│lico,  Ôöé  Ôöé
Ôöé  Ôöé referencias a Tarkovsky...   Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
Ôöé  (La IA usar├í esto como br├║jula    Ôöé
Ôöé   para detectar incoherencias)     Ôöé
Ôöé                                    Ôöé
Ôöé  [ Cancelar ]  [ Crear proyecto ]  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

**Sistema:** crea la carpeta `projects/{slug}/` y el fichero `project.md` con los datos introducidos.

---

### 1.3 El usuario entra al editor

**Pantalla:** Editor de bloques ÔÇö proyecto nuevo vac├¡o

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒÄ¼ El ├║ltimo tren          [Guardar]   Ôöé                  Ôöé
Ôöé  Drama ┬À Serio ┬À ├ìntimo                 Ôöé   Sin imagen     Ôöé
Ôöé                          [­ƒÄ¼ Generar Ôû©] Ôöé   seleccionada   Ôöé
Ôö£ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöñ                  Ôöé
Ôöé                                         Ôöé  Selecciona un   Ôöé
Ôöé  Empieza a├▒adiendo bloques a tu         Ôöé  bloque con ­ƒû╝   Ôöé
Ôöé  proyecto. No hay orden obligatorio.    Ôöé  para ver la     Ôöé
Ôöé                                         Ôöé  imagen aqu├¡.    Ôöé
Ôöé  [ + A├▒adir bloque ]                    Ôöé                  Ôöé
Ôöé                                         Ôöé                  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

**Sistema:** el bot├│n "Generar Ôû©" est├í deshabilitado hasta que existan al menos 2 escenas.

---

## Flujo 2 ÔÇö Construir el proyecto con bloques

### 2.1 El usuario a├▒ade un bloque

Al pulsar "+ A├▒adir bloque" aparece un selector:

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ┬┐Qu├® quieres a├▒adir?       Ôöé
Ôöé                             Ôöé
Ôöé  ­ƒôØ Sinopsis / descripci├│n  Ôöé
Ôöé  ­ƒæñ Personaje               Ôöé
Ôöé  ­ƒÅø´©Å  Escenario               Ôöé
Ôöé  ­ƒÄ¡ Acci├│n                  Ôöé
Ôöé  ­ƒÆ¼ Di├ílogo                 Ôöé
Ôöé  ­ƒùÆ´©Å  Nota del autor          Ôöé
Ôöé  ­ƒÄ¼ Ir a Escenas ÔåÆ          Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

### 2.2 Bloque sin imagen (ej. Sinopsis)

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒôØ Sinopsis                   [IA] [├ù] Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé Un hombre que perdi├│ su memoria   Ôöé  Ôöé
Ôöé  Ôöé llega a una estaci├│n abandonada   Ôöé  Ôöé
Ôöé  Ôöé y debe decidir si subirse al tren Ôöé  Ôöé
Ôöé  Ôöé que le llevar├í de vuelta...       Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

- `[IA]` ÔÇö valida coherencia con la visi├│n de autor y otros bloques
- `[├ù]` ÔÇö eliminar bloque (con confirmaci├│n si hay contenido)

---

### 2.3 Bloque con imagen (ej. Personaje)

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒæñ Personaje                  [IA] [­ƒû╝] [├ù] Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé Marco, 45 a├▒os. Alto, pelo canoso Ôöé  Ôöé
Ôöé  Ôöé gabardina beige desgastada.       Ôöé  Ôöé
Ôöé  Ôöé Reservado, melanc├│lico.           Ôöé  Ôöé
Ôöé  Ôöé Busca recuperar su identidad.     Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

Al pulsar `[­ƒû╝]`:
1. La IA verifica que el texto tiene suficiente detalle visual
2. Si pasa ÔåÆ lanza ComfyUI ÔåÆ imagen aparece en el panel lateral derecho
3. Si no pasa ÔåÆ sugerencias orientativas (el usuario puede forzar la generaci├│n igualmente)

**Panel lateral al generar:**
```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒæñ Marco        Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé  [imagen   Ôöé  Ôöé
Ôöé  Ôöé   B&N      Ôöé  Ôöé
Ôöé  Ôöé   boceto]  Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
Ôöé  Generada: hoy   Ôöé
Ôöé  [Regenerar]     Ôöé
Ôöé  [Ô£ô Validar]     Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

### 2.4 Feedback de IA al pulsar `[IA]`

La IA carga: `project.md` + bloque actual + bloques relacionados del mismo proyecto.

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒôØ Sinopsis                   [IA] [├ù] Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé Un hombre que perdi├│ su memoria...Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
Ôöé                                         Ôöé
Ôöé  ­ƒÆí Sugerencia de IA:                   Ôöé
Ôöé  El tono melanc├│lico que describes en   Ôöé
Ôöé  la visi├│n de autor encaja bien. Sin    Ôöé
Ôöé  embargo, "debe decidir" es vago ÔÇö      Ôöé
Ôöé  ┬┐cu├íl es la consecuencia concreta      Ôöé
Ôöé  de cada opci├│n?                        Ôöé
Ôöé                          [Entendido]    Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

### 2.5 Aviso de incoherencia global

Cuando el usuario lleva varios bloques, la IA puede detectar incoherencias entre ellos:

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ÔÜá´©Å  La IA ha detectado una posible      Ôöé
Ôöé  incoherencia:                          Ôöé
Ôöé                                         Ôöé
Ôöé  El personaje "Elena" se describe como  Ôöé
Ôöé  antagonista en el bloque de personaje, Ôöé
Ôöé  pero en la Escena 03 aparece ayudando  Ôöé
Ôöé  al protagonista sin explicaci├│n.       Ôöé
Ôöé                          [Ver detalle]  Ôöé
Ôöé                          [Ignorar]      Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

## Flujo 3 ÔÇö Gesti├│n de Escenas

Las escenas son una secci├│n separada del editor libre. Se accede desde el men├║ lateral o desde el selector de bloques ("­ƒÄ¼ Ir a Escenas ÔåÆ").

### 3.1 Vista de escenas

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö¼ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒÄ¼ El ├║ltimo tren  ÔÇ║ Escenas           Ôöé                  Ôöé
Ôöé                         [+ Nueva escena]Ôöé                  Ôöé
Ôö£ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöñ                  Ôöé
Ôöé                                         Ôöé                  Ôöé
Ôöé  01 ÔÇö El encuentro              [editar]Ôöé                  Ôöé
Ôöé  02 ÔÇö La decisi├│n               [editar]Ôöé                  Ôöé
Ôöé  03 ÔÇö El ├║ltimo and├®n           [editar]Ôöé                  Ôöé
Ôöé                                         Ôöé                  Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔö┤ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

### 3.2 Editor de escena individual

Cada escena tiene **estructura m├¡nima** + **bloques libres internos**:

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Escena 01 ÔÇö El encuentro               Ôöé
Ôöé                                         Ôöé
Ôöé  Escenario: [Estaci├│n central Ôû¥]        Ôöé
Ôöé  Momento:   [Noche Ôû¥]                   Ôöé
Ôöé  Personajes: [Marco ├ù] [Elena ├ù] [+]    Ôöé
Ôöé                                         Ôöé
Ôöé  ÔöÇÔöÇ Bloques de la escena ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ     Ôöé
Ôöé                                         Ôöé
Ôöé  ­ƒÄ¡ Acci├│n                    [IA] [­ƒû╝] Ôöé
Ôöé  Marco entra en la estaci├│n vac├¡a...    Ôöé
Ôöé                                         Ôöé
Ôöé  ­ƒÆ¼ Di├ílogo                   [IA]      Ôöé
Ôöé  MARCO: ┬┐Qui├®n eres t├║?                 Ôöé
Ôöé  ELENA: La pregunta correcta es...      Ôöé
Ôöé                                         Ôöé
Ôöé  [ + A├▒adir bloque a esta escena ]      Ôöé
Ôöé                                         Ôöé
Ôöé  [­ƒû╝ Generar panel de storyboard]       Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

## Flujo 4 ÔÇö Generar Storyboard (entrada a Fase 2)

### 4.1 Condici├│n de desbloqueo

El bot├│n `[­ƒÄ¼ Generar Ôû©]` se habilita cuando:
- Existe al menos 1 bloque en el editor libre (proyecto tiene contenido)
- Existen al menos 2 escenas con escenario, momento y al menos 1 personaje asignados

### 4.2 Confirmaci├│n antes de generar

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒÄ¼ Generar Storyboard                  Ôöé
Ôöé                                         Ôöé
Ôöé  Se generar├ín paneles en baja calidad   Ôöé
Ôöé  (boceto B&N) para:                     Ôöé
Ôöé                                         Ôöé
Ôöé  ┬À 3 escenas                            Ôöé
Ôöé  ┬À ~9 paneles estimados                 Ôöé
Ôöé                                         Ôöé
Ôöé  Podr├ís seguir editando el proyecto     Ôöé
Ôöé  mientras se genera. Los cambios        Ôöé
Ôöé  posteriores requerir├ín regenerar los   Ôöé
Ôöé  paneles afectados.                     Ôöé
Ôöé                                         Ôöé
Ôöé  [ Cancelar ]  [ Generar ]              Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

### 4.3 Generaci├│n en tiempo real (Fase 2)

El usuario va a la vista de Fase 2. Los paneles aparecen uno a uno:

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  Escena 01 ÔÇö El encuentro               Ôöé
Ôöé                                         Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  Ôöé
Ôöé  Ôöé Panel 1  Ôöé Ôöé Panel 2  Ôöé Ôöé  ...   Ôöé  Ôöé
Ôöé  Ôöé [imagen] Ôöé Ôöé ÔÅ│ genera Ôöé Ôöé        Ôöé  Ôöé
Ôöé  Ôöé [Ô£ô] [Ô£ù] Ôöé Ôöé          Ôöé Ôöé        Ôöé  Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé
Ôöé                                         Ôöé
Ôöé  Escena 02 ÔÇö La decisi├│n                Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ                           Ôöé
Ôöé  Ôöé ÔÅ│ esperaÔöé                           Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ                           Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

---

## Flujo 5 ÔÇö Volver a un proyecto existente

### 5.1 Pantalla de inicio con proyectos

```
ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ
Ôöé  ­ƒÄ¼ MovieAI                  [ + Nueva pel├¡cula]Ôöé
Ôöé                                                Ôöé
Ôöé  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ  ÔöîÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÉ            Ôöé
Ôöé  Ôöé El ├║ltimo    Ôöé  Ôöé La ciudad    Ôöé            Ôöé
Ôöé  Ôöé tren         Ôöé  Ôöé olvidada     Ôöé            Ôöé
Ôöé  Ôöé Drama        Ôöé  Ôöé Sci-Fi       Ôöé            Ôöé
Ôöé  Ôöé Fase 1 ┬À 80% Ôöé  Ôöé Fase 2 ┬À 3/5 Ôöé            Ôöé
Ôöé  Ôöé [Continuar]  Ôöé  Ôöé escenas Ô£ô    Ôöé            Ôöé
Ôöé  ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ  Ôöé [Continuar]  Ôöé            Ôöé
Ôöé                    ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ            Ôöé
ÔööÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÿ
```

Cada tarjeta muestra: t├¡tulo, g├®nero, fase actual, progreso resumido.

---

## Flujo 6 ÔÇö Editar despu├®s de avanzar a Fase 2

### 6.1 El usuario quiere modificar un bloque de Fase 1

Desde Fase 2, hay un bot├│n "ÔåÉ Editar proyecto" que vuelve al editor libre. El usuario puede modificar cualquier bloque libremente.

**Si modifica un bloque que ya tiene imagen generada:**
```
ÔÜá´©Å Has modificado la descripci├│n de Marco.
   La imagen de referencia puede no ser coherente.
   [Regenerar imagen]  [Mantener imagen actual]
```

**Si modifica un personaje o escenario referenciado en escenas:**
```
ÔÜá´©Å Marco aparece en 3 escenas con paneles generados.
   Los cambios pueden afectar la coherencia visual.
   [Ver paneles afectados]  [Continuar igualmente]
```

### 6.2 El usuario elimina un personaje referenciado en escenas

```
ÔÜá´©Å Marco est├í asignado a 3 escenas:
   ┬À Escena 01 ÔÇö El encuentro
   ┬À Escena 02 ÔÇö La decisi├│n
   ┬À Escena 03 ÔÇö El ├║ltimo and├®n

   Si eliminas este personaje, se eliminar├í
   de esas escenas. Los paneles ya generados
   no se modifican autom├íticamente.

   [ Cancelar ]  [ Eliminar igualmente ]
```

---

## Flujo 7 ÔÇö Errores y casos l├¡mite

| Situaci├│n | Lo que ve el usuario |
|-----------|---------------------|
| ComfyUI no disponible al generar imagen | "No se puede conectar con el motor de im├ígenes. Comprueba que ComfyUI est├í activo en Dragon." + [Reintentar] |
| IA local no responde al pulsar [IA] | "El asistente no est├í disponible ahora. Puedes continuar sin validaci├│n." (timeout 10s) |
| El usuario cierra el navegador con cambios sin guardar | Guardado autom├ítico cada 1s de inactividad ÔÇö al reabrir, los cambios est├ín |
| Fichero `.md` corrupto o ilegible | "No se pudo cargar este bloque. El fichero puede estar da├▒ado." + ruta del fichero |
| Generaci├│n de storyboard interrumpida a mitad | Los paneles ya generados se conservan. Al retomar, contin├║a desde el ├║ltimo panel pendiente |

---

## Pantallas identificadas

| Pantalla | Cubierta por issue |
|----------|--------------------|
| Lista de proyectos (vac├¡a y con proyectos) | ÔÜá´©Å No tiene issue ÔÇö nuevo issue necesario |
| Modal de creaci├│n de proyecto | ÔÜá´©Å No tiene issue ÔÇö nuevo issue necesario |
| Editor de bloques libre | ÔÜá´©Å Reemplaza el dise├▒o anterior de T-03 a T-08 |
| Selector de tipo de bloque | ÔÜá´©Å No tiene issue espec├¡fico |
| Panel lateral de imagen | ÔÜá´©Å No tiene issue espec├¡fico |
| Vista de escenas (lista) | ÔÜá´©Å Parcialmente en T-08 ÔÇö revisar |
| Editor de escena individual | ÔÜá´©Å Parcialmente en T-08 ÔÇö revisar |
| Confirmaci├│n de generaci├│n | ÔÜá´©Å En T-09 ÔÇö revisar |
| Vista de Fase 2 (storyboard en tiempo real) | ÔØî Fuera de scope Fase 1 |

---

## Decisiones de UX pendientes

| # | Pregunta | Impacto |
|---|----------|---------|
| D1 | ┬┐Los bloques tienen orden fijo (drag & drop para reordenar) o el orden es el de creaci├│n? | UX del editor |
| D2 | ┬┐El editor libre y las escenas son tabs del mismo layout o pantallas separadas? | Navegaci├│n global |
| D3 | ┬┐Hay l├¡mite de bloques por proyecto? | Rendimiento con muchos bloques |
| D4 | ┬┐Los bloques de tipo "Di├ílogo" y "Acci├│n" en el editor libre son diferentes a los de dentro de una escena, o son el mismo componente? | Arquitectura de componentes |

---

## Gaps detectados respecto a issues actuales

Los issues T-03 a T-08 fueron dise├▒ados para un formulario de 5 secciones fijas. Con el nuevo concepto de editor de bloques, **necesitan ser revisados o reemplazados**:

| Issue | Estado | Acci├│n recomendada |
|-------|--------|--------------------|
| T-01 (#27) | Ô£à V├ílido | Mantener ÔÇö estructura de ficheros sigue igual |
| T-02 (#28) | Ô£à V├ílido | Mantener ÔÇö API de persistencia sigue siendo necesaria |
| T-03 (#29) | ­ƒöä Revisar | El layout cambia: editor de bloques + panel lateral |
| T-04 (#30) | ­ƒöä Revisar | Sinopsis pasa a ser un tipo de bloque, no una secci├│n |
| T-05 (#31) | ­ƒöä Revisar | Personaje pasa a ser un tipo de bloque |
| T-06 (#32) | ­ƒöä Revisar | Escenario pasa a ser un tipo de bloque |
| T-07 (#33) | ­ƒöä Revisar | Estructura narrativa pasa a ser un tipo de bloque |
| T-08 (#34) | ­ƒöä Revisar | Escenas tienen su propio editor con bloques internos |
| T-09 (#35) | Ô£à V├ílido | L├│gica de desbloqueo del bot├│n Generar ÔÇö condici├│n cambia ligeramente |
| T-10 (#36) | Ô£à V├ílido | Feedback IA por bloque ÔÇö concepto se mantiene |
| T-11 (#37) | Ô£à V├ílido | Generaci├│n de im├ígenes ÔÇö concepto se mantiene |
| ÔÇö | ÔØî Falta | Nueva pantalla: lista de proyectos + creaci├│n |
| ÔÇö | ÔØî Falta | Nueva tarea: editor de bloques libre (core de la app) |
| ÔÇö | ÔØî Falta | Nueva tarea: panel lateral de imagen |
| ÔÇö | ÔØî Falta | Nueva tarea: editor de escena individual con bloques internos |

