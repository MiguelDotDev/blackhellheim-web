import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { razonDeContraste } from '@/compartido/lib'
import { paresDeContraste } from '@/compartido/ui/marca.pares'

const css = readFileSync('src/aplicacion/estilos/marca.css', 'utf8')
const token = (n: string) => css.match(new RegExp(`--color-${n}:\\s*(#[0-9a-fA-F]{6})`))?.[1] as string

describe('contraste de la marca (AA)', () => {
  it.each(paresDeContraste)('%s sobre %s ≥ %d', (texto, fondo, minimo) => {
    expect(token(texto), `falta --color-${texto}`).toBeTruthy()
    expect(token(fondo), `falta --color-${fondo}`).toBeTruthy()
    expect(razonDeContraste(token(texto), token(fondo))).toBeGreaterThanOrEqual(minimo)
  })
})
