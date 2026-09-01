import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string; id: string }> }

function escenDir(slug: string) { return path.join(projectDir(slug), 'escenarios') }

function updateProjectUpdated(slug: string) {
  const p = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(p)) return
  const data = readMd(p)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(p, data)
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(escenDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const parsed = readMd(filePath)
  return NextResponse.json({ id, name: parsed.title, type: parsed.fields.type ?? '', lighting: parsed.fields.lighting ?? '', description: parsed.sections['Descripción'] ?? '', atmosphere: parsed.sections['Atmósfera'] ?? '', keyElements: parsed.sections['Elementos clave'] ?? '', hasImage: fs.existsSync(path.join(escenDir(slug), `${id}-referencia.png`)) })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(escenDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const body = await req.json()
  const { name, type = '', lighting = '', description = '', atmosphere = '', keyElements = '' } = body
  writeMd(filePath, { title: name ?? id, fields: { type, lighting }, sections: { 'Descripción': description, 'Atmósfera': atmosphere, 'Elementos clave': keyElements } })
  updateProjectUpdated(slug)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const dir = escenDir(slug)
  const filePath = path.join(dir, `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  fs.rmSync(filePath)
  const imgPath = path.join(dir, `${id}-referencia.png`)
  if (fs.existsSync(imgPath)) fs.rmSync(imgPath)
  updateProjectUpdated(slug)
  return NextResponse.json({ ok: true })
}
