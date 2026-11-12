import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import { reiniciarMock, responder } from '../../../../mock/respuestas.ts'
import { useSesion } from '@/entidades/sesion'
import { useBorradorDiseno } from '../modelo/borrador'
import FormularioDiseno from './FormularioDiseno.vue'

const lectura = vi.hoisted(() => ({ oscura: true }))
vi.mock('../lib/analizar-arte', async (original) => ({
  ...(await original<object>()),
  leerArte: async () => ({ datos: { data: new Uint8ClampedArray(lectura.oscura ? [0, 0, 0, 255] : [255, 255, 255, 255]) }, ancho: 4000, alto: 4000 }),
}))

let pinia: ReturnType<typeof createPinia>
beforeEach(async () => {
  reiniciarMock()
  lectura.oscura = true
  vi.stubGlobal('fetch', async (r: Request) => {
    const cuerpo = r.headers.get('content-type')?.includes('json') ? await r.json() : undefined
    const res = responder(r.method, new URL(r.url).pathname, { cuerpo, cabeceras: { authorization: r.headers.get('authorization') ?? undefined, 'if-match': r.headers.get('if-match') ?? undefined } })
    return new Response(res.cuerpo ? JSON.stringify(res.cuerpo) : null, { status: res.estado, headers: { 'content-type': 'application/json' } })
  })
  pinia = createPinia()
  setActivePinia(pinia)
  await useSesion().registrar({ correo: 'admin@ejemplo.com', contrasena: 'secreta123' })
})
afterEach(() => vi.unstubAllGlobals())

async function montar() {
  const w = mount(FormularioDiseno, { global: { plugins: [pinia] }, attachTo: document.body })
  await flushPromises()
  return w
}

it('FR-007: no hay campos de precio y cada control tiene etiqueta', async () => {
  const w = await montar()
  expect(w.text().toLowerCase()).not.toMatch(/precio|costo/)
  expect(w.find('[name*=precio i]').exists()).toBe(false)
  for (const el of w.findAll('input:not([type=file]), textarea')) {
    const id = el.attributes('id')
    const envuelto = el.element.closest('label')
    expect(id ? w.find(`label[for=${id}]`).exists() : !!envuelto).toBe(true)
  }
})

it('guardar vacío muestra errores por campo, vincula aria-describedby y enfoca el primero', async () => {
  const w = await montar()
  await w.get('form').trigger('submit')
  await flushPromises()
  const nombre = w.get('#d-nombre')
  expect(nombre.attributes('aria-invalid')).toBe('true')
  expect(nombre.attributes('aria-describedby')).toBe('d-nombre-error')
  expect(document.activeElement).toBe(nombre.element)
})

it('US3: aviso con role=status y texto cuando arte oscuro + prenda negra; sin aviso si no', async () => {
  const w = await montar()
  const b = useBorradorDiseno()
  await b.agregar([new File(['x'], 'calavera.png', { type: 'image/png' })])
  await flushPromises()
  expect(w.get('[role=status]').text()).toBe('')
  await w.get('input[name=colores][value=Negro]').setValue(true)
  expect(w.get('[role=status]').text()).toMatch(/Aviso.*calavera\.png.*Negro/)
  await w.get('input[name=colores][value=Negro]').setValue(false)
  expect(w.get('[role=status]').text()).toBe('')
})

it('SC-003: el formulario se completa solo con controles nativos de teclado y se envía', async () => {
  const w = await montar()
  await w.get('#d-nombre').setValue('Calavera')
  await w.get('input[name=colores][value=Blanco]').setValue(true)
  await w.get('input[name=tallas][value=M]').setValue(true)
  await w.get('form').trigger('submit')
  await flushPromises()
  expect(w.emitted('guardado')).toHaveLength(1)
  expect(w.findAll('button').every((x) => x.attributes('type'))).toBe(true)
})
