'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SceneEditor } from '@/components/SceneEditor'
import { ImagePanelConnected } from '@/components/ImagePanel'
import type { SceneData } from '@/components/SceneEditor'

export default function SceneDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const slug    = params?.slug as string
  const id      = params?.id   as string

  const [scene,   setScene]   = useState<SceneData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const [saved,   setSaved]   = useState(false)

  // ── Carga ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug || !id) return
    setLoading(true)
    fetch(`/api/projects/${slug}/escenas/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(res.status === 404 ? 'Escena no encontrada' : 'Error al cargar')
        return res.json()
      })
      .then((data) => setScene(data))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, id])

  // ── Guardar ─────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async (data: SceneData) => {
    try {
      await fetch(`/api/projects/${slug}/escenas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch { /* silencioso */ }
  }, [slug, id])

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" role="progressbar" aria-label="Cargando">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error || !scene) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-gray-500">
        <span className="text-4xl">🎬</span>
        <p className="text-lg font-medium">{error ?? 'Escena no encontrada'}</p>
        <button
          type="button"
          onClick={() => router.push(`/projects/${slug}/editor`)}
          className="text-sm text-indigo-500 hover:underline"
        >
          ← Volver al editor
        </button>
      </div>
    )
  }

  // ── Título del breadcrumb ───────────────────────────────────────────────────
  // escena-01-el-encuentro → "Escena 01 — El encuentro"
  const scenLabel = id
    .replace(/^escena-(\d+)-(.+)$/, (_, n, rest) =>
      `Escena ${n} — ${rest.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase())}`
    )

  return (
    <div className="flex h-screen flex-col bg-gray-50">

      {/* Header / breadcrumb */}
      <header className="flex items-center gap-2 border-b border-gray-200 bg-white px-6 py-3">
        <button
          type="button"
          aria-label="Volver a escenas"
          onClick={() => router.push(`/projects/${slug}/editor`)}
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <nav className="flex items-center gap-1 text-sm text-gray-400">
          <span className="font-medium text-gray-700">{slug.replace(/-/g, ' ')}</span>
          <span>›</span>
          <button
            type="button"
            onClick={() => router.push(`/projects/${slug}/editor`)}
            className="hover:text-gray-600"
          >
            Escenas
          </button>
          <span>›</span>
          <span className="font-medium text-gray-700">{scenLabel}</span>
        </nav>

        {saved && (
          <span className="ml-auto text-xs text-emerald-500">✓ Guardado</span>
        )}
      </header>

      {/* Contenido */}
      <div className="flex flex-1 overflow-hidden">

        {/* Editor (scroll) */}
        <main className="flex-1 overflow-y-auto px-6 py-6">
          <SceneEditor
            scene={scene}
            projectSlug={slug}
            onSave={handleSave}
          />
        </main>

        {/* Panel lateral */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-white px-4 py-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
            Imagen de referencia
          </h2>
          <ImagePanelConnected projectSlug={slug} />
        </aside>
      </div>
    </div>
  )
}
