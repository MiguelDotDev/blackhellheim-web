import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { crearClienteApi } from '@/compartido/api'
import { guardarDiseno, listarVariantes, obtenerDiseno, subirArte, type Diseno, type VarianteDiseno, type VariantePrintful } from '@/entidades/diseno'
import { useSesion } from '@/entidades/sesion'
import { esArteOscuro, leerArte, proporcionOscura } from '../lib/analizar-arte'
import { validarArchivo, validarResolucion } from '../lib/validar-archivo'

export interface ImagenArte {
  clave: string
  archivo: File
  vistaPrevia: string
  estado: 'pendiente' | 'subiendo' | 'lista' | 'error'
  error?: string
  arteId?: string
  oscuro: boolean
}

const PRODUCTO = 71 // shortcut: un solo producto (playera Printful); selector de producto cuando haya más
const PARALELO = 2 // plan D2
const esNegro = (hex: string) => {
  const c = [1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2] < 0.01
}

/** Borrador del formulario en memoria (plan D3): sobrevive a renovaciones de sesión y nunca se persiste. */
export const useBorradorDiseno = defineStore('borrador-diseno', () => {
  const sesion = useSesion()
  const api = crearClienteApi(undefined, { obtenerToken: () => sesion.token, renovar: sesion.renovar })
  const existente = ref<Pick<Diseno, 'id' | 'version'>>()
  const nombre = ref('')
  const descripcion = ref('')
  const estadoDiseno = ref('Borrador')
  const imagenes = ref<ImagenArte[]>([])
  const rechazos = ref<string[]>([])
  const catalogo = ref<VariantePrintful[]>([])
  const colores = ref<string[]>([])
  const tallas = ref<string[]>([])
  const errores = ref<Record<string, string[]>>({})
  const mensaje = ref('')
  const guardando = ref(false)
  const guardado = ref<Diseno>()

  const coloresDisponibles = computed(() => [...new Map(catalogo.value.map((v) => [v.color, v.codigoColor])).entries()].map(([color, codigo]) => ({ color, codigo })))
  const tallasDisponibles = computed(() => [...new Set(catalogo.value.map((v) => v.talla))])
  const variantes = computed<VarianteDiseno[]>(() =>
    catalogo.value
      .filter((v) => colores.value.includes(v.color) && tallas.value.includes(v.talla))
      .map((v) => ({ printfulVarianteId: v.id, printfulProductoId: v.productoId, nombreProducto: null, color: v.color, codigoColor: v.codigoColor, talla: v.talla, costoBaseUsd: v.costoBaseUsd })),
  )
  /** Una advertencia por imagen oscura mientras haya una prenda negra elegida (no bloquea el guardado). */
  const avisosArteOscuro = computed(() => {
    const negras = coloresDisponibles.value.filter((c) => colores.value.includes(c.color) && esNegro(c.codigo)).map((c) => c.color)
    return negras.length ? imagenes.value.filter((i) => i.oscuro).map((i) => ({ imagen: i.archivo.name, prendas: negras })) : []
  })
  const subiendo = computed(() => imagenes.value.some((i) => i.estado === 'subiendo' || i.estado === 'pendiente'))

  async function cargarCatalogo() {
    const r = await listarVariantes(api, PRODUCTO)
    catalogo.value = r.ok ? r.data : []
    if (!r.ok) mensaje.value = 'No pudimos cargar colores y tallas.'
  }

  async function cargar(id: string) {
    const r = await obtenerDiseno(api, id)
    if (!r.ok) return (mensaje.value = r.estado === 404 ? 'El diseño no existe.' : 'No pudimos cargar el diseño.'), false
    const d = r.data
    existente.value = { id: d.id, version: d.version }
    nombre.value = d.nombre
    descripcion.value = d.descripcion ?? ''
    estadoDiseno.value = d.estado
    colores.value = [...new Set(d.variantes.map((v) => v.color))]
    tallas.value = [...new Set(d.variantes.map((v) => v.talla))]
    return true
  }

  async function subir(imagen: ImagenArte) {
    imagen.estado = 'subiendo'
    imagen.error = undefined
    const r = await subirArte(api, imagen.archivo)
    if (r.ok) Object.assign(imagen, { estado: 'lista', arteId: r.data.id })
    else Object.assign(imagen, { estado: 'error', error: r.estado === 413 ? 'La imagen es demasiado grande.' : r.estado === 415 ? 'El servidor no admite ese tipo de imagen.' : 'No se pudo subir. Reintenta.' })
  }

  async function agregar(archivos: File[]) {
    rechazos.value = []
    const nuevas: ImagenArte[] = []
    for (const archivo of archivos) {
      let motivo = validarArchivo(archivo, imagenes.value.length + nuevas.length)
      let oscuro = false
      if (!motivo) {
        try {
          const { datos, ancho, alto } = await leerArte(archivo)
          motivo = validarResolucion(ancho, alto) ?? (proporcionOscura(datos) === null ? 'La imagen está totalmente transparente.' : undefined)
          oscuro = esArteOscuro(datos)
        } catch {
          motivo = 'No se pudo leer la imagen.'
        }
      }
      if (motivo) rechazos.value.push(`${archivo.name}: ${motivo}`)
      else nuevas.push({ clave: crypto.randomUUID(), archivo, vistaPrevia: URL.createObjectURL?.(archivo) ?? '', estado: 'pendiente', oscuro })
    }
    imagenes.value.push(...nuevas)
    const cola = [...nuevas]
    await Promise.all(Array.from({ length: PARALELO }, async () => { for (let i = cola.shift(); i; i = cola.shift()) await subir(imagenes.value.find((x) => x.clave === i.clave)!) }))
  }

  const reintentar = (clave: string) => subir(imagenes.value.find((i) => i.clave === clave)!)
  const quitar = (clave: string) => void (imagenes.value = imagenes.value.filter((i) => i.clave !== clave))
  function mover(clave: string, delta: -1 | 1) {
    const a = imagenes.value.findIndex((i) => i.clave === clave)
    const b = a + delta
    if (a < 0 || b < 0 || b >= imagenes.value.length) return
    ;[imagenes.value[a], imagenes.value[b]] = [imagenes.value[b], imagenes.value[a]]
  }

  /** Valida en cliente (ayuda) y guarda. Los errores del servidor quedan por campo en `errores`. */
  async function guardar() {
    if (guardando.value) return false
    errores.value = {}
    mensaje.value = ''
    if (!nombre.value.trim()) errores.value.nombre = ['Escribe un nombre.']
    if (!variantes.value.length) errores.value.variantes = ['Elige al menos un color y una talla.']
    if (imagenes.value.some((i) => i.estado !== 'lista')) errores.value.imagenes = ['Espera a que terminen las subidas o reintenta las fallidas.']
    if (Object.keys(errores.value).length) return false
    guardando.value = true
    // La primera imagen es el arte principal: el contrato admite un solo archivoArteId.
    const r = await guardarDiseno(api, { nombre: nombre.value.trim(), descripcion: descripcion.value || null, archivoArteId: imagenes.value[0]?.arteId, variantes: variantes.value, estado: estadoDiseno.value }, existente.value)
    guardando.value = false
    if (r.ok) return (guardado.value = r.data), (existente.value = { id: r.data.id, version: r.data.version }), true
    // El servidor puede nombrar los campos en cualquier capitalización.
    errores.value = Object.fromEntries(Object.entries(r.errores ?? {}).map(([k, v]) => [k.toLowerCase(), v]))
    if (!Object.keys(errores.value).length)
      mensaje.value = r.estado === 412 || r.estado === 409 ? 'El diseño cambió en el servidor. Recarga para ver la versión actual antes de guardar.' : r.estado === 0 ? 'No hay conexión con el servidor.' : 'No pudimos guardar el diseño. Inténtalo de nuevo.'
    return false
  }

  function reiniciar() {
    imagenes.value.forEach((i) => URL.revokeObjectURL?.(i.vistaPrevia))
    existente.value = guardado.value = undefined
    nombre.value = descripcion.value = mensaje.value = ''
    estadoDiseno.value = 'Borrador'
    imagenes.value = []
    rechazos.value = []
    colores.value = []
    tallas.value = []
    errores.value = {}
  }

  return { existente, nombre, descripcion, estadoDiseno, imagenes, rechazos, catalogo, colores, tallas, errores, mensaje, guardando, guardado, coloresDisponibles, tallasDisponibles, variantes, avisosArteOscuro, subiendo, cargarCatalogo, cargar, agregar, reintentar, quitar, mover, guardar, reiniciar }
})
