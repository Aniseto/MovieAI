import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

const TEST_ROOT = path.join(os.tmpdir(), 'movieai-api-test-' + process.pid)

// Establecer antes de que se importen los módulos
vi.stubEnv('MOVIEAI_PROJECTS_ROOT', TEST_ROOT)

// Importación dinámica para que cojan la env var
const { GET, POST } = await import('@/app/api/projects/route')

describe('GET /api/projects', () => {
  beforeEach(() => fs.mkdirSync(TEST_ROOT, { recursive: true }))
  afterEach(() => fs.rmSync(TEST_ROOT, { recursive: true, force: true }))

  it('devuelve array (vacío si no hay proyectos)', async () => {
    const res = await GET()
    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
  })

  it('devuelve proyectos existentes con sus datos', async () => {
    const slug = 'proyecto-test'
    fs.mkdirSync(path.join(TEST_ROOT, slug), { recursive: true })
    fs.writeFileSync(
      path.join(TEST_ROOT, slug, 'project.md'),
      '# Mi Proyecto\n\nslug: proyecto-test\ngenre: Drama\ntone: Serio\nphase: 1\nupdated: 2026-09-01\n\n## Visión\n\nUna historia.\n'
    )
    const res = await GET()
    const data = await res.json()
    const found = data.find((p: { slug: string }) => p.slug === slug)
    expect(found).toBeDefined()
    expect(found.title).toBe('Mi Proyecto')
    expect(found.genre).toBe('Drama')
  })

  it('ignora carpetas sin project.md', async () => {
    fs.mkdirSync(path.join(TEST_ROOT, 'vacio'), { recursive: true })
    const res = await GET()
    const data = await res.json()
    expect(data.find((p: { slug: string }) => p.slug === 'vacio')).toBeUndefined()
  })
})

describe('POST /api/projects', () => {
  beforeEach(() => fs.mkdirSync(TEST_ROOT, { recursive: true }))
  afterEach(() => fs.rmSync(TEST_ROOT, { recursive: true, force: true }))

  it('crea el proyecto y retorna 201 con slug correcto', async () => {
    const req = new NextRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'El Último Tren', genre: 'Drama' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.slug).toBe('el-ultimo-tren')
    expect(fs.existsSync(path.join(TEST_ROOT, 'el-ultimo-tren', 'project.md'))).toBe(true)
    expect(fs.existsSync(path.join(TEST_ROOT, 'el-ultimo-tren', 'sinopsis.md'))).toBe(true)
    expect(fs.existsSync(path.join(TEST_ROOT, 'el-ultimo-tren', 'estructura.md'))).toBe(true)
  })

  it('devuelve 400 si falta el título', async () => {
    const req = new NextRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ genre: 'Drama' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('devuelve 409 si el proyecto ya existe', async () => {
    const body = JSON.stringify({ title: 'Duplicado' })
    await POST(new NextRequest('http://localhost/api/projects', { method: 'POST', body }))
    const res = await POST(new NextRequest('http://localhost/api/projects', { method: 'POST', body }))
    expect(res.status).toBe(409)
  })

  it('genera slug sin tildes ni caracteres especiales', async () => {
    const req = new NextRequest('http://localhost/api/projects', {
      method: 'POST',
      body: JSON.stringify({ title: 'Crónica de un Año' }),
    })
    const res = await POST(req)
    const data = await res.json()
    expect(data.slug).toBe('cronica-de-un-ano')
  })
})
