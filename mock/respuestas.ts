import type { components } from '../src/compartido/api/generado/esquema.d.ts'

type Problema = components['schemas']['ProblemDetails']
export interface Respuesta {
  estado: number
  cuerpo: components['schemas']['EstadoSalud'] | components['schemas']['EstadoBaseDatos'] | components['schemas']['Tienda'] | Problema
}

const titulos: Record<number, string> = { 400: 'Solicitud inválida', 404: 'No encontrado' }

function problema(estado: 400 | 404, codigo: string): Respuesta {
  return {
    estado,
    cuerpo: {
      type: `https://blackhellheim.invalid/problemas/${codigo}`,
      title: titulos[estado],
      status: estado,
      codigo,
      idCorrelacion: crypto.randomUUID(),
    } satisfies Problema,
  }
}

/** Respuesta del mock para una petición; pura y sin red. */
export function responder(metodo: string, ruta: string): Respuesta {
  if (metodo === 'GET') {
    if (ruta === '/salud') return { estado: 200, cuerpo: { estado: 'ok' } satisfies components['schemas']['EstadoSalud'] }
    if (ruta === '/salud/base')
      return { estado: 200, cuerpo: { estado: 'ok' } satisfies components['schemas']['EstadoBaseDatos'] }
    const m = /^\/tiendas\/([^/]+)$/.exec(ruta)
    if (m) {
      const codigo = decodeURIComponent(m[1])
      if (!/^[A-Z]{3}$/.test(codigo)) return problema(400, 'validacion')
      if (codigo === 'MEX') return { estado: 200, cuerpo: { codigo: 'MEX', nombre: 'BlackHellHeim', moneda: 'MXN' } satisfies components['schemas']['Tienda'] }
      return problema(404, 'tienda_no_encontrada')
    }
  }
  return problema(404, 'ruta_no_encontrada')
}
