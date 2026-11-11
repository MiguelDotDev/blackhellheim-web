# Especificación de la funcionalidad: Flujo completo probado y pedido de demo (HU-42, parte web)

**Rama de trabajo**: `sprint/11` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-42 · **Sprint**: 11 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-23, HU-24, HU-27, HU-29, HU-33
**Bloqueado por**: HU-14, HU-23, HU-24, HU-27, HU-29, HU-33 implementadas; backend y servicios de prueba (Stripe modo prueba, Printful)
**Entrada**: «Quiero el flujo completo probado y un pedido real de demo. Criterio: compra de prueba de punta a punta con sesión; la confirmación real en Printful es opcional.» (parte web de una historia api + web)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Flujo de compra automatizado (Prioridad: P1)

1. **Dado** el mock, **Cuando** una prueba recorre catálogo → detalle → carrito → acceso → checkout → pago simulado → confirmación, **Entonces** cada paso se completa y el pedido queda pagado.
2. **Dado** un fallo inyectado (red, 401 con renovación, 409), **Cuando** ocurre en el flujo, **Entonces** la app se recupera o muestra el error esperado.
3. **Dado** la integración continua, **Cuando** corre, **Entonces** la prueba del flujo corre sin servicios externos.

### Historia de usuario 2 - Pedido de demostración real (Prioridad: P1)

1. **Dado** el ambiente de prueba con pagos de Stripe en modo de prueba, **Cuando** la desarrolladora hace una compra completa, **Entonces** el pedido llega a «pagado» y aparece en el historial.
2. **Dado** Printful, **Cuando** se decide confirmar el pedido real, **Entonces** se hace solo con la bandera del backend activa (opcional).
3. **Dado** la demostración, **Cuando** termina, **Entonces** quedan capturas y notas como evidencia.

### Casos límite

- La compra real con tarjeta de prueba es siempre `[MANUAL]`; no se automatiza contra Stripe.
- Datos de demostración ficticios (constitución y aviso de privacidad diferido).
- La prueba de punta a punta no debe depender del orden de otras pruebas ni de puertos fijos.
- Navegador para pruebas: el que instale la herramienta; sin descargas en CI sin licencia verificada.
- Fallo en CI por tiempo: reintentos acotados, nunca desactivar la prueba.

## Requisitos *(obligatorio)*

- **FR-001**: Prueba de punta a punta del flujo con el mock, en CI.
- **FR-002**: Escenarios de fallo: red caída, 401 con renovación, 409 de pedido, variante sin existencia.
- **FR-003**: Herramienta de pruebas de navegador libre (por ejemplo Playwright, Apache-2.0) con licencia verificada, o `@vue/test-utils` con el enrutador si el plan lo justifica.
- **FR-004**: Guion de la demostración real en `docs/` con pasos y capturas.
- **FR-005**: Sin secretos: el modo de prueba de Stripe lo configura el backend.
- **FR-006**: Cobertura del flujo documentada en el README.

## Criterios de éxito

- **SC-001**: El flujo automatizado corre en CI en menos de 5 minutos.
- **SC-002**: La demostración real termina con un pedido pagado en el ambiente de prueba.
- **SC-003**: 0 secretos en el repo o en las capturas.

## Supuestos

- Todas las HU del flujo (14, 23, 24, 27, 29, 33) están implementadas; esta HU no avanza sin ellas.
- La confirmación real en Printful es opcional y la decide la desarrolladora.
