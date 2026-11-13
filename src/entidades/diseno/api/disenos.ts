import type { crearClienteApi } from '@/compartido/api'
import type { ArteSubido, Diseno, ProductoPrintful, Resultado, SolicitudDiseno, VariantePrintful } from '../modelo/tipos'

type Api = ReturnType<typeof crearClienteApi>
type Crudo<T> = { data?: T; error?: { errores?: Record<string, string[]> }; response: Response }

/** Unifica éxito/error del cliente generado; un fallo de red es `estado: 0`. */
async function resolver<T>(llamada: () => Promise<Crudo<T>>): Promise<Resultado<T>> {
  try {
    const { data, error, response } = await llamada()
    return data !== undefined ? { ok: true, data } : { ok: false, estado: response.status, errores: error?.errores }
  } catch {
    return { ok: false, estado: 0 }
  }
}

export const listarDisenos = (api: Api) => resolver(() => api.GET('/admin/disenos'))
export const obtenerDiseno = (api: Api, id: string) => resolver(() => api.GET('/admin/disenos/{id}', { params: { path: { id } } }))
export const listarProductos = (api: Api): Promise<Resultado<ProductoPrintful[]>> => resolver(() => api.GET('/admin/printful/productos'))
export const listarVariantes = (api: Api, id: number): Promise<Resultado<VariantePrintful[]>> =>
  resolver(() => api.GET('/admin/printful/productos/{id}/variantes', { params: { path: { id } } }))

/** Crea (sin `id`) o edita con `If-Match` = versión cargada. Nunca lleva precios. */
export function guardarDiseno(api: Api, cuerpo: SolicitudDiseno, existente?: Pick<Diseno, 'id' | 'version'>): Promise<Resultado<Diseno>> {
  return existente
    ? resolver(() => api.PUT('/admin/disenos/{id}', { params: { path: { id: existente.id }, header: { 'If-Match': existente.version } }, body: cuerpo }))
    : resolver(() => api.POST('/admin/disenos', { body: cuerpo }))
}

export function subirArte(api: Api, archivo: File): Promise<Resultado<ArteSubido>> {
  const formulario = new FormData()
  formulario.append('archivo', archivo)
  return resolver(() =>
    api.POST('/admin/arte', {
      body: { archivo: archivo as unknown as string },
      bodySerializer: () => formulario,
    }),
  )
}
