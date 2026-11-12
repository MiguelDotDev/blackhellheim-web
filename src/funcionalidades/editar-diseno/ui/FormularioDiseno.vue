<script setup lang="ts">
import { nextTick, onMounted } from 'vue'
import { useBorradorDiseno } from '../modelo/borrador'
import AvisoArteOscuro from './AvisoArteOscuro.vue'

const props = defineProps<{ id?: string }>()
const emit = defineEmits<{ guardado: [] }>()
const b = useBorradorDiseno()

onMounted(async () => {
  b.reiniciar()
  await b.cargarCatalogo()
  if (props.id) await b.cargar(props.id)
})

async function alEnviar() {
  const ok = await b.guardar()
  if (ok) return emit('guardado')
  await nextTick()
  ;(document.querySelector('#form-diseno [aria-invalid="true"]') as HTMLElement | null)?.focus()
}
const alElegir = (e: Event) => {
  const entrada = e.target as HTMLInputElement
  void b.agregar(Array.from(entrada.files ?? []))
  entrada.value = ''
}
const campo = 'min-h-11 rounded border border-borde bg-fondo px-3 py-2 text-texto aria-invalid:border-error'
const boton = 'inline-flex min-h-11 items-center justify-center rounded border border-borde px-3 py-2 text-texto hover:border-texto-secundario disabled:opacity-60'
</script>

<template>
  <form
    id="form-diseno"
    class="flex flex-col gap-6 rounded-lg border border-borde bg-tarjeta p-6"
    novalidate
    @submit.prevent="alEnviar"
  >
    <p
      v-if="b.mensaje"
      role="alert"
      class="flex gap-2 rounded border border-error bg-fondo p-3 text-texto"
    >
      <span
        aria-hidden="true"
        class="text-error"
      >⚠</span>{{ b.mensaje }}
    </p>

    <div class="flex flex-col gap-1">
      <label
        for="d-nombre"
        class="text-sm font-medium text-texto-secundario"
      >Nombre</label>
      <input
        id="d-nombre"
        v-model="b.nombre"
        name="nombre"
        :class="campo"
        required
        :aria-invalid="!!b.errores.nombre"
        :aria-describedby="b.errores.nombre ? 'd-nombre-error' : undefined"
      >
      <p
        v-if="b.errores.nombre"
        id="d-nombre-error"
        class="text-sm text-error"
      >
        <span aria-hidden="true">⚠ </span>{{ b.errores.nombre[0] }}
      </p>
    </div>

    <div class="flex flex-col gap-1">
      <label
        for="d-descripcion"
        class="text-sm font-medium text-texto-secundario"
      >Descripción</label>
      <textarea
        id="d-descripcion"
        v-model="b.descripcion"
        name="descripcion"
        rows="3"
        :class="campo"
      />
    </div>

    <fieldset class="flex flex-col gap-2">
      <legend class="text-sm font-medium text-texto-secundario">
        Imágenes de arte (PNG)
      </legend>
      <input
        id="d-imagenes"
        type="file"
        name="imagenes"
        accept="image/png"
        multiple
        aria-label="Agregar imágenes de arte"
        :aria-invalid="!!b.errores.imagenes"
        :aria-describedby="b.errores.imagenes ? 'd-imagenes-error' : undefined"
        @change="alElegir"
      >
      <p
        v-if="b.errores.imagenes"
        id="d-imagenes-error"
        class="text-sm text-error"
      >
        <span aria-hidden="true">⚠ </span>{{ b.errores.imagenes[0] }}
      </p>
      <ul
        v-if="b.rechazos.length"
        role="alert"
        class="text-sm text-error"
      >
        <li
          v-for="r in b.rechazos"
          :key="r"
        >
          <span aria-hidden="true">⚠ </span>{{ r }}
        </li>
      </ul>
      <ul class="flex flex-col gap-2">
        <li
          v-for="(img, i) in b.imagenes"
          :key="img.clave"
          class="flex flex-wrap items-center gap-2 rounded border border-borde p-2"
        >
          <img
            v-if="img.vistaPrevia"
            :src="img.vistaPrevia"
            :alt="`Vista previa de ${img.archivo.name}`"
            class="size-12 bg-fondo object-contain"
          >
          <span class="flex-1 break-all">{{ img.archivo.name }}</span>
          <span :class="img.estado === 'error' ? 'text-error' : ''">
            {{ { pendiente: 'En espera', subiendo: 'Subiendo…', lista: 'Subida', error: img.error }[img.estado] }}
          </span>
          <button
            v-if="img.estado === 'error'"
            type="button"
            :class="boton"
            @click="b.reintentar(img.clave)"
          >
            Reintentar
          </button>
          <button
            type="button"
            :class="boton"
            :disabled="i === 0"
            :aria-label="`Subir ${img.archivo.name}`"
            @click="b.mover(img.clave, -1)"
          >
            ↑
          </button>
          <button
            type="button"
            :class="boton"
            :disabled="i === b.imagenes.length - 1"
            :aria-label="`Bajar ${img.archivo.name}`"
            @click="b.mover(img.clave, 1)"
          >
            ↓
          </button>
          <button
            type="button"
            :class="boton"
            @click="b.quitar(img.clave)"
          >
            Quitar<span class="sr-only"> {{ img.archivo.name }}</span>
          </button>
        </li>
      </ul>
    </fieldset>

    <fieldset class="flex flex-col gap-2">
      <legend class="text-sm font-medium text-texto-secundario">
        Colores de prenda
      </legend>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="(c, i) in b.coloresDisponibles"
          :key="c.color"
          class="flex min-h-11 items-center gap-2"
        >
          <input
            v-model="b.colores"
            type="checkbox"
            name="colores"
            :value="c.color"
            :aria-invalid="i === 0 && !!b.errores.variantes"
            :aria-describedby="i === 0 && b.errores.variantes ? 'd-variantes-error' : undefined"
          >{{ c.color }}
        </label>
      </div>
    </fieldset>

    <fieldset class="flex flex-col gap-2">
      <legend class="text-sm font-medium text-texto-secundario">
        Tallas
      </legend>
      <div class="flex flex-wrap gap-3">
        <label
          v-for="t in b.tallasDisponibles"
          :key="t"
          class="flex min-h-11 items-center gap-2"
        >
          <input
            v-model="b.tallas"
            type="checkbox"
            name="tallas"
            :value="t"
          >{{ t }}
        </label>
      </div>
      <p
        v-if="b.errores.variantes"
        id="d-variantes-error"
        class="text-sm text-error"
      >
        <span aria-hidden="true">⚠ </span>{{ b.errores.variantes[0] }}
      </p>
    </fieldset>

    <AvisoArteOscuro :avisos="b.avisosArteOscuro" />

    <button
      type="submit"
      :disabled="b.guardando"
      :aria-busy="b.guardando"
      class="inline-flex min-h-11 items-center justify-center rounded bg-primario px-4 py-2 font-semibold text-sobre-primario hover:bg-primario-hover disabled:cursor-not-allowed disabled:opacity-60"
    >
      {{ b.guardando ? 'Guardando…' : 'Guardar diseño' }}
    </button>
  </form>
</template>
