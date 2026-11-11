# Tareas: Ambientes de desarrollo, prueba y producción (HU-8)

**Entrada**: `specs/008-ambientes/` (spec.md, plan.md, research.md, quickstart.md)
**Pruebas**: incluidas, primero (deben fallar antes de implementar). Principio VI.
**Etiquetas**: `[FE]` código de este repo · `[CI]` automatización · `[MANUAL]` solo la desarrolladora. Esta HU no tiene tareas `[MANUAL]`.
**Historias**: US1 URL por ambiente (P1) · US2 solo públicas y sin secretos (P1) · US3 error claro (P2)

## Fase 1: Preparación

- [X] T001 [FE] Confirmar que la HU-7 está hecha (existen `package.json`, `vite.config.ts`, `src/vite-env.d.ts`, `.gitignore` con `.env*.local` y los scripts `lint`, `type-check`, `test`, `build`); si falta algo, detenerse y avisar (dependencia)

## Fase 2: Base

- [X] T002 [FE] Declarar en `src/vite-env.d.ts` la interfaz `ImportMetaEnv` con `readonly VITE_API_URL: string` y `ImportMeta` con `readonly env: ImportMetaEnv`

## Fase 3: Historia 1 — La URL del API cambia según el ambiente (P1) 🎯 MVP

**Meta**: tres ambientes, tres URL distintas, sin tocar código.
**Prueba independiente**: pruebas de valores + construcción en dos modos.

- [X] T003 [US1] [FE] Escribir primero `src/compartido/lib/entorno.test.ts`: `leerEntorno({ VITE_API_URL: 'http://localhost:4010/' })` devuelve `{ urlApi: 'http://localhost:4010' }`; acepta `https://…` y rutas `/api`; en el modo de pruebas `leerEntorno()` devuelve `http://localhost:5068` (lee `.env.test`); comprobar que falla
- [X] T004 [P] [US1] [FE] Escribir primero `tests/ambientes/valores-por-ambiente.test.ts`: con `loadEnv` de Vite sobre la raíz, `VITE_API_URL` es `http://localhost:4010` en `development`, `http://localhost:5068` en `test` y `/api` en `production`, y los tres son distintos; comprobar que falla
- [X] T005 [US1] [FE] Crear `.env.development` (`VITE_API_URL=http://localhost:4010`), `.env.test` (`VITE_API_URL=http://localhost:5068`) y `.env.production` (`VITE_API_URL=/api`), cada uno con un comentario en español sobre el ambiente y sin otras variables
- [X] T006 [US1] [FE] Crear `src/compartido/lib/entorno.ts` con `leerEntorno` (devuelve `{ urlApi }` sin barra final) y `src/compartido/lib/index.ts` que lo exporta; eliminar `src/compartido/lib/.gitkeep`
- [X] T007 [US1] [FE] Añadir el script `"build:test": "vue-tsc --build && vite build --mode test"` en `package.json`
- [X] T008 [US1] [FE] Ejecutar `npm run build` y `npm run build:test` y confirmar que ambos terminan bien; ejecutar T003–T004 en verde

**Punto de control**: historia 1 funcional.

## Fase 4: Historia 2 — Solo variables públicas y sin secretos (P1)

**Meta**: nada sin prefijo llega a la app y nada secreto vive en los archivos.
**Prueba independiente**: pruebas de `tests/ambientes/`.

- [X] T009 [P] [US2] [FE] Escribir primero `tests/ambientes/sin-secretos.test.ts`: parsea los tres `.env.*` (ignora comentarios, comillas y espacios) y falla si algún nombre no empieza por `VITE_`, si coincide con `SECRET|SECRETO|TOKEN|PASSWORD|PASSWD|CLAVE|CONTRASE|KEY|CREDENCIAL` (sin distinguir mayúsculas), salvo los nombres de una lista explícita de claves públicas justificadas en `tests/ambientes/permitidas.ts` (vacía hoy; la usarán, por ejemplo, la clave pública VAPID o la publicable de Stripe), o si algún valor contiene credenciales incrustadas (`://usuario:clave@`); incluye casos sintéticos (cadenas en memoria) que deben ser detectados y un caso válido que no; y comprueba que `.gitignore` contiene `.env*.local`; los mensajes nombran archivo y variable
- [X] T010 [P] [US2] [FE] Escribir primero `tests/ambientes/solo-vite.test.ts`: con `process.env.SECRETO_DE_PRUEBA = 'x'` y un `loadEnv(modo, raíz, 'VITE_')` para `development`, `test` y `production`, todas las claves devueltas empiezan por `VITE_` y ninguna es `SECRETO_DE_PRUEBA`
- [X] T011 [US2] [FE] Fijar `envPrefix: 'VITE_'` explícito en `vite.config.ts` con un comentario en español que remita al principio IX
- [X] T012 [US2] [FE] Ejecutar `npm run test -- tests/ambientes` y corregir hasta que T009–T010 pasen sin debilitar las pruebas

**Punto de control**: historias 1 y 2.

## Fase 5: Historia 3 — Error claro si la configuración falta o es inválida (P2)

**Meta**: falla inmediata y comprensible.
**Prueba independiente**: casos de error de `entorno.test.ts`.

- [X] T013 [US3] [FE] Añadir en `src/compartido/lib/entorno.test.ts` los casos de error: ausente, cadena vacía, solo espacios, `ftp://x`, `api` (sin barra inicial); cada uno espera un `Error` cuyo mensaje contiene `VITE_API_URL` y los formatos válidos; comprobar que fallan
- [X] T014 [US3] [FE] Implementar las validaciones en `src/compartido/lib/entorno.ts` (mensajes en español, con la pista «revisa el archivo `.env.<ambiente>`») y ejecutar T003 y T013 en verde

**Punto de control**: las tres historias.

## Fase 6: Cierre

- [X] T015 [P] [FE] Añadir a `README.md` la sección «Ambientes»: tabla de los tres ambientes (archivo, valor, para qué sirve), comandos (`npm run dev`, `npm run test`, `npm run build`, `npm run build:test`), uso de `.env.development.local` para valores personales y la regla de «nada secreto en `VITE_*`»
- [X] T016 [FE] Ejecutar `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` y corregir hasta que pasen; recorrer `specs/008-ambientes/quickstart.md`
- [X] T017 [FE] Actualizar la fila de HU-8 en `docs/scrum/backlog.md` (Spec = `specs/008-ambientes`, Estado = Hecha)
- [X] T018 [FE] Commit `HU-8: ambientes de desarrollo, prueba y producción` en `sprint/02` y detenerse; la desarrolladora hace el push

## Dependencias y orden

- HU-7 completa → T001 → T002 → historias.
- US1 primero (MVP). US2 depende de T005 (existen los archivos) y de `vite.config.ts` de HU-7. US3 depende de T006 (modifica `entorno.ts`).
- T015 puede ir en paralelo con US2/US3; T017 depende de T016.

## Ejemplo de paralelismo

```text
T003 + T004 (pruebas de US1)     T009 + T010 (pruebas de US2)
```

## Estrategia

MVP = US1. Luego US2 (segunda mitad del criterio de la historia) y US3. Un solo commit al final.
