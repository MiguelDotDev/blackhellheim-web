# Especificación 000: Fundación y DevOps (Web)

**Épica**: E0 Fundación y DevOps · **Sprints**: 1 y 2 · **Jira**: BHH (componentes FE, CI)
**Estado**: borrador semilla. Completar con `/speckit.specify` y `/speckit.clarify`.

## Objetivo
Dejar un proyecto Vue 3 + TypeScript listo, con la estructura FSD y los controles automáticos, para construir las pantallas.

## Historias de usuario
1. Como desarrolladora, quiero Vite + Vue 3 + TS + Pinia + Router + Tailwind con las capas FSD en español para empezar ordenada.
2. Como desarrolladora, quiero ESLint que imponga imports por `index.ts` y la jerarquía de capas.
3. Como desarrolladora, quiero CI (lint, type-check, pruebas, build) en GitHub Actions.
4. Como desarrolladora, quiero cliente de API generado desde OpenAPI y un servidor mock.
5. Como desarrolladora, quiero `.env.development`, `.env.test` y `.env.production`.
6. Como administradora, quiero un contenedor nginx que sirva la PWA y haga proxy de `/api`, desplegado en Azure Container Apps con ingress público.

## Criterios de aceptación
- `npm run lint`, `type-check`, `test` y `build` pasan en CI.
- Un import que salte `index.ts` o suba de capa hace fallar el lint.
- `npm run dev` funciona contra el mock sin backend.
- El contenedor sirve la app y reenvía `/api` a la API; mismo origen, sin CORS en producción.

## Fuera de alcance
Pantallas de negocio (ver specs posteriores). PWA completa se cierra en Sprint 11.

## Puntos abiertos
- Comportamiento del proxy hacia el ingress interno de la API.
