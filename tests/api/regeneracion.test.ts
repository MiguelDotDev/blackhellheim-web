import { spawnSync } from 'node:child_process'
import { existsSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { expect, it } from 'vitest'

it('un contrato malformado falla con mensaje legible y sin crear salida', () => {
  const dir = mkdtempSync(join(tmpdir(), 'contrato-'))
  const entrada = join(dir, 'roto.json')
  const salida = join(dir, 'salida.d.ts')
  writeFileSync(entrada, '{ "openapi": "3.1.1", "paths": ')
  const r = spawnSync('node_modules/.bin/openapi-typescript', [entrada, '-o', salida], { encoding: 'utf8' })
  expect(r.status).not.toBe(0)
  expect(r.stderr.trim().length).toBeGreaterThan(0)
  expect(existsSync(salida)).toBe(false)
})
