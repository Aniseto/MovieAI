import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Block } from '@/components/Block'
import type { Block as BlockType } from '@/store/editorStore'

function makeBlock(overrides: Partial<BlockType> = {}): BlockType {
  return {
    id: 'b1',
    type: 'action',
    slug: 'el-protagonista-entra',
    filename: 'blocks/block-001-action.md',
    order: 1,
    content: 'El protagonista entra',
    hasImage: false,
    status: 'draft',
    ...overrides,
  }
}

describe('Block — renderizado básico', () => {
  it('renderiza el tipo de bloque correctamente', () => {
    render(<Block block={makeBlock()} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/acción/i)).toBeInTheDocument()
  })

  it('renderiza el contenido en la textarea', () => {
    render(<Block block={makeBlock()} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('El protagonista entra')
  })

  it('renderiza el botón IA siempre', () => {
    render(<Block block={makeBlock()} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: /ayuda ia/i })).toBeInTheDocument()
  })
})

describe('Block — botón de imagen', () => {
  it('muestra el botón de imagen solo si hasImage es true', () => {
    render(<Block block={makeBlock({ hasImage: true })} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: /imagen/i })).toBeInTheDocument()
  })

  it('no muestra el botón de imagen si hasImage es false', () => {
    render(<Block block={makeBlock({ hasImage: false })} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.queryByRole('button', { name: /imagen/i })).not.toBeInTheDocument()
  })

  it('llama onImageClick al pulsar el botón de imagen', async () => {
    const onImageClick = vi.fn()
    render(<Block block={makeBlock({ hasImage: true })} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} onImageClick={onImageClick} />)
    await userEvent.click(screen.getByRole('button', { name: /imagen/i }))
    expect(onImageClick).toHaveBeenCalledOnce()
  })
})

describe('Block — interacciones', () => {
  it('llama onUpdate cuando el usuario escribe en la textarea', async () => {
    const onUpdate = vi.fn()
    render(<Block block={makeBlock({ content: '' })} context="free" onUpdate={onUpdate} onRemove={vi.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'nuevo texto')
    expect(onUpdate).toHaveBeenCalled()
  })

  it('llama onRemove con el id al pulsar el botón eliminar', async () => {
    const onRemove = vi.fn()
    render(<Block block={makeBlock()} context="free" onUpdate={vi.fn()} onRemove={onRemove} />)
    await userEvent.click(screen.getByRole('button', { name: /eliminar/i }))
    expect(onRemove).toHaveBeenCalledWith('b1')
  })
})

describe('Block — contexto', () => {
  it('renderiza en contexto scene si el tipo es action', () => {
    render(<Block block={makeBlock({ type: 'action' })} context="scene" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/acción/i)).toBeInTheDocument()
  })

  it('no renderiza un bloque synopsis en contexto scene', () => {
    const { container } = render(<Block block={makeBlock({ type: 'synopsis' })} context="scene" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renderiza un bloque synopsis en contexto free', () => {
    render(<Block block={makeBlock({ type: 'synopsis' })} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByText(/sinopsis/i)).toBeInTheDocument()
  })
})

describe('Block — drag handle', () => {
  it('renderiza el drag handle', () => {
    render(<Block block={makeBlock()} context="free" onUpdate={vi.fn()} onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: /arrastrar/i })).toBeInTheDocument()
  })
})
