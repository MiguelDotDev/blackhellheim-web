# Especificación de la funcionalidad: Pagar con Stripe (HU-29, parte web)

**Rama de trabajo**: `sprint/08` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-29 · **Sprint**: 8 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-24, HU-27
**Bloqueado por**: HU-14, HU-24, HU-27; contrato del API de pago (HU-29 api); cuenta de Stripe
**Entrada**: «Como cliente, quiero pagar con Stripe. Criterio: crea la sesión de Stripe Checkout, redirige, valida el webhook y marca el pedido pagado; los pagos diferidos (OXXO, SPEI) quedan pendientes.» (parte web de una historia api + web + CI)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Pagar con Stripe Checkout (Prioridad: P1)

1. **Dado** un checkout con total válido, **Cuando** pulsa Pagar, **Entonces** la web pide al backend crear la sesión de pago y redirige a la dirección que éste devuelve.
2. **Dado** que la creación falla, **Cuando** ocurre, **Entonces** ve un mensaje con reintento y el carrito sigue intacto.
3. **Dado** un doble clic, **Cuando** pulsa Pagar, **Entonces** solo se crea una sesión (botón deshabilitado y clave de idempotencia si el contrato la pide).

### Historia de usuario 2 - Volver del pago y ver el resultado (Prioridad: P1)

1. **Dado** que paga, **Cuando** Stripe lo regresa a `/pago/resultado`, **Entonces** la web consulta el estado del pedido en el backend (no confía en la dirección de retorno) y muestra pagado, pendiente o fallido.
2. **Dado** un pago aún sin confirmar por el webhook, **Cuando** consulta, **Entonces** ve «procesando» y se reconsulta con espera creciente hasta un límite.
3. **Dado** que cancela en Stripe, **Cuando** regresa a `/pago/cancelado`, **Entonces** ve su carrito y puede reintentar.

### Historia de usuario 3 - Pagos diferidos (OXXO, SPEI) (Prioridad: P2)

1. **Dado** un pago diferido, **Cuando** Stripe lo regresa, **Entonces** se muestra «pendiente de pago» con las instrucciones que entregue el backend y el pedido no se marca pagado.
2. **Dado** que el pago diferido se confirma luego, **Cuando** abre el pedido, **Entonces** ve el estado actualizado (la lista de pedidos es de HU-34).

### Casos límite

- La dirección de retorno puede ser manipulada: el estado solo se toma del backend.
- Cierre de la pestaña en Stripe: el pedido queda pendiente y se puede reintentar sin duplicar cobro.
- Total cambiado entre checkout y pago: lo decide el backend al crear la sesión; la web muestra el total que éste devuelva.
- Sesión caducada al volver: se renueva sola (HU-14) y se consulta el estado.
- Sin conexión al volver: mensaje claro; el estado se consulta al recuperar red.

## Requisitos *(obligatorio)*

- **FR-001**: MUST llamar a la operación del contrato que crea la sesión de pago y redirigir a la dirección devuelta; la web no construye direcciones de Stripe ni usa claves de Stripe (principios III y IX).
- **FR-002**: MUST NOT incluir `stripe.js` ni claves públicas o privadas: el flujo usa redirección completa.
- **FR-003**: El estado del pago MUST salir de la consulta al backend, no de los parámetros de la dirección.
- **FR-004**: Reconsulta del estado con espera creciente y límite, y salida clara al agotarse.
- **FR-005**: Pantallas `/pago/resultado` y `/pago/cancelado` accesibles; estado anunciado con `role="status"`.
- **FR-006**: El gancho `onPagar` de HU-27 queda conectado; el botón se deshabilita mientras hay una petición.
- **FR-007**: Mock ampliado con crear sesión y estados pagado, pendiente, fallido.

## Criterios de éxito

- **SC-001**: 0 secretos o claves de Stripe en el repositorio o en `dist` (prueba que busca `sk_`, `pk_`, `whsec_`).
- **SC-002**: El estado mostrado coincide con el del backend en el 100 % de los casos de prueba.
- **SC-003**: Un doble clic crea una sola sesión.

## Supuestos

- El API (HU-29 api) crea la sesión, valida el webhook y expone el estado del pedido; la web remite a su contrato.
- Cuenta de Stripe, claves y webhook los configura la desarrolladora y viven solo en el backend.
- Los pagos diferidos solo se muestran como pendientes; su conciliación es del backend.
