# Especificación de la funcionalidad: Cliente de API tipado y servidor mock (HU-9)

**Rama de trabajo**: `sprint/02` · **Creada**: 2026-11-11 · **Estado**: Borrador
**Historia**: HU-9 · **Sprint**: 2 · **Repos**: web · **Componente**: FE · **Depende de**: HU-7 y HU-8
**Entrada**: «Como desarrolladora quiero un cliente de API tipado generado desde el OpenAPI del backend y un servidor mock, para trabajar sin esperar al backend. Criterio: el cliente se regenera con un comando y el mock responde un endpoint de ejemplo (`/salud`).»
**Contrato**: `specs/009-cliente-api-mock/contratos/openapi.json` (copia del backend, versión 0.4.0, con `/salud`, `/salud/base` y `/tiendas/{codigo}`). Se usa tal cual; no se edita ni se regenera aquí.

## Escenarios de usuario y pruebas *(obligatorio)*

La «usuaria» es la desarrolladora, que construye pantallas mientras el backend evoluciona.

### Historia de usuario 1 - Cliente tipado que se regenera con un comando (Prioridad: P1)

Quiero un cliente de la API cuyos tipos (peticiones, respuestas y errores) salgan del contrato del backend, y poder regenerarlos con un único comando cuando llegue una copia nueva del contrato, sin escribir a mano ningún tipo que exista en el contrato.

**Por qué esta prioridad**: es el principio II (contrato primero) y la primera mitad del criterio; todas las pantallas con datos dependerán de él.

**Prueba independiente**: ejecutar el comando de regeneración sobre el contrato actual; el resultado coincide exactamente con lo versionado (sin diferencias) y las tres operaciones del contrato se pueden llamar con tipos correctos.

**Escenarios de aceptación**:

1. **Dado** el contrato copiado en `contratos/`, **Cuando** ejecuto el comando de regeneración, **Entonces** se producen los tipos del cliente sin intervención manual y sin cambios si el contrato no cambió.
2. **Dado** una copia nueva del contrato con un campo cambiado, **Cuando** regenero, **Entonces** el cambio aparece en los tipos y la verificación de tipos señala todo uso de la aplicación que ya no encaja.
3. **Dado** una llamada a una operación del contrato, **Cuando** la escribo, **Entonces** el editor y la verificación de tipos conocen sus parámetros, su respuesta exitosa y sus errores (código, correlación, errores por campo).
4. **Dado** un contrato malformado, **Cuando** regenero, **Entonces** el comando falla con un mensaje claro y no deja tipos a medias.
5. **Dado** la copia versionada de los tipos, **Cuando** corren las pruebas, **Entonces** una prueba falla si los tipos versionados no corresponden al contrato actual.

---

### Historia de usuario 2 - Servidor mock que responde como el contrato (Prioridad: P1)

Quiero arrancar con un comando un servidor local que responda las operaciones del contrato (empezando por `/salud`) sin backend, para que `npm run dev` funcione y para probar el cliente.

**Por qué esta prioridad**: segunda mitad del criterio y habilita el trabajo de interfaz de los sprints siguientes sin depender de la API real.

**Prueba independiente**: arrancar el mock, pedir `/salud` y recibir una respuesta con la forma que fija el contrato.

**Escenarios de aceptación**:

1. **Dado** el mock arrancado, **Cuando** pido `/salud`, **Entonces** responde con éxito y un cuerpo que cumple el contrato (`estado`).
2. **Dado** el mock arrancado, **Cuando** pido `/salud/base`, **Entonces** responde con éxito y un cuerpo que cumple el contrato.
3. **Dado** el mock arrancado, **Cuando** pido `/tiendas/MEX`, **Entonces** devuelve una tienda con código, nombre y moneda.
4. **Dado** el mock arrancado, **Cuando** pido una tienda con código mal formado o inexistente, **Entonces** devuelve el error del contrato con su estado (400 o 404) y los campos de problema (tipo, título, estado, código, correlación).
5. **Dado** una ruta que el contrato no define, **Cuando** la pido, **Entonces** el mock responde 404 con el mismo formato de problema.
6. **Dado** la aplicación en desarrollo apuntando al mock, **Cuando** la cliente de API pide `/salud`, **Entonces** recibe la respuesta del mock sin errores de origen cruzado.

---

### Historia de usuario 3 - Usar el cliente desde la aplicación con la URL del ambiente (Prioridad: P2)

Quiero obtener un cliente ya configurado con la URL del API del ambiente actual (HU-8), para que las pantallas lo usen sin repetir configuración.

**Por qué esta prioridad**: une las historias 8 y 9, pero el cliente generado y el mock ya entregan valor por separado.

**Prueba independiente**: con el mock arrancado, una prueba crea el cliente y obtiene `/salud` con tipos correctos; otra comprueba un error 404 de tienda con sus campos.

**Escenarios de aceptación**:

1. **Dado** un ambiente con su URL del API, **Cuando** creo el cliente sin indicar dirección, **Entonces** usa la URL de ese ambiente.
2. **Dado** una URL distinta indicada de forma explícita (por ejemplo, en pruebas), **Cuando** creo el cliente, **Entonces** usa esa.
3. **Dado** una respuesta de error del contrato, **Cuando** la recibo, **Entonces** puedo leer su código estable y su identificador de correlación con tipos.

---

### Casos límite

