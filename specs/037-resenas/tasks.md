# Tareas: Reseñas con estrellas y comentarios (HU-37, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-23, HU-34; contrato del API de reseñas (HU-37 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya las reseñas y su moderación (HU-37 api) a `specs/037-resenas/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-23, HU-34); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-resenas.test.ts` y ampliar el mock (FR-006)

## Fase 3: Leer y escribir

- [ ] T005 [FE] Escribir primero pruebas de la lista y del promedio (valores del backend, vacío, paginación) e integrarlas en el detalle de HU-23 (FR-001, FR-005)
- [ ] T006 [FE] Escribir primero pruebas del formulario (elegible/no elegible, estrellas accesibles, errores por campo, un solo envío, comentario con HTML como texto) e implementarlo (FR-002, FR-003, FR-005)

## Fase 4: Moderación

- [ ] T007 [FE] Escribir primero pruebas de ocultar/mostrar y del rol e implementar `paginas/admin-resenas` (FR-004, FR-005)

## Fase 5: Integración

- [ ] T008 [MANUAL] Probar con la API real una compra verificada y una moderación

## Fase final: Cierre

- [ ] T009 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T010 [FE] Fila de HU-37 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-37: Reseñas con estrellas y comentarios`; avisar «HU-37 terminada. Haz push a sprint/10»
