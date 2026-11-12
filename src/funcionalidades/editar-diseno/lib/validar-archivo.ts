export const MAX_BYTES = 200 * 1024 * 1024
// shortcut: el contrato no publica resolución mínima ni límite de imágenes; valores provisionales, ajustar cuando HU-17 los defina.
export const RESOLUCION_MINIMA = 1000
export const MAX_IMAGENES = 10

/** Ayuda previa a la subida; el servidor valida igual (HU-17). Devuelve el motivo del rechazo. */
export function validarArchivo(archivo: File, yaAgregadas: number): string | undefined {
  if (yaAgregadas >= MAX_IMAGENES) return `Se admite un máximo de ${MAX_IMAGENES} imágenes.`
  if (archivo.type !== 'image/png') return 'Solo se admiten imágenes PNG.'
  if (archivo.size > MAX_BYTES) return 'La imagen supera los 200 MB.'
}

export function validarResolucion(ancho: number, alto: number): string | undefined {
  if (Math.min(ancho, alto) < RESOLUCION_MINIMA) return `La resolución es muy baja (mínimo ${RESOLUCION_MINIMA} px por lado).`
}
