# Plan de implementación: Cliente de API tipado y servidor mock (HU-9)

**Rama**: `sprint/02` · **Fecha**: 2026-11-11 · **Spec**: [spec.md](./spec.md) · **Depende de**: HU-7 y HU-8

## Resumen

Generar los tipos del cliente desde `contratos/openapi.json` con `openapi-typescript` (comando `npm run api:generar`), llamar a la API con `openapi-fetch` usando la URL del ambiente (HU-8), y ofrecer un mock sin dependencias hecho con `node:http` que responde las tres operaciones del contrato con las respuestas tipadas por los tipos generados. Pruebas automáticas aseguran que los tipos versionados corresponden al contrato y que el mock cubre cada operación. Decisiones en [research.md](./research.md).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5.9.x sobre Node 24 (el mock usa la ejecución nativa de TypeScript de Node ≥ 22.18)
**Dependencias principales nuevas**: `openapi-fetch` (producción), `openapi-typescript` (desarrollo)
**Almacenamiento**: N/A
**Pruebas**: Vitest (heredado). Pruebas en `src/compartido/api/` y `tests/api/`
**Plataforma de destino**: navegador (cliente) y Node (mock y generación)
**Tipo de proyecto**: aplicación web de un solo paquete + herramienta local `mock/`
**Metas de rendimiento**: regenerar < 1 min; mock listo < 5 s; `/salud` < 1 s (SC-001/002)
**Restricciones**: contrato de solo lectura; mock fuera del bundle; solo software libre
**Escala/Alcance**: 3 operaciones, 4 esquemas

## Licencias de dependencias nuevas (principio VIII)

Consulta al registro de npm el 2026-11-11; el árbol transitivo se revisa en T003.

| Paquete | Uso | Licencia |
|---|---|---|
| openapi-fetch | cliente HTTP tipado (producción) | MIT |
| openapi-typescript-helpers (transitiva de openapi-fetch) | tipos auxiliares | MIT (a confirmar en T003) |
| openapi-typescript | generación de tipos (desarrollo) | MIT |
| @redocly/openapi-core y otras transitivas de openapi-typescript | lectura del contrato | a confirmar en T003 (se esperan MIT) |

Alternativas evaluadas y no instaladas: Prism (Apache-2.0), MSW (MIT). Si T003 halla una licencia no libre, se detiene la HU y se avisa.

## Verificación de la constitución

| Principio | Estado | Nota |
|---|---|---|
| I. FSD | Cumple | Cliente en `compartido/api` con `index.ts`; el mock fuera de `src/`; el lint de HU-7 aplica |
| II. Contrato primero | Cumple | Núcleo de la HU: tipos generados, nada a mano, copia en `contratos/` intacta |
| III. Precio del backend | Cumple | El contrato no tiene precios; el cliente no calcula ni envía |
| V. Sesión segura | N/A | Sin sesión (HU-14) |
| VI. Pruebas | Cumple | Pruebas primero; corren en CI |
| VIII. Software libre | Cumple | Tabla anterior |
| IX. Secretos y entornos | Cumple | Usa `VITE_API_URL` (HU-8); el mock no tiene secretos |
| X. Idioma | Cumple | Mensajes, docs y nombres en español |
| XI. Ramas | Cumple | `sprint/02`; un commit por HU |

**Re-evaluación tras el diseño**: sin violaciones.

## Estructura

```text
specs/009-cliente-api-mock/
├── contratos/openapi.json   # copia del backend v0.4.0 (NO editar)
├── spec.md  plan.md  research.md  data-model.md  quickstart.md
├── checklists/requirements.md
└── tasks.md
```

Código:

```text
mock/
├── respuestas.ts        # responder(metodo, ruta) → { estado, cuerpo }  (pura, tipada)
├── servidor.ts          # iniciarServidor(puerto) con node:http + CORS de desarrollo
└── iniciar.ts           # punto de entrada: puerto 4010 (o MOCK_PUERTO)
src/compartido/api/
├── generado/esquema.d.ts   # GENERADO (npm run api:generar); no se edita
├── cliente.ts              # crearClienteApi(urlBase = leerEntorno().urlApi)
├── cliente.test.ts         # URL por defecto/explícita y tipos (expectTypeOf)
└── index.ts                # interfaz pública del segmento
tests/api/
├── esquema-actualizado.test.ts
├── regeneracion.test.ts        # contrato malformado
├── mock-respuestas.test.ts
├── mock-cobertura.test.ts
├── mock-servidor.test.ts
└── cliente-mock.test.ts        # cliente real contra el mock
.gitattributes                  # esquema.d.ts marcado como generado
package.json                    # scripts api:generar y mock
tsconfig.node.json, eslint.config.js   # incluyen mock/; ignoran generado/
```

**Decisión de estructura**: sigue la HU-7. El archivo generado se versiona para que CI no necesite regenerar; una prueba garantiza que no se desfase.

## Contrato de la interfaz pública del segmento `compartido/api`

- `crearClienteApi(urlBase?: string)`: devuelve un cliente de `openapi-fetch` tipado con `paths`; sin argumento usa `leerEntorno().urlApi`.
- Reexporta los tipos `paths` y `components` del esquema generado para que otras capas no importen el archivo interno.

## Riesgos

- **R-1**: el contrato cambia y el mock se queda atrás ⇒ `satisfies` + prueba de cobertura (T012).
- **R-2**: ejecución nativa de TypeScript en Node no admite `enum`, `namespace` ni parámetros con propiedades ⇒ activar `erasableSyntaxOnly` en `tsconfig.node.json` (T004).
- **R-3**: `openapi-typescript` con peer `typescript ^5.x` ⇒ TypeScript 5.9 fijado en HU-7.
- **R-4**: la regla de capas de la HU-7 puede marcar `mock/` como archivo desconocido ⇒ configurar `mock/` fuera de las capas en `eslint.config.js` (T004).

## Seguimiento de complejidad

Sin violaciones que justificar.
