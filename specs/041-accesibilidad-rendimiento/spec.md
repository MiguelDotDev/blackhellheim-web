# Especificación de la funcionalidad: Accesibilidad y rendimiento revisados (HU-41)

**Rama de trabajo**: `sprint/11` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-41 · **Sprint**: 11 · **Repos**: web · **Componente**: FE · **Depende de**: HU-11, HU-23, HU-27, HU-39
**Bloqueado por**: HU-11, HU-23, HU-27, HU-39
**Entrada**: «Quiero accesibilidad y rendimiento revisados. Criterio: Lighthouse sin fallas críticas de accesibilidad; contrastes validados.» (prioridad S, recorte)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Accesibilidad revisada (Prioridad: P1)

1. **Dado** las pantallas principales (inicio, catálogo, detalle, carrito, acceso, checkout, pedido), **Cuando** se corre Lighthouse y una revisión con axe, **Entonces** no hay fallas críticas de accesibilidad.
2. **Dado** cada par de colores de uso real, **Cuando** se calcula el contraste, **Entonces** cumple WCAG AA (reutiliza la prueba de HU-11).
3. **Dado** un recorrido solo con teclado de la compra, **Cuando** se hace, **Entonces** se completa y el foco es visible.

### Historia de usuario 2 - Rendimiento revisado (Prioridad: P2)

1. **Dado** un dispositivo móvil simulado, **Cuando** se mide Lighthouse en inicio, catálogo y detalle, **Entonces** se registran las métricas y se corrigen los problemas evidentes.
2. **Dado** las imágenes, **Cuando** se cargan, **Entonces** usan tamaño adecuado y carga diferida.

### Casos límite

- Falsos positivos de la herramienta: se documentan con justificación, no se ocultan.
- Lighthouse varía entre ejecuciones: se toma la mediana de tres.
- Las pantallas que dependen de la API se miden con el mock.
- No se promete una puntuación numérica; el criterio es sin fallas críticas.
- Es recorte: puede quedar parcial.

## Requisitos *(obligatorio)*

- **FR-001**: Informe de Lighthouse y axe (accesibilidad) de las pantallas principales guardado en `docs/calidad/`.
- **FR-002**: Corregir las fallas críticas encontradas, cada una con su prueba.
- **FR-003**: Mantener la prueba de contraste de HU-11 actualizada con los pares reales.
- **FR-004**: Recorrido por teclado de la compra documentado y probado en componentes.
- **FR-005**: Medición de rendimiento y correcciones evidentes (imágenes, carga diferida, división de código).
- **FR-006**: Herramientas libres con licencia verificada (Lighthouse y axe-core: Apache-2.0 y MPL-2.0).

## Criterios de éxito

- **SC-001**: 0 fallas críticas de accesibilidad en las pantallas principales.
- **SC-002**: El 100 % de los pares de color cumplen AA.
- **SC-003**: Informe guardado con fecha y versión.

## Supuestos

- Se corre en local o como paso opcional de CI; no sustituye los cuatro controles.
- `axe-core` MPL-2.0 es software libre; se usa solo como herramienta de desarrollo.
