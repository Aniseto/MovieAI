/**
 * lib/scene-md-writer.ts
 * Genera y parsea el Markdown de una escena siguiendo el formato escena-md-format.md
 */

import type { SceneData } from '@/components/SceneEditor'
import type { Block } from '@/store/editorStore'

// ─── Tipos internos ───────────────────────────────────────────────────────────

export interface SceneMdInput {
  title: string
  order?: number
  slug?: string
  locationSlug?: string   // slug del escenario, ej: "estacion-central"
  location?: string       // alias legacy, se normaliza a locationSlug
  moment?: string
  emotion?: string[]
  duration?: number
  characters?: string[]   // slugs de personajes, ej: ["marco", "elena"]
  blocks?: Block[]
  updated?: string
}

export interface SceneMdParsed {
  title: string
  order: number
  slug: string
  locationSlug: string
  moment: string
  emotion: string[]
  duration: number | null
  characters: string[]     // slugs extraídos de los enlaces
  action: string
  dialogues: string
  notes: string
  blocks: Block[]
  updated: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'escena'
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// ─── buildSceneMd ─────────────────────────────────────────────────────────────

/**
 * Genera el contenido completo de escena-{nn}-{slug}.md
 */
export function buildSceneMd(scene: SceneMdInput, order = scene.order ?? 1): string {
  const nn       = String(order).padStart(2, '0')
  const slug     = scene.slug ?? toSlug(scene.title)
  const locSlug  = scene.locationSlug ?? scene.location ?? ''
  const emotion  = scene.emotion ?? []
  const chars    = scene.characters ?? []
  const blocks   = scene.blocks ?? []

  // Separar bloques por tipo para las secciones Acción / Diálogos / Notas
  const actionBlocks   = blocks.filter((b) => b.type === 'action')
  const dialogBlocks   = blocks.filter((b) => b.type === 'dialogue')
  const noteBlocks     = blocks.filter((b) => b.type === 'note')

  const actionText   = actionBlocks.map((b) => b.content).filter(Boolean).join('\n\n') || ''
  const dialogText   = dialogBlocks.map((b) => b.content).filter(Boolean).join('\n\n') || ''
  const notesText    = noteBlocks.map((b) => b.content).filter(Boolean).join('\n\n') || ''

  const lines: string[] = []

  // H1
  lines.push(`# Escena ${nn} — ${scene.title}`)
  lines.push('')

  // Metadatos
  lines.push(`order: ${order}`)
  lines.push(`slug: ${slug}`)
  lines.push(`location: ${locSlug ? `escenarios/${locSlug}.md` : ''}`)
  lines.push(`moment: ${scene.moment ?? ''}`)
  lines.push(`emotion: ${emotion.join(', ')}`)
  if (scene.duration != null) lines.push(`duration: ${scene.duration}`)
  lines.push(`updated: ${scene.updated ?? today()}`)
  lines.push('')

  // Personajes
  lines.push('## Personajes')
  lines.push('')
  if (chars.length > 0) {
    chars.forEach((slug) => {
      // Intentamos capitalizar el slug para el nombre legible
      const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
      lines.push(`- [${name}](../personajes/${slug}.md)`)
    })
  }
  lines.push('')

  // Acción
  lines.push('## Acción')
  lines.push('')
  if (actionText) lines.push(actionText)
  lines.push('')

  // Diálogos clave (solo si hay contenido)
  if (dialogText) {
    lines.push('## Diálogos clave')
    lines.push('')
    lines.push(dialogText)
    lines.push('')
  }

  // Notas de producción (solo si hay contenido)
  if (notesText) {
    lines.push('## Notas de producción')
    lines.push('')
    lines.push(notesText)
    lines.push('')
  }

  return lines.join('\n')
}

// ─── writeSceneMd (alias para compatibilidad con tests del issue) ─────────────

export function writeSceneMd(scene: SceneMdInput & { blocks?: (Block & { character?: string })[] }): string {
  return buildSceneMd(scene)
}

// ─── parseSceneMd ────────────────────────────────────────────────────────────

/**
 * Parsea el contenido de un fichero escena-{nn}-{slug}.md
 */
export function parseSceneMd(content: string): SceneMdParsed {
  const lines = content.split('\n')
  let i = 0

  // ── H1 ────────────────────────────────────────────────────────────────────
  const h1Match = lines[0]?.match(/^#\s+Escena\s+(\d+)\s+[—–-]\s+(.+)$/)
  const order  = h1Match ? parseInt(h1Match[1], 10) : 1
  const title  = h1Match ? h1Match[2].trim() : lines[0]?.replace(/^#+\s*/, '') ?? ''
  i = 1

  // ── Metadatos (entre H1 y primer H2) ─────────────────────────────────────
  const fields: Record<string, string> = {}
  while (i < lines.length && !lines[i].startsWith('## ')) {
    const m = lines[i].match(/^(\w+):\s*(.*)$/)
    if (m) fields[m[1]] = m[2].trim()
    i++
  }

  const slug       = fields.slug       ?? toSlug(title)
  const locRaw     = fields.location   ?? ''
  const locationSlug = locRaw.replace(/^escenarios\//, '').replace(/\.md$/, '')
  const moment     = fields.moment     ?? ''
  const emotion    = fields.emotion    ? fields.emotion.split(',').map((s) => s.trim()).filter(Boolean) : []
  const duration   = fields.duration   ? parseInt(fields.duration, 10) : null
  const updated    = fields.updated    ?? today()

  // ── Secciones H2 ─────────────────────────────────────────────────────────
  const sections: Record<string, string[]> = {}
  let currentSection = ''

  while (i < lines.length) {
    const h2Match = lines[i].match(/^##\s+(.+)$/)
    if (h2Match) {
      currentSection = h2Match[1].trim()
      sections[currentSection] = []
    } else if (currentSection) {
      sections[currentSection].push(lines[i])
    }
    i++
  }

  const trimSection = (key: string) =>
    (sections[key] ?? []).join('\n').trim()

  // ── Personajes (extraer slugs de los enlaces) ─────────────────────────────
  const charLines = sections['Personajes'] ?? []
  const characters = charLines
    .map((l) => l.match(/\[.*?\]\(\.\.\/personajes\/(.+?)\.md\)/)?.[1])
    .filter((x): x is string => Boolean(x))

  // ── Reconstruir bloques desde secciones ──────────────────────────────────
  const blocks: Block[] = []
  let blockOrder = 1

  const actionText  = trimSection('Acción')
  const dialogText  = trimSection('Diálogos clave')
  const notesText   = trimSection('Notas de producción')

  if (actionText) {
    blocks.push({
      id: `parsed-action-${blockOrder}`, type: 'action',
      slug: 'action', filename: '', order: blockOrder++,
      content: actionText, hasImage: false, status: 'draft',
    })
  }
  if (dialogText) {
    blocks.push({
      id: `parsed-dialogue-${blockOrder}`, type: 'dialogue',
      slug: 'dialogue', filename: '', order: blockOrder++,
      content: dialogText, hasImage: false, status: 'draft',
    })
  }
  if (notesText) {
    blocks.push({
      id: `parsed-note-${blockOrder}`, type: 'note',
      slug: 'note', filename: '', order: blockOrder++,
      content: notesText, hasImage: false, status: 'draft',
    })
  }

  return {
    title, order, slug, locationSlug, moment, emotion,
    duration, characters,
    action:    actionText,
    dialogues: dialogText,
    notes:     notesText,
    blocks,
    updated,
  }
}

// ─── sceneDataToMd ────────────────────────────────────────────────────────────

/**
 * Convierte SceneData del editor a Markdown listo para persistir.
 * Puente entre el estado del editor y el escritor de ficheros.
 */
export function sceneDataToMd(scene: SceneData, order: number): string {
  return buildSceneMd({
    title:       scene.title,
    order,
    slug:        toSlug(scene.title),
    locationSlug: scene.locationSlug,
    moment:      scene.moment,
    emotion:     scene.emotion,
    characters:  scene.characters,
    blocks:      scene.blocks,
    updated:     today(),
  })
}
