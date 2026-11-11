# Tareas: Specs diferidos de aviso de privacidad y CFDI (HU-44)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: nada técnico. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-1); si no, detenerse y avisar

## Fase 2: Prueba y documentos

- [ ] T002 [FE] Escribir primero `tests/documentacion/diferidos.test.ts` (carpetas 900 y 901, marca «DIFERIDA», sin `- [ ]`, plantillas legales marcadas como ejemplo) (FR-005)
- [ ] T003 [FE] Completar `specs/900-…/spec.md` con la plantilla de campos y la marca (FR-001, FR-003)
- [ ] T004 [FE] Crear `specs/901-cfdi-diferido/spec.md` con la misma estructura (FR-002, FR-003)
- [ ] T005 [FE] Crear las plantillas de `docs/legal/` con la marca de ejemplo no vigente (FR-004)

## Fase 3: Revisión

- [ ] T006 [MANUAL] Revisar con asesoría legal cuando se retome el proyecto comercial

## Fase final: Cierre

- [ ] T007 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T008 [FE] Fila de HU-44 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-44: Specs diferidos de aviso de privacidad y CFDI`; avisar «HU-44 terminada. Haz push a sprint/11»
