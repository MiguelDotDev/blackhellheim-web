import { describe, expect, it } from 'vitest'
import { leerEntorno } from './entorno'

describe('leerEntorno', () => {
  it('quita la barra final', () => {
    expect(leerEntorno({ VITE_API_URL: 'http://localhost:4010/' })).toEqual({ urlApi: 'http://localhost:4010' })
  })
  it('acepta https y rutas /api', () => {
    expect(leerEntorno({ VITE_API_URL: 'https://x.com' }).urlApi).toBe('https://x.com')
    expect(leerEntorno({ VITE_API_URL: '/api' }).urlApi).toBe('/api')
  })
  it('en el modo de pruebas lee .env.test', () => {
    expect(leerEntorno().urlApi).toBe('http://localhost:5068')
  })
  it.each([[undefined], [''], ['   '], ['ftp://x'], ['api']])('rechaza %j', (valor) => {
    expect(() => leerEntorno({ VITE_API_URL: valor })).toThrow(/VITE_API_URL.*http/s)
  })
})
