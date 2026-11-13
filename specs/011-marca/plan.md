# Plan de implementación: Marca (HU-11)

**Rama**: `sprint/04` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: documento de diseño (paleta, fuentes, logo, monograma)

## Resumen

Tokens `@theme` de Tailwind 4 en `src/aplicacion/estilos/marca.css` (o el archivo de estilos global existente), fuentes alojadas con `@fontsource/<fuente>` (OFL-1.1, se importan los pesos concretos en `woff2`), y `LogoMarca.vue`/`Monograma.vue` en `compartido/ui` con los SVG entregados.

## Decisiones

- **D1 Fuentes**: `@fontsource/*` empaquetado por Vite (sin red en ejecución). Alternativa: copiar `woff2` a `src/` a mano; se descarta por el mantenimiento. Nombre de la fuente: a definir por el documento de diseño.
- **D2 Contraste**: función pura `razonDeContraste(hexA, hexB)` en `compartido/lib` con prueba, y una tabla de pares en `compartido/ui/marca.pares.ts`; sin dependencias.
- **D3 Sin literales**: prueba que recorre `src/**/*.{vue,ts,css}` buscando `#hex`, `rgb(` y `fonts.googleapis` fuera de `marca.css`.
- **D4 SVG**: componentes Vue con `currentColor`; el SVG de origen se versiona en `src/compartido/ui/marca/`.

## Verificación de la constitución

I cumple (`compartido/ui` con `index.ts`) · VII contraste · VIII licencias · IX sin secretos ni red externa · X marca «BlackHellHeim», diseños propios · XI `sprint/04`.

## Estructura

```text
specs/011-marca/{spec.md, plan.md, tasks.md}
src/aplicacion/estilos/marca.css          # @theme + @font-face; se importa desde el principal.css existente (ahí está @import "tailwindcss")
src/compartido/ui/{LogoMarca.vue, Monograma.vue, marca/*.svg, index.ts}
src/compartido/lib/contraste.ts (+ prueba)
tests/marca/{contraste.test.ts, sin-literales.test.ts}
public/favicon.svg
```

## Licencias

Verificadas (T002, `npm ls --all`, sin dependencias transitivas): `@fontsource/anton` 5.3.0 (Anton, OFL-1.1) y `@fontsource-variable/inter` 5.3.0 (Inter, OFL-1.1); los paquetes son MIT. Fuente de títulos: Anton, según `docs/diseno/marca.md` v2 (no Cinzel).
Iconos PWA (`public/iconos/`) generados una vez desde el monograma con `sharp` (Apache-2.0, solo herramienta temporal, no queda como dependencia). El manifiesto llega con la HU-39.
Nota: `Monograma` se llama `MonogramaMarca` (la regla ESLint exige nombres de varias palabras).

## Riesgos

- **R-1**: sin el documento de diseño no hay valores reales; la HU no avanza más allá de la preparación.
- **R-2**: `bg-black` y utilidades por defecto de Tailwind pueden colarse; la prueba D3 lo detecta.
