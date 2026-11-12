import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'
import { responder } from '../../mock/respuestas.ts'

const contrato = JSON.parse(readFileSync('specs/018-editor-disenos/contratos/openapi.json', 'utf8'))

// Fuera del alcance de las HU hechas: el mock se amplía cuando llegue su HU (catálogo → HU-23).
const pendientes = /^\/(admin\/precios|catalogo)/

it('el mock cubre cada operación del contrato', () => {
  for (const [ruta, metodos] of Object.entries<Record<string, { operationId: string }>>(contrato.paths)) {
    if (pendientes.test(ruta)) continue
    for (const [metodo, op] of Object.entries(metodos)) {
      const r = responder(metodo.toUpperCase(), ruta.replace('{codigo}', 'MEX'))
      const noCubierta = (r.cuerpo as { codigo?: string } | undefined)?.codigo === 'ruta_no_encontrada'
      expect(noCubierta, `operación sin cubrir: ${op.operationId}`).toBe(false)
    }
  }
})
