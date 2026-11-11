# Plan de implementación: Confirmación y estado del pedido (HU-33)

**Rama**: `sprint/09` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-29; contrato del API de pedidos (HU-33/34 api)

## Resumen

Entidad `pedido` y página de detalle/estado reutilizable por el historial.

## Decisiones

- **D1 Etiquetas**: `Record<EstadoPedido, string>` con tipo del contrato, de modo que un estado nuevo rompa la verificación de tipos.
- **D2 Dirección y guía**: solo lectura.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/033-confirmacion-pedido/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/entidades/pedido/  src/paginas/pedido/
mock/respuestas.ts (+ pedidos)
```

## Riesgos

- **R-1**: Contrato de pedidos inexistente hasta que el API lo publique.
- **R-2**: Compartida con HU-34: la entidad se define aquí y HU-34 la reutiliza.
