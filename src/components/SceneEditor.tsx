'use client'

import { useState, useRef, useCallback } from 'react'
import { BlockEditor } from '@/components/BlockEditor'
import { useEditorStore } from '@/store/editorStore'
import type { Block } from '@/store/editorStore'

// ─── Tipos ────────────────────────────────────────────────────────────────────

const MOMENTS = ['Mañana', 'Tarde', 'Noche', 'Amanecer', 'Atardecer']
const EMOTIONS = ['Tensión', 'Misterio', 'Alegría', 'Tristeza', 'Miedo', 'Esperanza', 'Ira', 'Calma']

export interface SceneData {
  id: string
  title: string
  locationSlug?: string
  moment?: string
  characters?: string[]
  emotion?: string[]
  blocks?: Block[]
}

interface SceneEditorProps {
  scene: SceneData
  projectSlug?: string
  onSave?: (data: SceneData) => void
}

// ─── SceneEditor ──────────────────────────────────────────────────────────────

export function SceneEditor({ scene, projectSlug, onSave }: SceneEditorProps) {
  const { blocks: storeBlocks } = useEditorStore()

  // Listas de personajes y escenarios disponibles del store
  const locations  = storeBlocks.filter((b) => b.type === 'location')
  const characters = storeBlocks.filter((b) => b.type === 'character')

  // Estado local de la escena
  const [title,        setTitle]        = useState(scene.title ?? '')
  const [locationSlug, setLocationSlug] = useState(scene.locationSlug ?? '')
  const [moment,       setMoment]       = useState(scene.moment ?? '')
  const [selChars,     setSelChars]     = useState<string[]>(scene.characters ?? [])
  const [emotions,     setEmotions]     = useState<string[]>(scene.emotion ?? [])
  const [sceneBlocks,  setSceneBlocks]  = useState<Block[]>(scene.blocks ?? [])

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Guardar con debounce ──────────────────────────────────────────────────
  const scheduleSave = useCallback((patch: Partial<SceneData>) => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      const data: SceneData = {
        id: scene.id,
        title,
        locationSlug,
        moment,
        characters: selChars,
        emotion: emotions,
        blocks: sceneBlocks,
        ...patch,
      }
      onSave?.(data)
      if (!projectSlug) return
      try {
        await fetch(`/api/projects/${projectSlug}/escenas/${scene.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
      } catch { /* silencioso */ }
    }, 1000)
  }, [scene.id, title, locationSlug, moment, selChars, emotions, sceneBlocks, projectSlug, onSave])

  // ── Guardar explícito ─────────────────────────────────────────────────────
  const handleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    const data: SceneData = { id: scene.id, title, locationSlug, moment, characters: selChars, emotion: emotions, blocks: sceneBlocks }
    onSave?.(data)
  }

  const toggleEmotion = (e: string) =>
    setEmotions((prev) => prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e])

  const toggleChar = (slug: string) =>
    setSelChars((prev) => prev.includes(slug) ? prev.filter((x) => x !== slug) : [...prev, slug])

  return (
    <div className="flex flex-col gap-5">

      {/* Título */}
      <div>
        <label htmlFor="scene-title" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
          Título
        </label>
        <input
          id="scene-title"
          type="text"
          value={title}
          onChange={(e) => { setTitle(e.target.value); scheduleSave({ title: e.target.value }) }}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-800 outline-none focus:border-indigo-400"
        />
      </div>

      {/* Metadatos en grid */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* Escenario */}
        <div>
          <label htmlFor="scene-location" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Escenario
          </label>
          <select
            id="scene-location"
            value={locationSlug}
            onChange={(e) => { setLocationSlug(e.target.value); scheduleSave({ locationSlug: e.target.value }) }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
          >
            <option value="">— Sin asignar —</option>
            {locations.map((l) => (
              <option key={l.slug} value={l.slug}>{l.content || l.slug}</option>
            ))}
          </select>
        </div>

        {/* Momento del día */}
        <div>
          <label htmlFor="scene-moment" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
            Momento del día
          </label>
          <select
            id="scene-moment"
            value={moment}
            onChange={(e) => { setMoment(e.target.value); scheduleSave({ moment: e.target.value }) }}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
          >
            <option value="">— Sin asignar —</option>
            {MOMENTS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Personajes */}
      {characters.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Personajes presentes</p>
          <div className="flex flex-wrap gap-2">
            {characters.map((c) => (
              <button
                key={c.slug}
                type="button"
                onClick={() => { toggleChar(c.slug); scheduleSave({}) }}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                  selChars.includes(c.slug)
                    ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-400'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {c.content || c.slug} {selChars.includes(c.slug) ? '×' : '+'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Emociones */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Emoción</p>
        <div className="flex flex-wrap gap-2">
          {EMOTIONS.map((e) => (
            <button
              key={e}
              type="button"
              onClick={() => { toggleEmotion(e); scheduleSave({}) }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                emotions.includes(e)
                  ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-400'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Separador */}
      <hr className="border-gray-100" />

      {/* BlockEditor context=scene */}
      <BlockEditor
        blocks={sceneBlocks}
        context="scene"
        projectSlug={projectSlug}
        onBlocksChange={(b) => { setSceneBlocks(b); scheduleSave({ blocks: b }) }}
      />

      {/* Botón guardar explícito */}
      <div className="flex justify-end">
        <button
          type="button"
          aria-label="Guardar escena"
          onClick={handleSave}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
