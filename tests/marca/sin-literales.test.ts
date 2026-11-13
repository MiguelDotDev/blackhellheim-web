import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const archivos = (d: string): string[] =>
  readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? archivos(join(d, e.name)) : [join(d, e.name)]))
const fuentes = archivos('src').filter((f) => /\.(vue|ts|css)$/.test(f) && !/\.test\.ts$/.test(f))
const sinTokens = fuentes.filter((f) => !f.endsWith('marca.css'))
const leer = (f: string) => readFileSync(f, 'utf8')

describe('marca sin literales', () => {
  it('no hay #hex ni rgb( fuera de marca.css', () => {
    expect(sinTokens.filter((f) => /#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(leer(f).replace(/&#\d+;/g, '')))).toEqual([])
  })
  it('no hay utilidades de color por defecto de Tailwind', () => {
    expect(sinTokens.filter((f) => /\b(?:bg|text|border|ring)-(?:black|white|gray|red|green|blue)\b/.test(leer(f)))).toEqual([])
  })
  it('no hay dominios de fuentes externos', () => {
    expect([...fuentes, 'index.html'].filter((f) => /fonts\.(googleapis|gstatic)|use\.typekit|fontawesome/.test(leer(f)))).toEqual([])
  })
  it('los @font-face de las fuentes instaladas usan swap y woff2', () => {
    for (const p of ['@fontsource/anton/latin-400.css', '@fontsource-variable/inter/wght.css']) {
      const css = leer(`node_modules/${p}`)
      for (const bloque of css.match(/@font-face\s*{[^}]*}/g) ?? []) {
        expect(bloque).toContain('font-display: swap')
        expect(bloque).toContain('woff2')
      }
    }
  })
})
