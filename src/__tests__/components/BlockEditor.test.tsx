import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlockEditor } from '@/components/BlockEditor'
import type { Block } from '@/store/editorStore'

function makeBlock(overrides: Partial<Block>): Block {
  return {
    id: overrides.id ?? 'b1',
    type: overrides.type ?? 'action',
    slug: 'bloque',
    filename: 'blocks/block-001-action.md',
    order: 1,
    content: overrides.content ?? 'Contenido',
    hasImage: false,
    status: 'draft',
    ...overrides,
  }
}

const mockBlocks: Block[] = [
  makeBlock({ id: 'b1', type: 'action',   content: 'Bloque de acción',      order: 1 }),
  makeBlock({ id: 'b2', type: 'dialogue', content: 'Diálogo del personaje', order: 2 }),
]

describe('BlockEditor — renderizado', () => {
  it('renderiza todos los bloques recibidos', () => {
    render(<BlockEditor blocks={mockBlocks} onBlocksChange={vi.fn()} />)
    expect(screen.getAllByTestId('block')).toHaveLength(2)
  })

  it('muestra botones para añadir bloques', () => {
    render(<BlockEditor blocks={[]} onBlocksChange={vi.fn()} />)
    expect(screen.getAllByRole('button', { name: /añadir bloque/i }).length).toBeGreaterThan(0)
  })

  it('en contexto scene solo muestra tipos action/dialogue/note', () => {
    render(<BlockEditor blocks={[]} context="scene" onBlocksChange={vi.fn()} />)
    const addButtons = screen.getAllByRole('button', { name: /añadir bloque/i })
    const labels = addButtons.map((b) => b.getAttribute('aria-label') ?? '')
    expect(labels.some((l) => l.includes('Sinopsis'))).toBe(false)
    expect(labels.some((l) => l.includes('Acción'))).toBe(true)
  })

  it('en contexto free muestra todos los tipos', () => {
    render(<BlockEditor blocks={[]} context="free" onBlocksChange={vi.fn()} />)
    const addButtons = screen.getAllByRole('button', { name: /añadir bloque/i })
    expect(addButtons.length).toBe(6)
  })
})

describe('BlockEditor — eliminar bloque', () => {
  it('llama onBlocksChange sin el bloque eliminado', async () => {
    const onChange = vi.fn()
    render(<BlockEditor blocks={mockBlocks} onBlocksChange={onChange} />)
    const [firstBlock] = screen.getAllByTestId('block')
    await userEvent.click(within(firstBlock).getByRole('button', { name: /eliminar/i }))
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 'b2' })])
    )
    const call = onChange.mock.calls[0][0] as Block[]
    expect(call.find((b) => b.id === 'b1')).toBeUndefined()
  })
})

describe('BlockEditor — añadir bloque', () => {
  it('añade un bloque action al pulsar su botón', async () => {
    const onChange = vi.fn()
    render(<BlockEditor blocks={[]} onBlocksChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /añadir bloque acción/i }))
    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ type: 'action' })])
  })

  it('añade un bloque dialogue al pulsar su botón', async () => {
    const onChange = vi.fn()
    render(<BlockEditor blocks={[]} onBlocksChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /añadir bloque diálogo/i }))
    expect(onChange).toHaveBeenCalledWith([expect.objectContaining({ type: 'dialogue' })])
  })

  it('el bloque añadido tiene order correcto', async () => {
    const onChange = vi.fn()
    render(<BlockEditor blocks={mockBlocks} onBlocksChange={onChange} />)
    await userEvent.click(screen.getByRole('button', { name: /añadir bloque nota/i }))
    const call = onChange.mock.calls[0][0] as Block[]
    expect(call[call.length - 1].order).toBe(3)
  })
})

describe('BlockEditor — actualizar contenido', () => {
  it('llama onBlocksChange al escribir en un bloque', async () => {
    const onChange = vi.fn()
    render(<BlockEditor blocks={[makeBlock({ id: 'b1', content: '' })]} onBlocksChange={onChange} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalled()
    const call = onChange.mock.calls[0][0] as Block[]
    expect(call[0].id).toBe('b1')
  })
})
