# Tareas: Documentación final y evidencia de cada sprint (HU-45)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: todas las HU que se documenten; contenido de revisión y retrospectiva de la desarrolladora. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-1 y todas las HU del proyecto); si no, detenerse y avisar

## Fase 2: Prueba

- [ ] T002 [FE] Escribir primero `tests/documentacion/readme.test.ts` (scripts del README existen, cada HU Hecha tiene spec, plan y tareas, existe `sprint-NN.md` por sprint) (FR-005)

## Fase 3: Documentos

- [ ] T003 [FE] Completar el README con requisitos, comandos, ambientes, mock, cliente, CI, despliegue, PWA y FSD (FR-001)
- [ ] T004 [FE] Generar `docs/scrum/sprint-NN.md` desde la plantilla con meta, historias y horas del backlog (FR-002)
- [ ] T005 [FE] Crear `docs/scrum/evidencias-sdd.md` con el índice de specs, planes, tareas e informes, marcando como pendientes las HU no hechas y resumiendo hallazgos de análisis y decisiones por HU (US2.3, FR-004)

## Fase 4: Aportes de la desarrolladora

- [ ] T006 [MANUAL] Escribir la revisión (qué se demostró) y la retrospectiva (funcionó, mejorar, acuerdos) de cada sprint (FR-003)
- [ ] T007 [MANUAL] Aprobar la documentación final en ambos repositorios

## Fase final: Cierre

- [ ] T008 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T009 [FE] Fila de HU-45 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-45: Documentación final y evidencia de cada sprint`; avisar «HU-45 terminada. Haz push a sprint/11»
