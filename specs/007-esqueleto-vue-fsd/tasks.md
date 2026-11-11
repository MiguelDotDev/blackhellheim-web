# Tareas: Esqueleto de la aplicación web con capas ordenadas (HU-7)

**Entrada**: `specs/007-esqueleto-vue-fsd/` (spec.md, plan.md, research.md, quickstart.md)
**Pruebas**: incluidas, primero (deben fallar antes de implementar). Principio VI.
**Etiquetas**: `[FE]` código de este repo · `[CI]` automatización · `[MANUAL]` solo la desarrolladora. Esta HU no tiene tareas `[MANUAL]`.

## Formato: `[ID] [P?] [Historia] [Etiqueta] Descripción con ruta`

- **[P]**: se puede hacer en paralelo (archivos distintos, sin dependencia pendiente)
- **[US#]**: historia de la spec (US1 arranque, US2 capas, US3 reglas de lint, US4 navegación/estado/estilos)

## Fase 1: Preparación

- [ ] T001 [FE] Crear `.nvmrc` con `24` y `.gitignore` (`node_modules/`, `dist/`, `coverage/`, `.env*.local`, `*.tsbuildinfo`, `.claude/settings.json`, `.claude/settings.local.json`) en la raíz
- [ ] T002 [FE] Crear `package.json` con `"private": true`, `"type": "module"`, `"engines": {"node": ">=24"}` y scripts `dev` (`vite`), `build` (`vue-tsc --build && vite build`), `preview` (`vite preview`), `lint` (`eslint .`), `type-check` (`vue-tsc --build`), `test` (`vitest run`)
- [ ] T003 [FE] Instalar dependencias de producción en `package.json`: `npm install vue vue-router pinia`
- [ ] T004 [FE] Instalar dependencias de desarrollo en `package.json`: `npm install -D vite @vitejs/plugin-vue typescript@~5.9 vue-tsc tailwindcss @tailwindcss/vite eslint @eslint/js globals typescript-eslint eslint-plugin-vue eslint-plugin-boundaries eslint-import-resolver-typescript vitest @vue/test-utils jsdom @vue/tsconfig @types/node@24` (si el gestor protesta por peers, detenerse y avisar; no usar `--force`)
- [ ] T005 [FE] Verificar licencias de todo el árbol instalado (`npm ls --all --parseable` y leer el campo `license` de cada `package.json`, sin añadir dependencias) y anotar cualquier licencia no libre en `specs/007-esqueleto-vue-fsd/plan.md`; si hay alguna, detener la HU
- [ ] T006 [P] [FE] Crear `tsconfig.json` (referencias), `tsconfig.app.json` (extiende `@vue/tsconfig/tsconfig.dom.json`, `strict`, alias `@/*` → `src/*`, incluye `src/**/*`, `src/**/*.vue`) y `tsconfig.node.json` (incluye `vite.config.ts`, `eslint.config.js`, `tests/**/*`)

## Fase 2: Base (bloquea las historias)

- [ ] T007 [FE] Crear `vite.config.ts` con plugins `@vitejs/plugin-vue` y `@tailwindcss/vite`, alias `@` → `src`, y bloque `test` (`environment: 'jsdom'`, `include: ['src/**/*.test.ts', 'tests/**/*.test.ts']`)
- [ ] T008 [P] [FE] Crear `index.html` (`lang="es"`, título «BlackHellHeim», `<div id="app">`, script `/src/main.ts`)
- [ ] T009 [P] [FE] Crear `src/vite-env.d.ts` con `/// <reference types="vite/client" />` y la declaración de módulos `*.vue`

**Punto de control**: la configuración compila; falta contenido.

## Fase 3: Historia 1 — El proyecto se instala, arranca y se verifica (P1) 🎯 MVP

**Meta**: `npm run dev` muestra la marca y los cuatro comandos pasan.
**Prueba independiente**: copia limpia → `npm ci` + los cinco comandos terminan bien.

- [ ] T010 [US1] [FE] Escribir primero la prueba de humo `src/aplicacion/App.test.ts`: monta `App` con `@vue/test-utils` y espera un `h1` con el texto «BlackHellHeim»; ejecutar `npm run test` y comprobar que falla
- [ ] T011 [US1] [FE] Crear `src/aplicacion/App.vue` (muestra `<h1>BlackHellHeim</h1>`, texto en español)
- [ ] T012 [US1] [FE] Crear `src/main.ts` (monta `App`) y `src/aplicacion/index.ts` (reexporta `App`)
- [ ] T013 [US1] [FE] Ejecutar `npm run type-check`, `npm run test` y `npm run build` y corregir hasta que pasen (el lint se activa en T021)

**Punto de control**: historia 1 funcional.

## Fase 4: Historia 2 — Las capas existen y están nombradas en español (P1)

**Meta**: seis capas con nombres exactos, una página de ejemplo y la guía.
**Prueba independiente**: `ls src` y la prueba de estructura.

- [ ] T014 [US2] [FE] Escribir primero `tests/arquitectura/estructura.test.ts`: comprueba que `src/` contiene exactamente las carpetas `aplicacion`, `paginas`, `widgets`, `funcionalidades`, `entidades`, `compartido` y que `compartido` tiene `ui`, `lib` y `api`; comprobar que falla
- [ ] T015 [P] [US2] [FE] Crear `.gitkeep` en `src/widgets/`, `src/funcionalidades/`, `src/entidades/`, `src/compartido/ui/`, `src/compartido/lib/` y `src/compartido/api/`
- [ ] T016 [P] [US2] [FE] Escribir la guía `src/LEEME.md` en español: qué va en cada capa y segmento, regla de importación (solo hacia abajo, siempre por `index.ts`, sin slices hermanos) y 5 ejemplos (botón, regla de negocio, llamada a la API, pantalla, tipo del contrato)
- [ ] T017 [US2] [FE] Crear la página `src/paginas/inicio/ui/PaginaInicio.vue` y `src/paginas/inicio/index.ts`, el componente `src/compartido/ui/TituloMarca.vue` con su `src/compartido/ui/index.ts`, y hacer que `src/aplicacion/App.vue` muestre `PaginaInicio` importada por `@/paginas/inicio`; la prueba T010 debe seguir pasando

**Punto de control**: historias 1 y 2 funcionan.

## Fase 5: Historia 3 — El lint rechaza importaciones que rompen la arquitectura (P1)

**Meta**: `npm run lint` falla ante las tres violaciones, con mensaje claro.
**Prueba independiente**: las pruebas de `tests/arquitectura/reglas-fsd.test.ts`.

- [ ] T018 [US3] [FE] Escribir primero en `tests/arquitectura/reglas-fsd.test.ts` el ayudante que crea un árbol temporal con las seis capas, ejecuta `new ESLint({ cwd })` con el `eslint.config.js` real y devuelve los mensajes; y el caso «capa inferior importa de superior» (`entidades` → `widgets`) que espera error de `boundaries/dependencies` y un mensaje en español que nombre la capa de origen y la de destino (escenario 1, FR-009)
- [ ] T019 [US3] [FE] Añadir en el mismo archivo los casos «import de un interno de otro slice sin `index.ts`» (escenario 2) y «import por `index.ts` de una capa inferior» que no debe dar errores (escenario 3); incluir la variante con alias `@/` y una con ruta relativa larga
- [ ] T020 [US3] [FE] Añadir los casos «slice importa de otro slice de su misma capa» (escenario 4), «slice importa sus propios internos» sin errores (escenario 5), «importación solo de tipos» y «archivo nuevo fuera de las seis capas» (avisa); comprobar que todos los casos de T018–T020 fallan por no existir aún la configuración
- [ ] T021 [US3] [FE] Crear `eslint.config.js` (configuración plana): bases `@eslint/js`, `typescript-eslint` y `eslint-plugin-vue` (recomendadas), resolutor `eslint-import-resolver-typescript` apuntando a `tsconfig.app.json`, y las reglas FSD del plan: elementos por capa con slice capturado, categoría `interfaz-publica` (`**/index.ts`), políticas `default: disallow`, mensajes en español por regla (capa superior, salto del `index.ts`, mismo nivel); ignora `dist/` y `node_modules/`
- [ ] T022 [US3] [FE] Ejecutar `npm run test -- tests/arquitectura` y ajustar `eslint.config.js` hasta que pasen T018–T020 (sin debilitar las pruebas)
- [ ] T023 [US3] [FE] Ejecutar `npm run lint` sobre el repositorio y corregir hasta que pase sin avisos

**Punto de control**: historias 1–3; el criterio de aceptación de la HU queda demostrado.

## Fase 6: Historia 4 — Navegación, estado compartido y estilos de base (P2)

**Meta**: inicio y «no encontrada», estado registrado y estilos de base.
**Prueba independiente**: pruebas de enrutador, de la pantalla y de Pinia; revisión en navegador.

- [ ] T024 [P] [US4] [FE] Escribir primero `src/aplicacion/enrutador/enrutador.test.ts`: con historial en memoria, `/` resuelve a la página de inicio y `/no-existe` a la «no encontrada»; comprobar que falla
- [ ] T025 [P] [US4] [FE] Escribir primero `src/paginas/no-encontrada/ui/PaginaNoEncontrada.test.ts`: muestra «Página no encontrada» y un enlace «Volver al inicio» con `href="/"` (rol `link`); comprobar que falla
- [ ] T026 [P] [US4] [FE] Escribir primero `src/aplicacion/proveedores/pinia.test.ts`: tras instalar el proveedor en una app, `getActivePinia()` existe; comprobar que falla
- [ ] T027 [US4] [FE] Crear `src/paginas/no-encontrada/ui/PaginaNoEncontrada.vue` y `src/paginas/no-encontrada/index.ts`
- [ ] T028 [US4] [FE] Crear `src/aplicacion/enrutador/index.ts` con `createRouter`/`createWebHistory`, ruta `/` (inicio) y ruta comodín (no encontrada), ambas importadas por `index.ts` de sus slices
- [ ] T029 [P] [US4] [FE] Crear `src/aplicacion/proveedores/pinia.ts` que exporta la instancia de Pinia (sin tiendas de ejemplo y sin almacenamiento persistente)
- [ ] T030 [US4] [FE] Actualizar `src/aplicacion/App.vue` para renderizar `RouterView` y `src/main.ts` para registrar enrutador y Pinia; ajustar la prueba T010 para montar con el enrutador
- [ ] T031 [P] [US4] [FE] Crear `src/aplicacion/estilos/principal.css` con `@import "tailwindcss";` y estilos de base (fuente del sistema, foco visible, `lang="es"`) e importarlo desde `src/main.ts`
- [ ] T032 [US4] [FE] Elegir colores neutros de texto y fondo con relación de contraste ≥ 4.5:1 (calcular y anotar el valor en un comentario de `src/aplicacion/estilos/principal.css`) y aplicarlos en `PaginaInicio.vue` y `PaginaNoEncontrada.vue`

**Punto de control**: las cuatro historias funcionan.

## Fase 7: Cierre

- [ ] T033 [P] [FE] Crear `README.md` en español con requisitos (Node 24), comandos (`npm ci`, `npm run dev`, `lint`, `type-check`, `test`, `build`) y enlace a `src/LEEME.md`
- [ ] T034 [FE] Ejecutar `specs/007-esqueleto-vue-fsd/quickstart.md` completo en una copia limpia (`git clean`-equivalente en un directorio temporal) y confirmar SC-001, SC-002 y SC-004
- [ ] T035 [FE] Cuando `npm run lint`, `npm run type-check`, `npm run test` y `npm run build` pasen, actualizar la fila de HU-7 en `docs/scrum/backlog.md` (Spec = `specs/007-esqueleto-vue-fsd`, Estado = Hecha)
- [ ] T036 [FE] Commit `HU-7: esqueleto Vue con FSD` en `sprint/02` y detenerse; la desarrolladora hace el push (AGENTS.md)

## Dependencias y orden

- Preparación (T001–T006) → Base (T007–T009) → historias.
- US1 primero (MVP). US2 depende de US1 (reusa `App.vue`). US3 depende de US2 (necesita capas y `package.json`), y T021 depende de T006 y T004. US4 depende de US2 (páginas) y modifica `App.vue` de US2.
- Dentro de cada historia: pruebas (rojo) → implementación → verde.
- T035 depende de T013, T023 y T034.

## Ejemplo de paralelismo

```text
T024, T025, T026 (pruebas de US4, archivos distintos)
T015, T016 (carpetas y guía de US2)
```

## Estrategia

MVP = Fase 1 + 2 + US1. Después US2 → US3 (criterio central de la HU) → US4. Un solo commit al final (una HU, un commit).
