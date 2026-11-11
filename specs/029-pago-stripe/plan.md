# Plan de implementación: Pagar con Stripe (HU-29, parte web)

**Rama**: `sprint/08` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-24, HU-27; contrato del API de pago (HU-29 api); cuenta de Stripe

## Resumen

Slice `funcionalidades/pagar` con crear sesión, redirección y consulta del estado; páginas de resultado y cancelación.

## Decisiones

- **D1 Redirección completa**: `window.location.assign(urlDevuelta)` validando que sea `https:`; sin SDK de Stripe, sin dependencias nuevas.
- **D2 Consulta del estado**: reintentos con espera creciente (1, 2, 4, 8 s, máximo 5 intentos).
- **D3 Clave de idempotencia**: solo si el contrato la define.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/029-pago-stripe/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/pagar/  src/paginas/resultado-pago/
mock/respuestas.ts (+ pago)  tests/pago/*.test.ts
```

## Riesgos

- **R-1**: Contrato de pago inexistente hasta que el API lo publique.
- **R-2**: Redirección abierta si la API devolviera una dirección no `https:`: se valida el esquema.
