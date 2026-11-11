# Tareas: Editor de diseños (HU-18)

**Pruebas**: primero. **Bloqueado por**: HU-14 y contrato de HU-16/17/19. Esta HU tiene tareas `[MANUAL]`.

## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend con diseños, subida de arte y catálogo a `specs/018-editor-disenos/contratos/openapi.json` y confirmar el umbral de «arte negro»
- [ ] T002 [FE] Apuntar `api:generar` al contrato vigente, regenerar y dejar en verde `tests/api/esquema-actualizado.test.ts`; confirmar que HU-14 y HU-11 están hechas (si no, detener y avisar)

## Fase 2: Mock

- [ ] T003 [FE] Escribir primero `tests/api/mock-disenos.test.ts` (crear, listar, obtener, actualizar, subida de arte, errores 400/403/409 con `ProblemDetails`) y ampliar `mock/respuestas.ts` con `satisfies`

## Fase 3: Aviso de arte oscuro (US3)

- [ ] T004 [FE] Escribir primero `lib/analizar-arte.test.ts` (negro opaco → aviso; claro → no; transparente → ignora píxeles; umbral exacto; imagen vacía)
- [ ] T005 [FE] Implementar `analizar-arte.ts` y el componente `AvisoArteOscuro` con `role="status"` y texto (no solo color)

## Fase 4: Formulario y subida (US1, US2)

- [ ] T006 [FE] Escribir primero pruebas de validación de archivos (tipo, tamaño, resolución) y del estado de subida (progreso, fallo, reintento por archivo, reordenar, quitar)
- [ ] T007 [FE] Implementar `ui/` del formulario (campos, imágenes, colores, tallas), validación por campo, errores del servidor, deshabilitar envío y foco al primer error; sin campos de precio (prueba que lo comprueba)
- [ ] T008 [FE] Implementar la entidad `diseno` y la llamada de guardado con el cliente generado

## Fase 5: Edición y rutas (US4)

- [ ] T009 [FE] Escribir primero pruebas de carga de un diseño, guardado y conflicto 409; implementar `paginas/admin-disenos` y las rutas con `meta.rol = Administrador`

## Fase 6: Cierre

- [ ] T010 [FE] `npm run lint`, `type-check`, `test`, `build` en verde; README: sección del panel
- [ ] T011 [FE] Fila de HU-18 en `backlog.md`: Spec y Estado = Hecha (si no quedan `[MANUAL]`); commit `HU-18: editor de diseños`; avisar «HU-18 terminada. Haz push a sprint/05»
- [ ] T012 [MANUAL] Probar con la API real y una imagen real de arte negro sobre prenda negra

## Dependencias

T001 → T002 → T003 → (T004–T005) y (T006–T008) → T009 → T010–T011. T012 tras desplegar el backend.
