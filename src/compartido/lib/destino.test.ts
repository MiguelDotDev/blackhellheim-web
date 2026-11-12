import { expect, it } from 'vitest'
import { destinoSeguro } from './destino'

it('acepta rutas internas', () => expect(destinoSeguro('/pedidos?x=1')).toBe('/pedidos?x=1'))
it.each(['https://otro.sitio', '//otro.sitio', '/\\otro.sitio', 'pedidos', '', undefined, ['/a']])(
  'ignora %j',
  (v) => expect(destinoSeguro(v)).toBe('/'),
)
