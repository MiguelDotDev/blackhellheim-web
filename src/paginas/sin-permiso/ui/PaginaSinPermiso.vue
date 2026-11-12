<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="mx-auto max-w-md p-6">
    <h1 class="mb-2 text-2xl font-semibold">
      Sin permiso
    </h1>
    <p
      class="mb-4 rounded border border-red-700 bg-red-50 p-3 text-red-800"
      role="alert"
    >
      Tu cuenta no tiene permiso para ver esta página.
    </p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
