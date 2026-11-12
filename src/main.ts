import { createApp } from 'vue'
import { App } from '@/aplicacion'
import { enrutador } from '@/aplicacion/enrutador'
import { pinia } from '@/aplicacion/proveedores/pinia'
import '@/aplicacion/estilos/principal.css'

createApp(App).use(pinia).use(enrutador).mount('#app')
