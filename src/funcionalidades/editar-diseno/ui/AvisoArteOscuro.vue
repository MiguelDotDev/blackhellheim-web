<script setup lang="ts">
defineProps<{ avisos: { imagen: string; prendas: string[] }[] }>()
</script>

<template>
  <div
    role="status"
    class="flex flex-col gap-1"
  >
    <p
      v-for="a in avisos"
      :key="a.imagen"
      class="flex gap-2 rounded border border-aviso bg-fondo p-3 text-texto"
    >
      <span aria-hidden="true">⚠</span>
      <span><strong>Aviso:</strong> «{{ a.imagen }}» es mayormente negra y elegiste prenda {{ a.prendas.join(', ') }}. Puede no verse; aun así puedes guardar.</span>
    </p>
  </div>
</template>
