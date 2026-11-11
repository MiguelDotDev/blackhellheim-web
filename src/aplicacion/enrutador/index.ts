import { createRouter, createWebHistory, type RouterHistory } from 'vue-router'
import { PaginaInicio } from '@/paginas/inicio'
import { PaginaNoEncontrada } from '@/paginas/no-encontrada'

export function crearEnrutador(historial: RouterHistory = createWebHistory()) {
  return createRouter({
    history: historial,
    routes: [
      { path: '/', name: 'inicio', component: PaginaInicio },
      { path: '/:rutaNoEncontrada(.*)*', name: 'no-encontrada', component: PaginaNoEncontrada },
    ],
  })
}

export const enrutador = crearEnrutador()
