# Plan de implementación: Specs diferidos de aviso de privacidad y CFDI (HU-44)

**Rama**: `sprint/11` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: nada técnico

## Resumen

Documentación: completar la spec 900, crear la 901 y las plantillas legales con una prueba de existencia.

## Decisiones

- **D1 Sin plan ni tareas**: se evita el flujo de implementación para estas carpetas.
- **D2 Prueba**: Vitest lee las carpetas y busca las marcas.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/900-aviso-privacidad-diferido/spec.md  specs/901-cfdi-diferido/spec.md
docs/legal/{plantilla-aviso-privacidad.md, plantilla-cfdi.md}  tests/documentacion/diferidos.test.ts
```

## Riesgos

- **R-1**: Confundir plantilla con texto vigente: marca visible en cada archivo.
