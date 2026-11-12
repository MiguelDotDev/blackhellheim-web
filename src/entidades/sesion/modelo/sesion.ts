import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { crearClienteApi, type components } from '@/compartido/api'

export type Credenciales = components['schemas']['CredencialesSolicitud']
type Sesion = components['schemas']['SesionDto']
/** `estado` 0 = sin respuesta del servidor (red). */
export type ResultadoAcceso = { ok: true } | { ok: false; estado: number; errores?: Record<string, string[]> }

/** Sesión del cliente. El token de acceso vive solo en memoria (FR-001); el refresh es cookie HttpOnly. */
export const useSesion = defineStore('sesion', () => {
  const api = crearClienteApi() // sin middleware: estas llamadas no deben dispararse a sí mismas
  const token = ref<string>()
  const rol = ref<string>()
  const usuario = ref<components['schemas']['PerfilDto']>()
  const renovando = ref(false)
  const activa = computed(() => !!token.value)
  const estado = computed(() => (renovando.value ? 'renovando' : activa.value ? 'activa' : 'anonima'))
  const oyentes = new Set<() => void>()
  let enVuelo: Promise<boolean> | undefined

  const cabecera = () => ({ Authorization: `Bearer ${token.value}` })

  function limpiar() {
    token.value = rol.value = usuario.value = undefined
  }

  async function establecer(sesion: Sesion) {
    token.value = sesion.tokenAcceso
    rol.value = sesion.rol
    // El perfil es complementario: si falla, la sesión sigue válida solo con el rol.
    const { data } = await api.GET('/auth/yo', { headers: cabecera() }).catch(() => ({ data: undefined }))
    usuario.value = data
  }

  async function acceder(operacion: '/auth/registro' | '/auth/inicio-sesion', cuerpo: Credenciales): Promise<ResultadoAcceso> {
    try {
      const { data, error, response } = await api.POST(operacion, { body: cuerpo })
      if (!data) return { ok: false, estado: response.status, errores: error?.errores }
      await establecer(data)
      oyentes.forEach((f) => f())
      return { ok: true }
    } catch {
      return { ok: false, estado: 0 }
    }
  }

  async function hacerRenovacion() {
    renovando.value = true
    try {
      const { data, response } = await api.POST('/auth/renovar')
      if (data) return await establecer(data), true
      if (response.status === 401) limpiar() // refresh caducado o revocado
      return false
    } catch {
      return false // fallo transitorio de red: se conserva la sesión local
    } finally {
      renovando.value = false
    }
  }

  return {
    token, rol, usuario, estado, activa,
    registrar: (c: Credenciales) => acceder('/auth/registro', c),
    iniciarSesion: (c: Credenciales) => acceder('/auth/inicio-sesion', c),
    /** Una sola renovación en vuelo: las llamadas simultáneas comparten la misma promesa. */
    renovar: () => (enVuelo ??= hacerRenovacion().finally(() => (enVuelo = undefined))),
    async cerrarSesion() {
      try {
        await api.POST('/auth/cerrar-sesion', { headers: token.value ? cabecera() : undefined })
      } catch {
        // sin red: igualmente se descarta la sesión local
      } finally {
        limpiar()
      }
    },
    /** Gancho de «sesión iniciada» (FR-009); devuelve la función para darse de baja. */
    alIniciarSesion(fn: () => void) {
      oyentes.add(fn)
      return () => oyentes.delete(fn)
    },
  }
})
