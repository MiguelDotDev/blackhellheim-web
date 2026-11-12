import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { permitidas } from './permitidas'

const SOSPECHOSO = /SECRET|SECRETO|TOKEN|PASSWORD|PASSWD|CLAVE|CONTRASE|KEY|CREDENCIAL/i

function parsear(texto: string): [string, string][] {
  return texto
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=')
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')] as [string, string]
    })
}

function problemas(archivo: string, texto: string): string[] {
  return parsear(texto).flatMap(([nombre, valor]) => {
    const fallos: string[] = []
    if (!nombre.startsWith('VITE_')) fallos.push(`${archivo}: ${nombre} no empieza por VITE_`)
    if (SOSPECHOSO.test(nombre) && !permitidas.includes(nombre))
      fallos.push(`${archivo}: ${nombre} parece un secreto (si es una clave pública, añádela a permitidas.ts)`)
    if (/:\/\/[^/\s:@]+:[^/\s@]+@/.test(valor)) fallos.push(`${archivo}: ${nombre} contiene credenciales incrustadas`)
    return fallos
  })
}

describe('archivos .env.*', () => {
  it.each(['.env.development', '.env.test', '.env.production'])('%s no tiene secretos', (f) => {
    expect(problemas(f, readFileSync(f, 'utf8'))).toEqual([])
  })
  it('detecta casos sintéticos', () => {
    expect(problemas('x', 'CLAVE_API=abc')).toHaveLength(2)
    expect(problemas('x', 'VITE_TOKEN=abc')).toHaveLength(1)
    expect(problemas('x', 'VITE_API_URL="http://u:p@host"')).toHaveLength(1)
    expect(problemas('x', '# c\nVITE_API_URL=/api')).toEqual([])
  })
  it('.gitignore excluye .env*.local', () => {
    expect(readFileSync('.gitignore', 'utf8')).toContain('.env*.local')
  })
})
