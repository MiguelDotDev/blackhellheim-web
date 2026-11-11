# Tareas: Pagar con Stripe (HU-29, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-24, HU-27; contrato del API de pago (HU-29 api); cuenta de Stripe. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya la creación de sesión de pago y el estado del pedido (HU-29 api) a `specs/029-pago-stripe/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-24, HU-27); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-pago.test.ts` (sesión creada, error, estados pagado/pendiente/fallido) y ampliar el mock con `satisfies` (FR-007)

## Fase 3: Pagar (US1)

- [ ] T005 [FE] Escribir primero pruebas de `pagar` (redirige a la dirección devuelta, rechaza esquemas no `https:`, error con reintento, un solo envío por doble clic) e implementar `funcionalidades/pagar` y conectar `onPagar` de HU-27 (FR-001, FR-002, FR-006)
- [ ] T006 [FE] Prueba que busca `stripe.js`, `sk_`, `pk_` y `whsec_` en `src/` y `dist` (FR-002)

## Fase 4: Resultado (US2, US3)

- [ ] T007 [FE] Escribir primero pruebas de la consulta de estado (pagado, pendiente, fallido, procesando con espera creciente y límite, sin confianza en la dirección de retorno, diferido con instrucciones) e implementar `paginas/resultado-pago` y la página de cancelación (FR-003, FR-004, FR-005)

## Fase 5: Cuentas e integración

- [ ] T008 [MANUAL] Crear la cuenta de Stripe, las claves y el webhook (solo en el backend); no poner nada en este repo
- [ ] T009 [MANUAL] Probar un pago de prueba de punta a punta y uno diferido contra la API real

## Fase final: Cierre

- [ ] T010 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T011 [FE] Fila de HU-29 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-29: Pagar con Stripe`; avisar «HU-29 terminada. Haz push a sprint/08»
