import { describe, expect, it } from 'vitest'
import { razonDeContraste } from './contraste'

describe('razonDeContraste', () => {
  it('blanco sobre negro es 21:1', () => expect(razonDeContraste('#FFFFFF', '#000000')).toBeCloseTo(21, 1))
  it('es simétrica', () => expect(razonDeContraste('#E4007C', '#FFFFFF')).toBe(razonDeContraste('#FFFFFF', '#E4007C')))
  it('mismo color es 1:1', () => expect(razonDeContraste('#123456', '#123456')).toBe(1))
})
