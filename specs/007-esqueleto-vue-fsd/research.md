# Investigación: HU-7 Esqueleto con capas (Fase 0)

Fecha de consulta de versiones y licencias: 2026-11-11 (registro público de npm). Las versiones exactas se fijan al instalar.

## D1. Herramienta de reglas de importación

- **Decisión**: `eslint-plugin-boundaries` (MIT), regla `boundaries/dependencies` con política `default: disallow`.
- **Razón**: se ejecuta dentro de `npm run lint` (criterio de la historia y principio I: «ESLint hace cumplir estas reglas»); acepta nombres de capa arbitrarios, así que sirve con las capas en español; permite capturar el slice de cada ruta (`paginas/<slice>`) para prohibir imports entre slices de la misma capa; permite categorizar archivos (`index.ts` = interfaz pública) para exigir el acceso por `index.ts`.
- **Alternativas libres evaluadas**:
  - `@conarti/eslint-plugin-feature-sliced` (ISC): reglas ya hechas de FSD, pero sus nombres de capa son los ingleses (`features`, `shared`…); habría que configurar equivalencias y su cobertura de «slice hermano» es menor. Descartada por el idioma.
  - Steiger (linter oficial de FSD): no corre dentro de ESLint, añade un segundo comando y no cumple «npm run lint falla»; el registro de npm no mostró metadatos de licencia en la consulta. Descartada.
  - `no-restricted-paths` de `eslint-plugin-import-x` (MIT): sirve para zonas, pero no captura slices ni la regla de `index.ts` sin muchas reglas manuales. Descartada.
- **Riesgo**: la versión 7 renombró las reglas (`boundaries/dependencies` sustituye a `element-types`/`entry-point`); la sintaxis exacta de políticas se confirma con las pruebas en rojo (T018–T020) antes de escribir la configuración.

## D2. Resolución de alias en el lint

- **Decisión**: alias `@` → `src` en Vite y TypeScript, y `eslint-import-resolver-typescript` (ISC) para que las reglas vean las importaciones por alias igual que las relativas (caso límite de la spec).
- **Razón**: sin resolutor, las importaciones por alias quedarían sin evaluar y las reglas serían eludibles.
- **Alternativa**: solo rutas relativas; descartada por legibilidad (`../../../entidades/...`).

## D3. Versión de TypeScript

- **Decisión**: `typescript` 5.9.x (Apache-2.0), no la 6.x ni la 7.x.
- **Razón**: `typescript-eslint` 8.x declara `typescript <6.1.0` como peer y `openapi-typescript` (HU-9) declara `typescript ^5.x`; con 6.x o 7.x `npm install` fallaría o forzaría `--legacy-peer-deps`. `vue-tsc` y `vue-router` aceptan 5.x. Se revisa cuando `openapi-typescript` amplíe su peer.

## D4. Pruebas

- **Decisión**: Vitest (MIT) + `@vue/test-utils` (MIT) + `jsdom` (MIT).
- **Razón**: es la herramienta estándar del ecosistema de Vite/Vue; comparte configuración con Vite (modo `test` ya existe para HU-8); `@vue/test-utils` es el montador oficial de componentes.
- **Alternativas**: Jest (necesita transformadores extra para Vite/ESM), Playwright component testing (más pesado; las pruebas de punta a punta son de la HU-42).

## D4b. Cómo se prueba que el lint falla

- **Decisión**: prueba de Vitest que usa la API de ESLint (`new ESLint({ cwd })`) sobre un árbol temporal con las seis capas y la configuración real (`eslint.config.js`), y comprueba `ruleId` y mensaje.
- **Razón**: automatiza el criterio de la historia sin dejar archivos «malos» en `src/` y sin que `npm run lint` del repo falle.
- **Alternativa**: fixtures versionados bajo `tests/`; descartada porque el lint del repo tendría que ignorarlos y se ocultarían de la regla.

## D5. Estilos

- **Decisión**: Tailwind CSS 4 con `@tailwindcss/vite` (MIT).
- **Razón**: lo exige la constitución; v4 se configura en CSS y no necesita PostCSS aparte.

## D6. Versión de Node

- **Decisión**: Node 24 LTS (`.nvmrc` = 24; `engines: ">=24"`).
- **Razón**: cumple los mínimos de Vite 8 (`^20.19 || >=22.12`) y Vitest 5; HU-9 usa ejecución nativa de TypeScript en Node (≥ 22.18); HU-10 reutiliza `.nvmrc`. El equipo local usa una versión más nueva, compatible.

## D7. Pinia, Router y estado

- **Decisión**: `pinia` (MIT) registrado en `aplicacion`; `vue-router` (MIT) con historial HTML5 (`createWebHistory`).
- **Razón**: lo exige la historia. No se crea una tienda de ejemplo con datos; el registro basta (FR-012).

## D8. Ubicación de pruebas

- **Decisión**: pruebas junto al código (`*.test.ts`) para unidades y componentes, y `tests/arquitectura/` para las pruebas de las reglas FSD.
- **Razón**: Vitest las descubre por defecto; las de arquitectura no pertenecen a ningún slice.
