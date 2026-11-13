import { beforeEach, describe, expect, it } from 'vitest'
import { reiniciarMock, responder } from '../../mock/respuestas.ts'

const variante = { printfulVarianteId: 1, printfulProductoId: 71, nombreProducto: 'Playera', color: 'Negro', codigoColor: '#000000', talla: 'M', costoBaseUsd: 9.5 }
const valido = { nombre: 'Calavera', descripcion: 'Arte', archivoArteId: crypto.randomUUID(), variantes: [variante], estado: 'Borrador' }
let admin: Record<string, string>

function sesion(correo: string) {
  const r = responder('POST', '/auth/registro', { cuerpo: { correo, contrasena: 'secreta123' } })
  return { authorization: `Bearer ${(r.cuerpo as { tokenAcceso: string }).tokenAcceso}` }
}
beforeEach(() => {
  reiniciarMock()
  admin = sesion('admin@ejemplo.com')
})

describe('mock de diseños', () => {
  it('productos y variantes de Printful', () => {
    expect(responder('GET', '/admin/printful/productos', { cabeceras: admin }).cuerpo).toMatchObject([{ id: 71 }])
    const v = responder('GET', '/admin/printful/productos/71/variantes', { cabeceras: admin }).cuerpo as unknown[]
    expect(v).toHaveLength(12)
  })
  it('sin sesión → 401; con rol Cliente → 403', () => {
    expect(responder('GET', '/admin/disenos').estado).toBe(401)
    expect(responder('GET', '/admin/disenos', { cabeceras: sesion('ana@ejemplo.com') }).estado).toBe(403)
  })
  it('crear, listar y obtener', () => {
    const c = responder('POST', '/admin/disenos', { cuerpo: valido, cabeceras: admin })
    expect(c.estado).toBe(201)
    const d = c.cuerpo as { id: string; slug: string; version: string }
    expect(d.slug).toBe('calavera')
    const l = responder('GET', '/admin/disenos', { cabeceras: admin })
    expect(l.cuerpo).toMatchObject({ total: 1, elementos: [{ id: d.id }] })
    expect(responder('GET', `/admin/disenos/${d.id}`, { cabeceras: admin }).estado).toBe(200)
    expect(responder('GET', '/admin/disenos/no-existe', { cabeceras: admin }).estado).toBe(404)
  })
  it('crear inválido → 400 con errores por campo', () => {
    const r = responder('POST', '/admin/disenos', { cuerpo: { ...valido, nombre: '', variantes: [] }, cabeceras: admin })
    expect(r.estado).toBe(400)
    expect(r.cuerpo).toMatchObject({ errores: { nombre: expect.any(Array), variantes: expect.any(Array) } })
  })
  it('nombre repetido → 409', () => {
    responder('POST', '/admin/disenos', { cuerpo: valido, cabeceras: admin })
    expect(responder('POST', '/admin/disenos', { cuerpo: valido, cabeceras: admin }).estado).toBe(409)
  })
  it('editar con If-Match: actualiza y cambia la versión; versión vieja → 412', () => {
    const d = responder('POST', '/admin/disenos', { cuerpo: valido, cabeceras: admin }).cuerpo as { id: string; version: string }
    const ok = responder('PUT', `/admin/disenos/${d.id}`, { cuerpo: { ...valido, nombre: 'Otra' }, cabeceras: { ...admin, 'if-match': d.version } })
    expect(ok.estado).toBe(200)
    expect((ok.cuerpo as { version: string }).version).not.toBe(d.version)
    const viejo = responder('PUT', `/admin/disenos/${d.id}`, { cuerpo: valido, cabeceras: { ...admin, 'if-match': d.version } })
    expect(viejo.estado).toBe(412)
  })
  it('subir arte: 201 con ArteDto; 401/403 y errores simulados 413/415', () => {
    expect(responder('POST', '/admin/arte').estado).toBe(401)
    expect(responder('POST', '/admin/arte', { cabeceras: sesion('ana@ejemplo.com') }).estado).toBe(403)
    expect(responder('POST', '/admin/arte', { cabeceras: admin }).cuerpo).toMatchObject({ id: expect.any(String), url: expect.any(String), reutilizado: false })
    expect(responder('POST', '/admin/arte', { cabeceras: { ...admin, 'x-mock-arte': '413' } }).estado).toBe(413)
    expect(responder('POST', '/admin/arte', { cabeceras: { ...admin, 'x-mock-arte': '415' } }).estado).toBe(415)
  })
})
