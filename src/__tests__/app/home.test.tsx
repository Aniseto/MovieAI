import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '@/app/page'
import NewProjectModal from '@/components/NewProjectModal'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

const mockProjects = [
  { slug: 'el-ultimo-tren', title: 'El último tren', genre: 'Drama', phase: 1 },
  { slug: 'la-ciudad',      title: 'La ciudad olvidada', genre: 'Thriller', phase: 2 },
]

beforeEach(() => vi.restoreAllMocks())

// ─── Home page ────────────────────────────────────────────────────────────────

describe('Home — estado vacío', () => {
  it('muestra el mensaje vacío cuando no hay proyectos', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<Home />)
    await waitFor(() => expect(screen.getByText(/no tienes proyectos/i)).toBeInTheDocument())
  })

  it('muestra el botón de nueva película', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<Home />)
    await waitFor(() => {
      const btns = screen.getAllByRole('button', { name: /nueva película/i })
      expect(btns.length).toBeGreaterThan(0)
    })
  })
})

describe('Home — con proyectos', () => {
  it('lista los proyectos existentes', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockProjects }))
    render(<Home />)
    await waitFor(() => expect(screen.getAllByRole('listitem')).toHaveLength(2))
  })

  it('muestra el título de cada proyecto', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockProjects }))
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByText('El último tren')).toBeInTheDocument()
      expect(screen.getByText('La ciudad olvidada')).toBeInTheDocument()
    })
  })
})

describe('Home — modal', () => {
  it('abre el modal al pulsar el botón del header', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<Home />)
    await waitFor(() => screen.getAllByRole('button', { name: /nueva película/i }))
    await userEvent.click(screen.getAllByRole('button', { name: /nueva película/i })[0])
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})

// ─── NewProjectModal ──────────────────────────────────────────────────────────

describe('NewProjectModal — validación', () => {
  it('no llama onSubmit si el título está vacío', async () => {
    const onSubmit = vi.fn()
    render(<NewProjectModal open onClose={vi.fn()} onSubmit={onSubmit} />)
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('muestra error si el título está vacío', async () => {
    render(<NewProjectModal open onClose={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }))
    expect(screen.getByText(/obligatorio/i)).toBeInTheDocument()
  })
})

describe('NewProjectModal — submit', () => {
  it('llama onSubmit con el título al confirmar', async () => {
    const onSubmit = vi.fn()
    render(<NewProjectModal open onClose={vi.fn()} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/título/i), 'Mi Película')
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ title: 'Mi Película' }))
  })

  it('llama onSubmit con género y tono seleccionados', async () => {
    const onSubmit = vi.fn()
    render(<NewProjectModal open onClose={vi.fn()} onSubmit={onSubmit} />)
    await userEvent.type(screen.getByLabelText(/título/i), 'Test')
    await userEvent.click(screen.getByRole('button', { name: 'Drama' }))
    await userEvent.click(screen.getByRole('button', { name: 'Íntimo' }))
    await userEvent.click(screen.getByRole('button', { name: /crear proyecto/i }))
    expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({ genre: 'Drama', tone: ['Íntimo'] }))
  })

  it('cierra al pulsar Cancelar', async () => {
    const onClose = vi.fn()
    render(<NewProjectModal open onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onClose).toHaveBeenCalledOnce()
  })
})
