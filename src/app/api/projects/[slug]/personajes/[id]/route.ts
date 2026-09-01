import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string; id: string }> }

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

// ─── GET /api/projects/[slug]/personajes/[id] ────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(personajesDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 })
  }
  try {
    const parsed = readMd(filePath)
    return NextResponse.json({
      id,
      name: parsed.title,
      role: parsed.fields.role ?? '',
      age: parsed.fields.age ?? '',
      appearance: parsed.sections['Apariencia'] ?? '',
      personality: parsed.sections['Personalidad'] ?? '',
      motivation: parsed.sections['Motivación'] ?? '',
      hasImage: fs.existsSync(path.join(personajesDir(slug), `${id}-referencia.png`)),
    })
  } catch {
    return NextResponse.json({ error: 'Error al leer personaje' }, { status: 500 })
  }
}

// ─── PUT /api/projects/[slug]/personajes/[id] ────────────────────────────────

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(personajesDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 })
  }
  try {
    const body = await req.json()
    const { name, role = '', age = '', appearance = '', personality = '', motivation = '' } = body
    writeMd(filePath, {
      title: name ?? id,
      fields: { role, age: String(age) },
      sections: { Apariencia: appearance, Personalidad: personality, Motivación: motivation },
    })
    updateProjectUpdated(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al actualizar personaje' }, { status: 500 })
  }
}

// ─── DELETE /api/projects/[slug]/personajes/[id] ─────────────────────────────

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const dir = personajesDir(slug)
  const filePath = path.join(dir, `${id}.md`)
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Personaje no encontrado' }, { status: 404 })
  }
  try {
    fs.rmSync(filePath)
    const imgPath = path.join(dir, `${id}-referencia.png`)
    if (fs.existsSync(imgPath)) fs.rmSync(imgPath)
    updateProjectUpdated(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al eliminar personaje' }, { status: 500 })
  }
}
