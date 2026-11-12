import { expect, it } from 'vitest'
import { loadEnv } from 'vite'

// Vitest ya inyecta VITE_API_URL del modo test en process.env y tendría prioridad.
delete process.env.VITE_API_URL
const url = (modo: string) => loadEnv(modo, process.cwd(), 'VITE_').VITE_API_URL

it('cada ambiente tiene su URL del API', () => {
  expect(url('development')).toBe('http://localhost:4010')
  expect(url('test')).toBe('http://localhost:5068')
  expect(url('production')).toBe('/api')
  expect(new Set(['development', 'test', 'production'].map(url)).size).toBe(3)
})
