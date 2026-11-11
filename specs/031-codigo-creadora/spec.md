# Especificación de la funcionalidad: Código de creadora en el checkout y su administración (HU-31, parte web)

**Rama de trabajo**: `sprint/09` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-31 · **Sprint**: 9 · **Repos**: api + web · **Componente**: FE · **Depende de**: HU-14, HU-18, HU-27
**Bloqueado por**: HU-14, HU-18 (patrón de panel), HU-27; contrato del API de códigos (HU-31 api)
**Entrada**: «Como administradora, quiero crear códigos de creadora y que la cliente los escriba en el checkout, para saber cuántas ventas trae cada una. Criterio: el código se valida al aplicarlo y el pedido lo guarda; no cambia el precio ni genera comisión.» (parte web de una historia api + web)

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - La cliente escribe un código en el checkout (Prioridad: P1)

1. **Dado** el checkout, **Cuando** escribe un código y lo aplica, **Entonces** la web lo valida con el backend y muestra «código aplicado» o el motivo del rechazo.
2. **Dado** un código aplicado, **Cuando** continúa, **Entonces** el código viaja con el pedido y el total mostrado no cambia por él.
3. **Dado** un código inválido o vacío, **Cuando** lo aplica, **Entonces** el checkout sigue funcionando sin código.

### Historia de usuario 2 - La administradora crea y consulta códigos (Prioridad: P1)

1. **Dado** el panel de administración, **Cuando** crea un código para una creadora, **Entonces** se guarda y aparece en la lista.
2. **Dado** un código duplicado o con formato inválido, **Cuando** guarda, **Entonces** ve el error del servidor junto al campo.
3. **Dado** un código existente, **Cuando** lo desactiva o lo edita (si el contrato lo permite), **Entonces** el cambio se refleja.

### Casos límite

- El código no altera precios, totales ni comisiones (principio III): el cliente no calcula nada con él.
- Mayúsculas/minúsculas y espacios: se normaliza según indique el contrato.
- Código aplicado y luego quitado: se envía el pedido sin código.
- Usuario sin rol Administrador en el panel: «sin permiso» (HU-14).
- Reintentos de validación: limitar clics (botón deshabilitado en curso).

## Requisitos *(obligatorio)*

- **FR-001**: MUST validar el código con la operación del contrato del API (HU-31 api) al aplicarlo.
- **FR-002**: MUST enviar el código aceptado junto al pedido; MUST NOT enviar ni calcular descuentos o comisiones.
- **FR-003**: El resumen del checkout MUST seguir mostrando los totales del backend sin cambios por el código.
- **FR-004**: Panel `/admin/creadoras` con rol Administrador: crear, listar y (si el contrato lo trae) editar/desactivar.
- **FR-005**: Formularios accesibles con errores por campo.
- **FR-006**: Mock ampliado con validar, crear y listar códigos.
- **FR-007**: Slices `funcionalidades/codigo-creadora` y `paginas/admin-creadoras`.

## Criterios de éxito

- **SC-001**: La cliente aplica un código en menos de 10 segundos.
- **SC-002**: 0 cambios de total atribuibles al código en las pruebas.
- **SC-003**: Crear un código en menos de 1 minuto.

## Supuestos

- El API define formato, unicidad y validación del código; la web remite al contrato.
- Las estadísticas de ventas por código son de HU-38.
- El panel reutiliza el patrón de formulario y la guardia por rol de HU-14/HU-18.
