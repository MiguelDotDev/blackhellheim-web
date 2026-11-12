import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reiniciarMock, responder } from '../../../../mock/respuestas.ts'
import { useSesion, type Credenciales } from './sesion'

const cred = { correo: 'ana@ejemplo.com', contrasena: 'secreta123' }
let cookie = ''
const llamadas: string[] = []

/** fetch → mock puro; guarda la cookie como lo haría el navegador. */
async function fetchMock(r: Request) {
  const ruta = new URL(r.url).pathname
  llamadas.push(ruta)
  const cuerpo = r.method === 'POST' ? ((await r.json().catch(() => undefined)) as Credenciales | undefined) : undefined
  const res = responder(r.method, ruta, { cuerpo, cabeceras: { authorization: r.headers.get('authorization') ?? undefined, cookie } })
  const sc = res.cabeceras?.['set-cookie']
  if (sc) cookie = sc.startsWith('refresco=;') ? '' : sc.split(';')[0]
  return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, {
    status: res.estado,
    headers: res.cuerpo ? { 'content-type': res.estado >= 400 ? 'application/problem+json' : 'application/json' } : {},
  })
}

beforeEach(() => {
  reiniciarMock()
  cookie = ''
  llamadas.length = 0
  vi.stubGlobal('fetch', vi.fn(fetchMock))
  setActivePinia(createPinia())
})
afterEach(() => vi.unstubAllGlobals())

describe('almacén de sesión', () => {
  it('empieza anónima', () => {
    expect(useSesion().estado).toBe('anonima')
  })
  it('registro e inicio dejan la sesión activa con perfil, y avisan al gancho', async () => {
    const s = useSesion()
    const aviso = vi.fn()
    s.alIniciarSesion(aviso)
    expect(await s.registrar(cred)).toEqual({ ok: true })
    expect(s.estado).toBe('activa')
    expect(s.usuario?.correo).toBe(cred.correo)
    await s.cerrarSesion()
    expect(await s.iniciarSesion(cred)).toEqual({ ok: true })
    expect(aviso).toHaveBeenCalledTimes(2)
  })
  it('credenciales incorrectas → estado 401 y sigue anónima; validación → errores por campo', async () => {
    const s = useSesion()
    expect(await s.iniciarSesion(cred)).toMatchObject({ ok: false, estado: 401 })
    const r = await s.iniciarSesion({ correo: '', contrasena: '' })
    expect(r).toMatchObject({ ok: false, estado: 400 })
    expect(Object.keys(r.ok ? {} : r.errores!)).toEqual(['correo', 'contrasena'])
    expect(s.estado).toBe('anonima')
  })
  it('el token nunca toca localStorage, sessionStorage ni IndexedDB', async () => {
    const espias = [vi.spyOn(Storage.prototype, 'setItem')]
    // jsdom no trae IndexedDB; si algún día existe, también se vigila.
    const bd = (globalThis as { indexedDB?: IDBFactory }).indexedDB
    if (bd) espias.push(vi.spyOn(bd, 'open') as never)
    const s = useSesion()
    await s.registrar(cred)
    await s.renovar()
    espias.forEach((e) => expect(e).not.toHaveBeenCalled())
    expect(JSON.stringify({ ...localStorage, ...sessionStorage })).not.toContain(s.token!)
  })
  it('renovar con cookie válida rota el token; N renovaciones simultáneas → una sola petición', async () => {
    const s = useSesion()
    await s.registrar(cred)
    const antes = s.token
    llamadas.length = 0
    const rs = await Promise.all([s.renovar(), s.renovar(), s.renovar()])
    expect(rs).toEqual([true, true, true])
    expect(llamadas.filter((r) => r === '/auth/renovar')).toHaveLength(1)
    expect(s.token).not.toBe(antes)
  })
  it('renovar con refresh inválido (401) limpia la sesión', async () => {
    const s = useSesion()
    await s.registrar(cred)
    cookie = 'refresco=falso'
    expect(await s.renovar()).toBe(false)
    expect(s.estado).toBe('anonima')
    expect(s.token).toBeUndefined()
  })
  it('un fallo de red al renovar conserva la sesión', async () => {
    const s = useSesion()
    await s.registrar(cred)
    const token = s.token
    vi.stubGlobal('fetch', async () => { throw new TypeError('red caída') })
    setActivePinia(createPinia()) // el cliente captura fetch al crearse
    const s2 = useSesion()
    s2.token = token
    expect(await s2.renovar()).toBe(false)
    expect(s2.token).toBe(token)
  })
  it('cerrar sesión limpia el estado y revoca el refresh en el servidor', async () => {
    const s = useSesion()
    await s.registrar(cred)
    const c = cookie
    await s.cerrarSesion()
    expect(s.estado).toBe('anonima')
    expect(s.usuario).toBeUndefined()
    cookie = c
    expect(await s.renovar()).toBe(false)
  })
})
