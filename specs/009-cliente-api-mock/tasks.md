# Tareas: Cliente de API tipado y servidor mock (HU-9)

**Entrada**: `specs/009-cliente-api-mock/` (spec.md, plan.md, research.md, data-model.md, quickstart.md, contratos/openapi.json)
**Pruebas**: incluidas, primero (deben fallar antes de implementar). Principio VI.
**Etiquetas**: `[FE]` código de este repo · `[CI]` automatización · `[MANUAL]` solo la desarrolladora. Esta HU no tiene tareas `[MANUAL]`.
**Historias**: US1 cliente tipado regenerable (P1) · US2 mock (P1) · US3 cliente con URL de ambiente (P2)
**Regla**: `specs/009-cliente-api-mock/contratos/openapi.json` no se edita ni se regenera en ninguna tarea.

## Fase 1: Preparación

- [ ] T001 [FE] Confirmar que las HU-7 y HU-8 están hechas (existen `src/compartido/lib/index.ts` con `leerEntorno`, `.env.development` con `http://localhost:4010` y los cuatro scripts de verificación) y que `specs/009-cliente-api-mock/contratos/openapi.json` existe sin cambios (`git status`); si falta algo, detenerse y avisar
- [ ] T002 [FE] Instalar `npm install openapi-fetch` y `npm install -D openapi-typescript` en `package.json` (si el gestor protesta por peers, detenerse; no usar `--force`)
- [ ] T003 [FE] Verificar la licencia de `openapi-fetch`, `openapi-typescript` y de todas sus dependencias transitivas (`npm ls --all --parseable` + campo `license` de cada `package.json`) y completar la tabla de `specs/009-cliente-api-mock/plan.md`; si alguna no es libre, detener la HU
- [ ] T004 [P] [FE] Incluir `mock/**/*.ts` en `tsconfig.node.json` con `allowImportingTsExtensions` y `erasableSyntaxOnly`; en `eslint.config.js` ignorar `src/compartido/api/generado/` y tratar `mock/` como código fuera de las capas con las reglas de TypeScript pero sin las reglas FSD; ejecutar `npm run lint` y `npm run type-check` sin errores

## Fase 2: Base

- [ ] T005 [FE] Añadir en `package.json` los scripts `"api:generar": "openapi-typescript specs/009-cliente-api-mock/contratos/openapi.json -o src/compartido/api/generado/esquema.d.ts"` y `"mock": "node mock/iniciar.ts"`
- [ ] T006 [P] [FE] Crear `.gitattributes` con `src/compartido/api/generado/** linguist-generated=true`

## Fase 3: Historia 1 — Cliente tipado que se regenera con un comando (P1) 🎯 MVP

**Meta**: tipos generados, versionados y siempre al día.
**Prueba independiente**: `npm run api:generar` no produce diferencias; las pruebas de `tests/api/` pasan.

- [ ] T007 [US1] [FE] Escribir primero `tests/api/esquema-actualizado.test.ts`: ejecuta `node_modules/.bin/openapi-typescript` sobre el contrato hacia un archivo temporal (`os.tmpdir()`) y exige que sea idéntico a `src/compartido/api/generado/esquema.d.ts`, y que éste empiece con la cabecera de archivo generado; comprobar que falla (el archivo no existe)
- [ ] T008 [P] [US1] [FE] Escribir primero `tests/api/regeneracion.test.ts`: con un contrato malformado en un directorio temporal, el comando termina con código distinto de cero, su salida de error es legible y no crea el archivo de salida (escenario 4)
- [ ] T009 [US1] [FE] Ejecutar `npm run api:generar` para crear `src/compartido/api/generado/esquema.d.ts`; comprobar que contiene `paths` con `/salud`, `/salud/base`, `/tiendas/{codigo}` y `components` con `EstadoSalud`, `EstadoBaseDatos`, `Tienda` y `ProblemDetails`; ejecutar de nuevo y confirmar que `git diff` no muestra cambios (SC-001)
- [ ] T010 [US1] [FE] Ejecutar T007 y T008 en verde

**Punto de control**: historia 1 funcional.

## Fase 4: Historia 2 — Servidor mock que responde como el contrato (P1)

**Meta**: `npm run mock` responde `/salud`, `/salud/base` y `/tiendas/{codigo}` sin backend.
**Prueba independiente**: `curl localhost:4010/salud` y las pruebas de `tests/api/mock-*`.

