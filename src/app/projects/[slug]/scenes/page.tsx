'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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

interface Scene {
  id: string
  title: string
  locationSlug?: string
  moment?: string
  order?: number
}

// ─── Item sortable ────────────────────────────────────────────────────────────

function SortableScene({
  scene,
  index,
  onEdit,
  onDelete,
}: {
  scene: Scene
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: scene.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
      data-testid="scene-item"
    >
      {/* Drag handle */}
      <button
        type="button"
        aria-label="Arrastrar escena"
        className="cursor-grab text-gray-300 opacity-0 transition group-hover:opacity-100"
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      {/* Número */}
      <span className="w-6 shrink-0 text-xs font-mono text-gray-400">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Título */}
      <span className="flex-1 text-sm font-medium text-gray-800">{scene.title}</span>

      {/* Meta */}
      {scene.moment && (
        <span className="text-xs text-gray-400">{scene.moment}</span>
      )}

      {/* Acciones */}
      <div className="flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          type="button"
          aria-label="Editar escena"
          onClick={() => onEdit(scene.id)}
          className="rounded px-2 py-1 text-xs text-indigo-500 hover:bg-indigo-50"
        >
          Editar
        </button>
        <button
          type="button"
          aria-label="Eliminar escena"
          onClick={() => onDelete(scene.id)}
          className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50"
        >
          ×
        </button>
      </div>
    </li>
  )
}

// ─── ScenesPage ───────────────────────────────────────────────────────────────

export default function ScenesPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string

  const [scenes, setScenes] = useState<Scene[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor))

  // ── Carga ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return
    fetch(`/api/projects/${slug}/escenas`)
      .then((r) => r.json())
      .then((data) => setScenes(Array.isArray(data) ? data : []))
      .catch(() => setScenes([]))
      .finally(() => setLoading(false))
  }, [slug])

  // ── Crear escena ────────────────────────────────────────────────────────────
  const handleCreate = useCallback(async () => {
    setCreating(true)
    try {
      const res = await fetch(`/api/projects/${slug}/escenas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: `Escena ${scenes.length + 1}` }),
      })
      const data = await res.json()
      if (res.ok) router.push(`/projects/${slug}/scenes/${data.id}`)
    } catch { /* silencioso */ }
    finally { setCreating(false) }
  }, [slug, scenes.length, router])

  // ── Eliminar escena ─────────────────────────────────────────────────────────
  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('¿Eliminar esta escena?')) return
    await fetch(`/api/projects/${slug}/escenas/${id}`, { method: 'DELETE' })
    setScenes((prev) => prev.filter((s) => s.id !== id))
  }, [slug])

  // ── Reordenar ───────────────────────────────────────────────────────────────
  const handleDragEnd = useCallback(({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    setScenes((prev) => {
      const from = prev.findIndex((s) => s.id === active.id)
      const to   = prev.findIndex((s) => s.id === over.id)
      if (from === -1 || to === -1) return prev
      const next = [...prev]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center" role="progressbar" aria-label="Cargando">
        <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Escenas
        </h2>
        <button
          type="button"
          aria-label="Nueva escena"
          onClick={handleCreate}
          disabled={creating}
          className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {creating ? 'Creando…' : '+ Nueva escena'}
        </button>
      </div>

      {/* Lista o vacío */}
      {scenes.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-gray-400">
          <span className="text-4xl">🎬</span>
          <p className="text-sm">No hay escenas todavía.</p>
          <button
            type="button"
            onClick={handleCreate}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Nueva escena
          </button>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={scenes.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2">
              {scenes.map((scene, i) => (
                <SortableScene
                  key={scene.id}
                  scene={scene}
                  index={i}
                  onEdit={(id) => router.push(`/projects/${slug}/scenes/${id}`)}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
