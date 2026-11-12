import { expect, it } from 'vitest'
import { loadEnv } from 'vite'

it.each(['development', 'test', 'production'])('%s solo expone VITE_*', (modo) => {
  process.env.SECRETO_DE_PRUEBA = 'x'
  const claves = Object.keys(loadEnv(modo, process.cwd(), 'VITE_'))
  expect(claves.length).toBeGreaterThan(0)
  expect(claves.every((c) => c.startsWith('VITE_'))).toBe(true)
  expect(claves).not.toContain('SECRETO_DE_PRUEBA')
})
