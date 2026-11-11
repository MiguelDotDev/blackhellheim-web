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
