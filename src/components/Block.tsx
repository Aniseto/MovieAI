'use client'

import { useRef, useEffect, useCallback } from 'react'
import type { Block as BlockType } from '@/store/editorStore'

// ─── Tipos disponibles por contexto ──────────────────────────────────────────

const TYPE_LABELS: Record<BlockType['type'], string> = {
  synopsis:  'Sinopsis',
  character: 'Personaje',
  location:  'Escenario',
  action:    'Acción',
  dialogue:  'Diálogo',
  note:      'Nota',
}

const TYPE_ICONS: Record<BlockType['type'], string> = {
  synopsis:  '📝',
  character: '👤',
  location:  '📍',
  action:    '🎬',
  dialogue:  '💬',
  note:      '🗒️',
}

const FREE_TYPES: BlockType['type'][] = ['synopsis', 'character', 'location', 'action', 'dialogue', 'note']
const SCENE_TYPES: BlockType['type'][] = ['action', 'dialogue', 'note']

// ─── Props ────────────────────────────────────────────────────────────────────

interface BlockProps {
  block: BlockType
  context: 'free' | 'scene'
  onUpdate: (content: string) => void
  onRemove: (id: string) => void
  onImageClick?: () => void
  onAiHelp?: () => void
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function Block({
  block,
  context,
  onUpdate,
  onRemove,
  onImageClick,
  onAiHelp,
  dragHandleProps,
}: BlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Tipos disponibles según contexto
  const allowedTypes = context === 'scene' ? SCENE_TYPES : FREE_TYPES
  const isAllowed = allowedTypes.includes(block.type)

  // Autoexpandir textarea
  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [])

  useEffect(() => { autoResize() }, [block.content, autoResize])

  if (!isAllowed) return null

  return (
    <div className="group relative flex gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-gray-300">

      {/* Drag handle — solo visible en hover */}
      <button
        type="button"
        aria-label="Arrastrar bloque"
        className="mt-1 cursor-grab self-start text-gray-300 opacity-0 transition group-hover:opacity-100"
        {...dragHandleProps}
      >
        ⠿
      </button>

      {/* Cuerpo */}
      <div className="flex flex-1 flex-col gap-2">

        {/* Cabecera */}
        <div className="flex items-center gap-2">
          <span className="text-sm">{TYPE_ICONS[block.type]}</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {TYPE_LABELS[block.type]}
          </span>

          <div className="ml-auto flex items-center gap-1">
            {/* Botón IA */}
            <button
              type="button"
              aria-label="Ayuda IA"
              onClick={onAiHelp}
              className="rounded px-2 py-0.5 text-xs text-indigo-500 hover:bg-indigo-50"
            >
              IA
            </button>

            {/* Botón imagen — solo si hasImage */}
            {block.hasImage && (
              <button
                type="button"
                aria-label="Ver imagen"
                onClick={onImageClick}
                className="rounded px-2 py-0.5 text-xs text-emerald-500 hover:bg-emerald-50"
              >
                🖼
              </button>
            )}

            {/* Botón eliminar */}
            <button
              type="button"
              aria-label="Eliminar bloque"
              onClick={() => onRemove(block.id)}
              className="rounded px-2 py-0.5 text-xs text-red-400 hover:bg-red-50"
            >
              ×
            </button>
          </div>
        </div>

        {/* Textarea autoexpandible */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={block.content}
          onChange={(e) => { onUpdate(e.target.value); autoResize() }}
          placeholder={`Escribe ${TYPE_LABELS[block.type].toLowerCase()}…`}
          className="w-full resize-none rounded border border-gray-100 bg-gray-50 px-3 py-2 text-sm leading-relaxed text-gray-800 outline-none focus:border-indigo-300 focus:bg-white"
        />

        {/* Slot feedback IA — vacío hasta T-10b */}
        <div data-testid="ai-feedback-slot" />
      </div>
    </div>
  )
}
