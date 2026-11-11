# Plan de implementación: Historial de pedidos con detalle (HU-34, parte web)

**Rama**: `sprint/09` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-33; contrato del API de historial (HU-34 api), se reutiliza el copiado en HU-33

## Resumen

Página de historial sobre la entidad `pedido` con paginación y enlace al detalle.

## Decisiones

- **D1 Paginación**: parámetros del contrato en la dirección.
- **D2 Sin dependencias nuevas**.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/034-historial-pedidos/{spec.md, plan.md, tasks.md}
src/paginas/historial-pedidos/  src/entidades/pedido/ (ampliada)
mock/respuestas.ts (+ lista)
```

## Riesgos

- **R-1**: Depende del contrato real del listado; sin él se usa el mock según el contrato copiado en HU-33.
