import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { reiniciarMock, responder } from '../../../mock/respuestas.ts'
import { useSesion } from '@/entidades/sesion'
import { crearApiConSesion } from './api'

let cookie = ''
let renovaciones = 0
beforeEach(() => {
  reiniciarMock()
  cookie = ''
  renovaciones = 0
  vi.stubGlobal('fetch', async (r: Request) => {
    if (new URL(r.url).pathname === '/auth/renovar') renovaciones++
    const res = responder(r.method, new URL(r.url).pathname, {
      cuerpo: r.method === 'POST' ? await r.json().catch(() => undefined) : undefined,
      cabeceras: { cookie, authorization: r.headers.get('authorization') ?? undefined },
    })
    const sc = res.cabeceras?.['set-cookie']
    if (sc) cookie = sc.split(';')[0]
    return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, { status: res.estado, headers: { 'content-type': 'application/json' } })
  })
  setActivePinia(createPinia())
})
afterEach(() => vi.unstubAllGlobals())

it('SC-001: con el acceso caducado, N peticiones simultáneas terminan bien con una sola renovación', async () => {
  const sesion = useSesion()
  await sesion.registrar({ correo: 'ana@ejemplo.com', contrasena: 'secreta123' })
  sesion.token = 'caducado-en-el-servidor'
  const api = crearApiConSesion()
  const rs = await Promise.all(Array.from({ length: 4 }, () => api.GET('/auth/yo')))
  expect(rs.map((r) => r.response.status)).toEqual([200, 200, 200, 200])
  expect(rs[0].data?.correo).toBe('ana@ejemplo.com')
  expect(renovaciones).toBe(1)
})
