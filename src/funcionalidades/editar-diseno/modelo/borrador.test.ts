import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { reiniciarMock, responder } from '../../../../mock/respuestas.ts'
import { useSesion } from '@/entidades/sesion'
import { useBorradorDiseno } from './borrador'

const lectura = vi.hoisted(() => ({ siguiente: [] as unknown[] }))
vi.mock('../lib/analizar-arte', async (original) => ({ ...(await original<object>()), leerArte: async () => lectura.siguiente.shift() }))

const imagen = (clara: boolean, ancho = 4000) => ({ datos: { data: new Uint8ClampedArray(clara ? [255, 255, 255, 255] : [0, 0, 0, 255]) }, ancho, alto: 4000 })
const png = (nombre: string) => new File(['x'], nombre, { type: 'image/png' })
let fallosArte = 0
let peticiones: { m: string; ruta: string; cuerpo?: unknown }[] = []

beforeEach(async () => {
  reiniciarMock()
  fallosArte = 0
  peticiones = []
  lectura.siguiente = []
  vi.stubGlobal('fetch', async (r: Request) => {
    const ruta = new URL(r.url).pathname
    const cuerpo = r.headers.get('content-type')?.includes('json') ? await r.json() : undefined
    peticiones.push({ m: r.method, ruta, cuerpo })
    const falla = ruta === '/admin/arte' && fallosArte-- > 0
    const res = responder(r.method, ruta, { cuerpo, cabeceras: { authorization: r.headers.get('authorization') ?? undefined, 'if-match': r.headers.get('if-match') ?? undefined, ...(falla && { 'x-mock-arte': '415' }) } })
    return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, { status: res.estado, headers: { 'content-type': 'application/json' } })
  })
  setActivePinia(createPinia())
  await useSesion().registrar({ correo: 'admin@ejemplo.com', contrasena: 'secreta123' })
})
afterEach(() => vi.unstubAllGlobals())

async function listo() {
  const b = useBorradorDiseno()
  await b.cargarCatalogo()
  b.nombre = 'Calavera'
  b.colores = ['Negro']
  b.tallas = ['M', 'L']
  return b
}

