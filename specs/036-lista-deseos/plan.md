# Plan de implementación: Lista de deseos (HU-36, parte web)

**Rama**: `sprint/10` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-23; contrato del API de lista de deseos (HU-36 api)

## Resumen

Slice `funcionalidades/lista-deseos` con botón de corazón y página de lista.

## Decisiones

- **D1 Optimista**: el store cambia primero y revierte si falla.
- **D2 Sin dependencias nuevas**.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/036-lista-deseos/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/lista-deseos/  src/paginas/lista-deseos/
mock/respuestas.ts (+ deseos)
```

## Riesgos

- **R-1**: Contrato inexistente hasta que el API lo publique.
- **R-2**: Es recorte: puede quedar sin implementar.
