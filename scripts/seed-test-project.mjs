#!/usr/bin/env node
// scripts/seed-test-project.mjs
// Crea un proyecto de prueba con datos realistas para testing manual
// Uso: node scripts/seed-test-project.mjs

import fs from 'fs'
import path from 'path'
import os from 'os'

const PROJECTS_ROOT = process.env.MOVIEAI_PROJECTS_ROOT
  ?? path.join(os.homedir(), 'MovieAI', 'projects')

const SLUG = 'el-ultimo-tren'
const DIR  = path.join(PROJECTS_ROOT, SLUG)

// ── Helpers ────────────────────────────────────────────────────────────────

function write(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log('  ✓', path.relative(PROJECTS_ROOT, filePath))
}

// ── Borrar proyecto anterior si existe ────────────────────────────────────

if (fs.existsSync(DIR)) {
  fs.rmSync(DIR, { recursive: true, force: true })
  console.log('🗑  Proyecto anterior eliminado\n')
}

console.log(`🌱 Creando proyecto de prueba: "${SLUG}"\n`)

// ── project.md ────────────────────────────────────────────────────────────

write(path.join(DIR, 'project.md'), `\
# El último tren

slug: ${SLUG}
genre: Drama
tone: Íntimo, Melancólico
phase: 1
updated: ${new Date().toISOString().slice(0, 10)}

## Visión

Una historia sobre la memoria, la identidad y la elección de vivir.
Un hombre sin pasado que descubre que el olvido puede ser un regalo.
`)

// ── sinopsis.md ───────────────────────────────────────────────────────────

write(path.join(DIR, 'sinopsis.md'), `\
# Sinopsis

## Logline

Un hombre sin memoria despierta en una estación de tren y debe decidir si quiere recuperar su pasado.

## Sinopsis

Marco, 45 años, despierta en el andén de una estación sin recordar quién es.
En su bolsillo, una fotografía de una mujer y un billete de tren sin destino.
A medida que investiga su identidad, descubre que quizás eligió olvidar.
`)

// ── estructura.md ─────────────────────────────────────────────────────────

write(path.join(DIR, 'estructura.md'), `\
# Estructura

## Acto 1 — Planteamiento

Marco despierta sin memoria en la Estación Central. Solo tiene una fotografía y un billete.
Los empleados de la estación lo conocen, aunque él no los recuerde.

## Punto de giro 1

Encuentra un diario escondido en su taquilla. La última entrada dice: "Mañana lo olvidaré todo. Es lo mejor."

## Acto 2 — Conflicto

Marco investiga su pasado siguiendo las pistas del diario.
Encuentra a Elena, la mujer de la fotografía, que vive en la ciudad pero lo trata como a un extraño.
Descubre que era un periodista que investigaba una trama de corrupción.

## Punto de giro 2

Elena le revela que él mismo se sometió a un procedimiento experimental para olvidar.
Alguien lo amenazó: "Olvida o te matamos."

## Acto 3 — Desenlace

Marco tiene la evidencia para publicar la historia pero también la opción de subirse al tren y empezar de cero.
Decide quedarse.
`)

// ── personajes ────────────────────────────────────────────────────────────

write(path.join(DIR, 'personajes', 'marco.md'), `\
# Marco

role: protagonista
age: 45

## Apariencia

Alto, pelo canoso, ojos grises. Viste ropa discreta, casi invisible.
Tiene una cicatriz pequeña detrás de la oreja izquierda.

## Personalidad

Reservado, observador, metódico. Confía más en los hechos que en las personas.
Bajo la frialdad hay una profunda necesidad de conexión.

## Motivación

Recuperar su identidad. Descubrir por qué eligió olvidar.
`)

write(path.join(DIR, 'personajes', 'elena.md'), `\
# Elena

role: secundario
age: 41

## Apariencia

Morena, mirada intensa. Siempre viste de negro. Lleva el mismo reloj desde hace años.

## Personalidad

Directa, protectora, herida. Sabe más de lo que dice.

## Motivación

Proteger a Marco de las consecuencias de su pasado. Quizás también protegerse a sí misma.
`)

