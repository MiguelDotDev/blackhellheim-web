import { createServer, type Server } from 'node:http'
import { responder } from './respuestas.ts'

// CORS abierto: solo para desarrollo local, el mock nunca se despliega.
const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, OPTIONS',
  'access-control-allow-headers': '*',
}

export function iniciarServidor(puerto: number): Promise<Server> {
  const servidor = createServer((req, res) => {
    if (req.method === 'OPTIONS') return void res.writeHead(204, cors).end()
    const { estado, cuerpo } = responder(req.method ?? 'GET', new URL(req.url ?? '/', 'http://x').pathname)
    const tipo = estado >= 400 ? 'application/problem+json' : 'application/json'
    res.writeHead(estado, { ...cors, 'content-type': tipo }).end(JSON.stringify(cuerpo))
  })
  return new Promise((resolver, rechazar) => {
    servidor.once('error', (e: NodeJS.ErrnoException) =>
      rechazar(
        e.code === 'EADDRINUSE'
          ? new Error(`El puerto ${puerto} está ocupado. Libéralo o elige otro con MOCK_PUERTO.`)
          : e,
      ),
    )
    servidor.listen(puerto, () => resolver(servidor))
  })
}
