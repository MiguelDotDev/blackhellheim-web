import { describe, expect, it, vi } from 'vitest'
import { crearClienteApi } from './cliente'

const json = (estado: number, cuerpo: unknown = { estado: 'ok' }) =>
  new Response(JSON.stringify(cuerpo), { status: estado, headers: { 'content-type': 'application/json' } })

/** Servidor falso: acepta solo el token vigente. */
function montar(renovar: () => Promise<boolean>) {
  let token = 'viejo'
  const vigente = 'nuevo'
  const vistos: (string | null)[] = []
  const fetch = vi.fn(async (r: Request) => {
    vistos.push(r.headers.get('authorization'))
    return json(r.headers.get('authorization') === `Bearer ${vigente}` ? 200 : 401)
  })
  const api = crearClienteApi('http://x:1', {
    obtenerToken: () => token,
    renovar: async () => {
      const ok = await renovar()
      if (ok) token = vigente
      return ok
    },
  })
  return { api, fetch, vistos }
}

describe('middleware de sesión', () => {
  it('añade Authorization con el token', async () => {
    const { api, fetch, vistos } = montar(async () => true)
    await api.GET('/salud', { fetch })
    expect(vistos[0]).toBe('Bearer viejo')
  })
  it('un 401 renueva y repite una vez con el token nuevo', async () => {
    const renovar = vi.fn(async () => true)
    const { api, fetch, vistos } = montar(renovar)
    const r = await api.GET('/salud', { fetch })
    expect(r.response.status).toBe(200)
    expect(renovar).toHaveBeenCalledTimes(1)
    expect(vistos).toEqual(['Bearer viejo', 'Bearer nuevo'])
  })
  it('conserva el cuerpo al repetir una petición POST', async () => {
    const { api, fetch } = montar(async () => true)
    const cuerpos: string[] = []
    const f = vi.fn(async (r: Request) => {
      cuerpos.push(await r.clone().text())
      return fetch(r)
    })
    await api.POST('/auth/registro', { body: { correo: 'a@b.c' }, fetch: f })
    expect(cuerpos).toEqual(['{"correo":"a@b.c"}', '{"correo":"a@b.c"}'])
  })
  it('si la renovación falla, devuelve el 401 original sin bucle', async () => {
    const renovar = vi.fn(async () => false)
    const { api, fetch } = montar(renovar)
    const r = await api.GET('/salud', { fetch })
    expect(r.response.status).toBe(401)
    expect(renovar).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(1)
  })
  it('si el reintento también da 401, no renueva de nuevo', async () => {
    const renovar = vi.fn(async () => true)
    const { api, fetch } = montar(renovar)
    const siempre401 = vi.fn(async () => json(401))
    const r = await api.GET('/salud', { fetch: siempre401 })
    expect(r.response.status).toBe(401)
    expect(renovar).toHaveBeenCalledTimes(1)
    expect(siempre401).toHaveBeenCalledTimes(2)
    expect(fetch).not.toHaveBeenCalled()
  })
  it('un fallo de red en la renovación no cierra la sesión: entrega el 401', async () => {
    const { api, fetch } = montar(async () => false) // el almacén devuelve false ante fallo de red
    expect((await api.GET('/salud', { fetch })).response.status).toBe(401)
  })
})
