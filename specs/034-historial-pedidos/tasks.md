# Tareas: Historial de pedidos con detalle (HU-34, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-33; contrato del API de historial (HU-34 api), se reutiliza el copiado en HU-33. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-14, HU-33); si no, detenerse y avisar

## Fase 2: Mock y datos

- [ ] T002 [FE] Escribir primero `tests/api/mock-historial.test.ts` (varias páginas, vacío, fuera de rango) y ampliar el mock (FR-006)

## Fase 3: Lista y detalle

- [ ] T003 [FE] Escribir primero pruebas de la lista (orden, paginación en la dirección, vacío, error con reintento, fuera de rango → última página válida, filtro por estado si el contrato lo trae, fecha con `Intl` en zona de México, sin sesión, sin cálculo de totales) e implementar `paginas/historial-pedidos` (FR-001, FR-002, FR-003, FR-004, FR-005)
- [ ] T004 [FE] Enlace al detalle de HU-33 y prueba de navegación por teclado de la paginación (FR-002, FR-004)

## Fase 4: Integración

- [ ] T005 [MANUAL] Probar el historial contra la API real con más de una página

## Fase final: Cierre

- [ ] T006 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T007 [FE] Fila de HU-34 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-34: Historial de pedidos con detalle`; avisar «HU-34 terminada. Haz push a sprint/09»
