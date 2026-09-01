'use client'

import { useEffect, useState } from 'react'
import { ProjectCard } from '@/components/ProjectCard'
import NewProjectModal from '@/components/NewProjectModal'

interface Project {
  slug: string
  title: string
  genre?: string
  phase?: string | number
  updated?: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">🎬 MovieAI</h1>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            aria-label="Nuevo proyecto"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            + Nueva película
          </button>
        </div>
      </header>

      {/* Contenido */}
      <main className="mx-auto max-w-5xl px-6 py-10">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          </div>
        ) : projects.length === 0 ? (
          /* Estado vacío */
          <div className="flex flex-col items-center gap-5 py-24 text-center">
            <span className="text-6xl">🎬</span>
            <div>
              <p className="text-lg font-medium text-gray-700">No tienes proyectos todavía</p>
              <p className="mt-1 text-sm text-gray-400">Empieza creando tu primera película</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              + Nueva película
            </button>
          </div>
        ) : (
          /* Lista de proyectos */
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p.slug} {...p} />
            ))}
          </ul>
        )}
      </main>

      <NewProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  )
}
