# Tareas: PWA instalable y uso sin conexión (HU-39)

**Pruebas**: primero (principio VI). **Etiquetas**: `[FE]` código de este repo · `[MANUAL]` solo la desarrolladora (no se inventan).
**Bloqueado por**: HU-11 (iconos y colores), HU-14, HU-23, HU-33/34. Esta HU tiene tareas `[MANUAL]`: no se marca «Hecha» hasta completarlas.


## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que están hechas las dependencias (HU-11, HU-14, HU-23, HU-33, HU-34); si no, detenerse y avisar

## Fase 2: Manifiesto y service worker

- [ ] T002 [FE] Verificar la licencia de `vite-plugin-pwa`, Workbox y `fake-indexeddb` y su árbol, instalarlos y anotarlas en `plan.md`
- [ ] T003 [FE] Escribir primero pruebas de configuración (manifiesto con nombre, iconos, `standalone`, colores; el service worker no cachea escrituras de `/api`) e implementar la configuración del plugin (FR-001, FR-004)
- [ ] T004 [FE] Aviso de nueva versión y actualización controlada, con prueba (FR-006)

## Fase 3: Datos sin conexión (US2, US3)

- [ ] T005 [FE] Escribir primero pruebas del almacén local por usuario (guardar, leer, borrar al cerrar sesión, sin tokens) e implementarlo (FR-003, FR-004, FR-007)
- [ ] T006 [FE] Integrar el almacén en pedidos (HU-33/34), avisos (HU-35, si ya existe) y catálogo visto (HU-23) con «visto el <fecha>» (FR-003)
- [ ] T007 [FE] Página y aviso de sin conexión accesibles con pruebas (FR-005)

## Fase 4: Documentación y dispositivo

- [ ] T008 [FE] Documentar la prueba en modo avión en el README (FR-008)
- [ ] T009 [MANUAL] Entregar los iconos finales de la app (monograma) si no están
- [ ] T010 [MANUAL] Instalar en un Android real y probar modo avión con pedidos, avisos y catálogo; correr Lighthouse

## Fase final: Cierre

- [ ] T011 [FE] `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` en verde; README actualizado con lo nuevo
- [ ] T012 [FE] Fila de HU-39 en `docs/scrum/backlog.md`: Estado = Por auditar/En progreso (hay tareas [MANUAL]); commit `HU-39: PWA instalable y uso sin conexión`; avisar «HU-39 terminada. Haz push a sprint/11»
