/** Proporción mínima de píxeles opacos oscuros para avisar (confirmada: 85 %). */
export const UMBRAL_ARTE_OSCURO = 0.85
const ALFA_OPACO = 128
const LUMINANCIA_OSCURA = 0.1

const lineal = (c: number) => {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

/** Proporción (0–1) de píxeles opacos oscuros, o `null` si no hay píxeles opacos. */
export function proporcionOscura({ data }: { data: ArrayLike<number> }): number | null {
  let opacos = 0
  let oscuros = 0
  for (let i = 0; i + 3 < data.length; i += 4) {
    if (data[i + 3] <= ALFA_OPACO) continue
    opacos++
    if (0.2126 * lineal(data[i]) + 0.7152 * lineal(data[i + 1]) + 0.0722 * lineal(data[i + 2]) < LUMINANCIA_OSCURA) oscuros++
  }
  return opacos ? oscuros / opacos : null
}

export function esArteOscuro(datos: { data: ArrayLike<number> }): boolean {
  const p = proporcionOscura(datos)
  return p !== null && p >= UMBRAL_ARTE_OSCURO
}

const LADO_MAXIMO = 256 // reduce la imagen antes de analizar (plan R-2)

/** Lee un PNG en un canvas reducido. Devuelve también sus dimensiones originales. */
export async function leerArte(archivo: Blob): Promise<{ datos: ImageData; ancho: number; alto: number }> {
  const imagen = await createImageBitmap(archivo)
  const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height))
  const lienzo = document.createElement('canvas')
  lienzo.width = Math.max(1, Math.round(imagen.width * escala))
  lienzo.height = Math.max(1, Math.round(imagen.height * escala))
  const ctx = lienzo.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
  const resultado = { datos: ctx.getImageData(0, 0, lienzo.width, lienzo.height), ancho: imagen.width, alto: imagen.height }
  imagen.close()
  return resultado
}
