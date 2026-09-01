import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

const TEST_ROOT = path.join(os.tmpdir(), 'movieai-t02e-test-' + process.pid)
vi.stubEnv('MOVIEAI_PROJECTS_ROOT', TEST_ROOT)

const { GET: listEscenarios, POST: createEscenario } = await import('@/app/api/projects/[slug]/escenarios/route')
const { GET: getEscenario, PUT: updateEscenario, DELETE: deleteEscenario } = await import('@/app/api/projects/[slug]/escenarios/[id]/route')
const { GET: listEscenas, POST: createEscena } = await import('@/app/api/projects/[slug]/escenas/route')
const { GET: getEscena, DELETE: deleteEscena } = await import('@/app/api/projects/[slug]/escenas/[id]/route')
const { POST: createBlock } = await import('@/app/api/projects/[slug]/blocks/route')
const { DELETE: deleteBlock } = await import('@/app/api/projects/[slug]/blocks/[id]/route')

const slug = 'mi-peli'
const lp = { params: Promise.resolve({ slug }) }
const ip = (id: string) => ({ params: Promise.resolve({ slug, id }) })

function mkReq(body: object, method = 'POST') {
  return new NextRequest('http://localhost', { method, body: JSON.stringify(body) })
}

function setupProject() {
  fs.mkdirSync(path.join(TEST_ROOT, slug), { recursive: true })
  fs.writeFileSync(path.join(TEST_ROOT, slug, 'project.md'), '# Mi Peli\n\nslug: mi-peli\nupdated: 2026-09-01\n')
}

beforeEach(setupProject)
afterEach(() => fs.rmSync(TEST_ROOT, { recursive: true, force: true }))

// ─── escenarios ──────────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/escenarios', () => {
  it('devuelve lista vacía si no hay escenarios', async () => {
    const res = await listEscenarios(new NextRequest('http://localhost'), lp)
    expect(await res.json()).toEqual([])
  })

  it('devuelve los escenarios existentes', async () => {
    fs.mkdirSync(path.join(TEST_ROOT, slug, 'escenarios'), { recursive: true })
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'escenarios', 'casa.md'), '# Casa\n\ntype: EXT\nlighting: día\n\n## Descripción\n\nUna casa rural\n')
    const res = await listEscenarios(new NextRequest('http://localhost'), lp)
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('Casa')
    expect(data[0].type).toBe('EXT')
  })
})

describe('POST /api/projects/[slug]/escenarios', () => {
  it('crea escenario y devuelve 201 con id', async () => {
    const res = await createEscenario(mkReq({ name: 'Estación Central', type: 'INT' }), lp)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe('estacion-central')
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'escenarios', 'estacion-central.md'))).toBe(true)
  })

  it('devuelve 400 si falta nombre', async () => {
    const res = await createEscenario(mkReq({ type: 'INT' }), lp)
    expect(res.status).toBe(400)
  })

  it('devuelve 409 si ya existe', async () => {
    await createEscenario(mkReq({ name: 'Casa' }), lp)
    const res = await createEscenario(mkReq({ name: 'Casa' }), lp)
    expect(res.status).toBe(409)
  })
})

describe('GET/PUT/DELETE /api/projects/[slug]/escenarios/[id]', () => {
  beforeEach(() => {
    fs.mkdirSync(path.join(TEST_ROOT, slug, 'escenarios'), { recursive: true })
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'escenarios', 'casa.md'), '# Casa\n\ntype: EXT\nlighting: día\n')
  })

  it('GET devuelve el escenario', async () => {
    const res = await getEscenario(new NextRequest('http://localhost'), ip('casa'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Casa')
  })

  it('GET devuelve 404 si no existe', async () => {
    const res = await getEscenario(new NextRequest('http://localhost'), ip('nope'))
    expect(res.status).toBe(404)
  })

  it('PUT actualiza el escenario', async () => {
    const res = await updateEscenario(mkReq({ name: 'Casa', type: 'INT' }, 'PUT'), ip('casa'))
    expect(res.status).toBe(200)
    const content = fs.readFileSync(path.join(TEST_ROOT, slug, 'escenarios', 'casa.md'), 'utf-8')
    expect(content).toContain('INT')
  })

  it('DELETE elimina el fichero', async () => {
    const res = await deleteEscenario(new NextRequest('http://localhost', { method: 'DELETE' }), ip('casa'))
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'escenarios', 'casa.md'))).toBe(false)
  })
})

// ─── escenas ─────────────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/escenas', () => {
  it('devuelve lista vacía si no hay escenas', async () => {
    const res = await listEscenas(new NextRequest('http://localhost'), lp)
    expect(await res.json()).toEqual([])
  })
})

describe('POST /api/projects/[slug]/escenas', () => {
  it('crea escena con nombre escena-01-* y devuelve 201', async () => {
    const res = await createEscena(mkReq({ title: 'Llegada a la estación' }), lp)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toMatch(/^escena-01-/)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'escenas', `${data.id}.md`))).toBe(true)
  })

  it('segunda escena tiene número 02', async () => {
    await createEscena(mkReq({ title: 'Primera' }), lp)
    const res = await createEscena(mkReq({ title: 'Segunda' }), lp)
    const data = await res.json()
    expect(data.id).toMatch(/^escena-02-/)
  })

  it('devuelve 400 si falta título', async () => {
    const res = await createEscena(mkReq({ locationSlug: 'casa' }), lp)
    expect(res.status).toBe(400)
  })
})

describe('GET/DELETE /api/projects/[slug]/escenas/[id]', () => {
  it('GET devuelve la escena', async () => {
    fs.mkdirSync(path.join(TEST_ROOT, slug, 'escenas'), { recursive: true })
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'escenas', 'escena-01-llegada.md'), '# Llegada\n\nlocationSlug: casa\n')
    const res = await getEscena(new NextRequest('http://localhost'), ip('escena-01-llegada'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.title).toBe('Llegada')
  })

  it('DELETE elimina la escena', async () => {
    fs.mkdirSync(path.join(TEST_ROOT, slug, 'escenas'), { recursive: true })
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'escenas', 'escena-01-llegada.md'), '# Llegada\n')
    const res = await deleteEscena(new NextRequest('http://localhost', { method: 'DELETE' }), ip('escena-01-llegada'))
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'escenas', 'escena-01-llegada.md'))).toBe(false)
  })
})

// ─── blocks ──────────────────────────────────────────────────────────────────

describe('POST /api/projects/[slug]/blocks', () => {
  it('crea block con nombre block-001-* y devuelve 201', async () => {
    const res = await createBlock(mkReq({ type: 'action', content: 'El protagonista entra' }), lp)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toMatch(/^block-001-/)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'blocks', `${data.id}.md`))).toBe(true)
  })

  it('devuelve 400 si falta type', async () => {
    const res = await createBlock(mkReq({ content: 'texto' }), lp)
    expect(res.status).toBe(400)
  })
})

describe('DELETE /api/projects/[slug]/blocks/[id]', () => {
  it('elimina el block y devuelve 200', async () => {
    fs.mkdirSync(path.join(TEST_ROOT, slug, 'blocks'), { recursive: true })
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'blocks', 'block-001-action.md'), '# block-001-action\n\ntype: action\norder: 001\n')
    const res = await deleteBlock(new NextRequest('http://localhost', { method: 'DELETE' }), ip('block-001-action'))
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'blocks', 'block-001-action.md'))).toBe(false)
  })
})
