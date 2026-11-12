<script setup lang="ts">
// Estilos de marca (HU-11); el contenido real llega en la HU-18.
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
</script>

<template>
  <main class="mx-auto max-w-md px-4 py-8 sm:px-6">
    <h1 class="mb-6 text-3xl text-texto">
      Mi cuenta
    </h1>
    <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border border-borde bg-tarjeta p-6">
      <dt class="text-texto-secundario">
        Correo
      </dt>
      <dd class="break-all">
        {{ sesion.usuario?.correo }}
      </dd>
      <dt class="text-texto-secundario">
        Rol
      </dt>
      <dd class="break-all">
        {{ sesion.rol }}
      </dd>
    </dl>
  </main>
</template>
