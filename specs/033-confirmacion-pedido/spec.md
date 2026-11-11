# Especificación de la funcionalidad: Confirmación y estado del pedido (HU-33)

**Rama de trabajo**: `sprint/09` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-33 · **Sprint**: 9 · **Repos**: web · **Componente**: FE · **Depende de**: HU-14, HU-29
**Bloqueado por**: HU-14, HU-29; contrato del API de pedidos (HU-33/34 api)
**Entrada**: «Como cliente, quiero ver la confirmación y el estado de mi pedido. Criterio: muestra estado, dirección y guía del pedido de la cliente con sesión.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Ver la confirmación tras pagar (Prioridad: P1)

1. **Dado** un pedido pagado, **Cuando** llega a la confirmación, **Entonces** ve número de pedido, líneas, total, dirección y estado.
2. **Dado** un pedido de otra persona, **Cuando** intenta abrirlo, **Entonces** el backend lo rechaza y la web muestra «no encontrado».

### Historia de usuario 2 - Seguir el estado y la guía (Prioridad: P1)

1. **Dado** un pedido enviado, **Cuando** abre su estado, **Entonces** ve la guía y el enlace de rastreo que entrega el backend.
2. **Dado** un cambio de estado, **Cuando** recarga o vuelve a abrir, **Entonces** ve el estado actualizado.
3. **Dado** un pedido aún sin guía, **Cuando** lo abre, **Entonces** ve «guía pendiente».

### Casos límite

- Sin sesión: se pide iniciar sesión y se regresa al pedido (HU-14).
- Enlace de rastreo externo: se abre con `rel="noopener noreferrer"` y solo si es `https:`.
- Estados desconocidos del contrato: se muestran con texto genérico sin romper la página.
- Sin conexión: la consulta sin conexión llega con HU-39; aquí solo se deja el estado en un store reutilizable.
- Pedido inexistente (404): página de no encontrado.

## Requisitos *(obligatorio)*

- **FR-001**: Ruta `/pedidos/:id` con `meta.requiereSesion`.
- **FR-002**: MUST mostrar estado, dirección y guía tal como los devuelve el backend; sin cálculos de dinero.
- **FR-003**: Estados traducidos a etiquetas en español en un mapa tipado contra el enum del contrato; estado desconocido → genérico.
- **FR-004**: Enlace de rastreo validado (`https:`) y con `rel="noopener noreferrer"`.
- **FR-005**: Página accesible; el estado se anuncia, no solo por color.
- **FR-006**: Slice `entidades/pedido` (reutilizado por HU-34) y `paginas/pedido`.
- **FR-007**: Mock ampliado con un pedido en cada estado.

## Criterios de éxito

- **SC-001**: El 100 % de los estados del contrato tienen etiqueta en español (prueba contra el enum generado).
- **SC-002**: El pedido ajeno nunca se muestra.
- **SC-003**: Se lee el estado en menos de 5 segundos tras abrir la página.

## Supuestos

- El API (HU-33 y 34 api) expone el pedido con estado, dirección y guía; la web remite a su contrato.
- El historial es de HU-34; las notificaciones de cambio de estado, de HU-35.
