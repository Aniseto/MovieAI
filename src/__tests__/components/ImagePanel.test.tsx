import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImagePanel } from '@/components/ImagePanel'

const baseProps = {
  projectSlug: 'mi-peli',
  blockId: 'b1' as string | null,
  imageUrl: null as string | null,
  onImageChange: vi.fn(),
}

beforeEach(() => {
  vi.restoreAllMocks()
  baseProps.onImageChange = vi.fn()
})

describe('ImagePanel — sin blockId activo', () => {
  it('muestra el placeholder cuando no hay bloque activo', () => {
    render(<ImagePanel {...baseProps} blockId={null} />)
    expect(screen.getByText(/pulsa/i)).toBeInTheDocument()
  })
})

describe('ImagePanel — estado vacío (bloque activo sin imagen)', () => {
  it('muestra el texto sin imagen', () => {
    render(<ImagePanel {...baseProps} />)
    expect(screen.getByText(/sin imagen/i)).toBeInTheDocument()
  })

  it('muestra el botón generar', () => {
    render(<ImagePanel {...baseProps} />)
    expect(screen.getByRole('button', { name: /generar/i })).toBeInTheDocument()
  })

  it('no muestra el botón validar si no hay imagen', () => {
    render(<ImagePanel {...baseProps} />)
    expect(screen.queryByRole('button', { name: /validar/i })).not.toBeInTheDocument()
  })
})

describe('ImagePanel — con imagen', () => {
  it('muestra la imagen si imageUrl tiene valor', () => {
    render(<ImagePanel {...baseProps} imageUrl="https://example.com/img.jpg" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('muestra el botón regenerar cuando ya hay imagen', () => {
    render(<ImagePanel {...baseProps} imageUrl="https://example.com/img.jpg" />)
    expect(screen.getByRole('button', { name: /regenerar/i })).toBeInTheDocument()
  })

  it('muestra el botón validar cuando ya hay imagen', () => {
    render(<ImagePanel {...baseProps} imageUrl="https://example.com/img.jpg" />)
    expect(screen.getByRole('button', { name: /validar/i })).toBeInTheDocument()
  })
})

describe('ImagePanel — generación', () => {
  it('llama onImageChange con la URL tras generación exitosa', async () => {
    const onImageChange = vi.fn()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://example.com/new.jpg' }),
    }))
    render(<ImagePanel {...baseProps} onImageChange={onImageChange} />)
    await userEvent.click(screen.getByRole('button', { name: /generar/i }))
    await waitFor(() => expect(onImageChange).toHaveBeenCalledWith('https://example.com/new.jpg'))
  })

  it('muestra alerta de error si la generación falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Error de API' }),
    }))
    render(<ImagePanel {...baseProps} />)
    await userEvent.click(screen.getByRole('button', { name: /generar/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
  })

  it('llama onGenerate si se pasa como prop (sin fetch)', async () => {
    const onGenerate = vi.fn()
    render(<ImagePanel {...baseProps} onGenerate={onGenerate} />)
    await userEvent.click(screen.getByRole('button', { name: /generar/i }))
    expect(onGenerate).toHaveBeenCalledOnce()
  })
})
