# Plan de implementación: Acceso y sesión (HU-14)

**Rama**: `sprint/03` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-13 (contrato de autenticación)

## Resumen

Slice `entidades/sesion` (store Pinia con token en memoria y `renovar()` de una sola vuelo), `funcionalidades/acceso` (formularios de registro e inicio, cierre de sesión), `paginas/acceso`, guardia de rutas en `aplicacion/enrutador` y un middleware de `openapi-fetch` inyectado desde `compartido/api`.

## Contexto técnico

**Lenguaje**: TypeScript 5.9 / Vue 3 / Pinia · **Dependencias nuevas**: ninguna (openapi-fetch ya trae `Middleware`) · **Pruebas**: Vitest + `@vue/test-utils`, mock de la HU-9 ampliado.

## Decisiones

- **D1 Middleware inyectable**: `crearClienteApi(urlBase, { obtenerToken, renovar })`. `compartido` no importa de `entidades` (principio I); la capa `aplicacion` conecta ambos al arrancar.
- **D2 Una renovación en vuelo**: se guarda la promesa pendiente; las peticiones con 401 la esperan y se repiten una vez con una marca para no entrar en bucle. La petición de renovación nunca dispara renovación.
- **D3 Arranque**: `aplicacion` intenta `renovar()` silencioso antes de montar rutas privadas; si falla, queda anónima.
- **D4 Redirección**: `destino` se valida con `^/(?!/)`; se guarda en la query, no en almacenamiento.
- **D5 Mock**: se amplía `mock/respuestas.ts` con las operaciones del contrato de auth; `?`/cabecera `x-mock-token: caducado` fuerza 401. Los cuerpos usan `satisfies` sobre los tipos generados.
- **D6 Script de generación**: `api:generar` apunta al contrato vigente más reciente (el de esta HU); se actualiza al copiarlo.

## Verificación de la constitución

I cumple (slices e `index.ts`, inyección) · II cumple (cliente generado; bloqueo documentado) · III N/A · V cumple (memoria + HttpOnly) · VI pruebas primero · VII formularios accesibles · VIII sin dependencias nuevas · IX sin secretos · X español · XI `sprint/03`.

## Estructura

```text
specs/014-acceso-sesion/{spec.md, plan.md, tasks.md, contratos/openapi.json}   # contrato: copia manual del backend
src/entidades/sesion/{index.ts, modelo/sesion.ts}
src/funcionalidades/acceso/{index.ts, ui/FormularioAcceso.vue, ui/FormularioRegistro.vue, api/autenticacion.ts}
src/paginas/acceso/{index.ts, ui/PaginaAcceso.vue}
src/compartido/api/middleware-sesion.ts
mock/respuestas.ts, tests/api/mock-auth.test.ts, tests/sesion/*.test.ts
```

## Riesgos

- **R-1**: el contrato real de HU-13 puede diferir de lo supuesto (nombres de operaciones); se ajusta tras copiarlo, no antes.
- **R-2**: cookies `SameSite` en desarrollo (mock en otro puerto) ⇒ el mock es de origen cruzado y requiere `Access-Control-Allow-Credentials` con origen explícito, no `*`.
