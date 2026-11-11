import { describe, expect, it } from 'vitest'
import { responder } from '../../mock/respuestas.ts'

describe('responder', () => {
  it('salud', () => {
    expect(responder('GET', '/salud')).toEqual({ estado: 200, cuerpo: { estado: 'ok' } })
    expect(responder('GET', '/salud/base').estado).toBe(200)
  })
  it('tienda MEX', () => {
    const r = responder('GET', '/tiendas/MEX')
    expect(r.estado).toBe(200)
    expect(r.cuerpo).toMatchObject({ codigo: 'MEX', nombre: expect.any(String), moneda: expect.any(String) })
  })
  it.each([
    ['/tiendas/mex', 400],
    ['/tiendas/XYZ', 404],
    ['/otra', 404],
  ])('%s → problema %i', (ruta, estado) => {
    const r = responder('GET', ruta)
    expect(r.estado).toBe(estado)
    expect(r.cuerpo).toMatchObject({
      type: expect.any(String),
      title: expect.any(String),
      status: estado,
      codigo: expect.any(String),
      idCorrelacion: expect.any(String),
    })
  })
  it('método distinto de GET → 404', () => {
    expect(responder('POST', '/salud').estado).toBe(404)
  })
})
