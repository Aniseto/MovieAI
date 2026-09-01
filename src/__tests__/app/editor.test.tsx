import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EditorPage from '@/app/projects/[slug]/editor/page'

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'mi-peli' }),
  useRouter: () => ({ push: vi.fn() }),
}))

const mockProject = {
  slug: 'mi-peli',
  title: 'Mi Película',
  genre: 'Drama',
  blocks: [
    { id: 'b1', type: 'action', slug: 'b1', filename: 'blocks/block-001-action.md', order: 1, content: 'El protagonista entra', hasImage: false, status: 'draft' },
  ],
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('EditorPage — carga', () => {
  it('muestra el loader mientras carga', () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})))
    render(<EditorPage />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('muestra el título del proyecto tras cargar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProject,
    }))
    render(<EditorPage />)
    await waitFor(() => expect(screen.getByText('Mi Película')).toBeInTheDocument())
  })

  it('renderiza los bloques del proyecto tras cargar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProject,
    }))
    render(<EditorPage />)
    await waitFor(() => expect(screen.getAllByTestId('block')).toHaveLength(1))
  })

  it('muestra error 404 si el proyecto no existe', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'no encontrado' }),
    }))
    render(<EditorPage />)
    await waitFor(() => expect(screen.getByText(/no encontrado/i)).toBeInTheDocument())
  })
})

describe('EditorPage — tabs', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProject,
    }))
  })

  it('muestra el tab Proyecto activo por defecto', async () => {
    render(<EditorPage />)
    await waitFor(() => screen.getByText('Mi Película'))
    expect(screen.getByRole('button', { name: /proyecto/i })).toBeInTheDocument()
  })

  it('cambia a tab Escenas al pulsarlo', async () => {
    render(<EditorPage />)
    await waitFor(() => screen.getByText('Mi Película'))
    await userEvent.click(screen.getByRole('button', { name: /escenas/i }))
    // ScenesPage hace su propio fetch — simplemente verificamos que el tab cambió
    expect(screen.queryByTestId('block')).not.toBeInTheDocument()
  })

  it('el panel lateral permanece visible al cambiar de tab', async () => {
    render(<EditorPage />)
    await waitFor(() => screen.getByText('Mi Película'))
    await userEvent.click(screen.getByRole('button', { name: /escenas/i }))
    expect(screen.getByText(/imagen de referencia/i)).toBeInTheDocument()
  })
})
