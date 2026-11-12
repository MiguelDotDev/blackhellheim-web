# Tareas: Flujo completo probado y pedido de demo (HU-42, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-23, HU-24, HU-27, HU-29, HU-33 implementadas; backend y servicios de prueba (Stripe modo prueba, Printful). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-14, HU-23, HU-24, HU-27, HU-29, HU-33); si no, detenerse y avisar

## Fase 2: Herramienta

- [ ] T002 [FE] Verificar la licencia y el árbol de la herramienta de navegador elegida, decidir con el criterio de tamaño/tiempo y anotarlo en `plan.md` (FR-003)

## Fase 3: Flujo automatizado (US1)

- [ ] T003 [FE] Escribir primero la prueba del flujo completo contra el mock (catálogo → detalle → carrito → acceso → checkout → pago simulado → confirmación) (FR-001)
- [ ] T004 [FE] Escribir primero las pruebas de fallo (red, 401 con renovación, 409, sin existencia) y hacerlas pasar (FR-002)
- [ ] T005 [FE] Integrarlas en la CI sin alterar los cuatro controles de HU-10 y medir el tiempo (≤ 5 min); las pruebas no dependen del orden ni de puertos fijos, y los reintentos por tiempo son acotados, nunca se desactiva la prueba (casos límite, FR-001)

## Fase 4: Demostración real (US2)

- [ ] T006 [FE] Escribir `docs/demo-pedido.md` con el guion paso a paso, qué capturar y dónde guardar la evidencia (sin secretos) (FR-004, FR-005, FR-006)
- [ ] T007 [MANUAL] Hacer la compra de demostración con tarjeta de prueba de Stripe en el ambiente de prueba y guardar capturas
- [ ] T008 [MANUAL] Decidir y, si se quiere, confirmar el pedido real en Printful con la bandera del backend

## Fase final: Cierre

- [ ] T009 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T010 [FE] Fila de HU-42 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-42: Flujo completo probado y pedido de demo`; avisar «HU-42 terminada. Haz push a sprint/11»
