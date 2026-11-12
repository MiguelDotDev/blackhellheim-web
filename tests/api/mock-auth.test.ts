import { beforeEach, describe, expect, it } from 'vitest'
import { reiniciarMock, responder } from '../../mock/respuestas.ts'

const cred = { correo: 'ana@ejemplo.com', contrasena: 'secreta123' }
const cookie = (r: ReturnType<typeof responder>) => /refresco=[^;]+/.exec(r.cabeceras?.['set-cookie'] ?? '')?.[0]
beforeEach(reiniciarMock)

describe('mock de autenticación', () => {
  it('registro: 201, sesión y cookie HttpOnly', () => {
    const r = responder('POST', '/auth/registro', { cuerpo: cred })
    expect(r.estado).toBe(201)
    expect(r.cuerpo).toMatchObject({ rol: 'Cliente', expiraEnSegundos: 900 })
    expect(r.cabeceras?.['set-cookie']).toContain('HttpOnly')
  })
  it('registro: 400 con errores por campo y 409 si el correo existe', () => {
    const mal = responder('POST', '/auth/registro', { cuerpo: { correo: 'x', contrasena: '1' } })
    expect(mal.estado).toBe(400)
    expect(Object.keys((mal.cuerpo as { errores: object }).errores)).toEqual(['correo', 'contrasena'])
    responder('POST', '/auth/registro', { cuerpo: cred })
    expect(responder('POST', '/auth/registro', { cuerpo: cred }).estado).toBe(409)
  })
  it('inicio de sesión: 200, y 401 idéntico para correo inexistente y contraseña incorrecta', () => {
    responder('POST', '/auth/registro', { cuerpo: cred })
    expect(responder('POST', '/auth/inicio-sesion', { cuerpo: cred }).estado).toBe(200)
    const a = responder('POST', '/auth/inicio-sesion', { cuerpo: { ...cred, contrasena: 'otra-clave1' } })
    const b = responder('POST', '/auth/inicio-sesion', { cuerpo: { ...cred, correo: 'no@ejemplo.com' } })
    expect([a.estado, b.estado]).toEqual([401, 401])
    expect((a.cuerpo as { codigo: string }).codigo).toBe((b.cuerpo as { codigo: string }).codigo)
  })
  it('renovación: rota el refresh; sin cookie o reutilizado da 401', () => {
    const c = cookie(responder('POST', '/auth/registro', { cuerpo: cred }))!
    const ok = responder('POST', '/auth/renovar', { cabeceras: { cookie: c } })
    expect(ok.estado).toBe(200)
    expect(responder('POST', '/auth/renovar', { cabeceras: { cookie: c } }).estado).toBe(401)
    expect(responder('POST', '/auth/renovar').estado).toBe(401)
  })
  it('cierre de sesión: 204 y revoca el refresh', () => {
    const c = cookie(responder('POST', '/auth/registro', { cuerpo: cred }))!
    expect(responder('POST', '/auth/cerrar-sesion', { cabeceras: { cookie: c } }).estado).toBe(204)
    expect(responder('POST', '/auth/renovar', { cabeceras: { cookie: c } }).estado).toBe(401)
  })
  it('perfil: con token 200; sin token o con x-mock-token: caducado 401', () => {
    const t = (responder('POST', '/auth/registro', { cuerpo: cred }).cuerpo as { tokenAcceso: string }).tokenAcceso
    const authorization = `Bearer ${t}`
    expect(responder('GET', '/auth/yo', { cabeceras: { authorization } }).cuerpo).toMatchObject({ correo: cred.correo })
    expect(responder('GET', '/auth/yo').estado).toBe(401)
    expect(responder('GET', '/auth/yo', { cabeceras: { authorization, 'x-mock-token': 'caducado' } }).estado).toBe(401)
  })
})
