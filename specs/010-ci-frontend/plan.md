# Plan de implementación: Integración continua del frontend (HU-10)

**Rama**: `sprint/02` · **Fecha**: 2026-11-11 · **Spec**: [spec.md](./spec.md) · **Depende de**: HU-7

## Resumen

Un único flujo de GitHub Actions (`.github/workflows/ci.yml`) con una matriz de cuatro trabajos (lint, type-check, test, build) que se dispara con push y pull request en `main`, `release`, `developer` y `sprint/**`, con permisos de solo lectura, 10 minutos máximo por trabajo, sin secretos y con acciones fijadas por SHA. Una prueba de Vitest valida la configuración. Las acciones de administración (habilitar, proteger ramas, ejecución real) son tareas `[MANUAL]`. Decisiones en [research.md](./research.md).

## Contexto técnico

**Lenguaje/Versión**: YAML (flujo) y TypeScript 5.9.x (prueba) sobre Node 24
**Dependencias principales nuevas**: `yaml` (desarrollo, para la prueba). Acciones: `actions/checkout`, `actions/setup-node`
**Almacenamiento**: N/A
**Pruebas**: Vitest, `tests/ci/flujo-ci.test.ts`; la ejecución real se comprueba a mano en GitHub
**Plataforma de destino**: GitHub Actions, `ubuntu-latest`
**Tipo de proyecto**: automatización de repositorio
**Metas de rendimiento**: < 5 min típico, 10 min como tope (SC-002)
**Restricciones**: permisos `contents: read`; sin secretos; repositorio público
**Escala/Alcance**: 1 archivo de flujo, 4 verificaciones

## Licencias (principio VIII)

| Elemento | Uso | Licencia | Cómo se verificó |
|---|---|---|---|
| yaml | analizar el flujo en la prueba (desarrollo) | ISC | registro de npm, 2026-11-11 |
| actions/checkout v7.0.1 | clonar | MIT | API de GitHub, 2026-11-11 |
| actions/setup-node v7.1.0 | instalar Node y caché | MIT | API de GitHub, 2026-11-11 |

El árbol transitivo de `yaml` (sin dependencias) se revisa en T003.

## Verificación de la constitución

| Principio | Estado | Nota |
|---|---|---|
| I. FSD | Cumple | `npm run lint` incluye las reglas de capas y corre en CI |
| VI. Pruebas | Cumple | Lint, tipos, pruebas y build obligatorios; el propio flujo tiene prueba |
| VIII. Software libre | Cumple | Tabla anterior |
| IX. Secretos y entornos | Cumple | Sin secretos; `build` usa `.env.production` versionado y público |
| X. Idioma | Cumple | Nombres y comentarios en español |
| XI. Ramas y PR | Cumple | Cubre la cadena completa; protección de ramas como tarea manual |

**Re-evaluación tras el diseño**: sin violaciones.

## Estructura

```text
specs/010-ci-frontend/{spec.md, plan.md, research.md, quickstart.md, checklists/requirements.md, tasks.md}
.github/workflows/ci.yml
tests/ci/flujo-ci.test.ts
README.md                      # sección «Integración continua»
```
Sin `data-model.md` ni `contratos/`: no hay datos ni interfaces.

## Diseño del flujo (resumen)

```yaml
name: CI frontend
on:
  pull_request: { branches: [main, release, developer, 'sprint/**'] }
  push:         { branches: [main, release, developer, 'sprint/**'] }
permissions: { contents: read }
concurrency:
  group: ci-${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: ${{ github.event_name == 'pull_request' }}
jobs:
  verificar:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    strategy: { fail-fast: false, matrix: { verificacion: [lint, type-check, test, build] } }
    steps: checkout (persist-credentials: false) → setup-node (.nvmrc, cache npm) → npm ci → npm run ${{ matrix.verificacion }}
```
Las acciones se fijan por SHA (research D6).

## Reglas que comprueba la prueba (FR-012)

1. `on.push.branches` y `on.pull_request.branches` son exactamente la lista de la historia; no existe `pull_request_target`.
2. `permissions` de flujo = `{ contents: read }` y ningún trabajo declara permisos propios.
3. Todo trabajo tiene `timeout-minutes` ≤ 10.
4. La matriz es exactamente las cuatro verificaciones, `fail-fast: false`, y cada una existe como script en `package.json`.
5. El paso final ejecuta `npm run ${{ matrix.verificacion }}`; instala con `npm ci`.
6. Todo `uses:` termina en un SHA de 40 caracteres hexadecimales.
7. No hay referencias a `secrets.` en el flujo.
8. `setup-node` usa `node-version-file: .nvmrc`; `checkout` usa `persist-credentials: false`.
9. Existen `package-lock.json` y `.nvmrc`.

## Riesgos

- **R-1**: nombres de los controles (`verificar (lint)`…) dependen del nombre del trabajo y de la matriz; si cambian, la protección de ramas deja de aplicar. Mitigación: la prueba fija el nombre del trabajo y la matriz.
- **R-2**: las ejecuciones por push y por pull request se duplican en ramas con PR abierto. Aceptado (la historia pide ambos).
- **R-3**: tests que usan puertos (mock de la HU-9) podrían chocar en paralelo. Mitigación: puerto 0 en todas las pruebas.
- **R-4**: la HU no se puede marcar «Hecha» hasta completar las cuatro tareas manuales.

## Seguimiento de complejidad

Sin violaciones que justificar.
