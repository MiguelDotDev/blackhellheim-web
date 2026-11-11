# Plan de implementación: Reseñas con estrellas y comentarios (HU-37, parte web)

**Rama**: `sprint/10` · **Spec**: [spec.md](./spec.md) · **Bloqueado por**: HU-14, HU-23, HU-34; contrato del API de reseñas (HU-37 api)

## Resumen

Reseñas visibles en el detalle, formulario para compradoras verificadas y panel de moderación.

## Decisiones

- **D1 Sin `v-html`**: regla de lint (`vue/no-v-html`) ya incluida en las reglas recomendadas.
- **D2 Elegibilidad**: la consulta del backend decide si se muestra el formulario.

## Verificación de la constitución

I, II, III, V, VI, VII, VIII, IX, X y XI cumplen; ver decisiones.

## Licencias (principio VIII)

Sin dependencias nuevas.

## Estructura

```text
specs/037-resenas/{spec.md, plan.md, tasks.md, contratos/openapi.json}
src/funcionalidades/resenas/  src/paginas/admin-resenas/
mock/respuestas.ts (+ reseñas)
```

## Riesgos

- **R-1**: Contrato inexistente hasta que el API lo publique.
- **R-2**: Es recorte: puede quedar sin implementar.
