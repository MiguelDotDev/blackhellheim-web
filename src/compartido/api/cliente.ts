import createClient from 'openapi-fetch'
import { leerEntorno } from '../lib'
import type { paths } from './generado/esquema'
import { crearMiddlewareSesion, type OpcionesSesion } from './middleware-sesion'

/** El refresh viaja en cookie HttpOnly, por eso `credentials: 'include'`. Con `sesion` añade token y renueva en 401. */
export function crearClienteApi(urlBase: string = leerEntorno().urlApi, sesion?: OpcionesSesion) {
  const cliente = createClient<paths>({ baseUrl: urlBase, credentials: 'include' })
  if (sesion) cliente.use(crearMiddlewareSesion(sesion))
  return cliente
}
