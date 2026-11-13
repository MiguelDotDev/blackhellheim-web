<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="mx-auto max-w-md px-4 py-8 text-texto sm:px-6">
    <h1 class="mb-4 text-3xl">
      Página no encontrada
    </h1>
    <p class="mb-4">
      La dirección que buscas no existe.
    </p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
