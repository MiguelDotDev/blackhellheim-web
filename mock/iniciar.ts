import type { AddressInfo } from 'node:net'
import { iniciarServidor } from './servidor.ts'

const puerto = Number(process.env.MOCK_PUERTO ?? 4010)
try {
  const servidor = await iniciarServidor(puerto)
  const { port } = servidor.address() as AddressInfo
  console.log(`Mock de la API en http://localhost:${port}\nRutas: /salud · /salud/base · /tiendas/{codigo} · /auth/{registro,inicio-sesion,renovar,cerrar-sesion,yo}`)
} catch (e) {
  console.error((e as Error).message)
  process.exit(1)
}
