import { describe, expect, it } from 'vitest'
import { UMBRAL_ARTE_OSCURO, esArteOscuro, proporcionOscura } from './analizar-arte'

const pixeles = (...p: [number, number, number, number][]) => ({ data: new Uint8ClampedArray(p.flat()) })
const negro: [number, number, number, number] = [0, 0, 0, 255]
const blanco: [number, number, number, number] = [255, 255, 255, 255]
const transp: [number, number, number, number] = [0, 0, 0, 0]

describe('analizar arte', () => {
  it('el umbral es 0.85', () => expect(UMBRAL_ARTE_OSCURO).toBe(0.85))
  it('negro opaco → aviso; claro → no', () => {
    expect(esArteOscuro(pixeles(negro, negro))).toBe(true)
    expect(esArteOscuro(pixeles(blanco, blanco))).toBe(false)
  })
  it('ignora los píxeles transparentes', () => {
    expect(proporcionOscura(pixeles(negro, transp, transp, transp))).toBe(1)
  })
  it('umbral exacto: 85 % cuenta, 84 % no', () => {
    const con = (n: number) => pixeles(...Array.from({ length: 100 }, (_, i) => (i < n ? negro : blanco)))
    expect(esArteOscuro(con(85))).toBe(true)
    expect(esArteOscuro(con(84))).toBe(false)
  })
  it('imagen vacía o totalmente transparente → sin proporción y sin aviso', () => {
    expect(proporcionOscura(pixeles())).toBeNull()
    expect(proporcionOscura(pixeles(transp, transp))).toBeNull()
    expect(esArteOscuro(pixeles(transp))).toBe(false)
  })
})
