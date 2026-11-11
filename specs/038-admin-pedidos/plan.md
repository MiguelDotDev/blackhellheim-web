# Plan de implementación: Panel de pedidos y ventas por código de creadora (HU-38, parte web)

**Rama**: `sprint/09` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-18, HU-31, HU-33; contrato del API de administración de pedidos (HU-38 api)

## Resumen

Páginas de administración de pedidos y de ventas por código, con la acción de entrega.

## Decisiones

- **D1 Confirmación**: diálogo accesible propio (`<dialog>`), sin dependencias nuevas.
- **D2 Refresco**: tras la acción se vuelve a pedir la fila al servidor.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/038-admin-pedidos/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/entregar-pedido/  src/paginas/admin-pedidos/  src/paginas/admin-creadoras/ (ventas)
mock/respuestas.ts (+ administración)
```

## Riesgos

- **R-1**: Contrato de administración inexistente hasta que el API lo publique.
- **R-2**: Datos personales visibles: limitar al contrato y no registrarlos.
