<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { FormularioDiseno } from '@/funcionalidades/editar-diseno'

const ruta = useRoute()
const enrutador = useRouter()
const id = typeof ruta.params.id === 'string' ? ruta.params.id : undefined
</script>

<template>
  <main class="mx-auto max-w-2xl px-4 py-8 text-texto sm:px-6">
    <h1 class="mb-6 text-3xl">
      {{ id ? 'Editar diseño' : 'Nuevo diseño' }}
    </h1>
    <FormularioDiseno
      :id="id"
      @guardado="enrutador.push('/admin/disenos')"
    />
  </main>
</template>
