'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { BlockEditor } from '@/components/BlockEditor'
import { ImagePanelConnected } from '@/components/ImagePanel'
import ScenesPage from '@/app/projects/[slug]/scenes/page'
import { useEditorStore } from '@/store/editorStore'
import type { Block } from '@/store/editorStore'

type Tab = 'proyecto' | 'escenas'

export default function EditorPage() {
  const params = useParams()
  const slug = params?.slug as string

  const { setProject, setBlocks, blocks } = useEditorStore()
  const [title, setTitle] = useState('')
  const [tab, setTab] = useState<Tab>('proyecto')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── Carga inicial ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)

    fetch(`/api/projects/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 404) throw new Error('Proyecto no encontrado')
          throw new Error('Error al cargar el proyecto')
        }
        return res.json()
      })
      .then((data) => {
        setTitle(data.title ?? slug)
        setProject(slug)
        setBlocks((data.blocks ?? []) as Block[])
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug, setProject, setBlocks])

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" role="progressbar" aria-label="Cargando">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    )
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-3 text-gray-500">
        <span className="text-4xl">🎬</span>
        <p className="text-lg font-medium">{error}</p>
        <a href="/" className="text-sm text-indigo-500 hover:underline">← Volver al inicio</a>
      </div>
    )
  }

  // ── Editor ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-gray-50">

      {/* Header */}
      <header className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3">
        <a href="/" className="text-sm text-gray-400 hover:text-gray-600">←</a>
        <h1 className="text-base font-semibold text-gray-800">{title}</h1>

        {/* Tabs */}
        <nav className="ml-2 flex gap-1">
          {(['proyecto', 'escenas'] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition ${
                tab === t
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t === 'proyecto' ? '📋 Proyecto' : '🎬 Escenas'}
            </button>
          ))}
        </nav>

        <div className="ml-auto">
          <button
            type="button"
            disabled
            title="Disponible en la siguiente fase"
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white opacity-40 cursor-not-allowed"
          >
            🎬 Generar storyboard
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="flex flex-1 overflow-hidden">

        {/* Editor (scroll) */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          {tab === 'proyecto' ? (
            <BlockEditor
              blocks={blocks}
              context="free"
              projectSlug={slug}
              onBlocksChange={setBlocks}
              onImageClick={(id) => useEditorStore.getState().setActiveImageBlock(id)}
            />
          ) : (
            <ScenesPage />
          )}
        </main>

        {/* Panel lateral — persistente */}
        <aside className="w-72 shrink-0 overflow-y-auto border-l border-gray-200 bg-white px-4 py-5">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Imagen de referencia</h2>
          <ImagePanelConnected projectSlug={slug} />
        </aside>
      </div>
    </div>
  )
}
