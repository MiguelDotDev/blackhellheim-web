import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { iniciarServidor } from '../../mock/servidor.ts'

let servidor: Server
let base: string
beforeAll(async () => {
  servidor = await iniciarServidor(0)
  base = `http://localhost:${(servidor.address() as AddressInfo).port}`
})
afterAll(() => new Promise((r) => servidor.close(r)))

it('responde JSON con CORS', async () => {
  const r = await fetch(`${base}/salud`)
  expect(r.status).toBe(200)
  expect(r.headers.get('content-type')).toContain('application/json')
  expect(r.headers.get('access-control-allow-origin')).toBeTruthy()
})

it('OPTIONS da 204', async () => {
  expect((await fetch(`${base}/salud`, { method: 'OPTIONS' })).status).toBe(204)
})

it('puerto ocupado: error en español', async () => {
  const puerto = (servidor.address() as AddressInfo).port
  await expect(iniciarServidor(puerto)).rejects.toThrow(new RegExp(`${puerto}.*MOCK_PUERTO`))
})
