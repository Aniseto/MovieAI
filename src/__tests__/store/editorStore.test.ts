import { describe, it, expect, beforeEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useEditorStore, getEditorInitialState } from '@/store/editorStore'

beforeEach(() => {
  useEditorStore.setState(getEditorInitialState())
})

describe('editorStore — estado inicial', () => {
  it('empieza con lista de bloques vacía', () => {
    const { result } = renderHook(() => useEditorStore())
    expect(result.current.blocks).toEqual([])
    expect(result.current.activeImageBlockId).toBeNull()
    expect(result.current.projectSlug).toBe('')
  })
})

describe('editorStore — addBlock', () => {
  it('añade un bloque al final con order correcto', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'action', content: 'El protagonista entra' }))
    expect(result.current.blocks).toHaveLength(1)
    expect(result.current.blocks[0].type).toBe('action')
    expect(result.current.blocks[0].order).toBe(1)
    expect(result.current.blocks[0].status).toBe('draft')
  })

  it('dos bloques tienen order 1 y 2', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.addBlock({ type: 'action', content: 'A' })
      result.current.addBlock({ type: 'dialogue', content: 'B' })
    })
    expect(result.current.blocks[0].order).toBe(1)
    expect(result.current.blocks[1].order).toBe(2)
  })

  it('character y location tienen hasImage=true', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'character', content: 'Marco' }))
    expect(result.current.blocks[0].hasImage).toBe(true)
  })

  it('action tiene hasImage=false', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'action', content: 'x' }))
    expect(result.current.blocks[0].hasImage).toBe(false)
  })
})

describe('editorStore — updateBlock', () => {
  it('modifica el contenido de un bloque existente', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'dialogue', content: 'Hola' }))
    const id = result.current.blocks[0].id
    act(() => result.current.updateBlock(id, { content: 'Adiós' }))
    expect(result.current.blocks[0].content).toBe('Adiós')
  })

  it('actualiza el slug al cambiar el contenido', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'action', content: 'Hola mundo' }))
    const id = result.current.blocks[0].id
    act(() => result.current.updateBlock(id, { content: 'Nueva acción épica' }))
    expect(result.current.blocks[0].slug).toContain('nueva')
  })

  it('no modifica bloques que no coinciden', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.addBlock({ type: 'action', content: 'A' })
      result.current.addBlock({ type: 'action', content: 'B' })
    })
    const id = result.current.blocks[0].id
    act(() => result.current.updateBlock(id, { content: 'X' }))
    expect(result.current.blocks[1].content).toBe('B')
  })
})

describe('editorStore — removeBlock', () => {
  it('elimina el bloque por id', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'action', content: 'X' }))
    const id = result.current.blocks[0].id
    act(() => result.current.removeBlock(id))
    expect(result.current.blocks).toHaveLength(0)
  })

  it('recalcula order tras eliminar', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.addBlock({ type: 'action', content: 'A' })
      result.current.addBlock({ type: 'action', content: 'B' })
      result.current.addBlock({ type: 'action', content: 'C' })
    })
    const idB = result.current.blocks[1].id
    act(() => result.current.removeBlock(idB))
    expect(result.current.blocks).toHaveLength(2)
    expect(result.current.blocks[0].order).toBe(1)
    expect(result.current.blocks[1].order).toBe(2)
  })
})

describe('editorStore — reorderBlocks', () => {
  it('mueve el bloque A a la posición de B', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.addBlock({ type: 'action', content: 'A' })
      result.current.addBlock({ type: 'action', content: 'B' })
    })
    const [idA, idB] = result.current.blocks.map((b) => b.id)
    act(() => result.current.reorderBlocks(idA, idB))
    expect(result.current.blocks[0].content).toBe('B')
    expect(result.current.blocks[1].content).toBe('A')
  })

  it('actualiza order tras reordenar', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => {
      result.current.addBlock({ type: 'action', content: 'A' })
      result.current.addBlock({ type: 'action', content: 'B' })
      result.current.addBlock({ type: 'action', content: 'C' })
    })
    const [idA, , idC] = result.current.blocks.map((b) => b.id)
    act(() => result.current.reorderBlocks(idA, idC))
    expect(result.current.blocks.map((b) => b.order)).toEqual([1, 2, 3])
  })

  it('no hace nada si el id no existe', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'action', content: 'A' }))
    act(() => result.current.reorderBlocks('nope', result.current.blocks[0].id))
    expect(result.current.blocks).toHaveLength(1)
  })
})

describe('editorStore — activeImageBlock', () => {
  it('setActiveImageBlock asigna el id', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.setActiveImageBlock('abc'))
    expect(result.current.activeImageBlockId).toBe('abc')
  })

  it('solo puede haber un bloque activo a la vez', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.setActiveImageBlock('abc'))
    act(() => result.current.setActiveImageBlock('xyz'))
    expect(result.current.activeImageBlockId).toBe('xyz')
  })

  it('setActiveImageBlock(null) limpia la selección', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.setActiveImageBlock('abc'))
    act(() => result.current.setActiveImageBlock(null))
    expect(result.current.activeImageBlockId).toBeNull()
  })
})

describe('editorStore — setBlockImage', () => {
  it('asigna imageUrl e imageUpdated al bloque', () => {
    const { result } = renderHook(() => useEditorStore())
    act(() => result.current.addBlock({ type: 'character', content: 'Marco' }))
    const id = result.current.blocks[0].id
    act(() => result.current.setBlockImage(id, '/images/marco.png'))
    expect(result.current.blocks[0].imageUrl).toBe('/images/marco.png')
    expect(result.current.blocks[0].imageUpdated).toBeDefined()
  })
})
