<script setup lang="ts">
import { useSesion } from '@/entidades/sesion'
import FormularioBase from './FormularioBase.vue'

const sesion = useSesion()
// Mismo mensaje para correo inexistente y contraseña incorrecta (FR-007).
const mensaje = (estado: number) =>
  estado === 0 ? 'No hay conexión con el servidor. Inténtalo de nuevo.' : 'No pudimos iniciar sesión. Revisa tus datos e inténtalo de nuevo.'
</script>

<template>
  <FormularioBase
    id-base="acceso"
    boton="Iniciar sesión"
    autocompletar-contrasena="current-password"
    :enviar="sesion.iniciarSesion"
    :mensaje-error="mensaje"
  >
    <template #titulo>
      <h2>Iniciar sesión</h2>
    </template>
  </FormularioBase>
</template>
