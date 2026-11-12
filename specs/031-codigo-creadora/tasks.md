# Tareas: Código de creadora en el checkout y su administración (HU-31, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-18 (patrón de panel), HU-27; contrato del API de códigos (HU-31 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya los códigos de creadora (HU-31 api) a `specs/031-codigo-creadora/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-18, HU-27); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-creadoras.test.ts` y ampliar el mock con validar, crear y listar (FR-006)

## Fase 3: Checkout (US1)

- [ ] T005 [FE] Escribir primero pruebas del campo de código (aceptado, rechazado con motivo, vacío, botón deshabilitado en curso, el total no cambia, se envía con el pedido, no se envía descuento, normalización según el contrato, código quitado → pedido sin código) e implementar `funcionalidades/codigo-creadora` y su inserción en el checkout (FR-001, FR-002, FR-003)

## Fase 4: Panel (US2)

- [ ] T006 [FE] Escribir primero pruebas del panel (crear, error por campo, lista, editar/desactivar si el contrato lo permite, rol Administrador con «sin permiso», accesibilidad) e implementar `paginas/admin-creadoras` (FR-004, FR-005, FR-007)

## Fase 5: Integración

- [ ] T007 [MANUAL] Probar la creación y aplicación de un código contra la API real

## Fase final: Cierre

- [ ] T008 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T009 [FE] Fila de HU-31 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-31: Código de creadora en el checkout y su administración`; avisar «HU-31 terminada. Haz push a sprint/09»
