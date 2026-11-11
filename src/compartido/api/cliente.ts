import createClient from 'openapi-fetch'
import { leerEntorno } from '../lib'
import type { paths } from './generado/esquema'

export function crearClienteApi(urlBase: string = leerEntorno().urlApi) {
  return createClient<paths>({ baseUrl: urlBase })
}
