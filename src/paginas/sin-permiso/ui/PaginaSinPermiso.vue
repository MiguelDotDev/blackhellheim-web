<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="mx-auto max-w-md px-4 py-8 sm:px-6">
    <h1 class="mb-4 text-3xl text-texto">
      Sin permiso
    </h1>
    <p
      class="mb-4 flex gap-2 rounded border border-error bg-tarjeta p-3 text-texto"
      role="alert"
    >
      <span
        aria-hidden="true"
        class="text-error"
      >⚠</span>Tu cuenta no tiene permiso para ver esta página.
    </p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
