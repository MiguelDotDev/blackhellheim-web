<script setup lang="ts">
// Maquetación mínima y temporal: el diseño final llega con la HU-11.
import { FormularioAcceso, FormularioRegistro } from '@/funcionalidades/acceso'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <main class="mx-auto max-w-3xl p-6">
    <h1 class="mb-4 text-2xl font-semibold">
      Acceso
    </h1>
    <p
      v-if="sesion.activa"
      role="status"
      class="mb-4 rounded border border-green-700 bg-green-50 p-3 text-green-800"
    >
      Sesión iniciada como {{ sesion.usuario?.correo }}.
    </p>
    <div class="grid gap-6 md:grid-cols-2">
      <FormularioAcceso />
      <FormularioRegistro />
    </div>
  </main>
</template>
