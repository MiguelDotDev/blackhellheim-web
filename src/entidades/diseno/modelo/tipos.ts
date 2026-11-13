import type { components } from '@/compartido/api'

type Esquemas = components['schemas']
export type Diseno = Esquemas['DisenoDto']
export type VarianteDiseno = Esquemas['VarianteDisenoDto']
export type SolicitudDiseno = Esquemas['DisenoSolicitud']
export type ArteSubido = Esquemas['ArteDto']
export type VariantePrintful = Esquemas['VariantePrintfulDto']
export type ProductoPrintful = Esquemas['ProductoPrintfulDto']

/** `estado` 0 = sin respuesta del servidor (red). */
export type Resultado<T> = { ok: true; data: T } | { ok: false; estado: number; errores?: Record<string, string[]> }
