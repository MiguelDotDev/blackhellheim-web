<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { destinoSeguro } from '@/compartido/lib'
import { useSesion, type ResultadoAcceso, type Credenciales } from '@/entidades/sesion'
import CamposCredenciales from './CamposCredenciales.vue'

const props = defineProps<{
  idBase: string
  boton: string
  autocompletarContrasena: 'current-password' | 'new-password'
  enviar: (c: Credenciales) => Promise<ResultadoAcceso>
  mensajeError: (estado: number) => string
}>()
useSesion() // garantiza el almacén activo antes de enviar
const ruta = useRoute()
const enrutador = useRouter()
const correo = ref('')
const contrasena = ref('')
const errores = ref<Record<string, string[]>>({})
const mensaje = ref('')
const enviando = ref(false)

async function alEnviar() {
  if (enviando.value) return
  enviando.value = true
  errores.value = {}
  mensaje.value = ''
  const credenciales = { correo: correo.value, contrasena: contrasena.value }
  contrasena.value = '' // la contraseña no se conserva tras enviar (FR-007)
  const r = await props.enviar(credenciales)
  enviando.value = false
  if (r.ok) return void (await enrutador.push(destinoSeguro(ruta.query.destino)))
  // El servidor puede nombrar los campos en cualquier capitalización.
  errores.value = Object.fromEntries(Object.entries(r.errores ?? {}).map(([k, v]) => [k.toLowerCase(), v]))
  if (!Object.keys(errores.value).length) mensaje.value = props.mensajeError(r.estado)
  await nextTick()
  const primero = document.querySelector(`#${props.idBase} [aria-invalid="true"]`) as { focus(): void } | null
  primero?.focus()
}
</script>

<template>
  <form
    :id="idBase"
    class="flex flex-col gap-4 rounded-lg border border-gray-300 bg-white p-6"
    novalidate
    @submit.prevent="alEnviar"
  >
    <slot name="titulo" />
    <p
      v-if="mensaje"
      role="alert"
      class="rounded border border-red-700 bg-red-50 p-3 text-red-800"
    >
      {{ mensaje }}
    </p>
    <CamposCredenciales
      v-model:correo="correo"
      v-model:contrasena="contrasena"
      :id-base="idBase"
      :errores="errores"
      :autocompletar-contrasena="autocompletarContrasena"
    />
    <button
      type="submit"
      :disabled="enviando"
      class="rounded bg-gray-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {{ enviando ? 'Enviando…' : boton }}
    </button>
  </form>
</template>
