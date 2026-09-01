'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const GENRES = ['Drama', 'Thriller', 'Comedia', 'Terror', 'Ciencia ficción', 'Romance', 'Documental', 'Animación']
const TONES  = ['Íntimo', 'Épico', 'Oscuro', 'Luminoso', 'Irónico', 'Melancólico', 'Tenso', 'Onírico']

interface NewProjectModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: (data: { title: string; genre: string; tone: string[]; vision: string }) => void
}

export default function NewProjectModal({ open, onClose, onSubmit }: NewProjectModalProps) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [genre, setGenre] = useState('')
  const [tones, setTones] = useState<string[]>([])
  const [vision, setVision] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTitle(''); setGenre(''); setTones([]); setVision(''); setError('')
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [open])

  if (!open) return null

  const toggleTone = (t: string) =>
    setTones((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])

  const handleSubmit = async () => {
    if (!title.trim()) { setError('El título es obligatorio'); return }
    setError('')
    setLoading(true)
    try {
      const payload = { title: title.trim(), genre, tone: tones.join(', '), vision }
      if (onSubmit) { onSubmit({ title: title.trim(), genre, tone: tones, vision }); return }
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear proyecto')
      router.push(`/projects/${data.slug}/editor`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" role="dialog" aria-modal="true" aria-label="Nuevo proyecto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-lg font-semibold text-gray-800">🎬 Nueva película</h2>

        {/* Título */}
        <div className="mb-4">
          <label htmlFor="project-title" className="mb-1 block text-sm font-medium text-gray-700">
            Título *
          </label>
          <input
            id="project-title"
            ref={titleRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="El último tren"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {/* Género */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Género *</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button key={g} type="button" onClick={() => setGenre(g)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${genre === g ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Tono */}
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-700">Tono <span className="text-gray-400 font-normal">(varios)</span></p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button key={t} type="button" onClick={() => toggleTone(t)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition ${tones.includes(t) ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-400' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Visión */}
        <div className="mb-5">
          <label htmlFor="project-vision" className="mb-1 block text-sm font-medium text-gray-700">
            Visión de autor *
          </label>
          <textarea
            id="project-vision"
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            rows={3}
            placeholder="¿Qué historia quieres contar y por qué?"
            className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>

        {error && <p className="mb-3 text-xs text-red-500">{error}</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-100">
            Cancelar
          </button>
          <button type="button" onClick={handleSubmit} disabled={loading}
            aria-label="Crear proyecto"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
            {loading ? 'Creando…' : 'Crear proyecto'}
          </button>
        </div>
      </div>
    </div>
  )
}
