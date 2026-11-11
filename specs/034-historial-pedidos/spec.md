# Especificación de la funcionalidad: Historial de pedidos con detalle (HU-34, parte web)

**Rama de trabajo**: `sprint/09` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-34 · **Sprint**: 9 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-33
**Bloqueado por**: HU-14, HU-33; contrato del API de historial (HU-34 api), se reutiliza el copiado en HU-33
**Entrada**: «Como cliente, quiero mi historial de pedidos con detalle. Criterio: lista mis pedidos paginados y abre el detalle de cada uno.» (parte web de una historia api + web)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Ver mi historial paginado (Prioridad: P1)

1. **Dado** un cliente con pedidos, **Cuando** abre «Mis pedidos», **Entonces** ve la lista paginada, la más reciente primero, con fecha, estado y total.
2. **Dado** muchos pedidos, **Cuando** cambia de página, **Entonces** la lista y la dirección se actualizan.
3. **Dado** ningún pedido, **Cuando** abre la lista, **Entonces** ve un estado vacío con enlace al catálogo.

### Historia de usuario 2 - Abrir el detalle (Prioridad: P1)

1. **Dado** un pedido de la lista, **Cuando** lo abre, **Entonces** ve el detalle de HU-33.
2. **Dado** un filtro por estado (si el contrato lo trae), **Cuando** lo aplica, **Entonces** la lista se acota.

### Casos límite

- Sin sesión: acceso y regreso (HU-14).
- Error de red: mensaje con reintento; lo ya mostrado se conserva.
- Sin conexión: lo resuelve HU-39 con IndexedDB; aquí el store ya separa carga y presentación.
- Totales y fechas se muestran tal cual (fecha con `Intl`, zona de México).
- Página fuera de rango: se lleva a la última válida.

## Requisitos *(obligatorio)*

- **FR-001**: Ruta `/pedidos` con `meta.requiereSesion` y paginación en la dirección.
- **FR-002**: Lista y detalle con tipos y operaciones del contrato generado; reutiliza la entidad `pedido` de HU-33.
- **FR-003**: MUST NOT calcular totales: se muestran los del backend.
- **FR-004**: Lista accesible (encabezados, enlaces con nombre, paginación por teclado).
- **FR-005**: Estado vacío y de error.
- **FR-006**: Mock con varias páginas de pedidos.

## Criterios de éxito

- **SC-001**: Abrir el historial y un detalle en menos de 3 interacciones.
- **SC-002**: El 100 % de las páginas del mock se recorren sin error.

## Supuestos

- El API (HU-34 api) devuelve una lista paginada de los pedidos de la cliente con sesión.
- La notificación de cambios es de HU-35.
