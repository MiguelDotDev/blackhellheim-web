# Especificación de la funcionalidad: Lista de deseos (HU-36, parte web)

**Rama de trabajo**: `sprint/10` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-36 · **Sprint**: 10 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-23
**Bloqueado por**: HU-14, HU-23; contrato del API de lista de deseos (HU-36 api)
**Entrada**: «Como cliente, quiero una lista de deseos. Criterio: agregar y quitar playeras; solo con sesión.» (parte web de una historia api + web; prioridad C, recorte)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Agregar y quitar playeras (Prioridad: P1)

1. **Dado** un cliente con sesión, **Cuando** pulsa el corazón en una playera, **Entonces** se agrega a su lista y el corazón queda marcado.
2. **Dado** una playera en la lista, **Cuando** pulsa de nuevo, **Entonces** se quita.
3. **Dado** un visitante sin sesión, **Cuando** pulsa el corazón, **Entonces** se le pide iniciar sesión y regresa a la playera.

### Historia de usuario 2 - Ver mi lista (Prioridad: P2)

1. **Dado** una lista con playeras, **Cuando** abre `/deseos`, **Entonces** las ve con imagen, nombre y precio del backend y enlace al detalle.
2. **Dado** una lista vacía, **Cuando** la abre, **Entonces** ve un estado vacío con enlace al catálogo.

### Casos límite

- Playera retirada del catálogo: se marca no disponible y se puede quitar.
- Doble clic: una sola petición por cambio (estado optimista con reversión si falla).
- Sesión caducada: se renueva sola (HU-14).
- Sin conexión: el cambio falla con aviso; el modo sin conexión de la lista no se promete.
- Precios solo mostrados (principio III).

## Requisitos *(obligatorio)*

- **FR-001**: Corazón accesible (`aria-pressed`, nombre claro) en el catálogo y el detalle.
- **FR-002**: Agregar y quitar MUST usar las operaciones del contrato del API (HU-36 api); sin sesión MUST pedir acceso.
- **FR-003**: Ruta `/deseos` con `meta.requiereSesion`.
- **FR-004**: Actualización optimista con reversión y aviso si el servidor rechaza.
- **FR-005**: Mock con agregar, quitar y listar.

## Criterios de éxito

- **SC-001**: Agregar a la lista en 1 interacción desde el catálogo.
- **SC-002**: 0 llamadas de lista sin sesión.

## Supuestos

- Historia de recorte: se implementa solo si sobra capacidad.
- El API ofrece agregar, quitar y listar; la web remite a su contrato.
