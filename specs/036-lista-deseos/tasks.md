# Tareas: Lista de deseos (HU-36, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-23; contrato del API de lista de deseos (HU-36 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya la lista de deseos (HU-36 api) a `specs/036-lista-deseos/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-23); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-deseos.test.ts` y ampliar el mock (FR-005)

## Fase 3: Corazón y lista

- [ ] T005 [FE] Escribir primero pruebas del corazón (marcado, quitar, sin sesión → acceso, reversión al fallar, una petición por clic, sin conexión → falla con aviso y se revierte, accesibilidad) e implementarlo en catálogo y detalle (FR-001, FR-002, FR-003, FR-004)
- [ ] T006 [FE] Escribir primero pruebas de `/deseos` (lista, vacío, no disponible) e implementar la página (FR-003)

## Fase 4: Integración

- [ ] T007 [MANUAL] Probar con la API real

## Fase final: Cierre

- [ ] T008 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T009 [FE] Fila de HU-36 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-36: Lista de deseos`; avisar «HU-36 terminada. Haz push a sprint/10»
