import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, writeMd } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

function updateProjectUpdated(slug: string) {
  const projectPath = path.join(projectDir(slug), 'project.md')
  if (!fs.existsSync(projectPath)) return
  const data = readMd(projectPath)
  data.fields.updated = new Date().toISOString().slice(0, 10)
  writeMd(projectPath, data)
}

// ─── GET /api/projects/[slug]/sinopsis ───────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const filePath = path.join(projectDir(slug), 'sinopsis.md')
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  try {
    const parsed = readMd(filePath)
    return NextResponse.json({
      title: parsed.title,
      logline: parsed.sections['Logline'] ?? '',
      sinopsis: parsed.sections['Sinopsis'] ?? '',
    })
  } catch {
    return NextResponse.json({ error: 'Error al leer sinopsis' }, { status: 500 })
  }
}

// ─── PUT /api/projects/[slug]/sinopsis ───────────────────────────────────────

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const filePath = path.join(projectDir(slug), 'sinopsis.md')
  try {
    const body = await req.json()
    const { title = 'Sinopsis', logline = '', synopsis = '' } = body

    writeMd(filePath, {
      title,
      fields: {},
      sections: { Logline: logline, Sinopsis: synopsis },
    })

    updateProjectUpdated(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar sinopsis' }, { status: 500 })
  }
}
