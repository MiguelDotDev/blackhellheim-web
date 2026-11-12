<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
const enrutador = useRouter()
async function cerrar() {
  await enrutador.push('/') // antes de limpiar, para que la guardia no te lleve a /acceso
  await sesion.cerrarSesion()
}
</script>

<template>
  <button
    v-if="sesion.activa"
    type="button"
    @click="cerrar"
  >
    Cerrar sesión
  </button>
</template>
