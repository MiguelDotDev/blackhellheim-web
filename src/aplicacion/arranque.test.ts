import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { reiniciarMock, responder } from '../../mock/respuestas.ts'
import { useSesion } from '@/entidades/sesion'
import { arrancar } from './arranque'
import { crearEnrutador } from './enrutador'

let cookie = ''
beforeEach(() => {
  reiniciarMock()
  vi.stubGlobal('fetch', async (r: Request) => {
    const res = responder(r.method, new URL(r.url).pathname, { cabeceras: { cookie, authorization: r.headers.get('authorization') ?? undefined } })
    return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, { status: res.estado, headers: { 'content-type': 'application/json' } })
  })
  setActivePinia(createPinia())
})
afterEach(() => vi.unstubAllGlobals())

describe('arranque', () => {
  it('renovación silenciosa con éxito → sesión activa', async () => {
    const reg = responder('POST', '/auth/registro', { cuerpo: { correo: 'a@b.c', contrasena: 'secreta123' } })
    cookie = reg.cabeceras!['set-cookie'].split(';')[0]
    await arrancar(crearEnrutador(createMemoryHistory()))
    expect(useSesion().estado).toBe('activa')
  })
  it('con fallo → anónima y sin error', async () => {
    cookie = ''
    await expect(arrancar(crearEnrutador(createMemoryHistory()))).resolves.toBeUndefined()
    expect(useSesion().estado).toBe('anonima')
  })
  it('perder la sesión en una ruta privada lleva a /acceso con destino', async () => {
    cookie = ''
    const e = crearEnrutador(createMemoryHistory())
    e.addRoute({ path: '/privada', component: { template: '<p />' }, meta: { requiereSesion: true } })
    await arrancar(e)
    const s = useSesion()
    s.token = 't' // sesión viva en memoria, pero el refresh ya no vale
    await e.push('/privada')
    await s.renovar() // 401 → limpia la sesión
    await vi.waitFor(() => expect(e.currentRoute.value.name).toBe('acceso'))
    expect(e.currentRoute.value.query.destino).toBe('/privada')
  })
})
