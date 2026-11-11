# Plan de implementación: Código de creadora en el checkout y su administración (HU-31, parte web)

**Rama**: `sprint/09` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-18 (patrón de panel), HU-27; contrato del API de códigos (HU-31 api)

## Resumen

Campo de código en el checkout (HU-27) y sección del panel para crear y listar códigos de creadora.

## Decisiones

- **D1 Código en el estado del checkout**: se guarda solo en el store del checkout (memoria).
- **D2 Panel**: lista simple paginada según el contrato; sin dependencias nuevas.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/031-codigo-creadora/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/codigo-creadora/  src/paginas/admin-creadoras/
mock/respuestas.ts (+ códigos)
```

## Riesgos

- **R-1**: Contrato inexistente hasta que el API lo publique.
- **R-2**: Confundir el código con un descuento: la prueba verifica que el total no cambia.
