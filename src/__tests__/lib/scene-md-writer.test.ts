import { describe, it, expect } from 'vitest'
import { buildSceneMd, writeSceneMd, parseSceneMd, sceneDataToMd } from '@/lib/scene-md-writer'
import type { Block } from '@/store/editorStore'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const actionBlock: Block = {
  id: 'b1', type: 'action', slug: 'b1',
  filename: 'blocks/block-001-action.md', order: 1,
  content: 'El protagonista entra lentamente', hasImage: false, status: 'draft',
}

const dialogBlock: Block = {
  id: 'b2', type: 'dialogue', slug: 'b2',
  filename: 'blocks/block-002-dialogue.md', order: 2,
  content: '¿Quién eres tú?', hasImage: false, status: 'draft',
}

const noteBlock: Block = {
  id: 'b3', type: 'note', slug: 'b3',
  filename: 'blocks/block-003-note.md', order: 3,
  content: 'Referencia visual: Kaurismäki', hasImage: false, status: 'draft',
}

// ─── buildSceneMd ─────────────────────────────────────────────────────────────

describe('buildSceneMd — estructura básica', () => {
  it('genera H1 con número y título', () => {
    const md = buildSceneMd({ title: 'El encuentro', order: 1 })
    expect(md).toContain('# Escena 01 — El encuentro')
  })

  it('número de dos dígitos con cero inicial', () => {
    const md = buildSceneMd({ title: 'La huida', order: 3 })
    expect(md).toContain('# Escena 03 — La huida')
  })

  it('genera los campos de metadatos', () => {
    const md = buildSceneMd({
      title: 'El encuentro', order: 1,
      locationSlug: 'estacion-central',
      moment: 'Noche',
      emotion: ['Tensión', 'Misterio'],
    })
    expect(md).toContain('order: 1')
    expect(md).toContain('location: escenarios/estacion-central.md')
    expect(md).toContain('moment: Noche')
    expect(md).toContain('emotion: Tensión, Misterio')
  })

  it('incluye las secciones H2 obligatorias', () => {
    const md = buildSceneMd({ title: 'Test', order: 1 })
    expect(md).toContain('## Personajes')
    expect(md).toContain('## Acción')
  })

  it('no incluye Diálogos ni Notas si no hay contenido', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, blocks: [actionBlock] })
    expect(md).not.toContain('## Diálogos clave')
    expect(md).not.toContain('## Notas de producción')
  })

  it('incluye Diálogos si hay bloque dialogue', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, blocks: [dialogBlock] })
    expect(md).toContain('## Diálogos clave')
    expect(md).toContain('¿Quién eres tú?')
  })

  it('incluye Notas si hay bloque note', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, blocks: [noteBlock] })
    expect(md).toContain('## Notas de producción')
    expect(md).toContain('Kaurismäki')
  })
})

describe('buildSceneMd — personajes', () => {
  it('genera enlaces relativos a personajes', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, characters: ['marco', 'elena'] })
    expect(md).toContain('[Marco](../personajes/marco.md)')
    expect(md).toContain('[Elena](../personajes/elena.md)')
  })

  it('sección personajes vacía si no hay characters', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, characters: [] })
    expect(md).toContain('## Personajes')
    expect(md).not.toContain('../personajes/')
  })
})

describe('buildSceneMd — bloques', () => {
  it('serializa bloque action en sección Acción', () => {
    const md = buildSceneMd({ title: 'Test', order: 1, blocks: [actionBlock] })
    expect(md).toContain('El protagonista entra lentamente')
  })

  it('múltiples bloques action se unen con línea en blanco', () => {
    const b2: Block = { ...actionBlock, id: 'b2', content: 'Se detiene.' }
    const md = buildSceneMd({ title: 'Test', order: 1, blocks: [actionBlock, b2] })
    expect(md).toContain('El protagonista entra lentamente\n\nSe detiene.')
  })
})

// ─── writeSceneMd (alias) ─────────────────────────────────────────────────────

describe('writeSceneMd', () => {
  it('genera cabecera con título y location', () => {
    const md = writeSceneMd({ title: 'Escena 1', location: 'estacion-central', blocks: [] })
    expect(md).toContain('# Escena 01 — Escena 1')
    expect(md).toContain('location: escenarios/estacion-central.md')
  })

  it('serializa bloques action con su contenido', () => {
    const md = writeSceneMd({ title: 'Escena 1', location: 'Casa', blocks: [actionBlock] })
    expect(md).toContain('El protagonista entra lentamente')
  })

  it('serializa bloques dialogue con su contenido', () => {
    const md = writeSceneMd({ title: 'Escena 1', location: 'Casa', blocks: [dialogBlock] })
    expect(md).toContain('¿Quién eres tú?')
  })
})

