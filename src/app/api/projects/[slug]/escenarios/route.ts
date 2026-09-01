import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

function toSlug(name: string): string {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-')
}

function escenDir(slug: string) { return path.join(projectDir(slug), 'escenarios') }

function updateProjectUpdated(slug: string) {
  const p = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(p)) return
  const data = readMd(p)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(p, data)
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const dir = escenDir(slug)
  if (!fs.existsSync(dir)) return NextResponse.json([])
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const items = files.map((file) => {
    try {
      const parsed = readMd(path.join(dir, file))
      const id = file.replace(/\.md$/, '')
      return { id, name: parsed.title, type: parsed.fields.type ?? '', lighting: parsed.fields.lighting ?? '', description: parsed.sections['Descripción'] ?? '', atmosphere: parsed.sections['Atmósfera'] ?? '', keyElements: parsed.sections['Elementos clave'] ?? '', hasImage: fs.existsSync(path.join(dir, `${id}-referencia.png`)) }
    } catch { return null }
  })
  return NextResponse.json(items.filter(Boolean))
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json()
  const { name, type = '', lighting = '', description = '', atmosphere = '', keyElements = '' } = body
  if (!name?.trim()) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 })
  const id = toSlug(name.trim())
  const dir = escenDir(slug)
  const filePath = path.join(dir, `${id}.md`)
  if (fs.existsSync(filePath)) return NextResponse.json({ error: 'Ya existe' }, { status: 409 })
  fs.mkdirSync(dir, { recursive: true })
  writeMd(filePath, { title: name.trim(), fields: { type, lighting }, sections: { 'Descripción': description, 'Atmósfera': atmosphere, 'Elementos clave': keyElements } })
  updateProjectUpdated(slug)
  return NextResponse.json({ id }, { status: 201 })
}
