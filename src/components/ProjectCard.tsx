'use client'

import Link from 'next/link'

interface ProjectCardProps {
  slug: string
  title: string
  genre?: string
  phase?: string | number
  updated?: string
}

export function ProjectCard({ slug, title, genre, phase, updated }: ProjectCardProps) {
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="font-semibold text-gray-800 leading-tight">{title}</h2>
          {genre && <p className="mt-0.5 text-xs text-gray-400">{genre}</p>}
        </div>
        {phase && (
          <span className="shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
            Fase {phase}
          </span>
        )}
      </div>

      {updated && (
        <p className="text-xs text-gray-300">
          Actualizado: {new Date(updated).toLocaleDateString('es-ES')}
        </p>
      )}

      <Link
        href={`/projects/${slug}/editor`}
        className="mt-auto rounded-lg bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700"
      >
        Continuar →
      </Link>
    </li>
  )
}
