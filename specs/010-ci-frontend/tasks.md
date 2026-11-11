# Tareas: Integración continua del frontend (HU-10)

**Entrada**: `specs/010-ci-frontend/` (spec.md, plan.md, research.md, quickstart.md)
**Pruebas**: incluidas, primero (deben fallar antes de implementar). Principio VI.
**Etiquetas**: `[FE]` código de este repo · `[CI]` flujo de integración continua · `[MANUAL]` solo la desarrolladora (no se inventan; quedan pendientes).
**Historias**: US1 cuatro verificaciones (P1) · US2 disparadores (P1) · US3 segura, rápida y sin secretos (P1) · US4 exigible y documentada (P2)
**Nota**: esta HU tiene 4 tareas `[MANUAL]` (T017, T018, T019, T020); no se marca «Hecha» hasta completarlas.

## Fase 1: Preparación

- [x] T001 [FE] Confirmar que la HU-7 está hecha: existen `package.json` con los scripts `lint`, `type-check`, `test` y `build`, `.nvmrc` y `package-lock.json` versionado (`git ls-files package-lock.json .nvmrc`); si falta algo, detenerse y avisar
- [x] T002 [FE] Instalar `npm install -D yaml` en `package.json`
- [x] T003 [FE] Verificar la licencia de `yaml` y su árbol (`npm ls --all --parseable` + campo `license`), reconsultar la última versión y el SHA de `actions/checkout` y `actions/setup-node` (`git ls-remote https://github.com/<acción> 'refs/tags/<versión>*'`) y la licencia de ambas, y actualizar la tabla de `specs/010-ci-frontend/research.md` (D6) y `plan.md`; si alguna licencia no es libre, detener la HU

## Fase 2: Base

- [x] T004 [P] [CI] Crear el directorio `.github/workflows/` y un `tests/ci/ayudantes.ts` con una función que lee y analiza `.github/workflows/ci.yml` con `yaml` y devuelve el objeto y el texto original (la usan todas las pruebas de `tests/ci/`)

## Fase 3: Historia 1 — Las cuatro verificaciones corren solas (P1) 🎯 MVP

**Meta**: cuatro controles con resultado propio.
**Prueba independiente**: `npm run test -- tests/ci` + ejecución real (T018).

- [x] T005 [US1] [CI] Escribir primero `tests/ci/flujo-ci.test.ts` (grupo «verificaciones»): el flujo tiene el trabajo `verificar`; su matriz es exactamente `lint`, `type-check`, `test`, `build`; `fail-fast` es `false`; cada valor existe como script en `package.json`; los pasos incluyen `npm ci` y un paso final `npm run ${{ matrix.verificacion }}`; comprobar que falla (no existe el flujo)
- [x] T006 [US1] [CI] Crear `.github/workflows/ci.yml` con nombre «CI frontend», el trabajo `verificar` (`runs-on: ubuntu-latest`, matriz y `fail-fast: false`) y los pasos: checkout, setup-node con `node-version-file: .nvmrc` y `cache: npm`, `npm ci` y `npm run ${{ matrix.verificacion }}`; las acciones fijadas por SHA con el tag en comentario (valores de T003); aún sin bloque `on:` definitivo (usar `on: workflow_dispatch` provisional)
- [x] T007 [US1] [CI] Ejecutar el grupo «verificaciones» de T005 en verde

**Punto de control**: historia 1 definida.

## Fase 4: Historia 2 — Disparadores en la cadena de ramas (P1)

**Meta**: push y pull request en `main`, `release`, `developer`, `sprint/**`.
**Prueba independiente**: prueba de configuración + ejecución real (T018).

- [x] T008 [US2] [CI] Escribir primero en `tests/ci/flujo-ci.test.ts` el grupo «disparadores»: `on.push.branches` y `on.pull_request.branches` son exactamente `['main','release','developer','sprint/**']`; no existe `pull_request_target`, ni `workflow_run`; comprobar que falla (T006 dejó `workflow_dispatch`)
- [x] T009 [US2] [CI] Sustituir el `on:` provisional de `.github/workflows/ci.yml` por `push` y `pull_request` con esa lista de ramas
- [x] T010 [US2] [CI] Ejecutar el grupo «disparadores» en verde

**Punto de control**: historias 1 y 2.

## Fase 5: Historia 3 — Segura, rápida y sin secretos (P1)