- El puerto del mock está ocupado: el comando falla con un mensaje que lo dice y cómo cambiarlo.
- El contrato incluye operaciones nuevas que el mock aún no sabe responder: la prueba de cobertura del mock falla y nombra la operación.
- El mock se queda atrás respecto al contrato (cambia el cuerpo de una respuesta): la verificación de tipos o las pruebas lo detectan.
- El mock nunca debe ser parte de lo que se publica a producción.
- La URL del ambiente es una ruta del mismo origen (`/api`): el cliente la acepta tal cual.
- Falla de red o respuesta que no es JSON (por ejemplo, un proxy caído): el fallo no se oculta; la llamada termina en error visible para quien la usa y no devuelve datos falsos.

## Requisitos *(obligatorio)*

### Requisitos funcionales

- **FR-001**: El repositorio MUST conservar la copia del contrato del backend en `specs/009-cliente-api-mock/contratos/` y ninguna historia de este repo MUST modificarla.
- **FR-002**: Un único comando documentado MUST regenerar los tipos del cliente a partir de esa copia, de forma repetible (mismo contrato, mismo resultado).
- **FR-003**: Los tipos generados MUST cubrir las tres operaciones del contrato (`/salud`, `/salud/base`, `/tiendas/{codigo}`), sus respuestas exitosas y sus respuestas de error; MUST NOT escribirse a mano tipos que existan en el contrato.
- **FR-004**: Los tipos generados MUST estar versionados en el repositorio y marcados como generados (no se editan a mano).
- **FR-005**: Una prueba automática MUST fallar si los tipos versionados no coinciden con lo que produce el comando sobre el contrato actual.
- **FR-006**: El cliente MUST obtener su URL base de la configuración de ambiente de la HU-8, con posibilidad de indicar otra explícitamente.
- **FR-007**: Debe existir un comando documentado que arranque un servidor mock local sin necesidad del backend.
- **FR-008**: El mock MUST responder `/salud`, `/salud/base` y `/tiendas/{codigo}` con cuerpos que cumplan el contrato, incluidos los errores 400 y 404 de tiendas y el 404 de rutas desconocidas, usando el formato de problema del contrato.
- **FR-009**: El mock MUST permitir peticiones desde el origen de desarrollo de la aplicación.
- **FR-010**: En el ambiente de desarrollo la aplicación MUST poder funcionar contra el mock sin cambiar código (la URL de desarrollo ya apunta a él, HU-8).
- **FR-011**: El mock y su código MUST quedar fuera de lo que se construye para producción.
- **FR-012**: Pruebas automatizadas MUST demostrar: el cliente contra el mock en éxito y en error, y que el mock cubre todas las operaciones del contrato.
- **FR-013**: La documentación MUST explicar cómo actualizar el contrato (copiar desde el backend, regenerar, revisar la diferencia, verificar tipos).
- **FR-014**: Cada dependencia nueva MUST tener su licencia verificada y registrada antes de añadirse (principio VIII), y ser software libre.
- **FR-015**: El contrato no incluye precios; si algún contrato futuro los incluye, el cliente solo los lee y nunca los calcula ni los envía (principio III).

### Entidades clave

- **Contrato de la API**: documento publicado por el backend que describe operaciones, parámetros, respuestas y errores. Fuente de verdad.
- **Cliente tipado**: parte de la aplicación que llama a la API con tipos derivados del contrato.
- **Servidor mock**: programa local que imita las respuestas del contrato.
- **Estado de salud**: respuesta con un texto de estado (`/salud`, `/salud/base`).
- **Tienda**: código de 3 letras mayúsculas, nombre y moneda (3 letras mayúsculas).
- **Problema**: respuesta de error con tipo, título, estado, detalle opcional, código estable, identificador de correlación y errores por campo opcionales.

## Criterios de éxito *(obligatorio)*

### Resultados medibles

- **SC-001**: Regenerar el cliente toma 1 comando y menos de 1 minuto, con 0 ediciones manuales, y el resultado sobre el contrato actual no produce diferencias.
- **SC-002**: El mock está listo para responder en menos de 5 segundos tras arrancarlo y `/salud` responde en menos de 1 segundo.
- **SC-003**: El 100 % de las operaciones del contrato tienen respuesta de éxito en el mock, y el 100 % de las respuestas de error definidas para `/tiendas/{codigo}` con 400 y 404 están cubiertas.
- **SC-004**: Un cambio de campo en el contrato es detectado por la verificación de tipos o por las pruebas en el 100 % de los casos probados.
- **SC-005**: Una persona nueva levanta mock + aplicación y ve una respuesta de `/salud` en menos de 5 minutos con solo la documentación.

## Supuestos

- El contrato de la versión 0.4.0 es el vigente; cuando el backend publique uno nuevo, la desarrolladora lo copia a `contratos/` (tarea manual) y regenera.
- Los valores concretos de las respuestas del mock los decide esta historia porque el contrato solo fija formas: `estado` = `"ok"`, tienda `MEX` = «BlackHellHeim», moneda `MXN`; cualquier otro código bien formado es inexistente (404).
- El mock solo simula éxitos y los errores 400/404; los estados 408, 500 y 503 del contrato no se simulan.
- El puerto del mock es el 4010, el que ya usa `.env.development` (HU-8).
- No se añade pantalla nueva: el uso del cliente se demuestra con pruebas. Las pantallas que lo consuman llegan en historias posteriores.
- No cubre autenticación, renovación de sesión ni reintentos (HU-14).
- Depende de HU-7 (estructura, lint, pruebas) y HU-8 (URL por ambiente).
