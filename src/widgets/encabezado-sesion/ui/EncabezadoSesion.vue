<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { LogoMarca } from '@/compartido/ui'
import { BotonCerrarSesion } from '@/funcionalidades/acceso'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-borde bg-tarjeta px-4 py-3 sm:px-6">
    <RouterLink
      to="/"
      class="inline-flex min-h-11 items-center text-texto"
    >
      <LogoMarca class="h-6 w-auto" />
    </RouterLink>
    <p
      v-if="sesion.activa"
      class="flex flex-wrap items-center gap-3 text-sm"
    >
      <span class="text-texto-secundario">{{ sesion.usuario?.correo }} · {{ sesion.rol }}</span>
      <RouterLink
        to="/cuenta"
        class="inline-flex min-h-11 items-center"
      >
        Mi cuenta
      </RouterLink>
      <BotonCerrarSesion class="min-h-11 rounded border border-borde px-3 py-1 text-texto hover:border-texto-secundario" />
    </p>
    <RouterLink
      v-else
      to="/acceso"
      class="inline-flex min-h-11 items-center"
    >
      Iniciar sesión
    </RouterLink>
  </header>
</template>
