import { describe, expect, it } from 'vitest'
import { leerFlujo } from '../ci/ayudantes'

const { texto, flujo } = leerFlujo('.github/workflows/despliegue.yml')
const jobs = flujo.jobs as Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
const pasos: Array<Record<string, any>> = jobs.desplegar.steps // eslint-disable-line @typescript-eslint/no-explicit-any

describe('flujo de despliegue', () => {
  it('se dispara solo con push a main', () => {
    expect(flujo.on).toEqual({ push: { branches: ['main'] } })
  })
  it('permisos mínimos: lectura global; OIDC y GHCR solo en el trabajo de despliegue', () => {
    expect(flujo.permissions).toEqual({ contents: 'read' })
    expect(jobs.desplegar.permissions).toEqual({ contents: 'read', 'id-token': 'write', packages: 'write' })
    expect(jobs.ci.permissions).toEqual({ contents: 'read' })
  })
  it('sin secretos en el archivo', () => {
    expect(texto).not.toContain('secrets.')
    expect(texto).not.toMatch(/password\s*:|client-secret/i)
  })
  it('todas las acciones externas fijadas por SHA', () => {
    const usos = pasos.filter((p) => p.uses).map((p) => p.uses as string)
    expect(usos.length).toBeGreaterThan(0)
    for (const u of usos) expect(u).toMatch(/@[0-9a-f]{40}$/)
  })
  it('exige el CI antes de desplegar (flujo reutilizable local)', () => {
    expect(jobs.ci.uses).toBe('./.github/workflows/ci.yml')
    expect(jobs.desplegar.needs).toBe('ci')
  })
  it('concurrencia sin cancelar y con grupo distinto al del CI', () => {
    expect(flujo.concurrency['cancel-in-progress']).toBe(false)
    expect(flujo.concurrency.group).not.toMatch(/^ci-/)
  })
  it('despliega por SHA del commit, nunca latest', () => {
    expect(texto).toContain('${GITHUB_SHA}')
    expect(texto).not.toMatch(/:latest/)
  })
  it('usa OIDC con variables (no secretas) y GHCR con github.token, sin ACR', () => {
    const login = pasos.find((p) => p.uses?.startsWith('azure/login'))!
    expect(login.with['client-id']).toBe('${{ vars.AZURE_CLIENT_ID }}')
    expect(texto).toContain('github.token')
    expect(texto).toContain('ghcr.io')
    expect(texto).not.toMatch(/azurecr\.io|az acr/)
  })
  it('el entorno produccion protege el trabajo y hay tiempo máximo', () => {
    expect(jobs.desplegar.environment).toBe('produccion')
    expect(jobs.desplegar['timeout-minutes']).toBeLessThanOrEqual(15)
  })
})

describe('ci.yml reutilizable', () => {
  it('admite workflow_call', () => {
    expect(leerFlujo().flujo.on).toHaveProperty('workflow_call')
  })
})
