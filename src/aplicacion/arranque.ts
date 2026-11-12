import { watch } from 'vue'
import type { Router } from 'vue-router'
import { useSesion } from '@/entidades/sesion'

/**
 * Renovación silenciosa al cargar (D3): si hay refresh válido, sigue con sesión; si no, queda anónima sin error visible.
 * Si la sesión se pierde en una ruta privada, lleva a /acceso recordando el destino.
 */
export async function arrancar(enrutador: Router) {
  const sesion = useSesion()
  await sesion.renovar()
  watch(
    () => sesion.activa,
    (activa) => {
      const ruta = enrutador.currentRoute.value
      if (!activa && (ruta.meta.requiereSesion || ruta.meta.rol)) {
        void enrutador.push({ name: 'acceso', query: { destino: ruta.fullPath } })
      }
    },
  )
}
