<script setup lang="ts">
// TEMPORAL: se sustituye en la HU-11/HU-18
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <main class="mx-auto max-w-md p-6">
    <h1 class="mb-4 text-2xl font-semibold">
      Mi cuenta
    </h1>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
      <dt class="font-medium">
        Correo
      </dt>
      <dd>{{ sesion.usuario?.correo }}</dd>
      <dt class="font-medium">
        Rol
      </dt>
      <dd>{{ sesion.rol }}</dd>
    </dl>
  </main>
</template>
