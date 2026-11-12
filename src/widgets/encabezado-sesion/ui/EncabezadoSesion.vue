<script setup lang="ts">
// Encabezado mínimo y temporal: el diseño final llega con la HU-11.
import { RouterLink } from 'vue-router'
import { BotonCerrarSesion } from '@/funcionalidades/acceso'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <header class="flex items-center justify-between gap-4 border-b border-gray-300 bg-white px-6 py-3">
    <RouterLink to="/">
      BlackHellHeim
    </RouterLink>
    <p
      v-if="sesion.activa"
      class="flex items-center gap-3"
    >
      <span>{{ sesion.usuario?.correo }} · {{ sesion.rol }}</span>
      <RouterLink to="/cuenta">
        Mi cuenta
      </RouterLink>
      <BotonCerrarSesion class="rounded border border-gray-400 px-3 py-1" />
    </p>
    <RouterLink
      v-else
      to="/acceso"
    >
      Iniciar sesión
    </RouterLink>
  </header>
</template>
