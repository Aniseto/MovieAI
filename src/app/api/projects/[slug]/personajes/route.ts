import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function personajesDir(slug: string) {
  return path.join(projectDir(slug), 'personajes')
}

function updateProjectUpdated(slug: string) {
  const p = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(p)) return
  const data = readMd(p)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(p, data)
}

// ─── GET /api/projects/[slug]/personajes ─────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const dir = personajesDir(slug)
  if (!fs.existsSync(dir)) return NextResponse.json([])

  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const personajes = files.map((file) => {
    try {
      const parsed = readMd(path.join(dir, file))
      const id = file.replace(/\.md$/, '')
      return {
        id,
        name: parsed.title,
        role: parsed.fields.role ?? '',
        age: parsed.fields.age ?? '',
        appearance: parsed.sections['Apariencia'] ?? '',
        personality: parsed.sections['Personalidad'] ?? '',
        motivation: parsed.sections['Motivación'] ?? '',
        hasImage: fs.existsSync(path.join(dir, `${id}-referencia.png`)),
      }
    } catch {
      return null
    }
  })

  return NextResponse.json(personajes.filter(Boolean))
}

// ─── POST /api/projects/[slug]/personajes ────────────────────────────────────

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json()
  const { name, role = '', age = '', appearance = '', personality = '', motivation = '' } = body

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  }

  const id = toSlug(name.trim())
  const dir = personajesDir(slug)
  const filePath = path.join(dir, `${id}.md`)

  if (fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Ya existe un personaje con ese nombre' }, { status: 409 })
  }

  fs.mkdirSync(dir, { recursive: true })
  writeMd(filePath, {
    title: name.trim(),
    fields: { role, age: String(age) },
    sections: { Apariencia: appearance, Personalidad: personality, Motivación: motivation },
  })

  updateProjectUpdated(slug)
  return NextResponse.json({ id }, { status: 201 })
}
