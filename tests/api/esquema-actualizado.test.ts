import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'

const contrato = 'specs/009-cliente-api-mock/contratos/openapi.json'
const versionado = readFileSync('src/compartido/api/generado/esquema.d.ts', 'utf8')

it('los tipos versionados corresponden al contrato', () => {
  const salida = join(mkdtempSync(join(tmpdir(), 'esquema-')), 'esquema.d.ts')
  execFileSync('node_modules/.bin/openapi-typescript', [contrato, '-o', salida], { stdio: 'pipe' })
  expect(readFileSync(salida, 'utf8')).toBe(versionado)
})

it('empieza con la cabecera de archivo generado', () => {
  expect(versionado).toMatch(/^\/\*\*\n \* This file was auto-generated/)
})
