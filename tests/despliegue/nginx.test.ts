import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const conf = readFileSync('nginx/default.conf.template', 'utf8')
const bloque = (cabecera: string) => {
  const i = conf.indexOf(cabecera)
  expect(i, `falta ${cabecera}`).toBeGreaterThan(-1)
  return conf.slice(i, conf.indexOf('\n  }', i))
}

describe('plantilla de nginx', () => {
  it('reenvía /api/ a ${API_URL}/ (la barra final quita el prefijo)', () => {
    expect(bloque('location /api/')).toContain('proxy_pass ${API_URL}/;')
  })
  it('no filtra Set-Cookie ni fija Host', () => {
    const b = bloque('location /api/')
    expect(b).not.toMatch(/proxy_hide_header|proxy_ignore_headers|proxy_set_header Host/)
    expect(b).toContain('X-Forwarded-Proto')
  })
  it('respaldo SPA a /index.html', () => {
    expect(bloque('location / {')).toContain('try_files $uri /index.html;')
  })
  it('no-cache en sw.js, index.html y manifest; inmutable en /assets/', () => {
    for (const l of ['location = /sw.js', 'location = /index.html', 'location = /manifest.webmanifest'])
      expect(bloque(l)).toContain('Cache-Control "no-cache"')
    expect(bloque('location /assets/')).toContain('max-age=31536000, immutable')
  })
  it('cada location con add_header repite las cabeceras de seguridad', () => {
    for (const l of ['location /assets/', 'location = /sw.js', 'location / {']) expect(bloque(l)).toContain('cabeceras-seguridad.conf')
  })
})

describe('arranque exige API_URL', () => {
  const correr = (env: Record<string, string>) =>
    spawnSync('sh', ['nginx/exigir-api-url.sh'], { encoding: 'utf8', env: { PATH: process.env.PATH ?? '', ...env } })
  it('sin API_URL falla con mensaje en español', () => {
    const r = correr({})
    expect(r.status).not.toBe(0)
    expect(r.stderr).toMatch(/falta la variable de entorno API_URL/)
  })
  it('rechaza valores sin esquema o con barra final', () => {
    expect(correr({ API_URL: 'api:8080' }).status).not.toBe(0)
    expect(correr({ API_URL: 'http://api:8080/' }).status).not.toBe(0)
  })
  it('acepta una URL válida', () => {
    expect(correr({ API_URL: 'http://api:8080' }).status).toBe(0)
  })
})