// ─── parseSceneMd ────────────────────────────────────────────────────────────

describe('parseSceneMd — parsing básico', () => {
  const EXAMPLE = `# Escena 01 — El encuentro

order: 1
slug: el-encuentro
location: escenarios/estacion-central.md
moment: Noche
emotion: Tensión, Misterio
duration: 90
updated: 2026-09-01

## Personajes

- [Marco](../personajes/marco.md)
- [Elena](../personajes/elena.md)

## Acción

Marco entra en la estación.

## Diálogos clave

MARCO: ¿Quién eres tú?

## Notas de producción

Cámara en distancia.
`

  it('extrae el título', () => {
    expect(parseSceneMd(EXAMPLE).title).toBe('El encuentro')
  })

  it('extrae el order', () => {
    expect(parseSceneMd(EXAMPLE).order).toBe(1)
  })

  it('extrae locationSlug', () => {
    expect(parseSceneMd(EXAMPLE).locationSlug).toBe('estacion-central')
  })

  it('extrae moment', () => {
    expect(parseSceneMd(EXAMPLE).moment).toBe('Noche')
  })

  it('extrae emotion como array', () => {
    expect(parseSceneMd(EXAMPLE).emotion).toEqual(['Tensión', 'Misterio'])
  })

  it('extrae duration como número', () => {
    expect(parseSceneMd(EXAMPLE).duration).toBe(90)
  })

  it('extrae los slugs de personajes', () => {
    expect(parseSceneMd(EXAMPLE).characters).toEqual(['marco', 'elena'])
  })

  it('extrae la sección Acción', () => {
    expect(parseSceneMd(EXAMPLE).action).toContain('Marco entra en la estación.')
  })

  it('extrae los diálogos', () => {
    expect(parseSceneMd(EXAMPLE).dialogues).toContain('MARCO: ¿Quién eres tú?')
  })

  it('reconstruye bloques desde las secciones', () => {
    const parsed = parseSceneMd(EXAMPLE)
    expect(parsed.blocks.find((b) => b.type === 'action')).toBeDefined()
    expect(parsed.blocks.find((b) => b.type === 'dialogue')).toBeDefined()
    expect(parsed.blocks.find((b) => b.type === 'note')).toBeDefined()
  })
})

// ─── Round-trip ───────────────────────────────────────────────────────────────

describe('round-trip: parseSceneMd(buildSceneMd(scene))', () => {
  it('preserva título, locationSlug y moment', () => {
    const input = {
      title: 'La huida', order: 2,
      locationSlug: 'apartamento-elena', moment: 'Noche',
      emotion: ['Tensión'], characters: ['marco'],
      blocks: [actionBlock],
    }
    const parsed = parseSceneMd(buildSceneMd(input))
    expect(parsed.title).toBe('La huida')
    expect(parsed.locationSlug).toBe('apartamento-elena')
    expect(parsed.moment).toBe('Noche')
  })

  it('preserva el contenido del bloque action', () => {
    const parsed = parseSceneMd(buildSceneMd({ title: 'Test', order: 1, blocks: [actionBlock] }))
    expect(parsed.blocks[0].content).toBe('El protagonista entra lentamente')
  })

  it('preserva los personajes', () => {
    const parsed = parseSceneMd(buildSceneMd({ title: 'Test', order: 1, characters: ['marco', 'elena'] }))
    expect(parsed.characters).toEqual(['marco', 'elena'])
  })
})

// ─── sceneDataToMd ────────────────────────────────────────────────────────────

describe('sceneDataToMd', () => {
  it('genera Markdown válido desde SceneData', () => {
    const md = sceneDataToMd(
      { id: 's1', title: 'El reencuentro', locationSlug: 'estacion-central', moment: 'Tarde', emotion: ['Esperanza'], characters: ['marco'], blocks: [actionBlock] },
      3
    )
    expect(md).toContain('# Escena 03 — El reencuentro')
    expect(md).toContain('location: escenarios/estacion-central.md')
    expect(md).toContain('[Marco](../personajes/marco.md)')
  })
})
