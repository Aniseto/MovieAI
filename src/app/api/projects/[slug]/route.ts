import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { projectDir, readMd, PROJECTS_ROOT } from '@/lib/markdown-fs'

type Params = { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params
  const dir = projectDir(slug)
  const projectPath = path.join(dir, 'project.md')

  if (!fs.existsSync(projectPath)) {
    return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 })
  }

  try {
    const project = readMd(projectPath)

    // Cargar bloques libres
    const blocksDir = path.join(dir, 'blocks')
    const blocks = fs.existsSync(blocksDir)
      ? fs.readdirSync(blocksDir)
          .filter((f) => f.endsWith('.md'))
          .sort()
          .map((file, i) => {
            try {
              const parsed = readMd(path.join(blocksDir, file))
              const id = file.replace(/\.md$/, '')
              const type = parsed.fields.type ?? 'note'
              return {
                id,
                type,
                slug: id,
                filename: `blocks/${file}`,
                order: i + 1,
                content: parsed.sections['Contenido'] ?? '',
                hasImage: type === 'character' || type === 'location',
                imageUrl: undefined as string | undefined,
                status: 'draft' as const,
              }
            } catch { return null }
          })
          .filter(Boolean)
      : []

    return NextResponse.json({
      slug,
      title: project.title,
      genre: project.fields.genre ?? '',
      tone: project.fields.tone ?? '',
      phase: project.fields.phase ?? '1',
      updated: project.fields.updated ?? '',
      blocks,
    })
  } catch {
    return NextResponse.json({ error: 'Error al leer proyecto' }, { status: 500 })
  }
}
