import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

function toSlug(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

function escenasDir(slug: string) { return path.join(projectDir(slug), 'escenas') }

function updateProjectUpdated(slug: string) {
  const p = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(p)) return
  const data = readMd(p)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(p, data)
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const dir = escenasDir(slug)
  if (!fs.existsSync(dir)) return NextResponse.json([])
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
  const items = files.map((file) => {
    try {
      const parsed = readMd(path.join(dir, file))
      const id = file.replace(/\.md$/, '')
      return { id, title: parsed.title, locationSlug: parsed.fields.locationSlug ?? '', moment: parsed.fields.moment ?? '', emotion: parsed.fields.emotion ?? '', duration: parsed.fields.duration ?? '' }
    } catch { return null }
  })
  return NextResponse.json(items.filter(Boolean))
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json()
  const { title, locationSlug = '', moment = '', emotion = '', duration = '', characters = '', action = '', dialogues = '', notes = '' } = body
  if (!title?.trim()) return NextResponse.json({ error: 'El título es obligatorio' }, { status: 400 })

  const dir = escenasDir(slug)
  fs.mkdirSync(dir, { recursive: true })

  const existing = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const nn = String(existing.length + 1).padStart(2, '0')
  const titleSlug = toSlug(title.trim())
  const id = `escena-${nn}-${titleSlug}`
  const filePath = path.join(dir, `${id}.md`)

  writeMd(filePath, {
    title: title.trim(),
    fields: { locationSlug, moment, emotion, duration },
    sections: { Personajes: characters, Acción: action, Diálogos: dialogues, Notas: notes },
  })
  updateProjectUpdated(slug)
  return NextResponse.json({ id }, { status: 201 })
}
