import { readFileSync } from 'node:fs'
import { parse } from 'yaml'

export function leerFlujo(ruta = '.github/workflows/ci.yml') {
  const texto = readFileSync(ruta, 'utf8')
  // El analizador YAML 1.2 deja `on` como clave de texto.
  return { texto, flujo: parse(texto) as Record<string, any> } // eslint-disable-line @typescript-eslint/no-explicit-any
}
