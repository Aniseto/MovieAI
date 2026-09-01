'use client'

import { useCallback, useRef } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Block } from '@/components/Block'
import type { Block as BlockType, BlockType as BType } from '@/store/editorStore'

// ─── Tipos y constantes ───────────────────────────────────────────────────────

const BLOCK_MENU: { type: BType; label: string; icon: string }[] = [
  { type: 'synopsis',  label: 'Sinopsis / descripción', icon: '📝' },
  { type: 'character', label: 'Personaje',               icon: '👤' },
  { type: 'location',  label: 'Escenario',               icon: '🏛️' },
  { type: 'action',    label: 'Acción',                  icon: '🎬' },
  { type: 'dialogue',  label: 'Diálogo',                 icon: '💬' },
  { type: 'note',      label: 'Nota del autor',          icon: '🗒️' },
]

// ─── Item sortable ────────────────────────────────────────────────────────────

function SortableBlock({
  block,
  context,
  onUpdate,
  onRemove,
  onImageClick,
}: {
  block: BlockType
  context: 'free' | 'scene'
  onUpdate: (id: string, content: string) => void
  onRemove: (id: string) => void
  onImageClick?: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} data-testid="block">
      <Block
        block={block}
        context={context}
        onUpdate={(content) => onUpdate(block.id, content)}
        onRemove={onRemove}
        onImageClick={onImageClick ? () => onImageClick(block.id) : undefined}
        dragHandleProps={{ ...attributes, ...listeners } as React.HTMLAttributes<HTMLButtonElement>}
      />
    </div>
  )
}

// ─── BlockEditor ──────────────────────────────────────────────────────────────

interface BlockEditorProps {
  blocks: BlockType[]
  context?: 'free' | 'scene'
  projectSlug?: string
  onBlocksChange: (blocks: BlockType[]) => void
  onImageClick?: (id: string) => void
}

export function BlockEditor({
  blocks,
  context = 'free',
  projectSlug,
  onBlocksChange,
  onImageClick,
}: BlockEditorProps) {
  const sensors = useSensors(useSensor(PointerSensor))
  const saveTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  // ── Guardar con debounce 1s ───────────────────────────────────────────────
  const scheduleSave = useCallback(
    (block: BlockType, content: string) => {
      const existing = saveTimers.current.get(block.id)
      if (existing) clearTimeout(existing)

      const timer = setTimeout(async () => {
        if (!projectSlug) return
        try {
          const endpoint = getEndpoint(projectSlug, block)
          if (!endpoint) return
          await fetch(endpoint, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          })
        } catch { /* silencioso — no bloquear UI */ }
      }, 1000)

      saveTimers.current.set(block.id, timer)
    },
    [projectSlug]
  )

  // ── Update ────────────────────────────────────────────────────────────────
  const handleUpdate = useCallback(
    (id: string, content: string) => {
      const updated = blocks.map((b) => (b.id === id ? { ...b, content } : b))
      onBlocksChange(updated)
      const block = updated.find((b) => b.id === id)
      if (block) scheduleSave(block, content)
    },
    [blocks, onBlocksChange, scheduleSave]
  )

  // ── Remove ────────────────────────────────────────────────────────────────
  const handleRemove = useCallback(
    (id: string) => {
      onBlocksChange(
        blocks
          .filter((b) => b.id !== id)
          .map((b, i) => ({ ...b, order: i + 1 }))
      )
    },
    [blocks, onBlocksChange]
  )

  // ── Add ───────────────────────────────────────────────────────────────────
  const handleAdd = useCallback(
    (type: BType) => {
      const order = blocks.length + 1
      const id = Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
      const newBlock: BlockType = {
        id,
        type,
        slug: type,
        filename: `blocks/block-${String(order).padStart(3, '0')}-${type}.md`,
        order,
        content: '',
        hasImage: type === 'character' || type === 'location',
        status: 'draft',
      }
      onBlocksChange([...blocks, newBlock])
    },
    [blocks, onBlocksChange]
  )

  // ── Drag end ──────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      if (!over || active.id === over.id) return
      const fromIdx = blocks.findIndex((b) => b.id === active.id)
      const toIdx = blocks.findIndex((b) => b.id === over.id)
      if (fromIdx === -1 || toIdx === -1) return
      const reordered = [...blocks]
      const [moved] = reordered.splice(fromIdx, 1)
      reordered.splice(toIdx, 0, moved)
      onBlocksChange(reordered.map((b, i) => ({ ...b, order: i + 1 })))
    },
    [blocks, onBlocksChange]
  )

  return (
    <div className="flex flex-col gap-3">
      {/* Lista de bloques con DnD */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          {blocks.map((block) => (
            <SortableBlock
              key={block.id}
              block={block}
              context={context}
              onUpdate={handleUpdate}
              onRemove={handleRemove}
              onImageClick={onImageClick}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Botón añadir bloque con menú */}
      <AddBlockMenu context={context} onAdd={handleAdd} />
    </div>
  )
}

// ─── Menú de añadir bloque ────────────────────────────────────────────────────

function AddBlockMenu({
  context,
  onAdd,
}: {
  context: 'free' | 'scene'
  onAdd: (type: BType) => void
}) {
  const allowed = context === 'scene'
    ? BLOCK_MENU.filter((m) => ['action', 'dialogue', 'note'].includes(m.type))
    : BLOCK_MENU

  return (
    <div className="relative flex flex-wrap gap-2 pt-1">
      {allowed.map(({ type, label, icon }) => (
        <button
          key={type}
          type="button"
          aria-label={`Añadir bloque ${label}`}
          onClick={() => onAdd(type)}
          className="flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-3 py-1 text-xs text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
        >
          <span>{icon}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}

// ─── Helper endpoint ──────────────────────────────────────────────────────────

function getEndpoint(projectSlug: string, block: BlockType): string | null {
  const base = `/api/projects/${projectSlug}`
  switch (block.type) {
    case 'character': return `${base}/personajes/${block.slug}`
    case 'location':  return `${base}/escenarios/${block.slug}`
    default:          return block.filename ? `${base}/blocks/${block.id}` : null
  }
}
