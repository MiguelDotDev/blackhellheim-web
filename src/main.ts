import { createApp } from 'vue'
import { App } from '@/aplicacion'
import { arrancar } from '@/aplicacion/arranque'
import { enrutador } from '@/aplicacion/enrutador'
import { pinia } from '@/aplicacion/proveedores/pinia'
import '@/aplicacion/estilos/principal.css'

const app = createApp(App).use(pinia)
await arrancar(enrutador) // primero la sesión, para que la guardia no rebote al recargar una ruta privada
app.use(enrutador).mount('#app')
