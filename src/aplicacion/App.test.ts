import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { createMemoryHistory } from 'vue-router'
import { describe, expect, it } from 'vitest'
import App from './App.vue'
import { crearEnrutador } from './enrutador'

describe('App', () => {
  it('muestra la marca BlackHellHeim en la página de inicio', async () => {
    const enrutador = crearEnrutador(createMemoryHistory())
    await enrutador.push('/')
    await enrutador.isReady()
    const envoltorio = mount(App, { global: { plugins: [createPinia(), enrutador] } })
    expect(envoltorio.get('h1').text()).toBe('BlackHellHeim')
  })
})
