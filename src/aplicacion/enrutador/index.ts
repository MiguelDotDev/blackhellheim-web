import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { useSesion } from '@/entidades/sesion'
import { PaginaDisenos, PaginaEditarDiseno } from '@/paginas/admin-disenos'
import { PaginaAcceso } from '@/paginas/acceso'
import { PaginaCuenta } from '@/paginas/cuenta'
import { PaginaInicio } from '@/paginas/inicio'
import { PaginaNoEncontrada } from '@/paginas/no-encontrada'
import { PaginaSinPermiso } from '@/paginas/sin-permiso'

declare module 'vue-router' {
  interface RouteMeta {
    requiereSesion?: boolean
    /** Rol exigido (implica sesión). El servidor sigue siendo la autoridad. */
    rol?: string
  }
}

export function crearEnrutador(historial: RouterHistory = createWebHistory()) {
  const enrutador = createRouter({
    history: historial,
    routes: [
      { path: '/', name: 'inicio', component: PaginaInicio },
      { path: '/acceso', name: 'acceso', component: PaginaAcceso },
      { path: '/cuenta', name: 'cuenta', component: PaginaCuenta, meta: { requiereSesion: true } }, // TEMPORAL: se sustituye en la HU-11/HU-18
      { path: '/admin/disenos', name: 'admin-disenos', component: PaginaDisenos, meta: { rol: 'Administrador' } },
      { path: '/admin/disenos/nuevo', name: 'admin-diseno-nuevo', component: PaginaEditarDiseno, meta: { rol: 'Administrador' } },
      { path: '/admin/disenos/:id', name: 'admin-diseno', component: PaginaEditarDiseno, meta: { rol: 'Administrador' } },
      { path: '/sin-permiso', name: 'sin-permiso', component: PaginaSinPermiso },
      { path: '/:rutaNoEncontrada(.*)*', name: 'no-encontrada', component: PaginaNoEncontrada },
    ],
  })
  enrutador.beforeEach((a) => {
    if (!a.meta.requiereSesion && !a.meta.rol) return
    const sesion = useSesion()
    if (!sesion.activa) return { name: 'acceso', query: { destino: a.fullPath } }
    if (a.meta.rol && sesion.rol !== a.meta.rol) return { name: 'sin-permiso' }
  })
  return enrutador
}

export const enrutador = crearEnrutador()
