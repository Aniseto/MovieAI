export type BlockType = 'synopsis' | 'action' | 'dialogue' | 'note' | 'character' | 'location'

export interface Block {
  id: string
  type: BlockType
  slug: string
  filename: string
  order: number
  content: string
  hasImage: boolean
  imageUrl?: string
  imageUpdated?: string
  status: 'draft' | 'complete'
}

export interface Project {
  slug: string
  title: string
  genre: string
  tone: string
  vision: string
  phase: number
  created: string
  updated: string
}

export interface Scene {
  order: number
  slug: string
  title: string
  locationSlug: string
  moment: string
  emotion: string[]
  duration?: number
  characters: string[]
  updated: string
}
