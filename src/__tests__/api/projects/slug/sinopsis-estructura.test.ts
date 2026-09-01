import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'

const TEST_ROOT = path.join(os.tmpdir(), 'movieai-sinopsis-test-' + process.pid)
vi.stubEnv('MOVIEAI_PROJECTS_ROOT', TEST_ROOT)

const { GET: getSinopsis, PUT: putSinopsis } = await import('@/app/api/projects/[slug]/sinopsis/route')
const { GET: getEstructura, PUT: putEstructura } = await import('@/app/api/projects/[slug]/estructura/route')

const slug = 'mi-peli'
const params = { params: Promise.resolve({ slug }) }

function makeReq(body?: object) {
  return new NextRequest('http://localhost', {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

beforeEach(() => {
  fs.mkdirSync(path.join(TEST_ROOT, slug), { recursive: true })
})

afterEach(() => {
  fs.rmSync(TEST_ROOT, { recursive: true, force: true })
})

// ─── sinopsis ────────────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/sinopsis', () => {
  it('devuelve 404 si el fichero no existe', async () => {
    const res = await getSinopsis(new NextRequest('http://localhost'), params)
    expect(res.status).toBe(404)
  })

  it('devuelve el contenido del fichero sinopsis.md', async () => {
    fs.writeFileSync(
      path.join(TEST_ROOT, slug, 'sinopsis.md'),
      '# Sinopsis\n\n## Logline\n\nUn hombre sin memoria\n\n## Sinopsis\n\nUna historia épica\n'
    )
    const res = await getSinopsis(new NextRequest('http://localhost'), params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.sinopsis).toContain('Una historia épica')
    expect(data.logline).toContain('Un hombre sin memoria')
  })
})

describe('PUT /api/projects/[slug]/sinopsis', () => {
  it('escribe el fichero y devuelve 200', async () => {
    const res = await putSinopsis(makeReq({ logline: 'Un hombre...', synopsis: 'Historia larga' }), params)
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'sinopsis.md'))).toBe(true)
  })

  it('el fichero escrito contiene la sinopsis', async () => {
    await putSinopsis(makeReq({ synopsis: 'Drama urbano intenso' }), params)
    const content = fs.readFileSync(path.join(TEST_ROOT, slug, 'sinopsis.md'), 'utf-8')
    expect(content).toContain('Drama urbano intenso')
  })
})

// ─── estructura ──────────────────────────────────────────────────────────────

describe('GET /api/projects/[slug]/estructura', () => {
  it('devuelve 404 si el fichero no existe', async () => {
    const res = await getEstructura(new NextRequest('http://localhost'), params)
    expect(res.status).toBe(404)
  })

  it('devuelve la estructura de actos parseada', async () => {
    fs.writeFileSync(
      path.join(TEST_ROOT, slug, 'estructura.md'),
      '# Estructura\n\n## Acto 1 — Planteamiento\n\nPresentación\n\n## Acto 2 — Conflicto\n\nConflicto\n'
    )
    const res = await getEstructura(new NextRequest('http://localhost'), params)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.actos).toHaveLength(2)
    expect(data.actos[0].nombre).toBe('Acto 1 — Planteamiento')
  })
})

describe('PUT /api/projects/[slug]/estructura', () => {
  it('escribe el fichero y devuelve 200', async () => {
    const res = await putEstructura(makeReq({ act1: 'Inicio', act2: 'Conflicto', act3: 'Final' }), params)
    expect(res.status).toBe(200)
    expect(fs.existsSync(path.join(TEST_ROOT, slug, 'estructura.md'))).toBe(true)
  })

  it('el fichero escrito contiene los actos', async () => {
    await putEstructura(makeReq({ act1: 'El protagonista aparece', turningPoint1: 'Giro dramático' }), params)
    const content = fs.readFileSync(path.join(TEST_ROOT, slug, 'estructura.md'), 'utf-8')
    expect(content).toContain('El protagonista aparece')
    expect(content).toContain('Giro dramático')
  })
})
