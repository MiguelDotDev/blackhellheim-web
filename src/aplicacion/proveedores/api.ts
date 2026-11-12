import { crearClienteApi } from '@/compartido/api'
import { useSesion } from '@/entidades/sesion'

/** Cliente de la API con sesión: añade el token y renueva en 401. Requiere Pinia activa (úsalo tras `app.use(pinia)`). */
export function crearApiConSesion() {
  const sesion = useSesion()
  return crearClienteApi(undefined, { obtenerToken: () => sesion.token, renovar: sesion.renovar })
}
