# Especificación de la funcionalidad: PWA instalable y uso sin conexión (HU-39)

**Rama de trabajo**: `sprint/11` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-39 · **Sprint**: 11 · **Repos**: web · **Componente**: FE · **Depende de**: HU-11, HU-14, HU-23, HU-33, HU-34
**Bloqueado por**: HU-11 (iconos y colores), HU-14, HU-23, HU-33/34
**Entrada**: «Como cliente, quiero instalar la app y ver mis compras, avisos y parte del catálogo sin conexión. Criterio: instalable en Android; en modo avión abre y muestra pedidos, notificaciones y catálogo visto.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Instalar la app (Prioridad: P1)

1. **Dado** Chrome en Android, **Cuando** la cliente visita la tienda, **Entonces** puede instalarla (manifiesto válido, iconos del monograma, service worker, HTTPS).
2. **Dado** la app instalada, **Cuando** se abre, **Entonces** se muestra a pantalla completa con el nombre BlackHellHeim y los colores de la marca.
3. **Dado** una nueva versión, **Cuando** está disponible, **Entonces** la cliente ve un aviso para actualizar y la app se actualiza sin perder el carrito.

### Historia de usuario 2 - Ver sin conexión lo ya visto (Prioridad: P1)

1. **Dado** que visitó pedidos, avisos y productos con red, **Cuando** abre la app en modo avión, **Entonces** ve esos pedidos, avisos y el catálogo visto.
2. **Dado** una pantalla no guardada, **Cuando** la abre sin conexión, **Entonces** ve una página de «sin conexión» clara con lo que sí puede ver.
3. **Dado** que recupera la red, **Cuando** la app lo detecta, **Entonces** actualiza los datos y retira el aviso.

### Historia de usuario 3 - Datos sin conexión seguros (Prioridad: P1)

1. **Dado** el cierre de sesión, **Cuando** ocurre, **Entonces** se borran los datos personales guardados (pedidos y avisos).
2. **Dado** el almacenamiento sin conexión, **Cuando** se inspecciona, **Entonces** no contiene tokens ni contraseñas.

### Casos límite

- Sin conexión no se puede comprar ni pagar: se explica y se conserva el carrito (HU-24).
- Precios guardados en caché pueden estar viejos: se marcan «visto el <fecha>» y se confirman en línea.
- Almacenamiento lleno o no disponible: degradar a solo en línea con aviso.
- Dos cuentas en el mismo dispositivo: los datos son por usuario y se borran al cerrar sesión.
- El service worker no cachea `/api` de escritura ni respuestas con datos de otra sesión.

## Requisitos *(obligatorio)*

- **FR-001**: Manifiesto con nombre BlackHellHeim, iconos del monograma (HU-11), `display: standalone`, colores de los tokens.
- **FR-002**: Service worker con `vite-plugin-pwa` (Workbox): precaché de la aplicación y estrategia para imágenes y catálogo visto.
- **FR-003**: Pedidos, avisos y compras MUST guardarse en IndexedDB (principio IV) por usuario, y borrarse al cerrar sesión.
- **FR-004**: El token de acceso MUST NOT guardarse en ninguna caché ni en IndexedDB (principio V); prueba que lo verifica.
- **FR-005**: Página de sin conexión y aviso de modo sin conexión accesibles.
- **FR-006**: Aviso de nueva versión y actualización controlada.
- **FR-007**: Pruebas con `fake-indexeddb` y de configuración del manifiesto y del service worker.
- **FR-008**: Documentar cómo probar en modo avión.

## Criterios de éxito

- **SC-001**: En modo avión abre y muestra pedidos, avisos y catálogo visto (prueba manual en Android).
- **SC-002**: Lighthouse reconoce la app como instalable.
- **SC-003**: 0 tokens en cachés e IndexedDB.

## Supuestos

- `vite-plugin-pwa` (MIT) y Workbox (MIT) se verifican al instalar; `fake-indexeddb` (MIT, desarrollo).
- Los iconos finales los entrega el diseño (HU-11).
- Las notificaciones push las agrega HU-35 sobre este service worker.
