# Especificación de la funcionalidad: Carrito que se conserva (HU-24, parte web)

**Rama de trabajo**: `sprint/07` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-24 · **Sprint**: 7 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-7, HU-9, HU-14, HU-23
**Bloqueado por**: HU-14 (sesión y gancho de sesión iniciada); contrato del API de carrito (HU-24 api)
**Entrada**: «Como visitante, quiero un carrito que se conserve. Criterio: sin sesión el carrito vive en el navegador; al iniciar sesión se fusiona con el del servidor.» (parte web de una historia api + web)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Carrito sin cuenta (Prioridad: P1)

1. **Dado** un visitante, **Cuando** agrega una variante, **Entonces** aparece en el carrito y sigue ahí al recargar o cerrar el navegador.
2. **Dado** un carrito, **Cuando** cambia la cantidad o quita una línea, **Entonces** el carrito se actualiza y persiste.
3. **Dado** un carrito local, **Cuando** está sin conexión, **Entonces** sigue usable (principio IV).

### Historia de usuario 2 - Fusionar al iniciar sesión (Prioridad: P1)

1. **Dado** un carrito local con líneas, **Cuando** inicia sesión (gancho de HU-14), **Entonces** se envía al servidor para fusionarse y se muestra el carrito fusionado que devuelve el servidor.
2. **Dado** una variante que ya estaba en ambos carritos, **Cuando** se fusionan, **Entonces** el resultado lo decide el servidor y la web lo muestra tal cual.
3. **Dado** que la fusión falla, **Cuando** ocurre, **Entonces** el carrito local se conserva intacto y se reintenta más tarde con aviso.

### Historia de usuario 3 - Carrito con sesión (Prioridad: P1)

1. **Dado** un cliente con sesión, **Cuando** agrega, cambia o quita líneas, **Entonces** los cambios se envían al servidor y se refleja la respuesta.
2. **Dado** un cierre de sesión, **Cuando** ocurre, **Entonces** el carrito del servidor deja de mostrarse y vuelve a un carrito local vacío.

### Casos límite

- Línea con variante que dejó de existir o sin existencia: se marca y se pide quitarla; no se borra en silencio.
- Almacenamiento no disponible (modo privado): el carrito vive en memoria y se avisa que no se conservará.
- Doble pestaña: el carrito local se sincroniza entre pestañas.
- Cantidades: mínimo 1 y máximo del contrato.
- Los precios del carrito vienen del backend; sin sesión, el resumen muestra los últimos precios recibidos del catálogo y se confirman en el checkout.

## Requisitos *(obligatorio)*

- **FR-001**: El carrito local MUST guardarse en el navegador (IndexedDB) solo con identificadores de variante y cantidades, nunca precios ni totales calculados (principios III y IV).
- **FR-002**: Al iniciar sesión MUST llamar a la operación de fusión del contrato del API de carrito (HU-24 api) y adoptar su respuesta.
- **FR-003**: Con sesión, las operaciones de carrito MUST usar el cliente generado con token en memoria (HU-14).
- **FR-004**: Interfaz del slice: agregar, cambiar cantidad, quitar, vaciar, contar líneas; la usan HU-23 y HU-27.
- **FR-005**: Icono de carrito con contador accesible y página `/carrito`.
- **FR-006**: Sincronización entre pestañas del carrito local.
- **FR-007**: Mock ampliado con las operaciones de carrito del contrato.

## Criterios de éxito

- **SC-001**: El carrito sobrevive a recargas y al cierre del navegador en el 100 % de las pruebas.
- **SC-002**: Tras iniciar sesión, el carrito mostrado es el devuelto por el servidor en el 100 % de los casos.
- **SC-003**: 0 precios o totales guardados en IndexedDB (prueba).

## Supuestos

- El API (HU-24 api) ofrece obtener, modificar y fusionar carrito; la web no inventa sus operaciones.
- Se usa IndexedDB mediante la API nativa o `idb` (ISC) si el plan lo justifica; se decide al implementar y se anota la licencia.
- Los totales definitivos los calcula el backend en el checkout.
