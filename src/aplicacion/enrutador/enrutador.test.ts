import { createPinia, setActivePinia } from 'pinia'
import { useSesion } from '@/entidades/sesion'
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

describe('guardia de rutas', () => {
  const privada = { path: '/privada', name: 'privada', component: { template: '<p />' }, meta: { requiereSesion: true } }
  const admin = { path: '/admin', name: 'admin', component: { template: '<p />' }, meta: { rol: 'Administrador' } }
  function montar(rol?: string) {
    setActivePinia(createPinia())
    const sesion = useSesion()
    if (rol) {
      sesion.token = 't'
      sesion.rol = rol
    }
    const e = crearEnrutador(createMemoryHistory())
    e.addRoute(privada)
    e.addRoute(admin)
    return e
  }

  it('visitante en ruta privada → /acceso?destino=', async () => {
    const e = montar()
    await e.push('/privada?x=1')
    expect(e.currentRoute.value.name).toBe('acceso')
    expect(e.currentRoute.value.query.destino).toBe('/privada?x=1')
  })
  it('con sesión entra a la ruta privada', async () => {
    const e = montar('Cliente')
    await e.push('/privada')
    expect(e.currentRoute.value.name).toBe('privada')
  })
  it('rol insuficiente → «sin permiso»; rol correcto entra', async () => {
    const e = montar('Cliente')
    await e.push('/admin')
    expect(e.currentRoute.value.name).toBe('sin-permiso')
    const a = montar('Administrador')
    await a.push('/admin')
    expect(a.currentRoute.value.name).toBe('admin')
  })
})

it('/cuenta es privada: un visitante va a /acceso?destino=/cuenta', async () => {
  setActivePinia(createPinia())
  const e = crearEnrutador(createMemoryHistory())
  await e.push('/cuenta')
  expect(e.currentRoute.value.query.destino).toBe('/cuenta')
})
