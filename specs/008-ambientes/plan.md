# Plan de implementación: Ambientes de desarrollo, prueba y producción (HU-8)

**Rama**: `sprint/02` · **Fecha**: 2026-11-11 · **Spec**: [spec.md](./spec.md) · **Depende de**: HU-7

## Resumen

Usar los modos nativos de Vite para tres ambientes con `.env.development`, `.env.test` y `.env.production`, cada uno con `VITE_API_URL` distinta. Una función pura `leerEntorno` valida y normaliza la URL; pruebas automáticas garantizan que las URL difieren y que no hay variables sin prefijo ni secretos. Sin dependencias nuevas. Decisiones en [research.md](./research.md).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 6.0.x sobre Node 24 (heredado de HU-7)
**Dependencias principales**: Vite (`loadEnv`, modos) y Vitest, ya instalados por HU-7. **Ninguna dependencia nueva.**
**Almacenamiento**: N/A
**Pruebas**: Vitest; pruebas de unidad en `src/compartido/lib/` y de configuración en `tests/ambientes/`
**Plataforma de destino**: navegador (valores en tiempo de construcción) y Node (pruebas)
**Tipo de proyecto**: aplicación web de un solo paquete
**Metas de rendimiento**: N/A (lectura de configuración instantánea)
**Restricciones**: variables solo con prefijo `VITE_`, sin secretos (principio IX); repositorio público
**Escala/Alcance**: una variable pública hoy

## Licencias (principio VIII)

Sin dependencias nuevas. Se usan `vite` (MIT) y `vitest` (MIT), ya verificadas en la HU-7.

## Verificación de la constitución

| Principio | Estado | Nota |
|---|---|---|
| I. FSD | Cumple | `leerEntorno` en `compartido/lib` con `index.ts`; el lint de la HU-7 lo valida |
| II. Contrato primero | N/A | HU-9 consume la URL |
| III. Precio del backend | N/A | |
| V. Sesión segura | Cumple | No se guardan tokens |
| VI. Pruebas | Cumple | Pruebas primero; corren en CI (HU-10) |
| VIII. Software libre | Cumple | Sin dependencias nuevas |
| IX. Secretos y entornos | Cumple | Núcleo de la HU: tres archivos, prefijo `VITE_`, prueba anti-secretos |
| X. Idioma | Cumple | Mensajes y docs en español |
| XI. Ramas | Cumple | `sprint/02`, un commit por HU |

**Re-evaluación tras el diseño**: sin violaciones.

## Estructura

```text
specs/008-ambientes/{spec.md, plan.md, research.md, quickstart.md, checklists/requirements.md, tasks.md}
```
Sin `data-model.md` ni `contratos/` (no hay datos ni interfaces externas; el contrato de las variables está en la tabla D3 de research.md).

Código afectado en la raíz:

```text
.env.development  .env.test  .env.production     # nuevos
vite.config.ts                                   # envPrefix explícito
package.json                                     # script build:test
README.md                                        # sección «Ambientes»
src/vite-env.d.ts                                # tipo de ImportMetaEnv
src/compartido/lib/
├── entorno.ts            # leerEntorno
├── entorno.test.ts
└── index.ts              # interfaz pública del segmento
tests/ambientes/
├── valores-por-ambiente.test.ts
├── sin-secretos.test.ts
├── permitidas.ts         # claves públicas justificadas (vacía)
└── solo-vite.test.ts
```

## Contrato de la función `leerEntorno`

- Entrada: objeto con `VITE_API_URL` (por defecto `import.meta.env`).
- Salida: `{ urlApi: string }`, sin barra final (`/api/` → `/api`).
- Errores (`Error`, en español, con el nombre `VITE_API_URL` y la pista «revisa el archivo `.env.<ambiente>`»): ausente, vacía, formato inválido. Formatos válidos: `http://…`, `https://…` o ruta que empieza por `/`.

## Riesgos

- **R-1**: la ruta `/api` de producción depende de que el proxy retire el prefijo (spec 000, punto abierto). Mitigación: documentado en research D3; se resuelve en HU-25.
- **R-2**: la prueba anti-secretos puede dar falsos positivos con nombres como `VITE_API_KEY_PUBLICA`. Hay casos legítimos futuros (clave pública VAPID, clave publicable de Stripe). Mitigación: lista explícita y justificada `tests/ambientes/permitidas.ts` (vacía hoy), el mensaje explica el criterio y los patrones viven en un único archivo.

## Seguimiento de complejidad

Sin violaciones que justificar.
