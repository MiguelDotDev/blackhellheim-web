export interface Entorno {
  urlApi: string
}

export function leerEntorno(variables: Record<string, unknown> = import.meta.env): Entorno {
  const bruto = variables.VITE_API_URL
  const valor = typeof bruto === 'string' ? bruto.trim() : ''
  if (!valor || !/^(https?:\/\/|\/)/.test(valor)) {
    throw new Error(
      `VITE_API_URL falta o no es válida (${JSON.stringify(bruto)}). ` +
        'Usa http://…, https://… o una ruta que empiece por /; revisa el archivo .env.<ambiente>.',
    )
  }
  return { urlApi: valor.replace(/\/+$/, '') || '/' }
}
