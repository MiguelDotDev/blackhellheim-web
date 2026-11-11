# Especificación de la funcionalidad: Panel de pedidos y ventas por código de creadora (HU-38, parte web)

**Rama de trabajo**: `sprint/09` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-38 · **Sprint**: 9 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-18, HU-31, HU-33
**Bloqueado por**: HU-14, HU-18, HU-31, HU-33; contrato del API de administración de pedidos (HU-38 api)
**Entrada**: «Como administradora, quiero ver los pedidos y, por cada código de creadora, cuántas ventas tiene y la lista paginada de sus compras. Criterio: el panel muestra el total de ventas (pedidos entregados) por código y una lista paginada de las compras con ese código; los pedidos se filtran por estado y la administradora puede marcar uno como entregado.» (parte web de una historia api + web)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Ver y filtrar pedidos (Prioridad: P1)

1. **Dado** el panel, **Cuando** abre `/admin/pedidos`, **Entonces** ve los pedidos paginados y puede filtrarlos por estado.
2. **Dado** un pedido, **Cuando** lo abre, **Entonces** ve su detalle completo.

### Historia de usuario 2 - Marcar un pedido como entregado (Prioridad: P1)

1. **Dado** un pedido que se puede entregar, **Cuando** pulsa «Marcar como entregado» y confirma, **Entonces** el backend cambia el estado y la lista se actualiza.
2. **Dado** un pedido que no admite el cambio, **Cuando** la acción se rechaza, **Entonces** ve el motivo del servidor.
3. **Dado** un doble clic, **Cuando** confirma, **Entonces** se envía una sola vez.

### Historia de usuario 3 - Ventas por código de creadora (Prioridad: P1)

1. **Dado** el panel de creadoras, **Cuando** elige un código, **Entonces** ve el total de ventas (pedidos entregados) y la lista paginada de sus compras.
2. **Dado** un código sin ventas, **Cuando** lo elige, **Entonces** ve cero y lista vacía.

### Casos límite

- Solo rol Administrador; el servidor es la autoridad.
- Totales y conteos los calcula el backend; la web no suma.
- Confirmación antes de la acción irreversible, accesible y con teclado.
- Condiciones de carrera: si el estado cambió, el servidor responde 409 y se refresca la fila.
- Datos personales de clientes: se muestran solo lo que entrega el contrato y no se registran en consola.

## Requisitos *(obligatorio)*

- **FR-001**: Rutas `/admin/pedidos` y `/admin/creadoras/:codigo` con `meta.rol = Administrador`.
- **FR-002**: Filtro por estado y paginación en la dirección.
- **FR-003**: La acción de entrega MUST usar la operación del contrato, pedir confirmación y deshabilitar el botón durante la petición.
- **FR-004**: El total de ventas por código MUST mostrarse tal como lo devuelve el backend.
- **FR-005**: Tablas accesibles (encabezados, orden, paginación por teclado).
- **FR-006**: Mock con pedidos en varios estados, entrega y estadísticas por código.
- **FR-007**: Reutiliza `entidades/pedido` (HU-33) y el panel de HU-31.

## Criterios de éxito

- **SC-001**: La administradora marca un pedido como entregado en menos de 3 interacciones.
- **SC-002**: El total por código coincide con el del mock en el 100 % de los casos.
- **SC-003**: 0 sumas de dinero en el cliente.

## Supuestos

- El API (HU-38 api) expone pedidos para administración, la acción de entregar y las ventas por código.
- La definición de «venta» (pedido entregado) la aplica el backend.
