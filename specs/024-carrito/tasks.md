# Tareas: Carrito que se conserva (HU-24, parte web)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-14 (sesión y gancho de sesión iniciada); contrato del API de carrito (HU-24 api). Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya el carrito y su fusión (HU-24 api) a `specs/024-carrito/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-7, HU-9, HU-14, HU-23); si no, detenerse y avisar

## Fase 2: Mock y almacenamiento local

- [ ] T004 [FE] Escribir primero `tests/api/mock-carrito.test.ts` y ampliar el mock con carrito y fusión (FR-007)
- [ ] T005 [FE] Escribir primero las pruebas del repositorio local (persistencia, cantidades, límites, memoria si no hay almacenamiento, sin precios guardados) e implementarlo con IndexedDB; si hace falta `fake-indexeddb`, verificar y anotar su licencia (FR-001, FR-002, FR-003)

## Fase 3: Fusión y carrito con sesión

- [ ] T006 [FE] Escribir primero pruebas de fusión (éxito, variante repetida decidida por el servidor, fallo conserva el local) y del repositorio remoto; implementar `entidades/carrito` y conectar el gancho de sesión iniciada de HU-14 (FR-002, FR-003)
- [ ] T007 [FE] Prueba de cierre de sesión (vuelve a carrito local vacío) y sincronización entre pestañas (FR-006)

## Fase 4: Interfaz

- [ ] T008 [FE] Escribir primero pruebas del contador accesible y de la página `/carrito` (línea no disponible marcada, cantidades) e implementar `widgets/icono-carrito` y `paginas/carrito` (FR-004, FR-005)

## Fase 5: Integración

- [ ] T009 [MANUAL] Probar la fusión contra la API real (carrito local + cuenta con carrito previo)

## Fase final: Cierre

- [ ] T010 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T011 [FE] Fila de HU-24 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-24: Carrito que se conserva`; avisar «HU-24 terminada. Haz push a sprint/07»
