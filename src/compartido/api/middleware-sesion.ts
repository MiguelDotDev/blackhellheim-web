import type { Middleware } from 'openapi-fetch'

export interface OpcionesSesion {
  obtenerToken: () => string | undefined
  /** Renueva la sesión; true si hay token nuevo. La implementación garantiza una sola renovación en vuelo. */
  renovar: () => Promise<boolean>
}

/** Añade el token y, ante 401, renueva y repite la petición una sola vez. */
export function crearMiddlewareSesion({ obtenerToken, renovar }: OpcionesSesion): Middleware {
  const copias = new Map<string, Request>() // copia sin consumir, para poder repetir
  const conToken = (r: Request) => {
    const token = obtenerToken()
    if (token) r.headers.set('Authorization', `Bearer ${token}`)
    return r
  }
  return {
    onRequest({ request, id }) {
      copias.set(id, request.clone())
      return conToken(request)
    },
    async onResponse({ response, id, options }) {
      const copia = copias.get(id)
      copias.delete(id)
      if (response.status !== 401 || !copia || copia.headers.has('x-reintento')) return response
      if (!(await renovar())) return response
      copia.headers.set('x-reintento', '1') // una sola repetición, nunca bucle
      return options.fetch(conToken(copia))
    },
    onError({ id }) {
      copias.delete(id)
    },
  }
}
