import fs from 'fs'
import path from 'path'
import os from 'os'

// ─── Rutas ────────────────────────────────────────────────────────────────────

export const PROJECTS_ROOT =
  process.env.MOVIEAI_PROJECTS_ROOT ??
  path.join(os.homedir(), 'MovieAI', 'projects')

export function projectDir(slug: string): string {
  return path.join(PROJECTS_ROOT, slug)
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface ParsedMd {
  title: string
  fields: Record<string, string>
  sections: Record<string, string>
}

// ─── Parser ───────────────────────────────────────────────────────────────────

/**
 * Parsea un fichero Markdown con la convención:
 *   # Título
 *
 *   clave: valor
 *   clave2: valor2
 *
 *   ## Sección
 *
 *   Contenido libre de la sección
 */
export function parseMd(content: string): ParsedMd {
  const lines = content.split('\n')
  const result: ParsedMd = { title: '', fields: {}, sections: {} }

  let i = 0
  let currentSection: string | null = null

  for (; i < lines.length; i++) {
    const line = lines[i]

    // H1 → título
    if (line.startsWith('# ') && result.title === '') {
      result.title = line.slice(2).trim()
      currentSection = null
      continue
    }

    // H2 → nueva sección
    if (line.startsWith('## ')) {
      currentSection = line.slice(3).trim()
      result.sections[currentSection] = ''
      continue
    }

    // Campos clave: valor (solo antes del primer H2 y tras el H1)
    if (currentSection === null && result.title !== '' && /^[\w_-]+:\s/.test(line)) {
      const colonIdx = line.indexOf(':')
      const key = line.slice(0, colonIdx).trim()
      const value = line.slice(colonIdx + 1).trim()
      result.fields[key] = value
      continue
    }

    // Contenido de sección
    if (currentSection !== null) {
      result.sections[currentSection] += (result.sections[currentSection] ? '\n' : '') + line
    }
  }

  // Limpiar trailing whitespace de secciones
  for (const key of Object.keys(result.sections)) {
    result.sections[key] = result.sections[key].trimEnd()
  }

  return result
}

// ─── Serializer ───────────────────────────────────────────────────────────────

/**
 * Serializa una estructura ParsedMd a Markdown con la convención del proyecto.
 */
export function serializeMd(data: ParsedMd): string {
  const lines: string[] = []

  lines.push(`# ${data.title}`)
  lines.push('')

  for (const [key, value] of Object.entries(data.fields)) {
    lines.push(`${key}: ${value}`)
  }

  for (const [heading, content] of Object.entries(data.sections)) {
    lines.push('')
    lines.push(`## ${heading}`)
    lines.push('')
    if (content) lines.push(content)
  }

  lines.push('')
  return lines.join('\n')
}

// ─── Lectura / escritura de ficheros ─────────────────────────────────────────

export function readMd(filePath: string): ParsedMd {
  const content = fs.readFileSync(filePath, 'utf-8')
  return parseMd(content)
}

export function writeMd(filePath: string, data: ParsedMd): void {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, serializeMd(data), 'utf-8')
}

// ─── Helpers de proyecto ─────────────────────────────────────────────────────

export function listProjects(): string[] {
  if (!fs.existsSync(PROJECTS_ROOT)) return []
  return fs
    .readdirSync(PROJECTS_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

export function projectExists(slug: string): boolean {
  return fs.existsSync(projectDir(slug))
}

export function ensureProjectDir(slug: string): void {
  const dirs = [
    projectDir(slug),
    path.join(projectDir(slug), 'blocks'),
    path.join(projectDir(slug), 'personajes'),
    path.join(projectDir(slug), 'escenarios'),
    path.join(projectDir(slug), 'escenas'),
  ]
  for (const dir of dirs) {
    fs.mkdirSync(dir, { recursive: true })
  }
}
