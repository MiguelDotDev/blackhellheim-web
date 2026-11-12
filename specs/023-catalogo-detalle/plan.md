# Plan de implementación: Catálogo y detalle de producto (HU-23)

**Rama**: `sprint/06` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: contratos de la API de catálogo (HU-19) y de precios (HU-20); interfaz del carrito (HU-24) y checkout (HU-27) para los botones

## Resumen

Páginas públicas de catálogo y detalle con selector de variante, que consumen el cliente generado y delegan carrito y checkout a HU-24 y HU-27.

## Decisiones

- **D1 Variante como estado local**: la variante elegida vive en el componente y se pasa por identificadores al carrito; no se persiste.
- **D2 Precios**: se formatean con `Intl.NumberFormat('es-MX')` sobre el número recibido; sin sumas ni descuentos. Si el contrato entrega el precio en unidades menores o ya formateado, se muestra tal cual lo define el contrato (se confirma en T002); el formato es solo presentación y nunca recalcula ni redondea el importe.
- **D3 Filtros en la dirección**: `vue-router` con `query`, sin dependencias nuevas.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/023-catalogo-detalle/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/entidades/producto/  src/funcionalidades/elegir-variante/
src/paginas/catalogo/  src/paginas/detalle-producto/  mock/respuestas.ts (+ catálogo)
```

## Riesgos

- **R-1**: Contrato de catálogo aún no copiado: sin él no se implementa.
- **R-2**: Imágenes pesadas: tamaños y `loading=lazy`; medir con HU-41.
