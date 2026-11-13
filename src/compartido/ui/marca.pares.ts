/** Pares texto/fondo de uso real (nombres de token de marca.css) y el mínimo WCAG AA que deben cumplir. */
export const paresDeContraste: ReadonlyArray<readonly [texto: string, fondo: string, minimo: number]> = [
  ['texto', 'fondo', 4.5],
  ['texto', 'tarjeta', 4.5],
  ['texto-secundario', 'fondo', 4.5],
  ['texto-secundario', 'tarjeta', 4.5],
  ['acento', 'fondo', 4.5],
  ['acento', 'tarjeta', 4.5],
  ['sobre-primario', 'primario', 4.5],
  ['sobre-primario', 'primario-hover', 4.5],
  ['error', 'tarjeta', 4.5],
  ['exito', 'tarjeta', 4.5],
  ['aviso', 'tarjeta', 4.5],
  ['turquesa', 'fondo', 4.5],
]
