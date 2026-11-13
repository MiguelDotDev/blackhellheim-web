import type { components } from '../src/compartido/api/generado/esquema.d.ts'

type Esquemas = components['schemas']
type Problema = Esquemas['ProblemDetails']
export interface Respuesta {
  estado: number
  cuerpo?: Esquemas['EstadoSalud'] | Esquemas['EstadoBaseDatos'] | Esquemas['Tienda'] | Esquemas['SesionDto'] | Esquemas['PerfilDto'] | Esquemas['DisenoDto'] | Esquemas['PaginaDisenosDto'] | Esquemas['ArteDto'] | Esquemas['ProductoPrintfulDto'][] | Esquemas['VariantePrintfulDto'][] | Problema
  cabeceras?: Record<string, string>
}
/** Entrada opcional de la petición: cuerpo JSON ya leído y cabeceras en minúsculas. */
export interface Peticion {
  cuerpo?: Esquemas['CredencialesSolicitud'] & Esquemas['DisenoSolicitud']
  cabeceras?: Record<string, string | undefined>
}

const titulos: Record<number, string> = {
  400: 'Solicitud inválida',
  401: 'No autorizado',
  404: 'No encontrado',
  403: 'Prohibido',
  409: 'Conflicto',
  412: 'Precondición fallida',
  413: 'Archivo demasiado grande',
  415: 'Tipo de archivo no admitido',
}

// Estado en memoria del mock de autenticación (HU-14); `reiniciarMock` lo limpia.
interface Usuario { id: string; correo: string; contrasena: string; rol: string }
const usuarios = new Map<string, Usuario>()
const accesos = new Map<string, Usuario>()
const refrescos = new Map<string, Usuario>()
const disenos = new Map<string, Esquemas['DisenoDto']>()
export function reiniciarMock() {
  disenos.clear()
  usuarios.clear()
  accesos.clear()
  refrescos.clear()
}

function problema(estado: 400 | 401 | 403 | 404 | 409 | 412 | 413 | 415, codigo: string, errores?: Record<string, string[]>): Respuesta {
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
    const u = { id: crypto.randomUUID(), correo, contrasena: cuerpo!.contrasena!, rol: correo.startsWith('admin@') ? 'Administrador' : 'Cliente' } // mock: «admin@…» es administradora
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

function validarDiseno(c: Esquemas['DisenoSolicitud'] = {}) {
  const errores: Record<string, string[]> = {}
  if (!c.nombre?.trim()) errores.nombre = ['Escribe un nombre.']
  if (!c.variantes?.length) errores.variantes = ['Elige al menos un color y una talla.']
  return Object.keys(errores).length ? errores : undefined
}

const slug = (n: string) => n.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const colores = [['Negro', '#000000'], ['Blanco', '#ffffff'], ['Azul marino', '#1b2a49']]
const variantesPrintful: Esquemas['VariantePrintfulDto'][] = colores.flatMap(([color, codigoColor], c) =>
  ['S', 'M', 'L', 'XL'].map((talla, t) => ({ id: 1000 + c * 10 + t, productoId: 71, color, codigoColor, talla, costoBaseUsd: 9.5, tecnica: 'dtg', disponiblePais: true })))

function responderAdmin(metodo: string, ruta: string, { cuerpo, cabeceras = {} }: Peticion): Respuesta | undefined {
  if (!/^\/admin\/(disenos|arte|printful)/.test(ruta)) return undefined
  const u = autenticar(cabeceras)
  if (!u) return problema(401, 'no_autenticado')
  if (u.rol !== 'Administrador') return problema(403, 'sin_permiso')
  if (ruta.startsWith('/admin/printful') && metodo === 'GET') {
    if (ruta === '/admin/printful/productos') return { estado: 200, cuerpo: [{ id: 71, nombre: 'Playera unisex', tipo: 'T-SHIRT', tecnicas: ['dtg'] }] }
    const m = /^\/admin\/printful\/productos\/(\d+)\/variantes$/.exec(ruta)
    if (m) return { estado: 200, cuerpo: variantesPrintful.filter((v) => v.productoId === Number(m[1])) }
    return undefined
  }
  if (ruta === '/admin/arte') {
    if (metodo !== 'POST') return undefined
    const simulado = Number(cabeceras['x-mock-arte'])
    if (simulado === 413 || simulado === 415) return problema(simulado, simulado === 413 ? 'arte_demasiado_grande' : 'arte_tipo_invalido')
    const id = crypto.randomUUID()
    return { estado: 201, cuerpo: { id, url: `https://blackhellheim.invalid/arte/${id}.png`, ancho: 4500, alto: 5400, tamanoBytes: 1_000_000, reutilizado: false } satisfies Esquemas['ArteDto'] }
  }
  if (ruta === '/admin/disenos') {
    if (metodo === 'GET') {
      const elementos = [...disenos.values()]
      return { estado: 200, cuerpo: { elementos, pagina: 1, tamano: 20, total: elementos.length } satisfies Esquemas['PaginaDisenosDto'] }
    }
    if (metodo !== 'POST') return undefined
    const errores = validarDiseno(cuerpo)
    if (errores) return problema(400, 'validacion', errores)
    const s = slug(cuerpo!.nombre!)
    if ([...disenos.values()].some((d) => d.slug === s)) return problema(409, 'diseno_duplicado')
    const d: Esquemas['DisenoDto'] = { id: crypto.randomUUID(), nombre: cuerpo!.nombre!.trim(), slug: s, descripcion: cuerpo!.descripcion ?? null, estado: cuerpo!.estado ?? 'Borrador', archivoArteUrl: cuerpo!.archivoArteId ? `https://blackhellheim.invalid/arte/${cuerpo!.archivoArteId}.png` : null, variantes: cuerpo!.variantes!, version: '1', avisos: [] }
    disenos.set(d.id, d)
    return { estado: 201, cuerpo: d }
  }
  const id = ruta.slice('/admin/disenos/'.length)
  const actual = disenos.get(id)
  if (!actual) return problema(404, 'diseno_no_encontrado')
  if (metodo === 'GET') return { estado: 200, cuerpo: actual }
  if (metodo !== 'PUT') return undefined
  const errores = validarDiseno(cuerpo)
  if (errores) return problema(400, 'validacion', errores)
  if (cabeceras['if-match'] !== actual.version) return problema(412, 'version_obsoleta')
  const d = { ...actual, nombre: cuerpo!.nombre!.trim(), descripcion: cuerpo!.descripcion ?? null, variantes: cuerpo!.variantes!, estado: cuerpo!.estado ?? actual.estado, version: String(Number(actual.version) + 1) }
  disenos.set(id, d)
  return { estado: 200, cuerpo: d }
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
  return responderAuth(metodo, ruta, peticion) ?? responderAdmin(metodo, ruta, peticion) ?? problema(404, 'ruta_no_encontrada')
}
