'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useEditorStore } from '@/store/editorStore'

// ─── Componente puro (testeable con props) ────────────────────────────────────

interface ImagePanelProps {
  projectSlug: string
  blockId?: string | null
  imageUrl?: string | null
  generatedAt?: string | null
  isGenerating?: boolean
  onGenerate?: () => void
  onValidate?: () => void
  onImageChange?: (url: string) => void
}

export function ImagePanel({
  projectSlug,
  blockId,
  imageUrl,
  generatedAt,
  isGenerating = false,
  onGenerate,
  onValidate,
  onImageChange,
}: ImagePanelProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (onGenerate) { onGenerate(); return }
    if (!blockId || !projectSlug) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${projectSlug}/generate/reference-image`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockId }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al generar imagen')
      onImageChange?.(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const busy = loading || isGenerating

  // ── Estado vacío ────────────────────────────────────────────────────────────
  if (!blockId) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
        <span className="text-4xl">🖼️</span>
        <p className="text-sm text-gray-400">
          Pulsa <span className="font-medium">🖼</span> en un bloque<br />para generar una imagen aquí
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

      {/* Imagen o skeleton */}
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
        {busy ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
            <span className="text-xs text-gray-400">Generando imagen…</span>
          </div>
        ) : imageUrl ? (
          <Image
            src={imageUrl}
            alt="Imagen de referencia"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-300">
            <span className="text-5xl">📷</span>
            <span className="text-xs">Sin imagen generada</span>
          </div>
        )}
      </div>

      {/* Fecha */}
      {generatedAt && !busy && (
        <p className="text-xs text-gray-400">
          Generada: {new Date(generatedAt).toLocaleDateString('es-ES')}
        </p>
      )}

      {/* Error */}
      {error && (
        <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-2">
        <button
          type="button"
          aria-label={imageUrl ? 'Regenerar imagen' : 'Generar imagen'}
          onClick={handleGenerate}
          disabled={busy}
          className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {imageUrl ? '↺ Regenerar' : '✨ Generar imagen'}
        </button>

        {imageUrl && (
          <button
            type="button"
            aria-label="Validar imagen"
            onClick={onValidate}
            disabled={busy}
            className="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50"
          >
            ✓ Validar
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Wrapper conectado al store (para uso en la página) ───────────────────────

export function ImagePanelConnected({ projectSlug }: { projectSlug: string }) {
  const { activeImageBlockId, blocks, setBlockImage } = useEditorStore()
  const activeBlock = blocks.find((b) => b.id === activeImageBlockId) ?? null

  return (
    <ImagePanel
      projectSlug={projectSlug}
      blockId={activeBlock?.id ?? null}
      imageUrl={activeBlock?.imageUrl ?? null}
      generatedAt={activeBlock?.imageUpdated ?? null}
      onImageChange={(url) => {
        if (activeBlock) setBlockImage(activeBlock.id, url)
      }}
    />
  )
}
