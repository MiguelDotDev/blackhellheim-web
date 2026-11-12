# BlackHellHeim · web

PWA de la tienda BlackHellHeim (Vue 3, TypeScript, Vite, Pinia, Vue Router y Tailwind) con arquitectura Feature-Sliced Design en español.

## Requisitos

- Node 24 (`nvm use` lee `.nvmrc`) y npm.

## Comandos

```bash
npm ci               # instala las dependencias
npm run dev          # servidor de desarrollo
npm run lint         # ESLint, incluye las reglas de capas
npm run type-check   # vue-tsc
npm run test         # Vitest
npm run build        # compilación de producción
```

## Ambientes

| Ambiente | Archivo | `VITE_API_URL` | Para qué |
|---|---|---|---|
| desarrollo | `.env.development` | `http://localhost:4010` | servidor mock (`npm run dev`) |
| prueba | `.env.test` | `http://localhost:5068` | API real local (`npm run test`, `npm run build:test`) |
| producción | `.env.production` | `/api` | mismo origen tras nginx (`npm run build`) |

Valores personales: `.env.development.local` (ignorado por git). Regla: nada secreto en `VITE_*`; el repositorio es público.

La guía de capas y de reglas de importación está en [`src/LEEME.md`](src/LEEME.md).

## Cliente de API y mock

- `npm run api:generar` regenera `src/compartido/api/generado/esquema.d.ts` desde `specs/014-acceso-sesion/contratos/openapi.json` (copia del backend; no se edita aquí). Una prueba falla si los tipos versionados no corresponden al contrato.
- `npm run mock` levanta el mock en `http://localhost:4010` (otro puerto con `MOCK_PUERTO`). Responde `GET /salud`, `GET /salud/base`, `GET /tiendas/{codigo}` (`MEX` existe) y la autenticación (ver abajo).
- Para trabajar sin backend usa dos terminales: `npm run mock` y `npm run dev`.
- Actualizar el contrato: copia el nuevo `openapi.json` del backend, ejecuta `npm run api:generar`, corrige `mock/respuestas.ts` si `npm run type-check` o `tests/api/mock-cobertura.test.ts` fallan, y haz commit de ambos.
- Uso en código: `import { crearClienteApi } from '@/compartido/api'`.

## Sesión y mock de autenticación (HU-14)

- Operaciones del contrato: `POST /auth/registro`, `/auth/inicio-sesion`, `/auth/renovar`, `/auth/cerrar-sesion` y `GET /auth/yo`.
- El token de acceso vive solo en memoria (`useSesion` de `@/entidades/sesion`); el refresh viaja en cookie HttpOnly. Al cargar, `arrancar()` intenta una renovación silenciosa.
- Para peticiones autenticadas usa `crearApiConSesion()` (`@/aplicacion/proveedores/api`): añade `Authorization` y, ante 401, renueva una sola vez y repite.
- Rutas privadas: `meta: { requiereSesion: true }` o `meta: { rol: 'Administrador' }`; llevan a `/acceso?destino=…`.
- Mock: contraseña de al menos 8 caracteres; los datos viven en memoria (se pierden al reiniciar). La cabecera `x-mock-token: caducado` fuerza 401 en `GET /auth/yo`. CORS con credenciales para `http://localhost:5173` (cambia con `MOCK_ORIGENES`, separados por comas).
- Hook de «sesión iniciada»: `useSesion().alIniciarSesion(fn)`.

## Despliegue

Imagen Docker (nginx) y despliegue a Azure desde `main`: ver [`docs/despliegue-azure.md`](docs/despliegue-azure.md).

## Integración continua

`.github/workflows/ci.yml` corre en cada push y pull request hacia `main`, `release`, `developer` y `sprint/**`. Son cuatro controles independientes: `verificar (lint)`, `verificar (type-check)`, `verificar (test)` y `verificar (build)`. Usa permisos de solo lectura, sin secretos, y acciones fijadas por SHA.

- **Leer un fallo**: en la pestaña Actions abre el control en rojo; solo falla el que corresponde.
- **Reproducir en local**: `npm ci` y luego el comando del control, por ejemplo `npm run lint`.
- **Exigirlos**: en Settings → Branches, protege `main`, `release` y `developer` exigiendo pull request y los cuatro controles.
