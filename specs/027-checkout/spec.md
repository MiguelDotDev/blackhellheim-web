# Especificación de la funcionalidad: Checkout con dirección mexicana y envío cotizado (HU-27)

**Rama de trabajo**: `sprint/07` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-27 · **Sprint**: 7 · **Repos**: web · **Componente**: FE · **Depende de**: HU-14, HU-23, HU-24
**Bloqueado por**: HU-14 (sesión), HU-23 y HU-24 (carrito); contrato del API de checkout y envío (historias 26 y 27 del API)
**Entrada**: «Como cliente, quiero un checkout con dirección mexicana, envío cotizado y resumen, y que me pida iniciar sesión si no la tengo. Criterio: un visitante que llega al pago es enviado a iniciar sesión o registrarse y regresa al checkout con el carrito intacto; muestra el total antes de pagar. El botón Pagar se conecta en la historia 29.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Exigir sesión sin perder el carrito (Prioridad: P1)

1. **Dado** un visitante con carrito, **Cuando** va al checkout, **Entonces** es enviado a `/acceso?destino=/checkout` y, tras iniciar sesión o registrarse, regresa con el carrito intacto (fusionado).
2. **Dado** un cliente con sesión y carrito vacío, **Cuando** abre el checkout, **Entonces** se le lleva al catálogo con un aviso.

### Historia de usuario 2 - Dirección mexicana (Prioridad: P1)

1. **Dado** el formulario, **Cuando** captura nombre, teléfono, calle y número, colonia, código postal, municipio/alcaldía y estado, **Entonces** cada campo se valida (código postal de 5 dígitos, teléfono de 10) con errores por campo.
2. **Dado** un código postal, **Cuando** lo escribe, **Entonces** la colonia, municipio y estado se sugieren solo si el contrato ofrece esa consulta; si no, se capturan a mano.
3. **Dado** errores del servidor, **Cuando** guarda, **Entonces** se muestran junto a su campo.

### Historia de usuario 3 - Envío cotizado y resumen con total (Prioridad: P1)

1. **Dado** una dirección válida, **Cuando** se cotiza, **Entonces** se muestran las opciones de envío y su costo tal como las devuelve el backend.
2. **Dado** una opción elegida, **Cuando** termina la cotización, **Entonces** el resumen muestra líneas, envío y total devueltos por el backend antes de pagar.
3. **Dado** que cambia el carrito o la dirección, **Cuando** ocurre, **Entonces** se vuelve a cotizar y el total anterior se descarta.

### Casos límite

- Cotización que falla o tarda: mensaje con reintento; el botón Pagar no se habilita sin total válido.
- Variante sin existencia al llegar al pago: se avisa y se vuelve al carrito.
- Sesión caducada durante el checkout: se renueva sola (HU-14) y se conserva lo capturado.
- Direcciones guardadas: fuera de alcance salvo que el contrato las ofrezca.
- El botón Pagar queda como punto de enganche de HU-29 (deshabilitado con aviso hasta entonces).

## Requisitos *(obligatorio)*

- **FR-001**: Ruta `/checkout` con `meta.requiereSesion` y retorno por `destino` (HU-14).
- **FR-002**: El resumen y el total MUST venir del backend; la web no suma ni calcula impuestos, envío o descuentos (principio III).
- **FR-003**: Formulario de dirección mexicana con validación de formato y accesible (principio VII).
- **FR-004**: La cotización MUST usar la operación del contrato del API de envío (HU-26/27 api) y volver a pedirse al cambiar dirección o carrito.
- **FR-005**: Al enviar la orden solo se mandan identificadores de variante, cantidades, dirección y opción de envío elegida; nunca precios.
- **FR-006**: Slices `funcionalidades/direccion-envio`, `funcionalidades/cotizar-envio` y `paginas/checkout`.
- **FR-007**: Gancho `onPagar` para HU-29.

## Criterios de éxito

- **SC-001**: Un visitante termina de capturar dirección y ver el total en menos de 3 minutos.
- **SC-002**: 0 cálculos de dinero en el cliente (prueba/regla).
- **SC-003**: Retorno al checkout con el carrito intacto en el 100 % de los casos de prueba.

## Supuestos

- El API ofrece cotización de envío y resumen/total (según las historias del API de checkout, 26 y 27 api); la web remite a su contrato.
- Solo México y MXN.
- Autocompletado por código postal solo si el contrato lo trae.
