import { createServer, type IncomingMessage, type Server } from 'node:http'
import { responder } from './respuestas.ts'

// CORS solo para desarrollo local (el mock nunca se despliega). Con cookies el origen debe ser explícito, no «*».
const origenes = (process.env.MOCK_ORIGENES ?? 'http://localhost:5173,http://127.0.0.1:5173').split(',')

function cors(origen = ''): Record<string, string> {
  return {
    'access-control-allow-origin': origenes.includes(origen) ? origen : origenes[0],
    'access-control-allow-credentials': 'true',
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'authorization, content-type, x-mock-token, x-reintento',
    vary: 'Origin',
  }
}

async function leerJson(req: IncomingMessage) {
  let texto = ''
  for await (const trozo of req) texto += trozo
  try {
    return texto ? JSON.parse(texto) : undefined
  } catch {
    return undefined
  }
}

export function iniciarServidor(puerto: number): Promise<Server> {
  const servidor = createServer(async (req, res) => {
    const cabecerasCors = cors(req.headers.origin)
    if (req.method === 'OPTIONS') return void res.writeHead(204, cabecerasCors).end()
    const cabeceras = Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k, [v].flat().join(', ')]))
    const { estado, cuerpo, cabeceras: extra } = responder(
      req.method ?? 'GET',
      new URL(req.url ?? '/', 'http://x').pathname,
      { cuerpo: await leerJson(req), cabeceras },
    )
    const tipo = estado >= 400 ? 'application/problem+json' : 'application/json'
    res.writeHead(estado, { ...cabecerasCors, ...extra, ...(cuerpo && { 'content-type': tipo }) }).end(cuerpo && JSON.stringify(cuerpo))
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