// ── escenarios ────────────────────────────────────────────────────────────

write(path.join(DIR, 'escenarios', 'estacion-central.md'), `\
# Estación Central

type: INT
lighting: artificial, fluorescente

## Descripción

Gran estación art déco de los años 40. Andenes largos, techos altos.
El sonido de los trenes llena el espacio constantemente.

## Atmósfera

Transitoria, anónima. La gente pasa pero nadie se queda.
Perfecta para alguien que no sabe quién es.

## Elementos clave

El banco del andén 7 donde Marco despierta.
La taquilla 231 con el diario.
La cafetería donde trabaja Sofía, la empleada que lo conoce.
`)

write(path.join(DIR, 'escenarios', 'apartamento-elena.md'), `\
# Apartamento de Elena

type: INT
lighting: natural, cálido

## Descripción

Apartamento pequeño en el centro histórico. Libros por todas partes.
Plantas en la ventana. Una pared llena de fotografías — ninguna con Marco.

## Atmósfera

Ordenado pero con capas. Cada objeto tiene una historia no contada.
`)

// ── bloques libres ────────────────────────────────────────────────────────

write(path.join(DIR, 'blocks', 'block-001-synopsis.md'), `\
# block-001-synopsis

type: synopsis
order: 001

## Contenido

Una historia sobre la memoria, la identidad y la elección de vivir.
¿Qué somos sin nuestros recuerdos? ¿Y si el olvido fuera un acto de valentía?
`)

write(path.join(DIR, 'blocks', 'block-002-action.md'), `\
# block-002-action

type: action
order: 002

## Contenido

Marco abre los ojos. El techo alto de la estación. El ruido de los trenes.
No sabe quién es. No sabe cómo ha llegado aquí.
Se incorpora despacio. En la mano, una fotografía arrugada.
`)

write(path.join(DIR, 'blocks', 'block-003-dialogue.md'), `\
# block-003-dialogue

type: dialogue
order: 003

## Contenido

SOFÍA (acercándose)
Otra vez aquí, Marco. Pensé que hoy no venías.

MARCO (confundido)
¿Me conoce?

SOFÍA (sonriendo)
Llevas tres semanas despertando en ese banco.
`)

write(path.join(DIR, 'blocks', 'block-004-note.md'), `\
# block-004-note

type: note
order: 004

## Contenido

NOTA DE AUTOR: El tono debe ser contenido. Marco no reacciona de forma exagerada.
El misterio se construye con silencios, no con drama explícito.
Referencia visual: "El hombre sin pasado" (Kaurismäki, 2002).
`)

// ── escenas ───────────────────────────────────────────────────────────────

write(path.join(DIR, 'escenas', 'escena-01-despertar.md'), `\
# El despertar

locationSlug: estacion-central
moment: Amanecer
emotion: Desorientación
duration: 3 min

## Personajes

Marco, Sofía

## Acción

Marco despierta en el banco del andén 7.
Mira a su alrededor sin reconocer nada.
Sofía se acerca con un café.

## Diálogos

Ver block-003-dialogue

## Notas

Primera escena. Establecer el tono visual: frío, desaturado.
La cámara sigue a Marco desde atrás antes de mostrar su cara.
`)

write(path.join(DIR, 'escenas', 'escena-02-la-taquilla.md'), `\
# La taquilla

locationSlug: estacion-central
moment: Mañana
emotion: Tensión creciente
duration: 4 min

## Personajes

Marco

## Acción

Marco encuentra la llave de la taquilla en su bolsillo.
La abre. Dentro: el diario, algo de dinero y una llave de apartamento.
Lee la última entrada del diario.

## Notas

Sin diálogos. Solo acción y sonido ambiente.
El silencio es intencionado.
`)

console.log(`
✅ Proyecto de prueba creado en:
   ${DIR}

🚀 Para probarlo:
   1. npm run dev (si no está corriendo)
   2. Abre http://localhost:3000
   3. Verás "El último tren" en la lista de proyectos
   4. Pulsa "Continuar" para abrir el editor
`)
