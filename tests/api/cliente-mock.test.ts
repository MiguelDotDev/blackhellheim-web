import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'
import { afterAll, beforeAll, expect, it } from 'vitest'
import { iniciarServidor } from '../../mock/servidor.ts'
import { crearClienteApi } from '../../src/compartido/api'

let servidor: Server
let api: ReturnType<typeof crearClienteApi>
beforeAll(async () => {
  servidor = await iniciarServidor(0)
  api = crearClienteApi(`http://localhost:${(servidor.address() as AddressInfo).port}`)
})
afterAll(() => new Promise((r) => servidor.close(r)))

it('GET /salud', async () => {
  const { data } = await api.GET('/salud')
  expect(data?.estado).toBe('ok')
})

it('tienda inexistente y código inválido', async () => {
  const a = await api.GET('/tiendas/{codigo}', { params: { path: { codigo: 'XYZ' } } })
  expect(a.error?.codigo).toBe('tienda_no_encontrada')
  expect(a.response.status).toBe(404)
  const b = await api.GET('/tiendas/{codigo}', { params: { path: { codigo: 'mex' } } })
  expect(b.response.status).toBe(400)
})
