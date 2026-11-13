# Especificación de la funcionalidad: Editor de diseños para la administradora (HU-18)

**Rama de trabajo**: `sprint/05` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-18 · **Sprint**: 5 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7, HU-9, HU-11, HU-14
**Bloqueado por**: HU-14 (sesión y rol Administrador); HU-16, HU-17 y HU-19 (api: dominio de diseño, subida de arte, catálogo) cuyo contrato debe copiarse; HU-20 para mostrar precios (solo lectura).
**Entrada**: «Como administradora, quiero crear y editar diseños con varias imágenes, colores y tallas. Criterio: el formulario guarda un diseño completo y avisa si el arte negro va sobre prenda negra.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Crear un diseño completo (Prioridad: P1)

Quiero un formulario para nombre, descripción, imágenes de arte, colores de prenda y tallas disponibles, y guardarlo en un paso.

**Prueba independiente**: con el mock, llenar el formulario, guardar y ver el diseño en el listado.

1. **Dado** datos válidos, **Cuando** guardo, **Entonces** se crea el diseño y veo confirmación.
2. **Dado** campos obligatorios vacíos o inválidos, **Cuando** guardo, **Entonces** veo errores junto a cada campo y no se envía.
3. **Dado** errores del servidor (`ProblemDetails.errores`), **Cuando** guardo, **Entonces** se muestran por campo.
4. **Dado** que guardo, **Cuando** la petición está en curso, **Entonces** el botón se deshabilita (sin doble envío).

### Historia de usuario 2 - Subir varias imágenes (Prioridad: P1)

Quiero subir varias imágenes de arte, ver su vista previa, reordenarlas y quitarlas.

1. **Dado** archivos PNG, **Cuando** los selecciono, **Entonces** veo vista previa y progreso de subida por archivo.
2. **Dado** un archivo que no es PNG, mayor de 200 MB o de baja resolución, **Cuando** lo selecciono, **Entonces** se rechaza antes de subir con el motivo (el servidor valida igual, HU-17).
3. **Dado** una subida fallida, **Cuando** ocurre, **Entonces** puedo reintentar solo ese archivo.

### Historia de usuario 3 - Aviso de arte negro sobre prenda negra (Prioridad: P1)

Quiero un aviso cuando el arte sea predominantemente negro y haya elegido una prenda negra.

1. **Dado** una imagen de arte con píxeles opacos mayormente oscuros y el color de prenda negro, **Cuando** ambos están elegidos, **Entonces** aparece un aviso visible y accesible (no solo por color) indicando la imagen y la prenda.
2. **Dado** el aviso, **Cuando** decido continuar, **Entonces** puedo guardar igual (es un aviso, no un bloqueo).
3. **Dado** arte claro o prenda no negra, **Cuando** elijo, **Entonces** no hay aviso.

### Historia de usuario 4 - Editar un diseño existente (Prioridad: P2)

Quiero abrir un diseño, cambiar datos, imágenes, colores y tallas, y guardar.

1. **Dado** un diseño existente, **Cuando** lo abro, **Entonces** el formulario se llena con sus datos.
2. **Dado** un cambio concurrente en el servidor, **Cuando** guardo, **Entonces** se avisa del conflicto y no se pisan los datos en silencio.

### Casos límite

- Usuario sin rol Administrador: ve «sin permiso» (HU-14); el servidor es la autoridad.
- Sesión caducada a mitad del formulario: se renueva sola (HU-14) y no se pierde lo escrito.
- Imagen con transparencia total o vacía: se rechaza con motivo.
- Muchas imágenes: límite razonable definido por el contrato; mensaje claro al superarlo.
- Nunca se calcula ni se envía precio: los precios, si se muestran, son de solo lectura y vienen del backend (principio III).

## Requisitos *(obligatorio)*

- **FR-001**: Rutas `/admin/disenos` (listado) y `/admin/disenos/nuevo` y `/admin/disenos/:id` con `meta.rol = Administrador`.
- **FR-002**: Slices `entidades/diseno`, `funcionalidades/editar-diseno` y `paginas/admin-disenos` con `index.ts`.
- **FR-003**: Llamadas y tipos solo del contrato generado; subida de arte con el endpoint de HU-17.
- **FR-004**: Validación en el cliente (PNG, ≤ 200 MB, resolución mínima del contrato) como ayuda; no sustituye la del servidor.
- **FR-005**: Detección de arte oscuro por análisis de píxeles opacos en un `canvas` (función pura sobre `ImageData`, con umbral documentado) y aviso accesible con `role="status"`.
- **FR-006**: Formularios accesibles (etiquetas, `aria-describedby`, foco al primer error, teclado) usando los tokens de HU-11.
- **FR-007**: El formulario MUST NOT contener campos de precio ni enviarlos.
- **FR-008**: Mock ampliado con las operaciones del contrato de diseños.

### Entidades clave

- **Diseño**: nombre, descripción, imágenes de arte (orden), colores de prenda, tallas.
- **Imagen de arte**: archivo PNG, URL pública devuelta por el servidor, estado de subida.

## Criterios de éxito

- **SC-001**: Un diseño con 3 imágenes, 3 colores y 4 tallas se guarda en menos de 2 minutos de uso.
- **SC-002**: El aviso aparece en el 100 % de los casos de prueba de arte oscuro + prenda negra y en 0 de los demás.
- **SC-003**: Completable solo con teclado.

## Supuestos

- Los colores y tallas disponibles vienen del contrato (catálogo de variantes de Printful, HU-15/16).
- La definición exacta de «predominantemente negro» (p. ej. ≥ 85 % de los píxeles opacos con luminancia < 0.1) se confirma con la administradora antes de implementar.
