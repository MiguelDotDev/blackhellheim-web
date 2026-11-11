# Plan de implementación: Checkout con dirección mexicana y envío cotizado (HU-27)

**Rama**: `sprint/07` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14 (sesión), HU-23 y HU-24 (carrito); contrato del API de checkout y envío (historias 26 y 27 del API)

## Resumen

Página de checkout que encadena sesión, dirección, cotización y resumen, todo con datos del backend, y deja el pago para HU-29.

## Decisiones

- **D1 Estado del checkout**: store Pinia en memoria (sin persistir datos personales en almacenamiento).
- **D2 Re-cotización**: cualquier cambio invalida el total con un identificador de versión local.
- **D3 Validaciones**: funciones puras de formato (CP, teléfono) con pruebas; el servidor manda.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/027-checkout/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/direccion-envio/  src/funcionalidades/cotizar-envio/  src/paginas/checkout/
mock/respuestas.ts (+ cotización y resumen)
```

## Riesgos

- **R-1**: Contrato de checkout inexistente hasta que el API lo publique.
- **R-2**: Datos personales en memoria: no registrar la dirección en consola.
