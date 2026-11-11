# Especificación de la funcionalidad: Reseñas con estrellas y comentarios (HU-37, parte web)

**Rama de trabajo**: `sprint/10` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-37 · **Sprint**: 10 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-23, HU-34
**Bloqueado por**: HU-14, HU-23, HU-34; contrato del API de reseñas (HU-37 api)
**Entrada**: «Como cliente, quiero reseñas con estrellas y comentarios. Criterio: solo compradoras verificadas reseñan; la administradora puede ocultar contenido.» (parte web de una historia api + web; prioridad S, recorte)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Leer reseñas (Prioridad: P1)

1. **Dado** un producto, **Cuando** abre el detalle, **Entonces** ve el promedio, el número de reseñas y la lista paginada, todo como lo entrega el backend.
2. **Dado** un producto sin reseñas, **Cuando** abre el detalle, **Entonces** ve un estado vacío.

### Historia de usuario 2 - Escribir una reseña (Prioridad: P1)

1. **Dado** una compradora verificada (según el backend), **Cuando** abre el formulario, **Entonces** elige de 1 a 5 estrellas y escribe un comentario.
2. **Dado** una usuaria no verificada, **Cuando** intenta reseñar, **Entonces** ve por qué no puede y el formulario no se muestra.
3. **Dado** errores del servidor, **Cuando** envía, **Entonces** se muestran junto a los campos.

### Historia de usuario 3 - Moderación (Prioridad: P2)

1. **Dado** la administradora, **Cuando** oculta una reseña, **Entonces** desaparece de la vista pública y se puede volver a mostrar.
2. **Dado** una usuaria sin rol Administrador, **Cuando** abre la moderación, **Entonces** ve «sin permiso».

### Casos límite

- Texto de la reseña: se muestra como texto plano, nunca como HTML (evita inyección).
- Estrellas accesibles: control de radio con etiquetas, no solo iconos.
- Reseña ocultada mientras se lee: se refresca.
- Doble envío: botón deshabilitado en curso.
- Longitud máxima del comentario según el contrato; contador accesible.

## Requisitos *(obligatorio)*

- **FR-001**: Reseñas, promedio y verificación MUST venir del backend; el cliente no calcula el promedio.
- **FR-002**: Formulario con estrellas (radios) y comentario, accesible y con errores por campo.
- **FR-003**: MUST renderizar el comentario como texto (sin `v-html`); prueba que lo impide.
- **FR-004**: Panel de moderación con rol Administrador para ocultar y mostrar.
- **FR-005**: Slice `funcionalidades/resenas` integrado en el detalle de HU-23 y `paginas/admin-resenas`.
- **FR-006**: Mock con reseñas, elegibilidad y moderación.

## Criterios de éxito

- **SC-001**: El 100 % de los comentarios con HTML se muestran como texto en las pruebas.
- **SC-002**: Reseñar en menos de 1 minuto.
- **SC-003**: El formulario solo se ofrece a quien el backend marque como elegible.

## Supuestos

- Historia de recorte: solo si sobra capacidad.
- El API define «compradora verificada» y la moderación; la web remite a su contrato.
