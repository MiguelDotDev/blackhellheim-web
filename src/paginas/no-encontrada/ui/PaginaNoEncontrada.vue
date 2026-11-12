<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="p-6 bg-(--color-fondo) text-(--color-texto)">
    <h1>Página no encontrada</h1>
    <p>La dirección que buscas no existe.</p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
