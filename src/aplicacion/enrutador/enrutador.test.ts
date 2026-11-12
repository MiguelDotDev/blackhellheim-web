import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { crearEnrutador } from './index'

describe('enrutador', () => {
  it('"/" resuelve a la página de inicio', async () => {
    const enrutador = crearEnrutador(createMemoryHistory())
    await enrutador.push('/')
    expect(enrutador.currentRoute.value.name).toBe('inicio')
  })

  it('una ruta desconocida resuelve a "no encontrada"', async () => {
    const enrutador = crearEnrutador(createMemoryHistory())
    await enrutador.push('/no-existe')
    expect(enrutador.currentRoute.value.name).toBe('no-encontrada')
  })
})
