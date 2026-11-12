# Investigación: HU-10 CI del frontend (Fase 0)

Consulta: 2026-11-11.

## D1. Plataforma

- **Decisión**: GitHub Actions, un archivo `.github/workflows/ci.yml`.
- **Razón**: el repositorio vive en GitHub (público), la spec 000 ya lo prevé y los minutos son gratuitos en repositorios públicos (principio VIII). El backend usa el mismo servicio.
- **Alternativas**: Azure Pipelines (el despliegue es a Azure, pero el código está en GitHub; añade otra cuenta y credenciales); CircleCI/GitLab CI (no están en el repo).

## D2. Estructura: una matriz de cuatro trabajos

- **Decisión**: un solo trabajo `verificar` con matriz `verificacion: [lint, type-check, test, build]`, `fail-fast: false`, cada celda ejecuta `npm run ${{ matrix.verificacion }}`.
- **Razón**: cada verificación sale como resultado propio (FR-004), corren en paralelo (más rápido que 4 pasos seguidos) y un fallo no oculta los demás. El valor de la matriz es fijo del repositorio, no entrada externa, así que no hay riesgo de inyección en `run`.
- **Alternativa**: un trabajo con cuatro pasos y `if: always()`; resultado único, difícil de exigir por separado. Descartada.
- **Costo**: cuatro instalaciones de dependencias; se mitiga con la caché de npm de `setup-node`.
- **Nombres de los controles**: `verificar (lint)`, `verificar (type-check)`, `verificar (test)`, `verificar (build)`; son los que se exigen en la protección de ramas (aparecen tras la primera ejecución).

## D3. Disparadores

- `pull_request` con `branches: [main, release, developer, 'sprint/**']` (rama destino) y `push` con la misma lista.
- **No** se usa `pull_request_target` (ejecutaría con privilegios y secretos sobre código de terceros).
- `sprint/**` incluye ramas anidadas (`sprint/02/ajuste`).

## D4. Permisos, tiempo, concurrencia

- `permissions: contents: read` a nivel de flujo; ningún trabajo lo amplía.
- `timeout-minutes: 10` por trabajo.
- `concurrency: group: ci-${{ github.workflow }}-${{ github.ref }}` con `cancel-in-progress` solo en pull requests (no cancelar ejecuciones de `main`, `release` o `developer`).
- `actions/checkout` con `persist-credentials: false`.

## D5. Node e instalación

- `actions/setup-node` con `node-version-file: .nvmrc` (24, definido en HU-7) y `cache: npm`.
- `npm ci` (falla si `package-lock.json` no coincide con `package.json`).

## D6. Acciones de terceros y licencias

| Acción | Versión | SHA de commit (consultado 2026-11-11) | Licencia |
|---|---|---|---|
| actions/checkout | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` | MIT |
| actions/setup-node | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` | MIT |

Se fijan por SHA completo con el tag en comentario. Al implementar se vuelve a consultar por si hay una versión más reciente.

## D7. Cómo se prueba el flujo

- **Decisión**: prueba de Vitest (`tests/ci/flujo-ci.test.ts`) que lee y analiza el YAML con el paquete `yaml` (ISC, dependencia de desarrollo) y comprueba los criterios de FR-001–FR-012.
- **Razón**: se ejecuta en local y en la propia CI; detecta que alguien relaje permisos o añada secretos.
- **Alternativas**: `actionlint` (MIT, binario Go): útil para sintaxis, pero no verifica nuestras reglas y añade un ejecutable; puede sumarse después. Pruebas de texto con expresiones regulares: frágiles.
- La ejecución real (SC-001, SC-004) solo puede comprobarse en GitHub: tareas manuales.

## D8. Fuera de alcance consciente

Dependabot, CodeQL, cobertura y publicación de artefactos se dejan para historias futuras; no cambian el flujo.
