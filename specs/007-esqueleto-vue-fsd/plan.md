# Plan de implementación: Esqueleto de la aplicación web con capas ordenadas (HU-7)

**Rama**: `sprint/02` · **Fecha**: 2026-11-11 · **Spec**: [spec.md](./spec.md)
**Entrada**: especificación en `specs/007-esqueleto-vue-fsd/spec.md`

## Resumen

Crear desde cero (el repositorio solo tiene la semilla de SDD) el proyecto Vue 3 + TypeScript + Vite + Pinia + Vue Router + Tailwind con las seis capas FSD en español, y hacer cumplir la arquitectura con `eslint-plugin-boundaries` dentro de `npm run lint`. Las reglas se demuestran con pruebas de Vitest que ejecutan ESLint sobre un árbol temporal. Decisiones y alternativas en [research.md](./research.md).

## Contexto técnico

**Lenguaje/Versión**: TypeScript 5.9.x (modo estricto) sobre Node 24 LTS
**Dependencias principales**: Vue 3.5, Vue Router 5, Pinia 4, Vite 8, Tailwind CSS 4
**Almacenamiento**: N/A
**Pruebas**: Vitest 5 + @vue/test-utils + jsdom
**Plataforma de destino**: navegadores modernos (PWA en HU-39); Node 24 para herramientas
**Tipo de proyecto**: aplicación web de una sola página (un solo paquete)
**Metas de rendimiento**: las cuatro verificaciones juntas en < 3 min (SC-004)
**Restricciones**: solo software libre; sin secretos; nada de tokens en `localStorage`
**Escala/Alcance**: esqueleto de 2 pantallas; el resto de pantallas llegan en historias posteriores

## Licencias de dependencias nuevas (principio VIII)

Consulta al registro de npm el 2026-11-11. Todas libres; se vuelve a comprobar el árbol instalado en T005.

| Paquete | Uso | Licencia |
|---|---|---|
| vue | framework | MIT |
| vue-router | navegación | MIT |
| pinia | estado | MIT |
| vite | empaquetador | MIT |
| @vitejs/plugin-vue | plugin | MIT |
| typescript (5.9.x) | lenguaje | Apache-2.0 |
| vue-tsc | verificación de tipos | MIT |
| tailwindcss, @tailwindcss/vite | estilos | MIT |
| eslint, @eslint/js, globals | lint | MIT |
| typescript-eslint | lint de TS | MIT |
| eslint-plugin-vue | lint de Vue | MIT |
| eslint-plugin-boundaries | reglas de capas | MIT |
| eslint-import-resolver-typescript | resolución de alias en lint | ISC |
| vitest | pruebas | MIT |
| @vue/test-utils | pruebas de componentes | MIT |
| jsdom | DOM de pruebas | MIT |
| @vue/tsconfig | base de tsconfig | MIT |
| @types/node (24.x) | tipos de Node | MIT |

Las licencias transitivas se revisan en T005; si aparece una no libre, se detiene la implementación y se avisa.

## Verificación de la constitución

| Principio | Estado | Nota |
|---|---|---|
| I. FSD | Cumple | Seis capas, `index.ts` público, reglas en ESLint; es el núcleo de esta HU |
| II. Contrato primero | N/A | HU-9 |
| III. Precio del backend | Cumple | No hay precios |
| IV. PWA | N/A | HU-39; no se cierra ninguna puerta (sin service worker aún) |
| V. Sesión segura | Cumple | Sin almacenamiento persistente de tokens |
| VI. Pruebas | Cumple | Pruebas primero; las cuatro verificaciones en verde |
| VII. Accesibilidad | Cumple | Enlaces nativos (operables con teclado, foco visible) y colores de texto con relación de contraste ≥ 4.5:1 calculada al elegirlos en T032 |
| VIII. Software libre | Cumple | Tabla anterior |
| IX. Secretos y entornos | N/A | HU-8; no se añaden `.env` aquí |
| X. Idioma | Cumple | Todo en español; marca **BlackHellHeim** |
| XI. Ramas | Cumple | Trabajo en `sprint/02`; un commit por HU |

**Re-evaluación tras el diseño**: sin violaciones. La prohibición de imports entre slices de una misma capa es más estricta que la constitución, pero no la contradice (Supuestos de la spec).

## Estructura del proyecto

### Documentación de esta historia

```text
specs/007-esqueleto-vue-fsd/
├── spec.md
├── plan.md
├── research.md
├── quickstart.md
├── checklists/requirements.md
└── tasks.md
```
No hay `data-model.md` ni `contratos/` propios: la historia no maneja datos ni interfaces externas.

### Código fuente (raíz del repositorio)

```text
.nvmrc  .gitignore  index.html  package.json
vite.config.ts  tsconfig.json  tsconfig.app.json  tsconfig.node.json
eslint.config.js
src/
├── main.ts
├── LEEME.md                        # guía de capas
├── aplicacion/
│   ├── index.ts
│   ├── App.vue
│   ├── enrutador/index.ts          # rutas y router
│   ├── proveedores/pinia.ts        # registro de Pinia
│   └── estilos/principal.css       # @import "tailwindcss" + base
├── paginas/
│   ├── inicio/{index.ts, ui/PaginaInicio.vue}
│   └── no-encontrada/{index.ts, ui/PaginaNoEncontrada.vue}
├── widgets/                        # vacía (.gitkeep)
├── funcionalidades/                # vacía (.gitkeep)
├── entidades/                      # vacía (.gitkeep)
└── compartido/
    ├── ui/        └── lib/        └── api/     # vacías (.gitkeep)
tests/
└── arquitectura/
    ├── estructura.test.ts          # las seis capas existen
    └── reglas-fsd.test.ts          # ESLint falla/pasa según el caso
```

**Decisión de estructura**: un solo paquete en la raíz; pruebas de componentes junto al código (`*.test.ts`) y pruebas de arquitectura en `tests/arquitectura/`.

### Configuración de las reglas FSD (resumen de diseño)

- Un *elemento* por capa en `settings["boundaries/elements"]`: `aplicacion` y `compartido` sin slice; `paginas`, `widgets`, `funcionalidades`, `entidades` con `capture` del slice.
- Una *categoría de archivo* `interfaz-publica` = `**/index.ts` de cada slice.
- Políticas (`default: disallow`): cada capa puede depender de las inferiores solo a través de archivos de categoría `interfaz-publica` (o de segmentos, en `aplicacion` y `compartido`); dentro del mismo slice todo se permite; entre slices de la misma capa, nada.
- Regla adicional del plugin para archivos de `src/` fuera de las capas (caso límite de la spec).
- El resolutor de TypeScript lee los alias de `tsconfig.app.json`.

## Riesgos

- **R-1**: sintaxis de políticas de `eslint-plugin-boundaries` v7 nueva; mitigación: pruebas en rojo primero y consulta de la documentación oficial al implementar.
- **R-2**: compatibilidad TypeScript/typescript-eslint; mitigación: TS 5.9.x fijado (D3); también exigido por `openapi-typescript` (HU-9).
- **R-3**: ESLint con configuración nueva (flat config) y `eslint-plugin-vue`; mitigación: partir de la configuración recomendada de cada paquete y probar con `npm run lint`.

## Seguimiento de complejidad

Sin violaciones que justificar.
