import { describe, expect, it } from 'vitest'
import { MAX_BYTES, MAX_IMAGENES, RESOLUCION_MINIMA, validarArchivo, validarResolucion } from './validar-archivo'

const archivo = (type: string, size = 10) => ({ type, size }) as File

describe('validar archivo', () => {
  it('acepta PNG pequeño', () => expect(validarArchivo(archivo('image/png'), 0)).toBeUndefined())
  it('rechaza lo que no es PNG', () => expect(validarArchivo(archivo('image/jpeg'), 0)).toMatch(/PNG/))
  it('rechaza más de 200 MB', () => expect(validarArchivo(archivo('image/png', MAX_BYTES + 1), 0)).toMatch(/200 MB/))
  it('rechaza al superar el límite de imágenes', () => expect(validarArchivo(archivo('image/png'), MAX_IMAGENES)).toMatch(/máximo/))
  it('resolución baja', () => {
    expect(validarResolucion(RESOLUCION_MINIMA - 1, 5000)).toMatch(/resolución/)
    expect(validarResolucion(RESOLUCION_MINIMA, RESOLUCION_MINIMA)).toBeUndefined()
  })
})
