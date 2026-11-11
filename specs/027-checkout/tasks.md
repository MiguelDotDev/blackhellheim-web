# Tareas: Checkout con dirección mexicana y envío cotizado (HU-27)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14 (sesión), HU-23 y HU-24 (carrito); contrato del API de checkout y envío (historias 26 y 27 del API). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya la cotización de envío y el resumen de checkout a `specs/027-checkout/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-23, HU-24); si no, detenerse y avisar

## Fase 2: Mock y validaciones

- [ ] T004 [FE] Escribir primero `tests/api/mock-checkout.test.ts` y ampliar el mock con cotización y resumen (FR-004, FR-006)
- [ ] T005 [FE] Escribir primero pruebas de validación (CP de 5 dígitos, teléfono de 10, obligatorios) e implementar las funciones puras (FR-003)

## Fase 3: Sesión y retorno (US1)

- [ ] T006 [FE] Escribir primero pruebas de guardia del checkout (visitante → acceso con destino, carrito vacío → catálogo, retorno con el carrito intacto) e implementar la ruta con `meta.requiereSesion` (FR-001)

## Fase 4: Dirección, envío y resumen (US2, US3)

- [ ] T007 [FE] Escribir primero pruebas del formulario de dirección (errores por campo, del servidor, accesibilidad) e implementar `funcionalidades/direccion-envio` (FR-003, FR-006)
- [ ] T008 [FE] Escribir primero pruebas de cotización (opciones, error con reintento, recotizar al cambiar, total descartado) e implementar `funcionalidades/cotizar-envio` y el resumen; prueba de que no hay aritmética de dinero (FR-002, FR-004, FR-005)
- [ ] T009 [FE] Dejar el botón Pagar con el gancho `onPagar` deshabilitado hasta HU-29 (FR-007)

## Fase 5: Integración

- [ ] T010 [MANUAL] Probar el flujo contra la API real con una dirección de prueba

## Fase final: Cierre

- [ ] T011 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T012 [FE] Fila de HU-27 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-27: Checkout con dirección mexicana y envío cotizado`; avisar «HU-27 terminada. Haz push a sprint/07»
