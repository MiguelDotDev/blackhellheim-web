# Tareas: Acceso y sesión (HU-14)

**Pruebas**: primero. **Etiquetas**: `[FE]` código · `[MANUAL]` solo la desarrolladora.
**Bloqueado por**: HU-13 (api). T001 es la puerta: sin contrato no se implementa.

## Fase 1: Preparación

- [ ] T001 [MANUAL] Copiar el `openapi.json` del backend (con la autenticación de HU-13) a `specs/014-acceso-sesion/contratos/openapi.json`
- [ ] T002 [FE] Apuntar `api:generar` al nuevo contrato, ejecutarlo y comprobar que `tests/api/esquema-actualizado.test.ts` sigue en verde; documentar los nombres reales de las operaciones en `plan.md`

## Fase 2: Mock (US2)

- [ ] T003 [FE] Escribir primero `tests/api/mock-auth.test.ts` (registro, inicio, renovación, cierre, 401 con `x-mock-token: caducado`, cobertura de cada operación nueva)
- [ ] T004 [FE] Ampliar `mock/respuestas.ts` y `mock/servidor.ts` (CORS con credenciales y origen explícito, cookie de refresh simulada)

## Fase 3: Sesión y renovación (US2)

- [ ] T005 [FE] Escribir primero `src/compartido/api/middleware-sesion.test.ts`: añade `Authorization`; un 401 renueva y repite una vez; N peticiones simultáneas → una renovación; la renovación con 401 no entra en bucle; fallo de red no cierra la sesión
- [ ] T006 [FE] Implementar `middleware-sesion.ts` y la opción en `crearClienteApi`; exportar por `index.ts`
- [ ] T007 [FE] Escribir primero `src/entidades/sesion/modelo/sesion.test.ts` (estados, token solo en memoria: espiar `localStorage`, `sessionStorage` e `indexedDB`; cierre limpia el estado) e implementar el store
- [ ] T008 [FE] Escribir primero una prueba del arranque (renovación silenciosa con éxito → sesión activa; con fallo → anónima sin error visible) y conectar cliente y store en `src/aplicacion` (D3)

## Fase 4: Pantallas (US1)

- [ ] T009 [FE] Escribir primero pruebas de `FormularioAcceso` y `FormularioRegistro` (errores por campo, mensaje genérico, botón deshabilitado en envío, foco al primer error, etiquetas, flujo completo solo con teclado [SC-003], la contraseña nunca aparece en `console.*` ni en el DOM tras enviar [FR-007], mensaje idéntico para correo inexistente y contraseña incorrecta)
- [ ] T010 [FE] Implementar slices `funcionalidades/acceso` y `paginas/acceso`, ruta `/acceso`, botón de cierre de sesión

## Fase 5: Guardia (US3)

- [ ] T011 [FE] Escribir primero pruebas del enrutador: ruta privada → `/acceso?destino=`, `destino` externo ignorado, rol insuficiente → «sin permiso»
- [ ] T012 [FE] Implementar `meta.requiereSesion`/`meta.rol` y la guardia; exponer el gancho de «sesión iniciada» (FR-009)

## Fase 6: Cierre

- [ ] T013 [FE] `npm run lint`, `type-check`, `test`, `build` en verde; README: sesión y mock de auth
- [ ] T014 [FE] Fila de HU-14 en `backlog.md`: Spec y Estado = Hecha; commit `HU-14: acceso y sesión`; avisar «HU-14 terminada. Haz push a sprint/03»
- [ ] T015 [MANUAL] Cuando el backend de HU-13 esté desplegado, probar el flujo contra la API real (rebajar el mock si el contrato difiere)

## Dependencias

T001 → T002 → (T003–T004) → T005–T008 → T009–T012 → T013–T014. T014 no cierra la HU si T015 sigue pendiente: queda «En progreso» hasta que la desarrolladora lo confirme.
