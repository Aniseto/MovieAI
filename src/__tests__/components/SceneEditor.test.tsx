import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SceneEditor } from '@/components/SceneEditor'
import { useEditorStore, getEditorInitialState } from '@/store/editorStore'
import type { Block } from '@/store/editorStore'
import type { SceneData } from '@/components/SceneEditor'

// Reset store antes de cada test
beforeEach(() => useEditorStore.setState(getEditorInitialState()))

const mockScene: SceneData = {
  id: 'escena-01-llegada',
  title: 'Llegada a la ciudad',
  locationSlug: '',
  moment: 'Noche',
  characters: [],
  emotion: ['Tensión'],
  blocks: [
    {
      id: 'b1', type: 'action', slug: 'b1',
      filename: 'blocks/block-001-action.md', order: 1,
      content: 'El tren frena lentamente', hasImage: false, status: 'draft',
    } satisfies Block,
  ],
}

describe('SceneEditor — renderizado', () => {
  it('renderiza el título de la escena', () => {
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getByDisplayValue('Llegada a la ciudad')).toBeInTheDocument()
  })

  it('renderiza los bloques existentes', () => {
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getAllByTestId('block')).toHaveLength(1)
  })

  it('muestra el botón de guardar', () => {
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument()
  })

  it('muestra botones de añadir bloque (context=scene)', () => {
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getAllByRole('button', { name: /añadir bloque/i }).length).toBeGreaterThan(0)
  })

  it('solo muestra tipos action/dialogue/note en context=scene', () => {
    render(<SceneEditor scene={mockScene} />)
    const addBtns = screen.getAllByRole('button', { name: /añadir bloque/i })
    const labels = addBtns.map((b) => b.getAttribute('aria-label') ?? '')
    expect(labels.some((l) => l.includes('Sinopsis'))).toBe(false)
    expect(labels.some((l) => l.includes('Acción'))).toBe(true)
  })
})

describe('SceneEditor — metadatos', () => {
  it('precarga el momento del día', () => {
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getByDisplayValue('Noche')).toBeInTheDocument()
  })

  it('muestra los chips de emoción y marca los activos', () => {
    render(<SceneEditor scene={mockScene} />)
    const tensionBtn = screen.getByRole('button', { name: /tensión/i })
    expect(tensionBtn.className).toContain('amber')
  })

  it('toggle de emoción activa/desactiva', async () => {
    render(<SceneEditor scene={mockScene} />)
    const btn = screen.getByRole('button', { name: /alegría/i })
    await userEvent.click(btn)
    expect(btn.className).toContain('amber')
    await userEvent.click(btn)
    expect(btn.className).not.toContain('amber')
  })
})

describe('SceneEditor — guardar', () => {
  it('llama onSave con el título actualizado', async () => {
    const onSave = vi.fn()
    render(<SceneEditor scene={mockScene} onSave={onSave} />)
    const input = screen.getByDisplayValue('Llegada a la ciudad')
    await userEvent.clear(input)
    await userEvent.type(input, 'Nueva llegada')
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ title: 'Nueva llegada' }))
  })

  it('llama onSave con las emociones seleccionadas', async () => {
    const onSave = vi.fn()
    render(<SceneEditor scene={{ ...mockScene, emotion: [] }} onSave={onSave} />)
    await userEvent.click(screen.getByRole('button', { name: /miedo/i }))
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }))
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({ emotion: ['Miedo'] }))
  })
})

describe('SceneEditor — personajes del store', () => {
  it('muestra personajes del store como chips', () => {
    useEditorStore.setState({
      ...getEditorInitialState(),
      blocks: [
        {
          id: 'c1', type: 'character', slug: 'marco',
          filename: 'personajes/marco.md', order: 1,
          content: 'Marco', hasImage: true, status: 'draft',
        },
      ],
    })
    render(<SceneEditor scene={mockScene} />)
    expect(screen.getByRole('button', { name: /marco/i })).toBeInTheDocument()
  })
})
