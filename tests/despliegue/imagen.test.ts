import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

const dockerfile = readFileSync('Dockerfile', 'utf8')

it('compila con la versión mayor de Node de .nvmrc', () => {
  const mayor = readFileSync('.nvmrc', 'utf8').trim().split('.')[0]
  expect(dockerfile).toMatch(new RegExp(`^FROM node:${mayor}[-\\w.]* AS compilar`, 'm'))
})
it('sirve con nginx sin privilegios y sin etiqueta latest', () => {
  expect(dockerfile).toMatch(/^FROM nginxinc\/nginx-unprivileged:\d/m)
  expect(dockerfile).not.toMatch(/:latest/)
})
it('no incrusta API_URL ni valores de Azure', () => {
  expect(dockerfile).not.toMatch(/ENV API_URL|azurecontainerapps|azure\.com/i)
})
it('el contexto de build conserva .env.production y excluye secretos locales', () => {
  const ignorados = readFileSync('.dockerignore', 'utf8').split('\n')
  expect(ignorados).not.toContain('.env.production')
  expect(ignorados).toContain('.env*.local')
  expect(readFileSync('.env.production', 'utf8')).toMatch(/^VITE_API_URL=\/api$/m)
})