**Meta**: permisos mínimos, 10 minutos, sin secretos, terceros fijados.
**Prueba independiente**: grupo «seguridad» de las pruebas.

- [x] T011 [US3] [CI] Escribir primero en `tests/ci/flujo-ci.test.ts` el grupo «seguridad»: `permissions` de flujo es `{contents: 'read'}` y ningún trabajo declara `permissions`; todo trabajo tiene `timeout-minutes` ≤ 10; el texto no contiene `secrets.`; todo `uses:` termina en un SHA de 40 hexadecimales; `checkout` tiene `persist-credentials: false`; `setup-node` usa `node-version-file: .nvmrc`; existen `.nvmrc` y `package-lock.json`; hay `concurrency` con `cancel-in-progress` que depende del evento `pull_request`; comprobar que falla
- [x] T012 [US3] [CI] Añadir a `.github/workflows/ci.yml` `permissions: contents: read`, `timeout-minutes: 10`, `concurrency` (`group: ci-${{ github.workflow }}-${{ github.ref }}`, `cancel-in-progress: ${{ github.event_name == 'pull_request' }}`) y `persist-credentials: false` en checkout
- [x] T013 [US3] [CI] Ejecutar el grupo «seguridad» en verde y `npm run test -- tests/ci` completo

**Punto de control**: historias 1–3 en el repositorio.

## Fase 6: Historia 4 — Exigible y documentada (P2)

**Meta**: se puede exigir y se sabe reproducir un fallo.
**Prueba independiente**: seguir la documentación; bloqueo de unión (T020).

- [x] T014 [P] [US4] [FE] Añadir a `README.md` la sección «Integración continua»: qué corre y cuándo, los cuatro controles `verificar (lint | type-check | test | build)`, cómo leer un fallo, cómo reproducirlo en local (`npm ci` + el comando) y cómo se exigen en la protección de ramas

## Fase 7: Cierre local

- [x] T015 [FE] Ejecutar `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` (la prueba de `tests/ci/` ya se incluye en `npm run test`) y corregir hasta que pasen
- [x] T016 [FE] Commit `HU-10: CI del frontend` en `sprint/02`; dejar la fila de HU-10 en `docs/scrum/backlog.md` con Spec = `specs/010-ci-frontend` y Estado = `En progreso` hasta completar las tareas manuales; detenerse y avisar a la desarrolladora qué le toca (T017–T020); no hacer push

## Fase 8: Tareas manuales (solo la desarrolladora)

- [ ] T017 [MANUAL] Habilitar GitHub Actions en el repositorio (Settings → Actions → General: permitir acciones; «Workflow permissions» en «Read repository contents»; no permitir que las ejecuciones aprueben pull requests) y hacer `git push origin sprint/02`
- [ ] T018 [MANUAL] Comprobar en la pestaña Actions que el push de `sprint/02` y un pull request `sprint/02` → `developer` muestran los 4 controles `verificar (…)` en verde, cada uno en menos de 10 minutos (SC-001, SC-002, SC-005)
- [ ] T019 [MANUAL] Prueba negativa SC-004: en una rama temporal `sprint/99-prueba-ci`, un commit por cada error provocado (import entre capas, error de tipos, prueba que falla, import inexistente) y comprobar que solo cae el control correspondiente; borrar la rama (local y remota)
- [ ] T020 [MANUAL] Configurar la protección de `main`, `release` y `developer` (Settings → Branches): exigir pull request y los cuatro controles `verificar (lint)`, `verificar (type-check)`, `verificar (test)` y `verificar (build)`, y comprobar que un pull request en rojo no se puede unir (SC-006). Al terminar, avisar para marcar HU-10 como Hecha en `docs/scrum/backlog.md`

## Dependencias y orden

- HU-7 completa → T001–T004 → US1 → US2 → US3 (todas editan el mismo `ci.yml`, no son paralelas entre sí) → T014 (puede ir en paralelo con US2/US3) → T015–T016 → T017–T020 en orden (T017 antes de T018; T018 antes de T020 porque los nombres de los controles solo aparecen tras la primera ejecución).
- HU-8 y HU-9 amplían las pruebas que corren; no condicionan estas tareas.

## Ejemplo de paralelismo

```text
T004 (ayudantes) con T002/T003      T014 (README) con T008–T013
```

## Estrategia

MVP = US1 + US2 (el criterio de la historia). US3 añade las restricciones pedidas. Un solo commit; el cierre depende de acciones manuales en GitHub.