describe('borrador del diseño', () => {
  it('rechaza archivos inválidos con motivo y acepta PNG; sube y guarda un diseño completo', async () => {
    const b = await listo()
    lectura.siguiente.push(imagen(true), imagen(true, 500))
    await b.agregar([png('a.png'), new File(['x'], 'b.jpg', { type: 'image/jpeg' }), png('baja.png')])
    expect(b.rechazos).toHaveLength(2)
    expect(b.imagenes.map((i) => i.estado)).toEqual(['lista'])
    expect(await b.guardar()).toBe(true)
    expect(b.guardado?.nombre).toBe('Calavera')
    expect(b.variantes).toHaveLength(2)
  })
  it('imagen totalmente transparente → rechazada con motivo', async () => {
    const b = await listo()
    lectura.siguiente.push({ datos: { data: new Uint8ClampedArray([0, 0, 0, 0]) }, ancho: 4000, alto: 4000 })
    await b.agregar([png('t.png')])
    expect(b.rechazos[0]).toMatch(/transparente/)
    expect(b.imagenes).toHaveLength(0)
  })
  it('subida fallida → reintento solo de ese archivo; guardar espera a las subidas', async () => {
    const b = await listo()
    lectura.siguiente.push(imagen(true), imagen(true))
    fallosArte = 1
    await b.agregar([png('a.png'), png('b.png')])
    const fallida = b.imagenes.filter((i) => i.estado === 'error')
    expect(fallida).toHaveLength(1)
    expect(await b.guardar()).toBe(false)
    expect(b.errores.imagenes).toBeDefined()
    await b.reintentar(fallida[0].clave)
    expect(b.imagenes.every((i) => i.estado === 'lista')).toBe(true)
    expect(await b.guardar()).toBe(true)
  })
  it('reordenar y quitar', async () => {
    const b = await listo()
    lectura.siguiente.push(imagen(true), imagen(true))
    await b.agregar([png('a.png'), png('b.png')])
    b.mover(b.imagenes[0].clave, 1)
    expect(b.imagenes.map((i) => i.archivo.name)).toEqual(['b.png', 'a.png'])
    b.quitar(b.imagenes[0].clave)
    expect(b.imagenes.map((i) => i.archivo.name)).toEqual(['a.png'])
  })
  it('aviso: arte oscuro + prenda negra sí; arte claro o prenda no negra no', async () => {
    const b = await listo()
    lectura.siguiente.push(imagen(false))
    await b.agregar([png('oscura.png')])
    expect(b.avisosArteOscuro).toEqual([{ imagen: 'oscura.png', prendas: ['Negro'] }])
    b.colores = ['Blanco']
    expect(b.avisosArteOscuro).toEqual([])
    b.colores = ['Negro']
    b.imagenes[0].oscuro = false
    expect(b.avisosArteOscuro).toEqual([])
  })
  it('con aviso se puede guardar igual', async () => {
    const b = await listo()
    lectura.siguiente.push(imagen(false))
    await b.agregar([png('oscura.png')])
    expect(b.avisosArteOscuro).toHaveLength(1)
    expect(await b.guardar()).toBe(true)
  })
  it('validación en cliente: sin nombre ni variantes no se envía', async () => {
    const b = useBorradorDiseno()
    expect(await b.guardar()).toBe(false)
    expect(Object.keys(b.errores).sort()).toEqual(['nombre', 'variantes'])
    expect(peticiones.some((p) => p.ruta === '/admin/disenos')).toBe(false)
  })
  it('errores del servidor por campo (capitalización libre)', async () => {
    const b = await listo()
    vi.stubGlobal('fetch', async () => new Response(JSON.stringify({ type: 'x', title: 't', status: 400, codigo: 'validacion', idCorrelacion: 'i', errores: { Nombre: ['Ya existe.'] } }), { status: 400, headers: { 'content-type': 'application/problem+json' } }))
    setActivePinia(createPinia())
    const b2 = useBorradorDiseno()
    b2.nombre = 'x'
    b2.catalogo = b.catalogo
    b2.colores = ['Negro']
    b2.tallas = ['M']
    expect(await b2.guardar()).toBe(false)
    expect(b2.errores.nombre).toEqual(['Ya existe.'])
  })
  it('sin doble envío mientras guarda', async () => {
    const b = await listo()
    const [a, c] = await Promise.all([b.guardar(), b.guardar()])
    expect([a, c]).toEqual([true, false])
    expect(peticiones.filter((p) => p.m === 'POST' && p.ruta === '/admin/disenos')).toHaveLength(1)
  })
  it('FR-007: el cuerpo enviado no lleva campos de precio', async () => {
    const b = await listo()
    await b.guardar()
    const cuerpo = peticiones.find((p) => p.ruta === '/admin/disenos' && p.m === 'POST')!.cuerpo
    expect(JSON.stringify(Object.keys(cuerpo as object))).not.toMatch(/precio/i)
  })
  it('editar: carga, guarda con If-Match; cambio concurrente → aviso de conflicto sin pisar', async () => {
    const a = await listo()
    await a.guardar()
    const id = a.guardado!.id
    const e = useBorradorDiseno()
    e.reiniciar()
    expect(await e.cargar(id)).toBe(true)
    expect(e.nombre).toBe('Calavera')
    await e.cargarCatalogo()
    // otra persona edita primero
    responder('PUT', `/admin/disenos/${id}`, { cuerpo: { nombre: 'Cambio ajeno', variantes: a.variantes }, cabeceras: { authorization: `Bearer ${useSesion().token}`, 'if-match': '1' } })
    e.nombre = 'Mi cambio'
    expect(await e.guardar()).toBe(false)
    expect(e.mensaje).toMatch(/cambió en el servidor/)
  })
  it('una renovación de sesión a mitad del formulario conserva lo escrito', async () => {
    const b = await listo()
    useSesion().token = 'caducado-en-el-servidor'
    // el mock rechaza el token (401) → el cliente renueva con la cookie y reintenta; sin cookie en este stub se verifica que el borrador sigue intacto
    await b.guardar()
    expect(b.nombre).toBe('Calavera')
    expect(b.colores).toEqual(['Negro'])
  })
})
