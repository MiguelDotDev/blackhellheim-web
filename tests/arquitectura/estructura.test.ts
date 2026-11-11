import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = join(import.meta.dirname, '..', '..', 'src')
const carpetas = (ruta: string) =>
  readdirSync(ruta).filter((n) => statSync(join(ruta, n)).isDirectory()).sort()

describe('estructura de capas', () => {
  it('src contiene exactamente las seis capas', () => {
    expect(carpetas(src)).toEqual(
      ['aplicacion', 'compartido', 'entidades', 'funcionalidades', 'paginas', 'widgets'].sort(),
    )
  })
  it('compartido tiene ui, lib y api', () => {
    expect(carpetas(join(src, 'compartido'))).toEqual(['api', 'lib', 'ui'])
  })
})
