import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

function blocksDir(slug: string) { return path.join(projectDir(slug), 'blocks') }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const dir = blocksDir(slug)
  if (!fs.existsSync(dir)) return NextResponse.json([])
  const { readMd } = await import('@/lib/markdown-fs')
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort()
  const items = files.map((file) => {
    try {
      const parsed = readMd(path.join(dir, file))
      const id = file.replace(/\.md$/, '')
      return { id, type: parsed.fields.type ?? '', order: parsed.fields.order ?? '', content: parsed.sections['Contenido'] ?? '' }
    } catch { return null }
  })
  return NextResponse.json(items.filter(Boolean))
}

export async function POST(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const body = await req.json()
  const { type, content = '' } = body
  if (!type?.trim()) return NextResponse.json({ error: 'El type es obligatorio' }, { status: 400 })

  const dir = blocksDir(slug)
  fs.mkdirSync(dir, { recursive: true })

  const existing = fs.readdirSync(dir).filter((f) => f.endsWith('.md'))
  const nnn = String(existing.length + 1).padStart(3, '0')
  const id = `block-${nnn}-${type.trim()}`
  const filePath = path.join(dir, `${id}.md`)

  writeMd(filePath, {
    title: id,
    fields: { type: type.trim(), order: nnn },
    sections: { Contenido: content },
  })
  return NextResponse.json({ id }, { status: 201 })
}
