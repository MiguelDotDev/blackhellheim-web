import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest'
import { crearClienteApi } from './cliente'

const ok = () => new Response(JSON.stringify({ estado: 'ok' }), { headers: { 'content-type': 'application/json' } })

function espiar() {
  const urls: string[] = []
  const fetch = async (r: Request) => {
    urls.push(r.url)
    return ok()
  }
  return { urls, fetch }
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('crearClienteApi', () => {
  it('usa la URL del entorno', async () => {
    vi.stubEnv('VITE_API_URL', 'http://entorno:9')
    const { urls, fetch } = espiar()
    await crearClienteApi().GET('/salud', { fetch })
    expect(urls).toEqual(['http://entorno:9/salud'])
  })
  it('usa la URL explícita', async () => {
    const { urls, fetch } = espiar()
    await crearClienteApi('http://x:1').GET('/salud', { fetch })
    expect(urls).toEqual(['http://x:1/salud'])
  })
  it('una ruta /api produce /api/salud', async () => {
    // Node exige URL absoluta en Request; el navegador la resuelve contra el origen.
    const Original = Request
    vi.stubGlobal('Request', class extends Original {
      constructor(u: string | Request, i?: RequestInit) {
        super(typeof u === 'string' ? new URL(u, 'http://origen') : u, i)
      }
    })
    const { urls, fetch } = espiar()
    await crearClienteApi('/api').GET('/salud', { fetch })
    expect(urls).toEqual(['http://origen/api/salud'])
  })
  it('tipos del contrato', async () => {
    const r = await crearClienteApi('http://x:1').GET('/salud', { fetch: async () => ok() })
    expectTypeOf(r.data!.estado).toBeString()
    const t = await crearClienteApi('http://x:1').GET('/tiendas/{codigo}', {
      params: { path: { codigo: 'MEX' } },
      fetch: async () => ok(),
    })
    expectTypeOf(t.error).toEqualTypeOf<typeof t.error>()
    expectTypeOf<NonNullable<typeof t.error>['codigo']>().toBeString()
    expectTypeOf<NonNullable<typeof t.error>['idCorrelacion']>().toBeString()
  })
  it('un fallo de red no se oculta', async () => {
    const fetch = async (): Promise<Response> => {
      throw new TypeError('red caída')
    }
    await expect(crearClienteApi('http://x:1').GET('/salud', { fetch })).rejects.toThrow('red caída')
  })
})
