import { describe, it, expect } from 'vitest'
import type { Block, Project, Scene, BlockType } from '@/types'

describe('types', () => {
  it('Block type tiene los campos requeridos', () => {
    const block: Block = {
      id: '1',
      type: 'action',
      slug: 'test',
      filename: 'blocks/block-001-action.md',
      order: 1,
      content: 'contenido',
      hasImage: false,
      status: 'draft'
    }
    expect(block.id).toBe('1')
    expect(block.type).toBe('action')
  })

  it('Project type tiene los campos requeridos', () => {
    const project: Project = {
      slug: 'mi-proyecto',
      title: 'Mi Proyecto',
      genre: 'Drama',
      tone: 'oscuro',
      vision: 'Una historia...',
      phase: 1,
      created: '2026-09-01',
      updated: '2026-09-01'
    }
    expect(project.slug).toBe('mi-proyecto')
  })

  it('BlockType solo acepta valores válidos', () => {
    const validTypes: BlockType[] = ['synopsis', 'action', 'dialogue', 'note', 'character', 'location']
    expect(validTypes).toHaveLength(6)
  })
})
