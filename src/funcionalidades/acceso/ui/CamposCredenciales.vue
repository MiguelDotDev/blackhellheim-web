<script setup lang="ts">
defineProps<{ idBase: string; errores: Record<string, string[]>; autocompletarContrasena: 'current-password' | 'new-password' }>()
const correo = defineModel<string>('correo', { required: true })
const contrasena = defineModel<string>('contrasena', { required: true })
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      class="font-medium"
      :for="`${idBase}-correo`"
    >Correo electrónico</label>
    <input
      :id="`${idBase}-correo`"
      v-model="correo"
      class="rounded border border-gray-400 px-3 py-2 aria-invalid:border-red-700"
      name="correo"
      type="email"
      autocomplete="email"
      required
      :aria-invalid="!!errores.correo"
      :aria-describedby="errores.correo ? `${idBase}-correo-error` : undefined"
    >
    <p
      v-if="errores.correo"
      :id="`${idBase}-correo-error`"
    >
      {{ errores.correo[0] }}
    </p>
  </div>
  <div class="flex flex-col gap-1">
    <label
      class="font-medium"
      :for="`${idBase}-contrasena`"
    >Contraseña</label>
    <input
      :id="`${idBase}-contrasena`"
      v-model="contrasena"
      class="rounded border border-gray-400 px-3 py-2 aria-invalid:border-red-700"
      name="contrasena"
      type="password"
      :autocomplete="autocompletarContrasena"
      required
      :aria-invalid="!!errores.contrasena"
      :aria-describedby="errores.contrasena ? `${idBase}-contrasena-error` : undefined"
    >
    <p
      v-if="errores.contrasena"
      :id="`${idBase}-contrasena-error`"
    >
      {{ errores.contrasena[0] }}
    </p>
  </div>
</template>
