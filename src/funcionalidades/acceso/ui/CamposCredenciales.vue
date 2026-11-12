<script setup lang="ts">
defineProps<{ idBase: string; errores: Record<string, string[]>; autocompletarContrasena: 'current-password' | 'new-password' }>()
const correo = defineModel<string>('correo', { required: true })
const contrasena = defineModel<string>('contrasena', { required: true })
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      class="text-sm font-medium text-texto-secundario"
      :for="`${idBase}-correo`"
    >Correo electrónico</label>
    <input
      :id="`${idBase}-correo`"
      v-model="correo"
      class="min-h-11 rounded border border-borde bg-fondo px-3 py-2 text-texto placeholder:text-texto-secundario hover:border-texto-secundario aria-invalid:border-error"
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
      class="flex gap-2 text-sm text-error"
    >
      <span aria-hidden="true">⚠</span>{{ errores.correo[0] }}
    </p>
  </div>
  <div class="flex flex-col gap-1">
    <label
      class="text-sm font-medium text-texto-secundario"
      :for="`${idBase}-contrasena`"
    >Contraseña</label>
    <input
      :id="`${idBase}-contrasena`"
      v-model="contrasena"
      class="min-h-11 rounded border border-borde bg-fondo px-3 py-2 text-texto placeholder:text-texto-secundario hover:border-texto-secundario aria-invalid:border-error"
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
      class="flex gap-2 text-sm text-error"
    >
      <span aria-hidden="true">⚠</span>{{ errores.contrasena[0] }}
    </p>
  </div>
</template>
