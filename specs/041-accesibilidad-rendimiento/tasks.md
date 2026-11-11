# Tareas: Accesibilidad y rendimiento revisados (HU-41)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-11, HU-23, HU-27, HU-39. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-11, HU-23, HU-27, HU-39); si no, detenerse y avisar

## Fase 2: Herramientas

- [ ] T002 [FE] Verificar licencias de las herramientas elegidas y su árbol, instalarlas como dependencias de desarrollo y anotarlas en `plan.md` (FR-006)

## Fase 3: Accesibilidad (US1)

- [ ] T003 [FE] Escribir primero pruebas con axe sobre los componentes y páginas principales y corregir las fallas críticas (FR-002)
- [ ] T004 [FE] Actualizar la prueba de contraste con los pares reales y el recorrido por teclado de la compra (FR-003, FR-004)

## Fase 4: Rendimiento (US2)

- [ ] T005 [FE] Medir con Lighthouse (mediana de tres) en inicio, catálogo y detalle, aplicar las correcciones evidentes y guardar los informes en `docs/calidad/` (FR-001, FR-005)

## Fase 5: Revisión

- [ ] T006 [MANUAL] Ejecutar Lighthouse en un dispositivo real y aprobar el informe

## Fase final: Cierre

- [ ] T007 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T008 [FE] Fila de HU-41 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-41: Accesibilidad y rendimiento revisados`; avisar «HU-41 terminada. Haz push a sprint/11»
