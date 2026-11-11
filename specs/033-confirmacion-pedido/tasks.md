# Tareas: Confirmación y estado del pedido (HU-33)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-29; contrato del API de pedidos (HU-33/34 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya la consulta de pedido (HU-33/34 api) a `specs/033-confirmacion-pedido/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-29); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-pedidos.test.ts` y ampliar el mock con un pedido por estado y el 404 (FR-007)

## Fase 3: Entidad y página

- [ ] T005 [FE] Escribir primero la prueba de etiquetas (todo estado del enum tiene texto; desconocido → genérico) e implementar `entidades/pedido` (FR-003)
- [ ] T006 [FE] Escribir primero pruebas de la página (datos, guía pendiente, 404, enlace `https:` con `rel`, estado no solo por color, sin sesión → acceso) e implementar `paginas/pedido` (FR-001, FR-002, FR-004, FR-005, FR-006)

## Fase 4: Integración

- [ ] T007 [MANUAL] Probar con un pedido real pagado y uno con guía de Printful

## Fase final: Cierre

- [ ] T008 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T009 [FE] Fila de HU-33 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-33: Confirmación y estado del pedido`; avisar «HU-33 terminada. Haz push a sprint/09»
