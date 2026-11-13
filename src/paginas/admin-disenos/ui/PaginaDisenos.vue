<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { crearClienteApi } from '@/compartido/api'
import { listarDisenos, type Diseno } from '@/entidades/diseno'
import { useSesion } from '@/entidades/sesion'

const sesion = useSesion()
const disenos = ref<Diseno[]>([])
const fallo = ref(false)
const cargando = ref(true)
onMounted(async () => {
  const r = await listarDisenos(crearClienteApi(undefined, { obtenerToken: () => sesion.token, renovar: sesion.renovar }))
  if (r.ok) disenos.value = r.data.elementos
  else fallo.value = true
  cargando.value = false
})
</script>

<template>
  <main class="mx-auto max-w-3xl px-4 py-8 text-texto sm:px-6">
    <div class="mb-6 flex items-center justify-between gap-4">
      <h1 class="text-3xl">
        Diseños
      </h1>
      <RouterLink
        to="/admin/disenos/nuevo"
        class="inline-flex min-h-11 items-center rounded bg-primario px-4 py-2 font-semibold text-sobre-primario hover:bg-primario-hover"
      >
        Nuevo diseño
      </RouterLink>
    </div>
    <p v-if="cargando">
      Cargando…
    </p>
    <p
      v-else-if="fallo"
      role="alert"
    >
      <span aria-hidden="true">⚠ </span>No pudimos cargar los diseños.
    </p>
    <p v-else-if="!disenos.length">
      Aún no hay diseños.
    </p>
    <ul
      v-else
      class="flex flex-col gap-2"
    >
      <li
        v-for="d in disenos"
        :key="d.id"
        class="flex items-center justify-between rounded border border-borde bg-tarjeta p-3"
      >
        <RouterLink :to="`/admin/disenos/${d.id}`">
          {{ d.nombre }}
        </RouterLink>
        <span class="text-texto-secundario">{{ d.estado }}</span>
      </li>
    </ul>
  </main>
</template>
