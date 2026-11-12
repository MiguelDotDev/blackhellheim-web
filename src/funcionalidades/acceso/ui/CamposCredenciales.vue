<script setup lang="ts">
defineProps<{ idBase: string; errores: Record<string, string[]>; autocompletarContrasena: 'current-password' | 'new-password' }>()
const correo = defineModel<string>('correo', { required: true })
const contrasena = defineModel<string>('contrasena', { required: true })
</script>

<template>
  <div>
    <label :for="`${idBase}-correo`">Correo electrónico</label>
    <input
      :id="`${idBase}-correo`"
      v-model="correo"
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
  <div>
    <label :for="`${idBase}-contrasena`">Contraseña</label>
    <input
      :id="`${idBase}-contrasena`"
      v-model="contrasena"
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
