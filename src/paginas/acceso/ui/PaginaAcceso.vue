<script setup lang="ts">
import { FormularioAcceso, FormularioRegistro } from '@/funcionalidades/acceso'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-8 sm:px-6">
    <h1 class="mb-6 text-3xl text-texto">
      Acceso
    </h1>
    <p
      v-if="sesion.activa"
      role="status"
      class="mb-6 flex gap-2 rounded border border-exito bg-tarjeta p-3 text-texto"
    >
      <span
        aria-hidden="true"
        class="text-exito"
      >✓</span>Sesión iniciada como {{ sesion.usuario?.correo }}.
    </p>
    <div class="grid gap-6 md:grid-cols-2">
      <FormularioAcceso />
      <FormularioRegistro />
    </div>
  </main>
</template>
