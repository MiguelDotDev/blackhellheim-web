# Especificación de la funcionalidad: Catálogo y detalle de producto (HU-23)

**Rama de trabajo**: `sprint/06` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-23 · **Sprint**: 6 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7, HU-9, HU-11
**Bloqueado por**: contratos de la API de catálogo (HU-19) y de precios (HU-20); interfaz del carrito (HU-24) y checkout (HU-27) para los botones
**Entrada**: «Como visitante, quiero ver el catálogo y el detalle con galería, color, talla, precio, Agregar al carrito y Comprar ahora. Criterio: todo se ve sin cuenta; los botones respetan la variante elegida; Comprar ahora lleva al checkout.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Explorar el catálogo (Prioridad: P1)

1. **Dado** un visitante sin cuenta, **Cuando** abre el catálogo, **Entonces** ve las playeras paginadas con imagen, nombre y precio desde el backend.
2. **Dado** filtros del contrato (los que ofrezca la API de HU-19), **Cuando** los aplica, **Entonces** la lista y la dirección (`query`) se actualizan y se pueden compartir.
3. **Dado** una lista vacía o un error, **Cuando** carga, **Entonces** ve un estado vacío o un mensaje con reintento.

### Historia de usuario 2 - Ver el detalle con galería y variantes (Prioridad: P1)

1. **Dado** una playera, **Cuando** abre el detalle, **Entonces** ve la galería de imágenes, colores y tallas disponibles y el precio de la variante elegida.
2. **Dado** una variante sin existencia, **Cuando** la elige, **Entonces** la talla/color aparece no disponible y los botones de compra se deshabilitan con motivo.
3. **Dado** un cambio de color o talla, **Cuando** lo elige, **Entonces** cambian la imagen principal y el precio mostrado (que viene del backend).

### Historia de usuario 3 - Agregar al carrito y Comprar ahora (Prioridad: P1)

1. **Dado** una variante elegida, **Cuando** pulsa Agregar al carrito, **Entonces** se pasa esa variante exacta al carrito (HU-24).
2. **Dado** una variante elegida, **Cuando** pulsa Comprar ahora, **Entonces** se lleva al checkout (HU-27) con esa variante.
3. **Dado** que no eligió color o talla, **Cuando** pulsa un botón, **Entonces** se le indica qué falta y no se avanza.

### Casos límite

- El precio nunca se calcula ni se redondea en el cliente: se muestra tal cual lo devuelve el backend (principio III).
- Imagen que no carga: marcador con texto alternativo.
- Producto inexistente (404): página de no encontrado de la app.
- Catálogo visto sin conexión: lo resuelve HU-39; aquí solo se deja el estado en un store reutilizable.
- Respuesta lenta: esqueletos de carga; un fallo de red no borra lo ya mostrado.

## Requisitos *(obligatorio)*

- **FR-001**: Rutas `/catalogo` y `/catalogo/:id` públicas, con filtros y página en la dirección.
- **FR-002**: Todos los tipos y llamadas salen del contrato generado de la API de catálogo (HU-19) y de precios (HU-20); sin tipos a mano (principio II).
- **FR-003**: MUST NOT calcular, convertir ni enviar precios; el botón de compra solo envía identificadores de variante.
- **FR-004**: Selector de variante accesible (grupo de opciones con etiquetas, teclado, estado no solo por color).
- **FR-005**: Galería con teclado, texto alternativo y carga diferida de imágenes.
- **FR-006**: Slices `entidades/producto`, `funcionalidades/elegir-variante` y `paginas/catalogo`, `paginas/detalle-producto`.
- **FR-007**: Mock ampliado con listado y detalle que respeten el contrato.

## Criterios de éxito

- **SC-001**: Un visitante llega del catálogo al detalle y a Comprar ahora en menos de 3 interacciones.
- **SC-002**: 0 apariciones de operaciones aritméticas sobre precios en el código (prueba/regla de lint).
- **SC-003**: El catálogo y el detalle se usan solo con teclado.

## Supuestos

- El contrato de HU-19 trae listado paginado, filtros, detalle con imágenes, colores y tallas, y los precios por variante; si no los trae, se anota y se pide ajustar el contrato al backend.
- Agregar al carrito usa la interfaz del store de HU-24; si HU-24 no está, se publica el gancho y se espera.
- Los tokens y componentes de marca son los de HU-11.
