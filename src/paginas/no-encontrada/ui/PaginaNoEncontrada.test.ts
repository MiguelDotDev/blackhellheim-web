import { mount } from '@vue/test-utils'
import { createMemoryHistory, createRouter } from 'vue-router'
import { describe, expect, it } from 'vitest'
import PaginaNoEncontrada from './PaginaNoEncontrada.vue'

describe('PaginaNoEncontrada', () => {
  it('muestra el mensaje y un enlace para volver al inicio', async () => {
    const enrutador = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div />' } }],
    })
    const envoltorio = mount(PaginaNoEncontrada, { global: { plugins: [enrutador] } })
    expect(envoltorio.text()).toContain('Página no encontrada')
    const enlace = envoltorio.get('a')
    expect(enlace.text()).toBe('Volver al inicio')
    expect(enlace.attributes('href')).toBe('/')
  })
})
