import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePhase1Progress } from '@/hooks/usePhase1Progress'
import { useEditorStore, getEditorInitialState } from '@/store/editorStore'
import type { Block } from '@/store/editorStore'

beforeEach(() => useEditorStore.setState(getEditorInitialState()))

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mkBlock = (overrides: Partial<Block> & Pick<Block, 'type'>): Block => ({
  id: `b-${Math.random()}`,
  slug: 'test',
  filename: 'blocks/block-001-action.md',
  order: 1,
  content: '',
  hasImage: false,
  status: 'draft',
  ...overrides,
})

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.'

// ─── Estado vacío ─────────────────────────────────────────────────────────────

describe('usePhase1Progress — store vacío', () => {
  it('synopsis = empty cuando no hay bloque de sinopsis', () => {
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.synopsis).toBe('empty')
  })

  it('canGenerate = false cuando el store está vacío', () => {
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.canGenerate).toBe(false)
  })

  it('percent = 0 cuando no hay bloques', () => {
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.percent).toBe(0)
  })

  it('items.sinopsis = false cuando no hay sinopsis', () => {
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.items.sinopsis).toBe(false)
  })
})

// ─── Sinopsis ─────────────────────────────────────────────────────────────────

describe('usePhase1Progress — synopsis', () => {
  it('synopsis = draft con texto corto', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [mkBlock({ type: 'synopsis', content: 'Texto breve.' })] })
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.synopsis).toBe('draft')
  })

  it('synopsis = complete con texto largo', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [mkBlock({ type: 'synopsis', content: longText })] })
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.synopsis).toBe('complete')
  })

  it('items.sinopsis = true cuando synopsis no está vacía', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [mkBlock({ type: 'synopsis', content: 'Algo.' })] })
    const { result } = renderHook(() => usePhase1Progress('mi-peli'))
    expect(result.current.items.sinopsis).toBe(true)
  })
})

// ─── Personajes ───────────────────────────────────────────────────────────────

describe('usePhase1Progress — characters', () => {
  it('characters.total cuenta los bloques character', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'character', content: 'Marco, protagonista.' }),
      mkBlock({ type: 'character', content: 'Elena.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.characters.total).toBe(2)
  })

  it('hasProtagonist = true si el contenido menciona "protagonista"', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'character', content: `El protagonista de la historia. ${longText}` }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.characters.hasProtagonist).toBe(true)
  })

  it('hasProtagonist = false si ningún personaje menciona protagonista', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'character', content: 'Elena, antagonista.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.characters.hasProtagonist).toBe(false)
  })

  it('items.personajes = true si hay al menos un personaje', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [mkBlock({ type: 'character', content: 'Marco.' })] })
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.items.personajes).toBe(true)
  })
})

// ─── Escenarios ───────────────────────────────────────────────────────────────

describe('usePhase1Progress — locations', () => {
  it('locations.total cuenta bloques location', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'location', content: 'Estación central.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.locations.total).toBe(1)
  })

  it('locations.complete cuenta solo los con contenido largo', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'location', content: longText }),
      mkBlock({ type: 'location', content: 'Breve.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.locations.complete).toBe(1)
  })
})

// ─── canGenerate ──────────────────────────────────────────────────────────────

describe('usePhase1Progress — canGenerate', () => {
  it('canGenerate = true con todos los requisitos', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'synopsis',   content: longText }),
      mkBlock({ type: 'character',  content: `${longText} protagonista`, slug: 'marco' }),
      mkBlock({ type: 'location',   content: longText }),
      mkBlock({ type: 'scene',      content: longText }),
      mkBlock({ type: 'scene',      content: longText }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.canGenerate).toBe(true)
  })

  it('canGenerate = false si falta un escenario completo', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'synopsis',  content: longText }),
      mkBlock({ type: 'character', content: `${longText} protagonista` }),
      mkBlock({ type: 'scene',     content: longText }),
      mkBlock({ type: 'scene',     content: longText }),
      // sin location
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.canGenerate).toBe(false)
  })

  it('canGenerate = false si hay menos de 2 escenas completas', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'synopsis',  content: longText }),
      mkBlock({ type: 'character', content: `${longText} protagonista` }),
      mkBlock({ type: 'location',  content: longText }),
      mkBlock({ type: 'scene',     content: longText }), // solo 1
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.canGenerate).toBe(false)
  })
})

// ─── Porcentaje ───────────────────────────────────────────────────────────────

describe('usePhase1Progress — percent', () => {
  it('percent = 20 con solo sinopsis draft', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'synopsis', content: 'Algo.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.percent).toBe(20)
  })

  it('percent = 100 con todos los criterios cumplidos', () => {
    useEditorStore.setState({ ...getEditorInitialState(), blocks: [
      mkBlock({ type: 'synopsis',   content: longText }),
      mkBlock({ type: 'structure',  content: 'Acto 1.' }),
      mkBlock({ type: 'character',  content: 'Marco.' }),
      mkBlock({ type: 'location',   content: 'Estación.' }),
      mkBlock({ type: 'scene',      content: 'Encuentro.' }),
    ]})
    const { result } = renderHook(() => usePhase1Progress())
    expect(result.current.percent).toBe(100)
  })
})
