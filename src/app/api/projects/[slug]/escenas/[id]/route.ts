import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string; id: string }> }

function escenasDir(slug: string) { return path.join(projectDir(slug), 'escenas') }

function updateProjectUpdated(slug: string) {
  const p = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(p)) return
  const data = readMd(p)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(p, data)
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(escenasDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  const parsed = readMd(filePath)
  return NextResponse.json({ id, title: parsed.title, locationSlug: parsed.fields.locationSlug ?? '', moment: parsed.fields.moment ?? '', emotion: parsed.fields.emotion ?? '', duration: parsed.fields.duration ?? '', characters: parsed.sections['Personajes'] ?? '', action: parsed.sections['Acción'] ?? '', dialogues: parsed.sections['Diálogos'] ?? '', notes: parsed.sections['Notas'] ?? '' })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(escenasDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  const body = await req.json()
  const { title, locationSlug = '', moment = '', emotion = '', duration = '', characters = '', action = '', dialogues = '', notes = '' } = body
  writeMd(filePath, { title: title ?? id, fields: { locationSlug, moment, emotion, duration }, sections: { Personajes: characters, Acción: action, Diálogos: dialogues, Notas: notes } })
  updateProjectUpdated(slug)
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(escenasDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrada' }, { status: 404 })
  fs.rmSync(filePath)
  updateProjectUpdated(slug)
  return NextResponse.json({ ok: true })
}
