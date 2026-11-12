import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { leerFlujo } from './ayudantes'

const { texto, flujo } = leerFlujo()
const trabajo = flujo.jobs.verificar
const pasos: Array<Record<string, any>> = trabajo.steps // eslint-disable-line @typescript-eslint/no-explicit-any
const ramas = ['main', 'release', 'developer', 'sprint/**']

describe('verificaciones', () => {
  it('matriz exacta y sin fail-fast', () => {
    expect(trabajo.strategy.matrix.verificacion).toEqual(['lint', 'type-check', 'test', 'build'])
    expect(trabajo.strategy['fail-fast']).toBe(false)
  })
  it('cada verificación existe como script', () => {
    const { scripts } = JSON.parse(readFileSync('package.json', 'utf8'))
    for (const v of trabajo.strategy.matrix.verificacion) expect(scripts).toHaveProperty(v)
  })
  it('instala con npm ci y termina ejecutando la verificación', () => {
    expect(pasos.some((p) => p.run === 'npm ci')).toBe(true)
    expect(pasos.at(-1)?.run).toBe('npm run ${{ matrix.verificacion }}')
  })
})

describe('disparadores', () => {
  it('push y pull_request en la cadena de ramas', () => {
    expect(flujo.on.push.branches).toEqual(ramas)
    expect(flujo.on.pull_request.branches).toEqual(ramas)
  })
  it('sin pull_request_target ni workflow_run', () => {
    expect(flujo.on).not.toHaveProperty('pull_request_target')
    expect(flujo.on).not.toHaveProperty('workflow_run')
  })
})

describe('seguridad', () => {
  it('permisos mínimos', () => {
    expect(flujo.permissions).toEqual({ contents: 'read' })
    for (const t of Object.values<any>(flujo.jobs)) expect(t).not.toHaveProperty('permissions') // eslint-disable-line @typescript-eslint/no-explicit-any
  })
  it('tiempo máximo de 10 minutos', () => {
    for (const t of Object.values<any>(flujo.jobs)) expect(t['timeout-minutes']).toBeLessThanOrEqual(10) // eslint-disable-line @typescript-eslint/no-explicit-any
  })
  it('sin secretos', () => {
    expect(texto).not.toContain('secrets.')
  })
  it('acciones fijadas por SHA', () => {
    const usos = pasos.filter((p) => p.uses).map((p) => p.uses as string)
    expect(usos.length).toBeGreaterThan(0)
    for (const u of usos) expect(u).toMatch(/@[0-9a-f]{40}$/)
  })
  it('checkout sin credenciales y Node desde .nvmrc', () => {
    expect(pasos.find((p) => p.uses?.startsWith('actions/checkout'))?.with['persist-credentials']).toBe(false)
    expect(pasos.find((p) => p.uses?.startsWith('actions/setup-node'))?.with['node-version-file']).toBe('.nvmrc')
    expect(existsSync('.nvmrc') && existsSync('package-lock.json')).toBe(true)
  })
  it('concurrencia cancela solo en pull_request', () => {
    expect(flujo.concurrency['cancel-in-progress']).toContain("github.event_name == 'pull_request'")
  })
})
