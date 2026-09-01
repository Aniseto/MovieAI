import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

const TEST_ROOT = path.join(os.tmpdir(), 'movieai-personajes-test-' + process.pid)
vi.stubEnv('MOVIEAI_PROJECTS_ROOT', TEST_ROOT)

const { GET: listPersonajes, POST: createPersonaje } = await import('@/app/api/projects/[slug]/personajes/route')
const { GET: getPersonaje, PUT: updatePersonaje, DELETE: deletePersonaje } = await import('@/app/api/projects/[slug]/personajes/[id]/route')

const slug = 'mi-peli'
const listParams = { params: Promise.resolve({ slug }) }
const idParams = (id: string) => ({ params: Promise.resolve({ slug, id }) })

function makeReq(body: object, method = 'POST') {
  return new NextRequest('http://localhost', { method, body: JSON.stringify(body) })
}

function setupProject() {
  fs.mkdirSync(path.join(TEST_ROOT, slug, 'personajes'), { recursive: true })
  fs.writeFileSync(
    path.join(TEST_ROOT, slug, 'project.md'),
    '# Mi Peli\n\nslug: mi-peli\nupdated: 2026-09-01\n'
  )
}

beforeEach(setupProject)
afterEach(() => fs.rmSync(TEST_ROOT, { recursive: true, force: true }))

// ─── GET (lista) ─────────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/personajes', () => {
  it('devuelve lista vacía si no hay personajes', async () => {
    const res = await listPersonajes(new NextRequest('http://localhost'), listParams)
    const data = await res.json()
    expect(data).toEqual([])
  })

  it('devuelve los personajes existentes', async () => {
    fs.writeFileSync(
      path.join(TEST_ROOT, slug, 'personajes', 'marco.md'),
      '# Marco\n\nrole: protagonista\nage: 45\n\n## Apariencia\n\nAlto, canoso\n'
    )
    const res = await listPersonajes(new NextRequest('http://localhost'), listParams)
    const data = await res.json()
    expect(data).toHaveLength(1)
    expect(data[0].name).toBe('Marco')
    expect(data[0].role).toBe('protagonista')
  })
})

// ─── POST ────────────────────────────────────────────────────────────────────

describe('POST /api/projects/[slug]/personajes', () => {
  it('crea el personaje y devuelve 201 con id', async () => {
    const res = await createPersonaje(makeReq({ name: 'Ana García', role: 'antagonista' }), listParams)
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.id).toBe('ana-garcia')
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'personajes', 'ana-garcia.md'))).toBe(true)
  })

  it('devuelve 400 si falta el nombre', async () => {
    const res = await createPersonaje(makeReq({ role: 'protagonista' }), listParams)
    expect(res.status).toBe(400)
  })

  it('devuelve 409 si el personaje ya existe', async () => {
    await createPersonaje(makeReq({ name: 'Marco' }), listParams)
    const res = await createPersonaje(makeReq({ name: 'Marco' }), listParams)
    expect(res.status).toBe(409)
  })
})

// ─── GET (individual) ────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/personajes/[id]', () => {
  it('devuelve 404 si no existe', async () => {
    const res = await getPersonaje(new NextRequest('http://localhost'), idParams('inexistente'))
    expect(res.status).toBe(404)
  })

  it('devuelve los datos del personaje', async () => {
    fs.writeFileSync(
      path.join(TEST_ROOT, slug, 'personajes', 'marco.md'),
      '# Marco\n\nrole: protagonista\nage: 45\n\n## Motivación\n\nRecuperar su identidad\n'
    )
    const res = await getPersonaje(new NextRequest('http://localhost'), idParams('marco'))
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.name).toBe('Marco')
    expect(data.motivation).toContain('Recuperar su identidad')
  })
})

// ─── PUT ─────────────────────────────────────────────────────────────────────

describe('PUT /api/projects/[slug]/personajes/[id]', () => {
  it('actualiza el personaje y devuelve 200', async () => {
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'personajes', 'marco.md'), '# Marco\n\nrole: protagonista\n')
    const res = await updatePersonaje(makeReq({ name: 'Marco', role: 'secundario' }, 'PUT'), idParams('marco'))
    expect(res.status).toBe(200)
    const content = fs.readFileSync(path.join(TEST_ROOT, slug, 'personajes', 'marco.md'), 'utf-8')
    expect(content).toContain('secundario')
  })

  it('devuelve 404 si no existe', async () => {
    const res = await updatePersonaje(makeReq({ name: 'X' }, 'PUT'), idParams('inexistente'))
    expect(res.status).toBe(404)
  })
})

// ─── DELETE ──────────────────────────────────────────────────────────────────

describe('DELETE /api/projects/[slug]/personajes/[id]', () => {
  it('elimina el fichero y devuelve 200', async () => {
    fs.writeFileSync(path.join(TEST_ROOT, slug, 'personajes', 'marco.md'), '# Marco\n')
    const res = await deletePersonaje(new NextRequest('http://localhost', { method: 'DELETE' }), idParams('marco'))
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'personajes', 'marco.md'))).toBe(false)
  })

  it('devuelve 404 si no existe', async () => {
    const res = await deletePersonaje(new NextRequest('http://localhost', { method: 'DELETE' }), idParams('noexiste'))
    expect(res.status).toBe(404)
  })
})
