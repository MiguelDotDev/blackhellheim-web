# Investigación: HU-9 Cliente de API y mock (Fase 0)

Consulta de versiones y licencias: 2026-11-11 (registro público de npm).

## D1. Generación de tipos desde OpenAPI

- **Decisión**: `openapi-typescript` 7.x (MIT), instalado como dependencia de desarrollo. Comando: `npm run api:generar` → `openapi-typescript specs/009-cliente-api-mock/contratos/openapi.json -o src/compartido/api/generado/esquema.d.ts`.
- **Razón**: solo genera tipos (cero código de ejecución), soporta OpenAPI 3.1 (el contrato es 3.1.1), salida determinista y sencilla de revisar en un diff.
- **Alternativas libres**: `orval` y `openapi-generator` (clientes completos con más código generado y, el segundo, necesita Java); `@hey-api/openapi-ts` (MIT; genera servicios, más superficie que mantener). Descartadas por tamaño y por la regla de no escribir ni generar de más.
- **Compatibilidad**: declara `typescript ^5.x` como peer ⇒ el proyecto fija TypeScript 5.9 (HU-7, D3).

## D2. Cliente en tiempo de ejecución

- **Decisión**: `openapi-fetch` 0.17 (MIT), `createClient<paths>({ baseUrl })`, sobre `fetch` nativo.
- **Razón**: pareja oficial de `openapi-typescript`; ~6 kB; da `data` y `error` tipados según el contrato (incluye los `application/problem+json`), sin lógica propia.
- **Alternativa**: `axios` + tipos a mano, descartada por el principio II.

## D3. Servidor mock

- **Decisión**: servidor propio mínimo con `node:http`, sin dependencias, ejecutado con el soporte nativo de TypeScript de Node (`node mock/iniciar.ts`; requiere Node ≥ 22.18, el proyecto usa 24). Respuestas tipadas con los tipos generados mediante `satisfies`, de modo que si el contrato cambia, `npm run type-check` falla.
- **Razón**: 0 dependencias y 0 riesgo de licencia (principio VIII); valores con sentido (el contrato solo fija formas); la lógica de respuesta es una función pura fácil de probar.
- **Alternativas libres evaluadas**:
  - Prism (`@stoplight/prism-cli`, Apache-2.0): deriva todo del contrato, pero devuelve `"string"` como valor de ejemplo (el contrato no trae ejemplos y no se edita) y su árbol de dependencias es grande.
  - MSW (`msw`, MIT): excelente para pruebas, pero sirve interceptando en proceso o con un service worker; el service worker chocaría con el de la PWA (HU-39) y no levanta un puerto propio.
- **Riesgo**: el mock puede quedarse atrás del contrato; mitigado con `satisfies` y la prueba de cobertura por operación (T012).

## D4. Dónde viven los archivos

- Tipos generados y cliente: `src/compartido/api/` (segmento `api` de la capa `compartido`, FSD). El cliente usa `leerEntorno` de `src/compartido/lib` (HU-8).
- Mock: carpeta `mock/` en la raíz (herramienta de desarrollo, fuera de `src/`, por tanto fuera del bundle de producción; FR-011).
- Pruebas que tocan el mock: `tests/api/` (para no importar desde `src/` hacia fuera de `src/`).

## D5. Origen cruzado (CORS)

- **Decisión**: el mock responde `Access-Control-Allow-Origin: *` y atiende `OPTIONS` con 204, solo porque es herramienta de desarrollo local sin datos reales. La aplicación corre en `http://localhost:5173` y el mock en `4010`.
- **Producción**: no aplica; se usa mismo origen (`/api`, HU-8).

## D6. Prueba de «tipos al día»

- **Decisión**: prueba de Vitest que ejecuta el binario `openapi-typescript` hacia un archivo temporal y compara byte a byte con `src/compartido/api/generado/esquema.d.ts`.
- **Razón**: usa exactamente el mismo camino que `npm run api:generar` (misma cabecera y formato) y corre en CI (HU-10).
- **Alternativa**: API programática (`openapiTS`); su salida puede diferir en cabecera/formato de la del comando.
