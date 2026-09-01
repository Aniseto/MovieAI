import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string; id: string }> }

function blocksDir(slug: string) { return path.join(projectDir(slug), 'blocks') }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(blocksDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const parsed = readMd(filePath)
  return NextResponse.json({ id, type: parsed.fields.type ?? '', order: parsed.fields.order ?? '', content: parsed.sections['Contenido'] ?? '' })
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(blocksDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  const body = await req.json()
  const { type = '', content = '', order = '' } = body
  writeMd(filePath, { title: id, fields: { type, order: String(order) }, sections: { Contenido: content } })
  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { slug, id } = await params
  const filePath = path.join(blocksDir(slug), `${id}.md`)
  if (!fs.existsSync(filePath)) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  fs.rmSync(filePath)
  return NextResponse.json({ ok: true })
}
