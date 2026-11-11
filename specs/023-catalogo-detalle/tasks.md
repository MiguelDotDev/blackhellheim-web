# Tareas: Catálogo y detalle de producto (HU-23)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: contratos de la API de catálogo (HU-19) y de precios (HU-20); interfaz del carrito (HU-24) y checkout (HU-27) para los botones. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend que incluya el catálogo (HU-19) y los precios (HU-20) a `specs/023-catalogo-detalle/contratos/openapi.json` (el contrato lo define el repo `blackhellheim-api`; no se inventa aquí)
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; documentar en `plan.md` los nombres reales de las operaciones
- [ ] T003 [FE] Confirmar que están hechas las dependencias (HU-7, HU-9, HU-11); si no, detenerse y avisar

## Fase 2: Mock

- [ ] T004 [FE] Escribir primero `tests/api/mock-catalogo.test.ts` (listado, filtros, detalle, 404) y ampliar `mock/respuestas.ts` con `satisfies` sobre los tipos generados (FR-007)

## Fase 3: Catálogo (US1)

- [ ] T005 [FE] Escribir primero pruebas de la lista (paginación, filtros en la dirección, vacío, error con reintento) e implementar `paginas/catalogo` (FR-001, FR-002, FR-006)
- [ ] T006 [FE] Prueba de que ningún archivo hace aritmética con precios y de que el precio mostrado es el recibido (formato `es-MX`) (FR-003)

## Fase 4: Detalle y variantes (US2)

- [ ] T007 [FE] Escribir primero pruebas del selector de variante (disponibilidad, cambio de imagen y precio, teclado, estado no solo por color) e implementar `funcionalidades/elegir-variante` (FR-004, FR-005)
- [ ] T008 [FE] Implementar la galería accesible y `paginas/detalle-producto` con 404 (FR-005, FR-006)

## Fase 5: Compra (US3)

- [ ] T009 [FE] Escribir primero pruebas de Agregar al carrito y Comprar ahora (variante exacta, falta color/talla, deshabilitado sin existencia) e implementar contra la interfaz de HU-24/HU-27 (FR-003, FR-004)

## Fase 6: Prueba real

- [ ] T010 [MANUAL] Probar catálogo y detalle contra la API real con imágenes de Printful

## Fase final: Cierre

- [ ] T011 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T012 [FE] Fila de HU-23 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-23: Catálogo y detalle de producto`; avisar «HU-23 terminada. Haz push a sprint/06»
