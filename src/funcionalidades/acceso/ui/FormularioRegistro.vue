<script setup lang="ts">
import { useSesion } from '@/entidades/sesion'
import FormularioBase from './FormularioBase.vue'

const sesion = useSesion()
const mensaje = (estado: number) =>
  estado === 0
    ? 'No hay conexión con el servidor. Inténtalo de nuevo.'
    : estado === 409
      ? 'No pudimos crear la cuenta con esos datos. Prueba iniciar sesión.'
      : 'No pudimos crear la cuenta. Inténtalo de nuevo.'
</script>

<template>
  <FormularioBase
    id-base="registro"
    boton="Crear cuenta"
    autocompletar-contrasena="new-password"
    :enviar="sesion.registrar"
    :mensaje-error="mensaje"
  >
    <template #titulo>
      <h2>Crear cuenta</h2>
    </template>
  </FormularioBase>
</template>
