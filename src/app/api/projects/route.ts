import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import {
  PROJECTS_ROOT,
  projectDir,
  projectExists,
  ensureProjectDir,
  listProjects,
  readMd,
  writeMd,
} from '@/lib/markdown-fs'
import fs from 'fs'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // eliminar diacríticos
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

// ─── GET /api/projects ────────────────────────────────────────────────────────

export async function GET() {
  try {
    const slugs = listProjects()
    const projects = []

    for (const slug of slugs) {
      const projectMdPath = path.join(projectDir(slug), 'project.md')
      if (!fs.existsSync(projectMdPath)) continue

      try {
        const parsed = readMd(projectMdPath)
        projects.push({
          slug,
          title: parsed.title,
          genre: parsed.fields.genre ?? '',
          tone: parsed.fields.tone ?? '',
          phase: Number(parsed.fields.phase ?? 1),
          updated: parsed.fields.updated ?? '',
        })
      } catch {
        // proyecto corrupto — ignorar
      }
    }

    return NextResponse.json(projects)
  } catch {
    return NextResponse.json({ error: 'Error al leer proyectos' }, { status: 500 })
  }
}

// ─── POST /api/projects ───────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, genre = '', tone = '', vision = '' } = body

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })
    }

    const slug = toSlug(title.trim())

    if (projectExists(slug)) {
      return NextResponse.json({ error: 'Ya existe un proyecto con ese nombre' }, { status: 409 })
    }

    const now = today()

    // Crear estructura de directorios
    ensureProjectDir(slug)

    // Escribir project.md
    writeMd(path.join(projectDir(slug), 'project.md'), {
      title: title.trim(),
      fields: { slug, genre, tone, phase: '1', created: now, updated: now },
      sections: { Visión: vision },
    })

    // Escribir sinopsis.md vacía
    writeMd(path.join(projectDir(slug), 'sinopsis.md'), {
      title: 'Sinopsis',
      fields: {},
      sections: { Logline: '', Sinopsis: '' },
    })

    // Escribir estructura.md vacía
    writeMd(path.join(projectDir(slug), 'estructura.md'), {
      title: 'Estructura',
      fields: {},
      sections: { Planteamiento: '', Nudo: '', Desenlace: '' },
    })

    return NextResponse.json({ slug }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Error al crear el proyecto' }, { status: 500 })
  }
}
