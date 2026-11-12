import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'
import { reiniciarMock, responder } from '../../../../mock/respuestas.ts'
import { useSesion } from '@/entidades/sesion'
import { FormularioAcceso, FormularioRegistro } from '..'

const cred = { correo: 'ana@ejemplo.com', contrasena: 'secreta123' }
let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  reiniciarMock()
  vi.stubGlobal('fetch', async (r: Request) => {
    const cuerpo = r.method === 'POST' ? await r.json().catch(() => undefined) : undefined
    const res = responder(r.method, new URL(r.url).pathname, { cuerpo, cabeceras: { authorization: r.headers.get('authorization') ?? undefined } })
    return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, { status: res.estado, headers: { 'content-type': 'application/json' } })
  })
  pinia = createPinia()
  setActivePinia(pinia)
})
afterEach(() => vi.unstubAllGlobals())

async function montar(componente: typeof FormularioAcceso, ruta = '/acceso') {
  const vacio = { template: '<p />' }
  const enrutador = createRouter({
    history: createMemoryHistory(),
    routes: ['/', '/acceso', '/pedidos'].map((path) => ({ path, component: vacio })),
  })
  await enrutador.push(ruta)
  const w = mount(componente, { global: { plugins: [pinia, enrutador] }, attachTo: document.body })
  return { w, enrutador }
}
const llenar = async (w: Awaited<ReturnType<typeof montar>>['w'], c = cred) => {
  await w.get('input[name=correo]').setValue(c.correo)
  await w.get('input[name=contrasena]').setValue(c.contrasena)
}

describe('formularios de acceso', () => {
  it('etiquetas asociadas y flujo completo solo con teclado (envío por formulario)', async () => {
    const { w, enrutador } = await montar(FormularioRegistro, '/acceso?destino=/pedidos')
    expect(w.get('label[for=registro-correo]').text()).toBe('Correo electrónico')
    expect(w.get('label[for=registro-contrasena]').text()).toBe('Contraseña')
    await llenar(w)
    await w.get('form').trigger('submit') // Enter en un campo envía el formulario nativo
    await flushPromises()
    expect(useSesion().estado).toBe('activa')
    expect(enrutador.currentRoute.value.path).toBe('/pedidos')
  })
  it('errores por campo con aria-describedby y foco al primer error', async () => {
    const { w } = await montar(FormularioRegistro)
    await llenar(w, { correo: 'mal', contrasena: '1' })
    await w.get('form').trigger('submit')
    await flushPromises()
    const correo = w.get('input[name=correo]')
    expect(correo.attributes('aria-invalid')).toBe('true')
    const id = correo.attributes('aria-describedby')!
    expect(w.get(`#${id}`).text()).toContain('correo válido')
    expect(document.activeElement).toBe(correo.element)
    w.unmount()
  })
  it('mensaje genérico idéntico para correo inexistente y contraseña incorrecta; conserva el correo', async () => {
    await useSesion().registrar(cred)
    await useSesion().cerrarSesion()
    const textos: string[] = []
    for (const c of [{ ...cred, contrasena: 'otra-clave1' }, { correo: 'no@ejemplo.com', contrasena: 'secreta123' }]) {
      const { w } = await montar(FormularioAcceso)
      await llenar(w, c)
      await w.get('form').trigger('submit')
      await flushPromises()
      textos.push(w.get('[role=alert]').text())
      expect(w.get<HTMLInputElement>('input[name=correo]').element.value).toBe(c.correo)
    }
    expect(textos[0]).toBe(textos[1])
    expect(textos[0]).not.toMatch(/existe|incorrecta/i)
  })
  it('deshabilita el botón durante el envío (sin doble envío)', async () => {
    const { w } = await montar(FormularioAcceso)
    await llenar(w)
    const envio = w.get('form').trigger('submit')
    await w.vm.$nextTick()
    expect(w.get('button').attributes('disabled')).toBeDefined()
    await envio
    await flushPromises()
    expect(w.get('button').attributes('disabled')).toBeUndefined()
  })
  it('la contraseña nunca aparece en console.* ni en el DOM tras enviar', async () => {
    const espias = (['log', 'info', 'warn', 'error', 'debug'] as const).map((m) => vi.spyOn(console, m))
    const { w } = await montar(FormularioAcceso)
    await llenar(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.html()).not.toContain(cred.contrasena)
    expect(w.get<HTMLInputElement>('input[name=contrasena]').element.value).toBe('')
    expect(JSON.stringify(espias.flatMap((e) => e.mock.calls))).not.toContain(cred.contrasena)
    espias.forEach((e) => e.mockRestore())
  })
  it('un destino externo se ignora y se va al inicio', async () => {
    const { w, enrutador } = await montar(FormularioRegistro, '/acceso?destino=https://otro.sitio')
    await llenar(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(enrutador.currentRoute.value.path).toBe('/')
  })
})
