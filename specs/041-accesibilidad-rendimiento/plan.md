# Plan de implementación: Accesibilidad y rendimiento revisados (HU-41)

**Rama**: `sprint/11` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-11, HU-23, HU-27, HU-39

## Resumen

Auditoría de accesibilidad y rendimiento con herramientas libres y correcciones de las fallas críticas.

## Decisiones

- **D1 Herramientas**: Lighthouse CLI y `axe-core` (vía `vitest-axe` o `@axe-core/playwright` si HU-42 instaló Playwright), solo en desarrollo.
- **D2 Informe**: Markdown con resultados y fecha.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Dependencias nuevas candidatas, solo de desarrollo: Lighthouse (Apache-2.0) y `axe-core` (MPL-2.0); licencia y árbol se verifican en T002 antes de instalar.

## Estructura

```text
docs/calidad/{accesibilidad.md, rendimiento.md}
tests/accesibilidad/*.test.ts
```

## Riesgos

- **R-1**: Resultados dependientes del equipo: medir la mediana.
- **R-2**: Recorte: se puede cerrar con lo medido si falta tiempo.
