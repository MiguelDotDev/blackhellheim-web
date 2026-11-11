import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { responder } from '../../mock/respuestas.ts'

const contrato = JSON.parse(readFileSync('specs/009-cliente-api-mock/contratos/openapi.json', 'utf8'))

it('el mock cubre cada operación del contrato', () => {
  for (const [ruta, metodos] of Object.entries<Record<string, { operationId: string }>>(contrato.paths)) {
    for (const [metodo, op] of Object.entries(metodos)) {
      const r = responder(metodo.toUpperCase(), ruta.replace('{codigo}', 'MEX'))
      expect(r.estado, `operación sin cubrir: ${op.operationId}`).toBe(200)
    }
  }
})
