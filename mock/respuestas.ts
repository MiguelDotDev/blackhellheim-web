import type { components } from '../src/compartido/api/generado/esquema.d.ts'

type Esquemas = components['schemas']
type Problema = Esquemas['ProblemDetails']
export interface Respuesta {
  estado: number
  cuerpo?: Esquemas['EstadoSalud'] | Esquemas['EstadoBaseDatos'] | Esquemas['Tienda'] | Esquemas['SesionDto'] | Esquemas['PerfilDto'] | Problema
  cabeceras?: Record<string, string>
}
/** Entrada opcional de la petición: cuerpo JSON ya leído y cabeceras en minúsculas. */
export interface Peticion {
  cuerpo?: Esquemas['CredencialesSolicitud']
  cabeceras?: Record<string, string | undefined>
}

const titulos: Record<number, string> = {
  400: 'Solicitud inválida',
  401: 'No autorizado',
  404: 'No encontrado',
  409: 'Conflicto',
}

// Estado en memoria del mock de autenticación (HU-14); `reiniciarMock` lo limpia.
interface Usuario { id: string; correo: string; contrasena: string; rol: string }
const usuarios = new Map<string, Usuario>()
const accesos = new Map<string, Usuario>()
const refrescos = new Map<string, Usuario>()
export function reiniciarMock() {
  usuarios.clear()
  accesos.clear()
  refrescos.clear()
}

function problema(estado: 400 | 401 | 404 | 409, codigo: string, errores?: Record<string, string[]>): Respuesta {
  return {
    estado,
    cuerpo: {
      type: `https://blackhellheim.invalid/problemas/${codigo}`,
      title: titulos[estado],
      status: estado,
      codigo,
      idCorrelacion: crypto.randomUUID(),
      ...(errores && { errores }),
    } satisfies Problema,
  }
}

function sesionPara(usuario: Usuario, estado: 200 | 201): Respuesta {
  const token = `acceso-${crypto.randomUUID()}`
  const refresco = `refresco-${crypto.randomUUID()}`
  accesos.set(token, usuario)
  refrescos.set(refresco, usuario)
  return {
    estado,
    cuerpo: { tokenAcceso: token, expiraEnSegundos: 900, rol: usuario.rol } satisfies Esquemas['SesionDto'],
    cabeceras: { 'set-cookie': `refresco=${refresco}; HttpOnly; Path=/; SameSite=Lax` },
  }
}

function validar({ correo, contrasena }: Esquemas['CredencialesSolicitud'] = {}) {
  const errores: Record<string, string[]> = {}
  if (!correo || !/^\S+@\S+$/.test(correo)) errores.correo = ['Escribe un correo válido.']
  if (!contrasena || contrasena.length < 8) errores.contrasena = ['Usa al menos 8 caracteres.']
  return Object.keys(errores).length ? errores : undefined
}

function autenticar(cabeceras: Peticion['cabeceras'] = {}) {
  if (cabeceras['x-mock-token'] === 'caducado') return undefined
  return accesos.get(/^Bearer (.+)$/.exec(cabeceras.authorization ?? '')?.[1] ?? '')
}

function responderAuth(metodo: string, ruta: string, { cuerpo, cabeceras = {} }: Peticion): Respuesta | undefined {
  if (metodo === 'GET' && ruta === '/auth/yo') {
    const u = autenticar(cabeceras)
    if (!u) return problema(401, 'no_autenticado')
    return { estado: 200, cuerpo: { id: u.id, correo: u.correo, rol: u.rol } satisfies Esquemas['PerfilDto'] }
  }
  if (metodo !== 'POST') return undefined
  if (ruta === '/auth/registro') {
    const errores = validar(cuerpo)
    if (errores) return problema(400, 'validacion', errores)
    const correo = cuerpo!.correo!.toLowerCase()
    if (usuarios.has(correo)) return problema(409, 'correo_en_uso')
    const u = { id: crypto.randomUUID(), correo, contrasena: cuerpo!.contrasena!, rol: 'Cliente' }
    usuarios.set(correo, u)
    return sesionPara(u, 201)
  }
  if (ruta === '/auth/inicio-sesion') {
    const errores = validar(cuerpo)
    if (errores) return problema(400, 'validacion', errores)
    const u = usuarios.get(cuerpo!.correo!.toLowerCase())
    // Mismo error para correo inexistente y contraseña incorrecta (FR-007).
    return u && u.contrasena === cuerpo!.contrasena ? sesionPara(u, 200) : problema(401, 'credenciales_invalidas')
  }
  if (ruta === '/auth/renovar') {
    const refresco = /(?:^|; )refresco=([^;]+)/.exec(cabeceras.cookie ?? '')?.[1] ?? ''
    const u = refrescos.get(refresco)
    if (!u) return problema(401, 'refresco_invalido')
    refrescos.delete(refresco) // rotativo: cada refresh se usa una vez
    return sesionPara(u, 200)
  }
  if (ruta === '/auth/cerrar-sesion') {
    refrescos.delete(/(?:^|; )refresco=([^;]+)/.exec(cabeceras.cookie ?? '')?.[1] ?? '')
    return { estado: 204, cabeceras: { 'set-cookie': 'refresco=; HttpOnly; Path=/; Max-Age=0' } }
  }
}

/** Respuesta del mock para una petición; sin red (el estado de auth vive en memoria). */
export function responder(metodo: string, ruta: string, peticion: Peticion = {}): Respuesta {
  if (metodo === 'GET') {
    if (ruta === '/salud') return { estado: 200, cuerpo: { estado: 'ok' } satisfies components['schemas']['EstadoSalud'] }
    if (ruta === '/salud/base')
      return { estado: 200, cuerpo: { estado: 'ok' } satisfies components['schemas']['EstadoBaseDatos'] }
    const m = /^\/tiendas\/([^/]+)$/.exec(ruta)
    if (m) {
      const codigo = decodeURIComponent(m[1])
      if (!/^[A-Z]{3}$/.test(codigo)) return problema(400, 'validacion')
      if (codigo === 'MEX') return { estado: 200, cuerpo: { codigo: 'MEX', nombre: 'BlackHellHeim', moneda: 'MXN' } satisfies components['schemas']['Tienda'] }
      return problema(404, 'tienda_no_encontrada')
    }
  }
  return responderAuth(metodo, ruta, peticion) ?? problema(404, 'ruta_no_encontrada')
}
