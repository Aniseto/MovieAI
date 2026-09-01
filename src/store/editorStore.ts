import { create } from 'zustand'

export type BlockType = 'synopsis' | 'structure' | 'scene' | 'action' | 'dialogue' | 'note' | 'character' | 'location'

export interface Block {
  id: string
  type: BlockType
  slug: string
  filename: string   // ej: 'blocks/block-001-action.md' | 'personajes/marco.md'
  order: number      // 1-based
  content: string
  hasImage: boolean
  imageUrl?: string
  imageUpdated?: string
  status: 'draft' | 'complete'
}

interface EditorState {
  projectSlug: string
  blocks: Block[]
  activeImageBlockId: string | null

  // actions
  setProject: (slug: string) => void
  setBlocks: (blocks: Block[]) => void
  addBlock: (opts: { type: BlockType; content?: string; filename?: string }) => void
  updateBlock: (id: string, patch: Partial<Pick<Block, 'content' | 'status' | 'imageUrl' | 'imageUpdated' | 'filename'>>) => void
  removeBlock: (id: string) => void
  reorderBlocks: (fromId: string, toId: string) => void
  setActiveImageBlock: (id: string | null) => void
  setBlockImage: (id: string, imageUrl: string) => void
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

function toSlug(content: string): string {
  return content
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .slice(0, 40)
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') || 'block'
}

const TYPES_WITH_IMAGE: BlockType[] = ['character', 'location']

const initialState = {
  projectSlug: '',
  blocks: [] as Block[],
  activeImageBlockId: null as string | null,
}

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,

  setProject: (slug) => set({ projectSlug: slug }),

  setBlocks: (blocks) => set({ blocks }),

  addBlock: ({ type, content = '', filename = '' }) => {
    const { blocks } = get()
    const order = blocks.length + 1
    const id = generateId()
    const newBlock: Block = {
      id,
      type,
      slug: toSlug(content),
      filename: filename || `blocks/block-${String(order).padStart(3, '0')}-${type}.md`,
      order,
      content,
      hasImage: TYPES_WITH_IMAGE.includes(type),
      status: 'draft',
    }
    set({ blocks: [...blocks, newBlock] })
  },

  updateBlock: (id, patch) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id
          ? { ...b, ...patch, slug: patch.content !== undefined ? toSlug(patch.content) : b.slug }
          : b
      ),
    })),

  removeBlock: (id) =>
    set((state) => ({
      blocks: state.blocks
        .filter((b) => b.id !== id)
        .map((b, i) => ({ ...b, order: i + 1 })),
    })),

  reorderBlocks: (fromId, toId) =>
    set((state) => {
      const blocks = [...state.blocks]
      const fromIdx = blocks.findIndex((b) => b.id === fromId)
      const toIdx = blocks.findIndex((b) => b.id === toId)
      if (fromIdx === -1 || toIdx === -1) return state
      const [moved] = blocks.splice(fromIdx, 1)
      blocks.splice(toIdx, 0, moved)
      return { blocks: blocks.map((b, i) => ({ ...b, order: i + 1 })) }
    }),

  setActiveImageBlock: (id) => set({ activeImageBlockId: id }),

  setBlockImage: (id, imageUrl) =>
    set((state) => ({
      blocks: state.blocks.map((b) =>
        b.id === id ? { ...b, imageUrl, imageUpdated: new Date().toISOString() } : b
      ),
    })),
}))

// Exponer estado inicial para poder resetearlo en tests
export function getEditorInitialState() { return { ...initialState } }
