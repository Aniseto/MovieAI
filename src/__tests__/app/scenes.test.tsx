import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ScenesPage from '@/app/projects/[slug]/scenes/page'

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'mi-peli' }),
  useRouter: () => ({ push: vi.fn() }),
}))

const mockScenes = [
  { id: 'escena-01-llegada',       title: 'Llegada',       moment: 'Amanecer', order: 1 },
  { id: 'escena-02-confrontacion', title: 'Confrontación', moment: 'Noche',    order: 2 },
]

beforeEach(() => vi.restoreAllMocks())

describe('ScenesPage — carga', () => {
  it('muestra loader mientras carga', () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})))
    render(<ScenesPage />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('lista las escenas tras cargar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScenes }))
    render(<ScenesPage />)
    await waitFor(() => {
      expect(screen.getByText('Llegada')).toBeInTheDocument()
      expect(screen.getByText('Confrontación')).toBeInTheDocument()
    })
  })

  it('muestra mensaje vacío si no hay escenas', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ScenesPage />)
    await waitFor(() => expect(screen.getByText(/no hay escenas/i)).toBeInTheDocument())
  })

  it('muestra el botón de nueva escena', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => [] }))
    render(<ScenesPage />)
    await waitFor(() => expect(screen.getAllByRole('button', { name: /nueva escena/i }).length).toBeGreaterThan(0))
  })
})

describe('ScenesPage — con escenas', () => {
  it('muestra los números de orden', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScenes }))
    render(<ScenesPage />)
    await waitFor(() => {
      expect(screen.getByText('01')).toBeInTheDocument()
      expect(screen.getByText('02')).toBeInTheDocument()
    })
  })

  it('muestra botones de editar y eliminar por escena', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScenes }))
    render(<ScenesPage />)
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /editar/i })).toHaveLength(2)
      expect(screen.getAllByRole('button', { name: /eliminar/i })).toHaveLength(2)
    })
  })
})

describe('ScenesPage — eliminar', () => {
  it('elimina la escena al confirmar', async () => {
    vi.stubGlobal('confirm', vi.fn().mockReturnValue(true))
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockScenes })  // carga inicial
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })        // DELETE
    )
    render(<ScenesPage />)
    await waitFor(() => screen.getAllByRole('button', { name: /eliminar/i }))
    await userEvent.click(screen.getAllByRole('button', { name: /eliminar/i })[0])
    await waitFor(() => expect(screen.queryByText('Llegada')).not.toBeInTheDocument())
  })
})
