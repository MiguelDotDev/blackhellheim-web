# Tareas: Panel de pedidos y ventas por código de creadora (HU-38, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-18, HU-31, HU-33; contrato del API de administración de pedidos (HU-38 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya la administración de pedidos y las ventas por código (HU-38 api) a `specs/038-admin-pedidos/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-18, HU-31, HU-33); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-admin-pedidos.test.ts` y ampliar el mock (listado, filtro, entregar con 409, estadísticas por código) (FR-006)

## Fase 3: Pedidos (US1)

- [ ] T005 [FE] Escribir primero pruebas de la lista (filtro por estado, paginación en la dirección, rol, detalle, accesibilidad, sin datos personales en consola ni más campos que los del contrato) e implementar `paginas/admin-pedidos` (FR-001, FR-002, FR-005, FR-007)

## Fase 4: Entrega (US2)

- [ ] T006 [FE] Escribir primero pruebas de la acción (confirmación, un solo envío, rechazo con motivo, 409 refresca) e implementar `funcionalidades/entregar-pedido` (FR-003)

## Fase 5: Ventas por código (US3)

- [ ] T007 [FE] Escribir primero pruebas (total del backend, cero ventas, lista paginada, sin sumas en el cliente) e implementar la vista de ventas en `/admin/creadoras/:codigo` con `meta.rol = Administrador` y tablas accesibles (FR-001, FR-004, FR-005)

## Fase 6: Integración

- [ ] T008 [MANUAL] Probar entrega y ventas por código contra la API real

## Fase final: Cierre

- [ ] T009 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T010 [FE] Fila de HU-38 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-38: Panel de pedidos y ventas por código de creadora`; avisar «HU-38 terminada. Haz push a sprint/09»