- [ ] T011 [US2] [FE] Escribir primero `tests/api/mock-respuestas.test.ts`: `responder('GET','/salud')` → 200 `{estado:'ok'}`; `/salud/base` → 200; `/tiendas/MEX` → 200 con `codigo`, `nombre`, `moneda`; `/tiendas/mex` → 400 y `/tiendas/XYZ` → 404, ambos con `type`, `title`, `status`, `codigo`, `idCorrelacion` (estado y `status` coinciden); `/otra` → 404 con formato de problema; método distinto de GET → 404; comprobar que falla
- [ ] T012 [P] [US2] [FE] Escribir primero `tests/api/mock-cobertura.test.ts`: lee `contratos/openapi.json`, recorre cada ruta y método, sustituye `{codigo}` por `MEX` y exige respuesta 200 de `responder`; el mensaje de fallo nombra la operación sin cubrir (`operationId`); comprobar que falla
- [ ] T013 [P] [US2] [FE] Escribir primero `tests/api/mock-servidor.test.ts`: `iniciarServidor(0)` escucha en un puerto libre; `fetch` a `/salud` da 200, `application/json` y cabecera `access-control-allow-origin`; `OPTIONS` da 204; un segundo servidor en el mismo puerto rechaza con un mensaje en español que menciona el puerto y `MOCK_PUERTO`; comprobar que falla
- [ ] T014 [US2] [FE] Crear `mock/respuestas.ts` con `responder(metodo, ruta)` pura: valores de `data-model.md`, cada cuerpo con `satisfies` sobre los tipos de `components`/`paths` de `src/compartido/api/generado/esquema.d.ts`, `idCorrelacion` con `crypto.randomUUID()`
- [ ] T015 [US2] [FE] Crear `mock/servidor.ts` con `iniciarServidor(puerto)` (`node:http`): respuestas JSON (`application/problem+json` en errores), cabeceras CORS de desarrollo, `OPTIONS` → 204 y error claro si el puerto está ocupado
- [ ] T016 [US2] [FE] Crear `mock/iniciar.ts`: lee `MOCK_PUERTO` (por defecto 4010), arranca el servidor e imprime en español la dirección y las rutas disponibles
- [ ] T017 [US2] [FE] Ejecutar T011–T013 en verde; arrancar `npm run mock` y comprobar con `curl` las cinco respuestas de `quickstart.md` §2; detener el proceso

**Punto de control**: historias 1 y 2.

## Fase 5: Historia 3 — Cliente configurado con la URL del ambiente (P2)

**Meta**: `crearClienteApi()` listo para las pantallas.
**Prueba independiente**: pruebas de `src/compartido/api/` y `tests/api/cliente-mock.test.ts`.

- [ ] T018 [P] [US3] [FE] Escribir primero `src/compartido/api/cliente.test.ts`: con `fetch` simulado, `crearClienteApi()` pide a la URL de `leerEntorno()` (fijar `VITE_API_URL` con `vi.stubEnv`), `crearClienteApi('http://x:1')` usa la explícita y una URL `/api` produce `/api/salud`; con `expectTypeOf` verificar el tipo de `data.estado` (string) y de `error.codigo`/`error.idCorrelacion`; con un `fetch` que rechaza, la llamada rechaza (el fallo de red no se oculta); comprobar que falla
- [ ] T019 [P] [US3] [FE] Escribir primero `tests/api/cliente-mock.test.ts`: arranca `iniciarServidor(0)` en `beforeAll` y cierra en `afterAll`; `GET /salud` devuelve `data.estado === 'ok'`; `GET /tiendas/{codigo}` con `XYZ` devuelve `error.codigo === 'tienda_no_encontrada'` y `response.status === 404`, y con `mex` devuelve 400; comprobar que falla
- [ ] T020 [US3] [FE] Crear `src/compartido/api/cliente.ts` con `crearClienteApi(urlBase = leerEntorno().urlApi)` basado en `createClient<paths>` de `openapi-fetch`, y `src/compartido/api/index.ts` que exporta `crearClienteApi` y los tipos `paths` y `components`; eliminar `src/compartido/api/.gitkeep`
- [ ] T021 [US3] [FE] Ejecutar T018–T019 en verde y `npm run type-check`

**Punto de control**: las tres historias.

## Fase 6: Cierre

- [ ] T022 [P] [FE] Añadir a `README.md` la sección «Cliente de API y mock»: `npm run api:generar`, `npm run mock` (puerto 4010 y `MOCK_PUERTO`), trabajo con `npm run dev` en dos terminales y el procedimiento de actualización del contrato (quickstart §5)
- [ ] T023 [FE] Ejecutar `npm run lint`, `npm run type-check`, `npm run test` y `npm run build`; comprobar que `grep -ril "tienda_no_encontrada" dist` no devuelve nada (FR-011) ; probar SC-004: renombrar temporalmente `estado` en `src/compartido/api/generado/esquema.d.ts` y comprobar que `npm run type-check` falla en `mock/respuestas.ts`, luego `git checkout` del archivo; recorrer `specs/009-cliente-api-mock/quickstart.md`
- [ ] T024 [FE] Actualizar la fila de HU-9 en `docs/scrum/backlog.md` (Spec = `specs/009-cliente-api-mock`, Estado = Hecha)
- [ ] T025 [FE] Commit `HU-9: cliente de API tipado y servidor mock` en `sprint/02` y detenerse; la desarrolladora hace el push

## Dependencias y orden

- HU-7 y HU-8 completas → T001–T006 → historias.
- US1 primero (MVP; el mock y el cliente necesitan los tipos generados). US2 depende de T009. US3 depende de T009 y T015 (T019) y de `leerEntorno` (HU-8).
- T018 y T019 pueden ir en paralelo; T024 depende de T023.

## Ejemplo de paralelismo

```text
T007 + T008 (US1)      T011 + T012 + T013 (US2)      T018 + T019 (US3)
```

## Estrategia

MVP = US1 (tipos regenerables). Luego mock (US2) y cliente (US3). Un solo commit al final.
