/** Solo rutas internas: evita redirecciones abiertas (`https://…`, `//host`, `/\host`). */
export function destinoSeguro(valor: unknown): string {
  return typeof valor === 'string' && /^\/(?![/\\])/.test(valor) ? valor : '/'
}
