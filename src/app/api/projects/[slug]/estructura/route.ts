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

// ─── GET /api/projects/[slug]/estructura ─────────────────────────────────────

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const filePath = path.join(projectDir(slug), 'estructura.md')
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  }
  try {
    const parsed = readMd(filePath)
    const actos = Object.entries(parsed.sections).map(([nombre, contenido]) => ({
      nombre,
      contenido,
    }))
    return NextResponse.json({ title: parsed.title, actos })
  } catch {
    return NextResponse.json({ error: 'Error al leer estructura' }, { status: 500 })
  }
}

// ─── PUT /api/projects/[slug]/estructura ─────────────────────────────────────

export async function PUT(req: NextRequest, { params }: Params) {
  const { slug } = await params
  const filePath = path.join(projectDir(slug), 'estructura.md')
  try {
    const body = await req.json()
    const {
      act1 = '',
      turningPoint1 = '',
      act2 = '',
      turningPoint2 = '',
      act3 = '',
    } = body

    writeMd(filePath, {
      title: 'Estructura',
      fields: {},
      sections: {
        'Acto 1 — Planteamiento': act1,
        'Punto de giro 1': turningPoint1,
        'Acto 2 — Conflicto': act2,
        'Punto de giro 2': turningPoint2,
        'Acto 3 — Desenlace': act3,
      },
    })

    updateProjectUpdated(slug)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Error al guardar estructura' }, { status: 500 })
  }
}
