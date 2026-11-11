# Especificación de la funcionalidad: Bandeja de notificaciones y avisos push (HU-35, parte web)

**Rama de trabajo**: `sprint/10` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-35 · **Sprint**: 10 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-33, HU-34, HU-39
**Bloqueado por**: HU-14, HU-33/34, HU-39 (service worker); contrato del API de notificaciones (HU-35 api); claves VAPID
**Entrada**: «Como cliente, quiero una bandeja de notificaciones y avisos push. Criterio: un cambio de estado crea el aviso en la bandeja y llega como push a Android si hay permiso.» (parte web de una historia api + web; prioridad S, recorte)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Bandeja de notificaciones (Prioridad: P1)

1. **Dado** un cliente con sesión, **Cuando** abre `/notificaciones`, **Entonces** ve sus avisos paginados, los no leídos destacados (no solo por color).
2. **Dado** un aviso, **Cuando** lo abre, **Entonces** se marca como leído y lleva al pedido relacionado.
3. **Dado** avisos nuevos, **Cuando** el icono de la barra se muestra, **Entonces** indica el número de no leídos de forma accesible.

### Historia de usuario 2 - Avisos push en Android (Prioridad: P1)

1. **Dado** que la cliente quiere avisos, **Cuando** pulsa «Activar avisos», **Entonces** la app pide permiso y registra la suscripción en el backend con la clave pública VAPID.
2. **Dado** un cambio de estado de su pedido, **Cuando** el backend envía el push, **Entonces** el service worker muestra la notificación y al pulsarla abre el pedido.
3. **Dado** permiso denegado o navegador sin Push, **Cuando** intenta activar, **Entonces** ve una explicación y la bandeja sigue funcionando.
4. **Dado** un cierre de sesión, **Cuando** ocurre, **Entonces** la suscripción se elimina en el backend.

### Casos límite

- Suscripción caducada (410): el backend la elimina; la web puede volver a suscribir.
- Sin conexión: la bandeja ya vista se muestra desde IndexedDB (HU-39).
- Varias pestañas: el contador se sincroniza.
- iOS o navegadores sin soporte: solo bandeja.
- La clave VAPID pública va en `VITE_VAPID_PUBLICA` (pública, no es un secreto); la privada vive solo en el backend (principio IX).

## Requisitos *(obligatorio)*

- **FR-001**: Ruta `/notificaciones` con `meta.requiereSesion`, paginación y marca de leído.
- **FR-002**: Suscripción Web Push con la clave pública VAPID de `VITE_VAPID_PUBLICA` y registro en el backend por el contrato del API (HU-35 api).
- **FR-003**: El service worker de HU-39 MUST manejar `push` y `notificationclick` (se amplía su configuración Workbox).
- **FR-004**: MUST NOT haber claves privadas ni secretos en el repositorio; prueba que lo verifica.
- **FR-005**: Contador de no leídos accesible en la barra.
- **FR-006**: Eliminación de la suscripción al cerrar sesión.
- **FR-007**: Almacenamiento de la bandeja para uso sin conexión según HU-39.
- **FR-008**: Mock con avisos y suscripción.

## Criterios de éxito

- **SC-001**: Un aviso de cambio de estado llega a Android con permiso en menos de 30 segundos (prueba manual con el backend).
- **SC-002**: La bandeja funciona sin permiso de push.
- **SC-003**: 0 secretos en el repo.

## Supuestos

- Depende del service worker de HU-39 (sprint 11), por lo que la parte push se implementa después de él; la bandeja puede ir antes.
- El API crea el aviso y envía el push (VAPID); la web remite a su contrato.
- `vite-plugin-pwa` (MIT) y Workbox (MIT) los instala HU-39.
