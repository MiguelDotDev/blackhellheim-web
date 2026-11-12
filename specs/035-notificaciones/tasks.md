# Tareas: Bandeja de notificaciones y avisos push (HU-35, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14, HU-33/34, HU-39 (service worker); contrato del API de notificaciones (HU-35 api); claves VAPID. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya las notificaciones y la suscripción push (HU-35 api) a `specs/035-notificaciones/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-14, HU-33, HU-34) para la bandeja; la HU-39 solo se exige para la Fase 3 (push), que queda pendiente si falta (T006); si falta HU-14, HU-33 o HU-34, detenerse y avisar

## Fase 2: Mock y bandeja

- [ ] T004 [FE] Escribir primero `tests/api/mock-notificaciones.test.ts` y ampliar el mock con avisos, leído y suscripción (FR-008)
- [ ] T005 [FE] Escribir primero pruebas de la bandeja y del contador (paginación, leído que lleva al pedido, no leídos destacados sin depender del color, contador sincronizado entre pestañas, accesibilidad) e implementar `paginas/notificaciones` y `widgets/icono-notificaciones` (FR-001, FR-005)

## Fase 3: Push

- [ ] T006 [FE] Confirmar que el service worker de HU-39 existe; si no, dejar esta fase pendiente y avisar (FR-003)
- [ ] T007 [FE] Escribir primero pruebas de suscripción (permiso concedido/denegado, sin soporte, registro y baja en el backend, clave desde `VITE_VAPID_PUBLICA`, suscripción caducada 410 → volver a suscribir, navegador sin soporte → solo bandeja) e implementar `funcionalidades/avisos-push` (FR-002, FR-006)
- [ ] T008 [FE] Ampliar el service worker con `push` y `notificationclick` y probar los manejadores con eventos simulados (FR-003)
- [ ] T009 [FE] Prueba que busca claves privadas y secretos en `src/` y en los `.env.*` (FR-004)

## Fase 4: Sin conexión

- [ ] T010 [FE] Guardar la bandeja en IndexedDB con la interfaz de HU-39 y probar la lectura sin conexión (FR-007)

## Fase 5: Dispositivo e integración

- [ ] T011 [MANUAL] Generar el par de claves VAPID (la privada solo en el backend) y poner la pública en `.env.*`
- [ ] T012 [MANUAL] Probar el push en un Android real: cambio de estado → notificación → abre el pedido

## Fase final: Cierre

- [ ] T013 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T014 [FE] Fila de HU-35 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-35: Bandeja de notificaciones y avisos push`; avisar «HU-35 terminada. Haz push a sprint/10»
