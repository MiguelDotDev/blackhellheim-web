# Especificación de la funcionalidad: Pantallas de acceso y sesión que se renueva sola (HU-14)

**Rama de trabajo**: `sprint/03` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-14 · **Sprint**: 3 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7, HU-8, HU-9
**Bloqueado por**: HU-13 (api): el contrato de autenticación (registro, inicio de sesión, renovación, cierre) aún no existe en la copia `contratos/` de este repo. Hasta que la desarrolladora lo copie (tarea `[MANUAL]`), la implementación no puede empezar.
**Entrada**: «Como cliente, quiero pantallas de acceso y que mi sesión se renueve sola. Criterio: tras caducar el acceso, la siguiente petición se repite con un token nuevo sin pedir contraseña.»

## Escenarios de usuario y pruebas *(obligatorio)*

### Historia de usuario 1 - Registrarme e iniciar sesión (Prioridad: P1)

Quiero pantallas de registro e inicio de sesión en español, con etiquetas, errores claros y uso con teclado.

**Prueba independiente**: con el mock, registrar una cuenta, cerrar sesión e iniciar sesión de nuevo.

**Escenarios de aceptación**:

1. **Dado** un correo y contraseña válidos, **Cuando** envío el registro, **Entonces** quedo con sesión iniciada y veo la página de destino.
2. **Dado** credenciales incorrectas, **Cuando** inicio sesión, **Entonces** veo un mensaje genérico (sin revelar si el correo existe) y los campos conservan el correo.
3. **Dado** errores de validación del servidor (`ProblemDetails.errores`), **Cuando** envío el formulario, **Entonces** cada error aparece junto a su campo.
4. **Dado** que quiero cerrar sesión, **Cuando** lo hago, **Entonces** el token se descarta, el servidor revoca el refresh y vuelvo al inicio.

### Historia de usuario 2 - La sesión se renueva sola (Prioridad: P1)

Quiero que cuando caduque el acceso, la siguiente petición se repita automáticamente con un token nuevo, sin pedirme la contraseña.

**Prueba independiente**: con un mock que responde 401 a un token caducado, una petición termina bien tras una sola renovación.

**Escenarios de aceptación**:

1. **Dado** un token de acceso caducado, **Cuando** una petición recibe 401, **Entonces** se renueva con el refresh (cookie HttpOnly) y la misma petición se repite una vez con el token nuevo.
2. **Dado** varias peticiones simultáneas con 401, **Cuando** se renueva, **Entonces** se hace una sola renovación y todas se repiten.
3. **Dado** que la renovación falla (refresh caducado o revocado), **Cuando** ocurre, **Entonces** se cierra la sesión local y se me lleva al inicio de sesión recordando a dónde iba.
4. **Dado** que recargo la página, **Cuando** arranca la app, **Entonces** intenta una renovación silenciosa y, si funciona, sigo con sesión.

### Historia de usuario 3 - Rutas que exigen sesión o rol (Prioridad: P2)

Quiero que las rutas privadas me envíen al inicio de sesión y me devuelvan a ellas después (lo usarán el checkout, HU-27, y el panel, HU-18).

**Escenarios de aceptación**:

1. **Dado** un visitante, **Cuando** abre una ruta privada, **Entonces** va a `/acceso?destino=<ruta>` y, tras iniciar sesión, regresa a ella.
2. **Dado** una ruta de administración y un usuario sin rol Administrador, **Cuando** entra, **Entonces** ve «sin permiso» (el servidor sigue siendo la autoridad).

### Casos límite

- Doble envío del formulario: el botón se deshabilita mientras hay una petición.
- `destino` externo (`https://otro.sitio`): se ignora; solo se aceptan rutas internas que empiecen por `/` (evita redirección abierta).
- Petición de renovación que recibe 401: no se reintenta en bucle.
- Fallo de red al renovar: se conserva la sesión local y se avisa; no se cierra por un fallo transitorio.

## Requisitos *(obligatorio)*

- **FR-001**: El token de acceso MUST vivir solo en memoria (store de Pinia); MUST NOT escribirse en `localStorage`, `sessionStorage`, IndexedDB ni cookies accesibles (principio V).
- **FR-002**: El refresh MUST viajar solo en la cookie HttpOnly que gestiona el backend; las peticiones de acceso y renovación usan `credentials: 'include'`.
- **FR-003**: El cliente de API MUST aceptar un middleware que añade `Authorization: Bearer` y, ante 401, renueva y repite una vez (con una sola renovación en vuelo).
- **FR-004**: Los tipos y llamadas de autenticación MUST salir del contrato generado; MUST NOT escribirse a mano.
- **FR-005**: Formularios accesibles: etiquetas, errores asociados (`aria-describedby`), foco al primer error y navegación por teclado (principio VII).
- **FR-006**: Guardia de rutas con `meta.requiereSesion` y `meta.rol`, y validación de `destino` interno.
- **FR-007**: La contraseña MUST NOT registrarse en consola ni guardarse; los mensajes de error no distinguen «correo inexistente» de «contraseña incorrecta».
- **FR-008**: Mientras el backend no esté listo, el mock MUST ofrecer las operaciones de autenticación del contrato, incluido un modo de token caducado para las pruebas.
- **FR-009**: La fusión del carrito local al iniciar sesión queda fuera (HU-24); esta HU solo expone un evento/gancho de «sesión iniciada».

### Entidades clave

- **Sesión**: usuario (id, correo, rol), token de acceso en memoria, estado (anónima, activa, renovando).
- **Credenciales**: correo y contraseña, solo en el formulario.

## Criterios de éxito

- **SC-001**: Con token caducado, la petición se repite con éxito sin intervención en el 100 % de las pruebas, con una sola renovación aunque haya N peticiones simultáneas.
- **SC-002**: 0 apariciones del token en almacenamiento del navegador (prueba automática).
- **SC-003**: Los formularios se completan solo con teclado.

## Supuestos

- El backend (HU-13) usa JWT de acceso corto, refresh rotativo en cookie HttpOnly y roles Cliente y Administrador.
- El mismo origen (`/api` tras nginx, HU-25) evita problemas de cookies de terceros; en desarrollo el mock sirve CORS con credenciales (ajuste del mock en esta HU).
- No incluye recuperación de contraseña ni verificación de correo (no están en el backlog).
