import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SceneDetailPage from '@/app/projects/[slug]/scenes/[id]/page'
import { useEditorStore, getEditorInitialState } from '@/store/editorStore'

vi.mock('next/navigation', () => ({
  useParams: () => ({ slug: 'mi-peli', id: 'escena-01-llegada' }),
  useRouter: () => ({ push: vi.fn() }),
}))

const mockScene = {
  id: 'escena-01-llegada',
  title: 'Llegada',
  locationSlug: '',
  moment: 'Amanecer',
  characters: [],
  emotion: [],
  blocks: [],
}

beforeEach(() => {
  vi.restoreAllMocks()
  useEditorStore.setState(getEditorInitialState())
})

describe('SceneDetailPage — carga', () => {
  it('muestra loader mientras carga', () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => new Promise(() => {})))
    render(<SceneDetailPage />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('carga y muestra la escena correctamente', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScene }))
    render(<SceneDetailPage />)
    await waitFor(() => expect(screen.getByDisplayValue('Llegada')).toBeInTheDocument())
  })

  it('muestra error si la escena no existe (404)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404, json: async () => ({}) }))
    render(<SceneDetailPage />)
    await waitFor(() => expect(screen.getByText(/no encontrada/i)).toBeInTheDocument())
  })
})

describe('SceneDetailPage — breadcrumb', () => {
  it('muestra el breadcrumb con el nombre de la escena', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScene }))
    render(<SceneDetailPage />)
    await waitFor(() => expect(screen.getByText(/Escena 01/i)).toBeInTheDocument())
  })

  it('muestra el botón volver', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockScene }))
    render(<SceneDetailPage />)
    await waitFor(() => expect(screen.getByRole('button', { name: /volver/i })).toBeInTheDocument())
  })
})

describe('SceneDetailPage — guardar', () => {
  it('muestra confirmación ✓ Guardado tras guardar', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => mockScene })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) })
    )
    render(<SceneDetailPage />)
    await waitFor(() => screen.getByRole('button', { name: /guardar/i }))
    await userEvent.click(screen.getByRole('button', { name: /guardar/i }))
    await waitFor(() => expect(screen.getByText(/guardado/i)).toBeInTheDocument())
  })
})
