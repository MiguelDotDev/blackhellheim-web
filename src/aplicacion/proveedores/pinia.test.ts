import { createApp } from 'vue'
import { getActivePinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { pinia } from './pinia'

describe('proveedor de Pinia', () => {
  it('queda activo al instalarlo en una app', () => {
    createApp({ template: '<div />' }).use(pinia)
    expect(getActivePinia()).toBeDefined()
  })
})
