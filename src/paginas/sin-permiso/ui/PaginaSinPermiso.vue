<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="p-6 bg-(--color-fondo) text-(--color-texto)">
    <h1>Sin permiso</h1>
    <p>Tu cuenta no tiene permiso para ver esta página.</p>
    <RouterLink to="/">Volver al inicio</RouterLink>
  </main>
</template>
